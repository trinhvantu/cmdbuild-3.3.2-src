package org.cmdbuild.cluster;

import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.collect.ComparisonChain;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.Lists.reverse;
import com.google.common.collect.Ordering;
import com.google.common.eventbus.EventBus;
import freemarker.template.Configuration;
import static freemarker.template.Configuration.VERSION_2_3_28;
import freemarker.template.Template;
import java.io.ByteArrayInputStream;
import static java.lang.String.format;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import static java.util.Collections.singletonList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import javax.annotation.PreDestroy;
import javax.inject.Provider;

import static org.cmdbuild.cluster.ClusterMessage.THIS_INSTANCE_ID;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.services.PostStartup;
import org.jgroups.JChannel;
import org.jgroups.Message;
import org.jgroups.Message.Flag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.services.MinionStatus;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.jgroups.Address;
import org.jgroups.Event;
import org.jgroups.PhysicalAddress;
import org.jgroups.Receiver;
import org.jgroups.View;
import org.jgroups.logging.CustomLogFactory;
import org.jgroups.logging.Log;
import org.jgroups.logging.LogFactory;
import org.jgroups.logging.Slf4jLogImpl;
import org.cmdbuild.services.PreShutdown;
import org.cmdbuild.services.MinionComponent;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;
import static org.cmdbuild.easytemplate.FtlUtils.processToString;
import org.cmdbuild.requestcontext.RequestContextService;
import static org.cmdbuild.services.MinionStatus.MS_ERROR;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_OBJECTS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.utils.date.CmDateUtils.systemZoneId;
import static org.cmdbuild.utils.hash.CmHashUtils.toIntHash;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmExecutorUtils.executorService;
import static org.cmdbuild.utils.lang.CmExecutorUtils.shutdownQuietly;
import static org.cmdbuild.utils.lang.CmStringUtils.abbreviate;
import static org.jgroups.Message.Flag.DONT_BUNDLE;
import org.jgroups.blocks.MethodCall;
import org.jgroups.blocks.RequestOptions;
import org.jgroups.blocks.ResponseMode;
import org.jgroups.blocks.RpcDispatcher;
import org.jgroups.fork.ForkChannel;

@Component
@MinionComponent(name = "Clustering", configBean = ClusterConfiguration.class, canStartStop = true)
public class ClusterServiceImpl implements ClusterService {

    private final static short RPC_METHOD_ID = 0;

    private final static Method RPC_METHOD_HANDLE;

    static {
        try {
            RPC_METHOD_HANDLE = ClusterServiceImpl.class.getMethod("handleRpcRequest", String.class, String.class);
        } catch (NoSuchMethodException | SecurityException ex) {
            throw runtime(ex);
        }
    }

    private static final String TIMESTAMP_ATTR = "timestamp",
            SOURCE_ID_ATTR = "sourceId",
            MESSAGE_TYPE_ATTR = "type",
            MESSAGE_ID_ATTR = "messageId",
            DATA_ATTR = "data";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EventBus eventBus = new EventBus(logExceptions(logger));

    private final ClusterConfiguration config;
    private final Provider<RpcHelper> rpcHelper;

    private final ExecutorService executorService;

    private final List<JChannel> channels = new CopyOnWriteArrayList<>();
    private RpcDispatcher rpcDispatcher;

    public ClusterServiceImpl(ClusterConfiguration clusterConfig, Provider<RpcHelper> rpcHelper, RequestContextService contextService) {
        this.config = checkNotNull(clusterConfig);
        this.rpcHelper = checkNotNull(rpcHelper);
        checkNotNull(contextService);
        executorService = executorService(getClass().getName(), () -> contextService.initCurrentRequestContext("cluster message processing job"), contextService::destroyCurrentRequestContext);
    }

    public MinionStatus getServiceStatus() {
        if (!isEnabled()) {
            return MS_DISABLED;
        } else if (isRunning()) {
            return MS_READY;
        } else {
            return MS_ERROR;
        }
    }

    @PreDestroy
    public void cleanup() {
        shutdownQuietly(executorService);
    }

    @Override
    public String getConfiguredNodeId() {
        return config.getConfiguredNodeId();
    }

    @Override
    public String getRuntimeNodeId() {
        return config.getRuntimeNodeId();
    }

    @Override
    public ClusterNode selectSingleNodeForKey(@Nullable String key) {
        key = nullToEmpty(key);
        List<ClusterNode> clusterNodes = Ordering.natural().onResultOf(ClusterNode::getNodeId).sortedCopy(getClusterNodes());
        int i = toIntHash(key) % clusterNodes.size();
        ClusterNode node = clusterNodes.get(i);
        logger.debug("select node for key =< {} >, selected node {} = {}", key, i, node);
        return node;
    }

    @Override
    public List<ClusterNode> getClusterNodes() {
        if (isRunning()) {
            try {
                View view = getMainChannel().getView();
                return getClusterNodes(view);
            } catch (Exception ex) {
                logger.error(marker(), "error retrieving cluster members", ex);
                return singletonList(getThisClusterNode());
            }
        } else {
            return singletonList(getThisClusterNode());
        }
    }

    @PostStartup
    public synchronized void startIfEnabled() {
        if (isEnabled()) {
            start();
        } else {
            logger.info("clustering is disabled");
        }
    }

    @PreShutdown
    public synchronized void stopSafe() {
        if (!channels.isEmpty()) {
            if (rpcDispatcher != null) {
                try {
                    rpcDispatcher.close();
                } catch (Exception ex) {
                    logger.warn("error closing rpc dispatcher", ex);
                }
                rpcDispatcher = null;
            }
            logger.info("stopping cluster event service");
            reverse(channels).forEach(channel -> {
                try {
                    channel.close();
                } catch (Exception ex) {
                    logger.warn("error closing channel", ex);
                }
            });
            channels.clear();
            logger.info("clustering service stopped");
        }
    }

    @ConfigListener(ClusterConfiguration.class)
    public void reload() {
        stopSafe();
        startIfEnabled();
    }

    @Override
    public boolean isRunning() {
        if (!isEnabled()) {
            return false;
        } else {
            try {
                return !channels.isEmpty() && !getMainChannel().isClosed();
            } catch (Exception ex) {
                logger.warn(marker(), "cluster service not running", ex);
                return false;
            }
        }
    }

    @Override
    public void sendMessage(ClusterMessage clusterMessage) {
        if (isRunning()) {
            try {
                doSendMessage(clusterMessage);
            } catch (Exception ex) {
                logger.warn(marker(), "error sending cluster message", ex);
            }
        } else {
            logger.debug("cluster not enabled, skip outgoing message = {}", clusterMessage);
        }
    }

    @Override
    public String invokeRpcMethod(String nodeId, @Nullable String sessionId, String payload) {
        checkArgument(isRunning());
        Address address = getRpcChannel().getView().getMembers().stream().filter(a -> equal(nodeAddressToNodeId(a), nodeId)).collect(onlyElement("node not found for id =< %s >", nodeId));
        MethodCall methodCall = new MethodCall(RPC_METHOD_ID, sessionId, payload);
        try {
            logger.debug("execute rpc invocation for target node = {} with payload =< {} >", nodeId, abbreviate(payload));
            String output = rpcDispatcher.callRemoteMethod(address, methodCall, new RequestOptions(ResponseMode.GET_FIRST, config.getRpcTimeout()).setFlags(DONT_BUNDLE));
            logger.debug("received rpc response =< {} >", abbreviate(output));
            return output;
        } catch (Exception ex) {
            throw runtime(ex, "rpc invocation failed for target node = %s with payload =< %s >", nodeId, abbreviate(payload));
        }
    }

    @Override
    public EventBus getEventBus() {
        return eventBus;
    }

    @Override
    public ClusterNode getThisClusterNode() {
        if (isRunning()) {
            return toClusterNode(getMainChannel().getAddress(), true);
        } else {
            return new ClusterNodeImpl(config.getClusterNodeId(), "127.0.0.1", true);
        }
    }

    private JChannel getMainChannel() {
        return channels.get(0);
    }

    private JChannel getEventChannel() {
        return channels.get(1);
    }

    private JChannel getRpcChannel() {
        return channels.get(2);
    }

    //accessed from jgroups via reflection
    public String handleRpcRequest(@Nullable String sessionId, String payload) throws InterruptedException, ExecutionException {
        logger.debug("handle rpc request with sessionId =< {} > and payload =< {} >", sessionId, abbreviate(payload));
        return executorService.submit((Callable<String>) () -> {
            try {
                return rpcHelper.get().invokeRpcMethod(sessionId, payload);
            } catch (Exception ex) {
                logger.error("error invoking rpc method", ex);
                throw ex;
            }
        }).get();
    }

    private boolean isEnabled() {
        return config.isClusterEnabled();
    }

    private List<ClusterNode> getClusterNodes(View view) {
        Address thisAddress = getMainChannel().getAddress();
        return view.getMembers().stream()
                .map((n) -> toClusterNode(n, equal(n, thisAddress)))
                .sorted((a, b) -> ComparisonChain.start().compareTrueFirst(a.isThisNode(), b.isThisNode()).compare(a.getNodeId(), b.getNodeId()).result()).collect(toList());
    }

    private ClusterNode toClusterNode(Address n, boolean isThisNode) {
        String nodeId = nodeAddressToNodeId(n);
        String address = getPhisicalAddressSafe(n);
        return new ClusterNodeImpl(nodeId, address, isThisNode);
    }

    private static String nodeAddressToNodeId(Address address) {
        return address.toString();
    }

    private String getPhisicalAddressSafe(Address address) {
        try {
            PhysicalAddress physicalAddress = (PhysicalAddress) getMainChannel().down(new Event(Event.GET_PHYSICAL_ADDRESS, address));
            return physicalAddress.printIpAddress();
        } catch (Exception ex) {
            logger.debug("error retrieving phisical addres from addr = {}", address, ex);
            return "<unknown address>";
        }
    }

    private synchronized void start() {
        try {
            startUnsafe();
        } catch (Exception ex) {
            logger.error(marker(), "unable to start clustering service", ex);
        }

    }

    private synchronized void startUnsafe() throws Exception {
        stopSafe();
        checkArgument(channels.isEmpty() && rpcDispatcher == null);
        logger.info("starting clustering service");
        logger.debug("create new jgroups channel");
        try {
            LogFactory.setCustomLogFactory(new CustomLogFactory() {
                @Override
                public Log getLog(Class clazz) {
                    return getLog(clazz.getName());
                }

                @Override
                public Log getLog(String category) {
                    return new Slf4jLogImpl(format("org.cmdbuild.clustering.jgroups.%s", category));
                }
            });
            String jgroupsConfig = processToString(new Template("config", readToString(getClass().getResourceAsStream("/org/cmdbuild/clustering/jgroups/jgroups.xml")), new Configuration(VERSION_2_3_28)), map(
                    "tcp_port", config.getTcpPort(),
                    "tcp_addr", config.getTcpAddr(),
                    "tcpping_initial_hosts", Joiner.on(",").skipNulls().join(config.getClusterNodes())
            ));
            logger.debug("jgroups config = \n\n{}\n", jgroupsConfig);

            JChannel mainChannel = new JChannel(new ByteArrayInputStream(jgroupsConfig.getBytes()));
            channels.add(mainChannel);
            mainChannel.setName(config.getClusterNodeId());
            mainChannel.setReceiver(new MainReceiver());
            mainChannel.connect(config.getClusterName());

            ForkChannel eventChannel = new ForkChannel(mainChannel, "event_stack", "event_channel");
            channels.add(eventChannel);
            eventChannel.setDiscardOwnMessages(true);
            eventChannel.setReceiver(new EventReceiver());
            eventChannel.connect(config.getClusterName());

            ForkChannel rpcChannel = new ForkChannel(mainChannel, "rpc_stack", "rpc_channel");
            channels.add(rpcChannel);
            rpcChannel.connect(config.getClusterName());

            rpcDispatcher = new RpcDispatcher(rpcChannel, this);
            rpcDispatcher.setMethodLookup((short id) -> {
                switch (id) {
                    case RPC_METHOD_ID:
                        return RPC_METHOD_HANDLE;
                    default:
                        throw new IllegalArgumentException(format("rpc method not found for id = %s", id));
                }
            });
            logger.debug("jgroups channel configuring");
        } catch (Exception ex) {
            stopSafe();
            throw ex;
        }
    }

    private void doSendMessage(ClusterMessage clusterMessage) throws Exception {
        logger.debug("send cluster message = {}", clusterMessage);
        checkArgument(equal(clusterMessage.getSourceInstanceId(), THIS_INSTANCE_ID));

        String payload = toJson(map(
                SOURCE_ID_ATTR, config.getClusterNodeId(),
                TIMESTAMP_ATTR, now().toInstant().toEpochMilli(),
                MESSAGE_ID_ATTR, clusterMessage.getMessageId(),
                MESSAGE_TYPE_ATTR, clusterMessage.getMessageType(),
                DATA_ATTR, map(clusterMessage.getMessageData())));

        Message message = new Message(null, payload.getBytes(StandardCharsets.UTF_8));
        if (clusterMessage.requireRsvp()) {
            message.setFlag(Flag.RSVP);
        }
        logger.trace("send jgroups message = {} with payload = {}", message, payload);
        getEventChannel().send(message);
    }

    private class MainReceiver implements Receiver {

        @Override
        public void receive(Message message) {
            // nothing to do
        }

        @Override
        public void viewAccepted(View view) {
            try {
                logger.info("new cluster view received = \n\n{}\n", getClusterNodes(view).stream().map(n -> format("\t%s  %-10s    %s", n.isThisNode() ? "(this node)" : "           ", n.getNodeId(), n.getAddress())).collect(joining("\n")));
            } catch (Exception ex) {
                logger.error("error processing jgroups view = {}", view, ex);
            }
        }

    }

    private class EventReceiver implements Receiver {

        @Override
        public void receive(Message message) {
            try {
                logger.trace("received jgroups message = {}", message);
                String payload = new String(message.getBuffer(), StandardCharsets.UTF_8);
                logger.trace("jgroups message payload = {}", payload);
                executorService.submit(() -> {
                    try {
                        Map<String, Object> map = fromJson(payload, MAP_OF_OBJECTS);
                        ClusterMessage clusterMessage = ClusterMessageImpl.builder()
                                .withTimestamp(Instant.ofEpochMilli(toLong(map.get(TIMESTAMP_ATTR))).atZone(systemZoneId()))
                                .withSourceInstanceId((String) map.get(SOURCE_ID_ATTR))
                                .withMessageType((String) map.get(MESSAGE_TYPE_ATTR))
                                .withMessageId((String) map.get(MESSAGE_ID_ATTR))
                                .withMessageData((Map<String, Object>) map.get(DATA_ATTR))
                                .build();
                        logger.debug("received cluster message = {}", clusterMessage);
                        checkArgument(!equal(clusterMessage.getSourceInstanceId(), config.getClusterNodeId()), "received cluster message with source node id = this node id");
                        eventBus.post(new ClusterMessageReceivedEventImpl(clusterMessage));
                    } catch (Exception ex) {
                        logger.error(marker(), "error processing jgroups message payload =< {} >", payload, ex);//TODO error collecting
                    }
                });
            } catch (Exception ex) {
                logger.error("error processing jgroups message = {}", message, ex);
            }
        }

    }

    private class ClusterMessageReceivedEventImpl implements ClusterMessageReceivedEvent {

        private final ClusterMessage clusterMessage;

        public ClusterMessageReceivedEventImpl(ClusterMessage clusterMessage) {
            this.clusterMessage = checkNotNull(clusterMessage);
        }

        @Override
        public ClusterMessage getClusterMessage() {
            return clusterMessage;
        }

    }

}
