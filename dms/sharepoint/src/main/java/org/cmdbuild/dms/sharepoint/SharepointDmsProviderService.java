package org.cmdbuild.dms.sharepoint;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.base.Supplier;
import com.google.common.base.Suppliers;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.MoreCollectors.toOptional;
import com.google.common.net.UrlEscapers;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.String.format;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.ZonedDateTime;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Function;
import static java.util.function.Function.identity;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;

import javax.activation.DataHandler;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import static org.apache.http.entity.ContentType.APPLICATION_JSON;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import org.apache.tika.Tika;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.dao.DaoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dms.DocumentData;
import org.cmdbuild.dms.DocumentDataImpl;
import org.cmdbuild.dms.inner.DmsProviderService;
import org.cmdbuild.dms.inner.DocumentInfoAndDetail;
import org.cmdbuild.dms.inner.DocumentInfoAndDetailImpl;
import static org.cmdbuild.dms.inner.DocumentPathUtils.buildDocumentPathList;
import org.cmdbuild.exception.DmsException;
import org.cmdbuild.scheduler.ScheduledJob;
import org.cmdbuild.services.MinionStatus;
import org.cmdbuild.services.MinionComponent;
import org.cmdbuild.services.MinionConfig;
import static org.cmdbuild.services.MinionConfig.MC_DISABLED;
import static org.cmdbuild.services.MinionConfig.MC_ENABLED;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import static org.cmdbuild.services.MinionStatus.MS_ERROR;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import org.cmdbuild.services.PostStartup;
import org.cmdbuild.services.PreShutdown;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import org.cmdbuild.utils.io.CmHttpRequestException;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.io.HttpClientUtils.checkStatus;
import static org.cmdbuild.utils.io.HttpClientUtils.checkStatusAndClose;
import static org.cmdbuild.utils.io.HttpClientUtils.checkStatusAndReadResponse;
import static org.cmdbuild.utils.io.HttpClientUtils.closeQuietly;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_OBJECTS;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_STRINGS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import org.cmdbuild.utils.lang.CmCollectionUtils.FluentList;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toInt;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import org.cmdbuild.utils.lang.CmInlineUtils;
import static org.cmdbuild.utils.lang.CmInlineUtils.flattenMaps;
import static org.cmdbuild.utils.lang.CmInlineUtils.flattenMapsKeepOriginal;
import static org.cmdbuild.utils.lang.CmInlineUtils.unflattenMap;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmMapUtils.mapOf;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.trimAndCheckNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableString;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;

@Component
@MinionComponent(name = "DMS_ SharePoint Online", config = "org.cmdbuild.dms.sharepoint", watchForConfigs = "org.cmdbuild.dms")
public class SharepointDmsProviderService implements DmsProviderService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final int UPLOAD_PART_SIZE = 327680 * 4, // the size of each byte range MUST be a multiple of 320 KiB (327,680 bytes)
            UPLOAD_SPLIT_THRESHOLD = UPLOAD_PART_SIZE * 2; //must be less than 4MB

    private final Tika tika = new Tika();

    private final DaoService dao;
    private final SharepointDmsConfiguration config;

    private final AtomicReference<SharepointGraphApiClient> helperHolder = new AtomicReference<>();

    public SharepointDmsProviderService(DaoService dao, SharepointDmsConfiguration config) {
        this.dao = checkNotNull(dao);
        this.config = checkNotNull(config);
    }

    public MinionStatus getServiceStatus() {
        if (!isEnabled()) {
            return MS_DISABLED;
        } else if (isOk()) {
            return MS_READY;
        } else {
            return MS_ERROR;
        }
    }

    @Override
    public void checkService() {
        doWithHelper((SharepointGraphApiClient h) -> h.checkOk());
    }

    public MinionConfig getMinionConfig() {
        return isEnabled() ? MC_ENABLED : MC_DISABLED;
    }

    @Override
    public String getDmsProviderServiceName() {
        return DMS_PROVIDER_SHAREPOINT_ONLINE;
    }

    private boolean isOk() {
        try {
            checkService();
            return true;
        } catch (Exception ex) {
            logger.warn("sharepoint dms service is NOT OK : {}", ex.toString());
            return false;
        }
    }

    @ScheduledJob(value = "0 */10 * * * ?", persistRun = false) //run every 10 minutes
    public void refreshExpiredToken() {
        if (isEnabled()) {
            synchronized (helperHolder) {
                logger.debug("check sharepoint dms token");
                if (helperHolder.get() != null) {
                    helperHolder.get().checkRefreshToken();
                }
            }
        }
    }

    @PostStartup
    @ConfigListener(SharepointDmsConfiguration.class)
    public void reload() {
        cleanup();
        if (isEnabled()) {
            try {
                doWithHelper((SharepointGraphApiClient h) -> h.setItem(buildBasePath(), DocumentDataImpl.builder().withFilename("README.txt").withData("\nroot folder used by cmdbuild sharepoint dms driver\n\nDO NOT DELETE THIS FILE\n".getBytes()).build()));
                logger.info("dms service ready");
            } catch (Exception ex) {
                logger.error(marker(), "error starting dms service", ex);
            }
        }
    }

    @PreShutdown
    public void close() {
        cleanup();
    }

    private boolean isEnabled() {
        return config.isEnabled(getDmsProviderServiceName());
    }

    @Override
    public DocumentInfoAndDetail getDocument(String documentId) {
        return doWithHelper((SharepointGraphApiClient helper) -> parseDocument(helper.getItemById(checkNotBlank(documentId))));
    }

    @Override
    public List<DocumentInfoAndDetail> getDocuments(String classId, long cardId) {
        return doWithHelper((SharepointGraphApiClient helper) -> helper.listFolderContent(buildPath(classId, cardId)).stream().filter(d -> d.containsKey("file")).map(d -> parseDocument(d)).collect(toImmutableList()));
    }

    @Override
    public List<DocumentInfoAndDetail> getDocumentVersions(String documentId) {
        return doWithHelper((SharepointGraphApiClient helper) -> {
            Map<String, Object> item = helper.getItemById(documentId, true);
            DocumentInfoAndDetail document = parseDocument(item);
            return list(document).accept(l -> ((List<Map<String, Object>>) item.get("versions")).stream()
                    .filter(v -> !equal(v.get("id"), document.getVersion()))
                    .map(v -> {
                        logger.debug("found version = \n\n{}\n", mapToLoggableStringLazy(v));
                        return DocumentInfoAndDetailImpl.copyOf(document)
                                .withVersion(toStringNotBlank(v.get("driveItemVersion___id")))
                                .withFileSize(toInt(v.get("driveItemVersion___size")))
                                .withHash("unknown")//TODO (?)
                                .withModified(toDateTime(v.get("driveItemVersion___lastModifiedDateTime")))
                                .withAuthor(firstNotBlank(config.hasSharepointCustomAuthorColumn() ? toStringOrEmpty(v.get(format("listItemVersion___fields___%s", config.getSharepointCustomAuthorColumn()))) : "", "unknown"))
                                .withDescription(config.hasSharepointCustomDescriptionColumn() ? toStringOrEmpty(v.get(format("listItemVersion___fields___%s", config.getSharepointCustomDescriptionColumn()))) : "")
                                .withCategory(config.hasSharepointCustomCategoryColumn() ? toStringOrEmpty(v.get(format("listItemVersion___fields___%s", config.getSharepointCustomCategoryColumn()))) : "")
                                .build();
                    }).forEach(l::add));
        });
    }

    @Override
    public DocumentInfoAndDetail create(String classId, long cardId, DocumentData data) {
        return doWithHelper((SharepointGraphApiClient helper) -> parseDocument(helper.setItem(buildPath(classId, cardId), data)));
    }

    @Override
    public DocumentInfoAndDetail update(String documentId, DocumentData data) {
        return doWithHelper((SharepointGraphApiClient helper) -> parseDocument(helper.setItem(documentId, data)));
    }

    @Override
    public DataHandler download(String documentId, @Nullable String version) {
        DocumentInfoAndDetail document = getDocument(documentId);
        DataHandler content = doWithHelper((SharepointGraphApiClient helper) -> {
            if (isBlank(version) || equal(version, document.getVersion())) {
                return helper.getItemContent(documentId);
            } else {
                return helper.getVersionContent(documentId, version);
            }
        });
        return newDataHandler(toByteArray(content), document.getMimeType(), document.getFileName());
    }

    @Override
    public void delete(String documentId) {
        doWithHelper((SharepointGraphApiClient helper) -> helper.deleteItem(documentId));
    }

    @Override
    public Optional<DataHandler> preview(String documentId) {
        try {
            return Optional.ofNullable(doWithHelper((SharepointGraphApiClient helper) -> helper.getItemPreview(documentId)));
        } catch (Exception ex) {
            logger.warn(marker(), "error retrieving preview for documentId =< {} >", documentId, ex);
            return Optional.empty();
        }
    }

    @Override
    public DocumentInfoAndDetail createLink(DocumentInfoAndDetail document, List<String> targetAbsolutePath) {
        return doWithHelper(helper -> {
            DataHandler data = helper.getItemContent(document.getDocumentId());
            List<String> folder = targetAbsolutePath.subList(0, targetAbsolutePath.size() - 1);
            String filename = targetAbsolutePath.get(targetAbsolutePath.size() - 1);
            return parseDocument(helper.setItem(folder, DocumentDataImpl.builder().withData(data).withFilename(filename).build()));
        });
    }

    @Override
    public void deleteLink(List<String> targetAbsolutePath) {
        doWithHelper(helper -> {
            helper.deleteItemIfExists(targetAbsolutePath);
        });
    }

    @Override
    public List<String> queryDocuments(String fulltextQuery, String classId, Long cardId) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private FluentList<String> buildPath(String classId, long cardId) {
        return buildBasePath().with(buildDocumentPathList(dao.getClasse(classId), cardId));
    }

    private DocumentInfoAndDetail parseDocument(Map<String, Object> d) {
        logger.debug("found document = \n\n{}\n", mapToLoggableStringLazy(d));
        return DocumentInfoAndDetailImpl.builder()
                .withAuthor(firstNotBlank(config.hasSharepointCustomAuthorColumn() ? toStringOrEmpty(d.get(format("listItem___fields___%s", config.getSharepointCustomAuthorColumn()))) : "", "unknown"))
                .withDescription(config.hasSharepointCustomDescriptionColumn() ? toStringOrEmpty(d.get(format("listItem___fields___%s", config.getSharepointCustomDescriptionColumn()))) : "")
                .withCategory(config.hasSharepointCustomCategoryColumn() ? toStringOrEmpty(d.get(format("listItem___fields___%s", config.getSharepointCustomCategoryColumn()))) : "")
                .withCreated(toDateTime(d.get("createdDateTime")))
                .withDocumentId(toStringNotBlank(d.get("id")))
                .withFileName(toStringNotBlank(d.get("name")))
                .withFileSize(toInt(d.get("size")))
                .withHash(unflattenMap(d, "file___hashes").entrySet().stream().limit(1).map(e -> format("%s:%s", e.getKey(), e.getValue())).collect(toOptional()).orElse("unknown"))
                .withMimeType(firstNotBlank(toStringOrEmpty(d.get("file___mimeType")), "application/octet-stream"))
                .withModified(toDateTime(d.get("lastModifiedDateTime")))
                .withVersion(toStringNotBlank(d.get("listItem___fields____UIVersionString")))
                .build();
    }

    private void doWithHelper(Consumer<SharepointGraphApiClient> fun) {
        doWithHelper((h) -> {
            fun.accept(h);
            return null;
        });
    }

    private <T> T doWithHelper(Function<SharepointGraphApiClient, T> fun) {
        SharepointGraphApiClient helper;
        synchronized (helperHolder) {
            if (helperHolder.get() == null) {
                helperHolder.set(buildHelper());
            }
            helper = helperHolder.get();
        }
        try {
            helper.checkRefreshToken();
            return fun.apply(helper);
        } catch (Exception ex) {
            logger.debug("sharepoint dms error, checking client");
            if (helper.isOk()) {
                throw new DaoException(ex);
            } else {
                logger.debug("sharepoint dms error, caused by invalid client", ex);
                logger.warn("sharepoint dms request failed for invalid client, reset client and retry: {}", ex.toString());
                synchronized (helperHolder) {
                    if (helperHolder.get() == helper) {
                        helperHolder.set(null);
                        closeQuietly(helper);
                        helperHolder.set(buildHelper());
                    }
                    helper = helperHolder.get();
                }
                return fun.apply(helper);
            }
        }
    }

    private void cleanup() {
        synchronized (helperHolder) {
            if (helperHolder.get() != null) {
                logger.debug("close sharepoint client helper");
                closeQuietly(helperHolder.get());
                helperHolder.set(null);
            }
        }
    }

    private SharepointGraphApiClient buildHelper() {
        SharepointGraphApiClient helper = new SharepointGraphApiClient();
        try {
            helper.checkOk();
            return helper;
        } catch (RuntimeException ex) {
            closeQuietly(helper);
            throw ex;
        }
    }

    private FluentList<String> buildBasePath() {
        return list(Splitter.on("/").omitEmptyStrings().splitToList(nullToEmpty(config.getSharepointPath())));
    }

    private static String escapeUrlPart(String part) {
        return UrlEscapers.urlPathSegmentEscaper().escape(part);
    }

    private String getGraphApiBaseUrl() {
        return checkNotBlank(config.getSharepointGraphApiBaseUrl(), "missing sharepoint graph api base url");
    }

    private class SharepointGraphApiClient implements AutoCloseable {

        private String accessToken, refreshToken;
        private ZonedDateTime tokenRelease, tokenExpiration;
        private final Supplier<String> driveId = Suppliers.memoize(this::acquireDriveId),
                listId = Suppliers.memoize(this::acquireListId),
                siteId = Suppliers.memoize(this::acquireSiteId);
        private final PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        private boolean isOk = true;

        public SharepointGraphApiClient() {
        }

        @Override
        public void close() throws IOException {
            connectionManager.close();
        }

        public synchronized boolean isOk() {
            if (!isOk) {
                return false;
            } else {
                try {
                    checkOk();
                    return true;
                } catch (CmHttpRequestException ex) {
                    logger.warn("sharepoint helper is not ok = {}", ex.toString());
                    return isOk = false;
                }
            }
        }

        public synchronized void checkOk() {
            getResource("me");
            getResource(format("drives/%s/root/children", escapeUrlPart(getDriveId())));
            logger.debug("sharepoint graph api client is OK");
        }

        public synchronized void checkRefreshToken() {
            switch (getAuthProtocol()) {
                case MSAZUREOAUTH2:
                    if (tokenRelease != null && tokenExpiration != null && isNotBlank(refreshToken) && isNotBlank(accessToken)) {
                        long initialSeconds = Duration.between(tokenRelease, tokenExpiration).getSeconds(), remainingSeconds = Duration.between(now(), tokenExpiration).getSeconds();
                        if (remainingSeconds < initialSeconds / 2 || remainingSeconds < 600) {
                            logger.debug("{} seconds remaining before token expiration, execute token refresh", remainingSeconds);
                            refreshMsAccessToken();
                        } else {
                            logger.debug("{} seconds remaining before token expiration, token is ok", remainingSeconds);
                        }
                    }
                    break;
                default:
                    throw unsupported("unsupported sharepoint auth protocol =< %s >", config.getSharepointAuthProtocol());
            }
        }

        public List<Map<String, Object>> listFolderContent(List<String> path) {
            return listFolderContent(path, false);
        }

        public List<Map<String, Object>> listFolderContentCreateIfMissing(List<String> path) {
            return listFolderContent(path, true);
        }

        public Map<String, Object> getItemById(String itemId) {
            return getItemById(itemId, false);
        }

        public Map<String, Object> getItemByPath(List<String> path) {
            return checkNotNull(doGetItemByPath(path, false));
        }

        @Nullable
        public Map<String, Object> getItemByPathOrNull(List<String> path) {
            return doGetItemByPath(path, true);
        }

        public Map<String, Object> getItemById(String itemId, boolean includeVersions) {
            String resource = "drives/%s/items/%s?$expand=listItem($expand=fields)";
            if (includeVersions) {
                resource += ",versions";
            }
            Map<String, Object> item = flattenMapsKeepOriginal(getResource(format(resource, escapeUrlPart(getDriveId()), escapeUrlPart(checkNotBlank(itemId)))));
            if (includeVersions) {
                Map<String, Map<String, Object>> driveItemVersions = map((List<Map<String, Object>>) item.get("versions"), m -> toStringNotBlank(m.get("id")), identity()),
                        listItemVersions = map((List<Map<String, Object>>) getResource(format("sites/%s/lists/%s/items/%s?$expand=versions($expand=fields)", escapeUrlPart(getSiteId()), escapeUrlPart(getListId()), escapeUrlPart(toStringNotBlank(item.get("listItem___id"))))).get("versions"), m -> toStringNotBlank(m.get("id")), identity());
                item = map(item).with("versions", set(driveItemVersions.keySet()).with(listItemVersions.keySet()).stream().map(v -> flattenMapsKeepOriginal(map("listItemVersion", listItemVersions.getOrDefault(v, emptyMap()), "driveItemVersion", driveItemVersions.getOrDefault(v, emptyMap())))).collect(toImmutableList()));
            }
            return item;
        }

        public DataHandler getItemContent(String itemId) {
            return getContent(format(getGraphApiBaseUrl() + "drives/%s/items/%s/content", escapeUrlPart(getDriveId()), escapeUrlPart(checkNotBlank(itemId))));
        }

        public DataHandler getItemPreview(String itemId) {
            return getContent(format(getGraphApiBaseUrl() + "drives/%s/items/%s/thumbnails/0/medium/content", escapeUrlPart(getDriveId()), escapeUrlPart(checkNotBlank(itemId))));
        }

        public DataHandler getVersionContent(String itemId, String version) {
            return getContent(format(getGraphApiBaseUrl() + "drives/%s/items/%s/versions/%s/content", escapeUrlPart(getDriveId()), escapeUrlPart(checkNotBlank(itemId)), escapeUrlPart(checkNotBlank(version))));
        }

        public Map<String, Object> setItem(List<String> folder, DocumentData document) {
            listFolderContentCreateIfMissing(folder);
            return doSetItem(format("drives/%s/root:/%s:", escapeUrlPart(getDriveId()), list(folder).with(document.getFilename()).map(SharepointDmsProviderService::escapeUrlPart).collect(joining("/"))), document);
        }

        public Map<String, Object> setItem(String documentId, DocumentData document) {
            return doSetItem(format("drives/%s/items/%s", escapeUrlPart(getDriveId()), escapeUrlPart(checkNotBlank(documentId))), document);
        }

        public void deleteItemIfExists(List<String> path) {
            Optional.ofNullable(getItemByPathOrNull(path)).ifPresent(this::doDeleteItem);
        }

        public void deleteItem(List<String> path) {
            doDeleteItem(getItemByPath(path));
        }

        public void deleteItem(String documentId) {
            doDeleteItem(getItemById(documentId));
        }

        @Nullable
        private Map<String, Object> doGetItemByPath(List<String> path, boolean orNull) {
            return Optional.ofNullable(doGetResource(format("drives/%s/root:/%s?$expand=listItem($expand=fields)", escapeUrlPart(getDriveId()), path.stream().map(SharepointDmsProviderService::escapeUrlPart).collect(joining("/"))), orNull)).map(CmInlineUtils::flattenMapsKeepOriginal).orElse(null);
        }

        private void doDeleteItem(Map<String, Object> item) {
            try {
                String documentId = toStringNotBlank(item.get("id"));
                String token = getAccessToken();
                HttpDelete request = new HttpDelete(format(getGraphApiBaseUrl() + "drives/%s/items/%s", escapeUrlPart(getDriveId()), escapeUrlPart(checkNotBlank(documentId))));
                request.setHeader("Authorization", format("Bearer %s", token));
                logger.debug("delete resource =< {} >", request);
                checkStatusAndClose(getHttpClient().execute(request));
                logger.debug("delete OK");
                String parentId = toStringOrNull(item.get("parentReference___id"));
                if (isNotBlank(parentId) && toInt(flattenMaps(getResource(format("drives/%s/items/%s", escapeUrlPart(getDriveId()), escapeUrlPart(parentId)))).get("folder___childCount")) == 0) {
                    deleteItem(parentId);
                }
            } catch (IOException e) {
                throw new DmsException(e);
            }
        }

        private DataHandler getContent(String path) {
            try {
                String token = getAccessToken();
                HttpGet request = new HttpGet(path);
                request.setHeader("Authorization", format("Bearer %s", token));
                logger.debug("get resource =< {} >", request);
                CloseableHttpResponse response = getHttpClient().execute(request);
                checkStatus(response);
                HttpEntity entity = checkNotNull(response.getEntity());
                byte[] data = toByteArray(entity.getContent());
                String contentType = Optional.ofNullable(entity.getContentType()).map(Header::getValue).orElseGet(() -> tika.detect(data));
                logger.debug("got data = {} bytes {}", data.length, entity.getContentType());
                logger.debug("headers = \n\n{}\n", mapToLoggableStringLazy(map(list(response.getAllHeaders()), Header::getName, Header::getValue)));
                EntityUtils.consumeQuietly(entity);
                return newDataHandler(data, contentType);
            } catch (IOException e) {
                throw new DmsException(e);
            }
        }

        public byte[] getItemContent(List<String> path) {
            return checkNotNull(getItemContentOrNull(path), "item content not found for path =< %s >", path);
        }

        @Nullable
        public byte[] getItemContentOrNull(List<String> path) {
            try {
                String token = getAccessToken();
                HttpGet request = new HttpGet(format(getGraphApiBaseUrl() + "drives/%s/root:/%s:/content", escapeUrlPart(getDriveId()), path.stream().map(SharepointDmsProviderService::escapeUrlPart).collect(joining("/"))));
                request.setHeader("Authorization", format("Bearer %s", token));
                logger.debug("get resource =< {} >", request);
                CloseableHttpResponse response = getHttpClient().execute(request);
                checkStatus(response);
                HttpEntity entity = checkNotNull(response.getEntity());
                byte[] data = toByteArray(entity.getContent());
                logger.debug("got data = {} bytes {}", data.length, entity.getContentType());
                logger.debug("headers = \n\n{}\n", mapToLoggableStringLazy(map(list(response.getAllHeaders()), Header::getName, Header::getValue)));
                EntityUtils.consumeQuietly(entity);
                return data;
            } catch (CmHttpRequestException ex) {
                if (nullToEmpty(getErrorCodeSafe(ex)).equalsIgnoreCase("itemNotFound")) {
                    logger.debug("item not found for path =< {} >", Joiner.on("/").join(path));
                    return null;
                } else {
                    throw ex;
                }
            } catch (IOException e) {
                throw new DmsException(e);
            }
        }

        private Map<String, Object> doSetItem(String path, DocumentData document) {
            try {
                String token = getAccessToken();
                Map<String, Object> item;
                if (!document.hasData()) {
                    item = flattenMapsKeepOriginal(getResource(path + "?$expand=listItem($expand=fields)"));
                } else if (document.getData().length < UPLOAD_SPLIT_THRESHOLD) {
                    HttpPut request = new HttpPut(getGraphApiBaseUrl() + path + "/content");
                    request.setHeader("Authorization", format("Bearer %s", token));
                    request.setEntity(new ByteArrayEntity(document.getData(), ContentType.create(tika.detect(document.getData()))));
                    logger.debug("put resource =< {} >", request);
                    item = fromJson(checkStatusAndReadResponse(getHttpClient().execute(request)), MAP_OF_OBJECTS);
                    logger.debug("got response = \n\n{}\n", mapToLoggableStringLazy(item));
                    item = getItemById(toStringNotBlank(item.get("id")));
                } else {
                    HttpEntityEnclosingRequestBase request = new HttpPost(getGraphApiBaseUrl() + path + "/createUploadSession");
                    request.setHeader("Authorization", format("Bearer %s", token));
                    request.setEntity(new StringEntity(toJson(map("item", map("@microsoft.graph.conflictBehavior", "replace", "name", document.getFilename()))), APPLICATION_JSON));
                    logger.debug("post resource =< {} >", request);
                    Map<String, Object> uploadInfo = fromJson(checkStatusAndReadResponse(getHttpClient().execute(request)), MAP_OF_OBJECTS);
                    logger.debug("got response = \n\n{}\n", mapToLoggableStringLazy(uploadInfo));
                    String uploadUrl = toStringNotBlank(uploadInfo.get("uploadUrl"));
                    logger.debug("upload url =< {} >", uploadUrl);
                    InputStream in = new ByteArrayInputStream(document.getData());
                    byte[] buffer = new byte[UPLOAD_PART_SIZE];
                    int offset = 0, count, size = document.getData().length;
                    item = emptyMap();
                    while (offset < size) {
                        count = in.read(buffer);
                        logger.debug("upload range {}-{} of total {} bytes", offset, offset + count - 1, size);
                        request = new HttpPut(uploadUrl);
                        request.setHeader("Content-Range", format("bytes %s-%s/%s", offset, offset + count - 1, size));
                        request.setEntity(new ByteArrayEntity(buffer, 0, count));
                        item = fromJson(checkStatusAndReadResponse(getHttpClient().execute(request)), MAP_OF_OBJECTS);
                        offset += count;
                    }
                    logger.debug("upload completed");
                    item = getItemById(toStringNotBlank(item.get("id")));
                }
                String itemId = toStringNotBlank(item.get("id")), listItemId = toStringNotBlank(item.get("listItem___id"));
                Map<String, Object> meta = mapOf(String.class, Object.class).accept(m -> {
                    if (config.hasSharepointCustomAuthorColumn()) {
                        m.put(config.getSharepointCustomAuthorColumn(), nullToEmpty(document.getAuthor()));
                    }
                    if (config.hasSharepointCustomCategoryColumn()) {
                        m.put(config.getSharepointCustomCategoryColumn(), nullToEmpty(document.getCategory()));
                    }
                    if (config.hasSharepointCustomDescriptionColumn()) {
                        m.put(config.getSharepointCustomDescriptionColumn(), nullToEmpty(document.getDescription()));
                    }
                });
                if (!meta.isEmpty()) {
                    HttpPatch request = new HttpPatch(format(getGraphApiBaseUrl() + "sites/%s/lists/%s/items/%s/fields", escapeUrlPart(getSiteId()), escapeUrlPart(getListId()), escapeUrlPart(listItemId)));
                    logger.debug("patch resource =< {} > with payload =\n\n{}\n", request, mapToLoggableStringLazy(meta));
                    request.setHeader("Authorization", format("Bearer %s", token));
                    request.setEntity(new StringEntity(toJson(meta), ContentType.APPLICATION_JSON));
                    checkStatusAndClose(getHttpClient().execute(request));
                }
                return getItemById(itemId);
            } catch (IOException e) {
                throw new DmsException(e);
            }
        }

        private List<Map<String, Object>> listFolderContent(List<String> path, boolean createIfMissing) {
            try {
                Map<String, Object> resource = getResource(format("drives/%s/root:/%s:/children?$expand=listItem($expand=fields)", escapeUrlPart(getDriveId()), path.stream().map(SharepointDmsProviderService::escapeUrlPart).collect(joining("/"))));
                return list((List<Map<String, Object>>) resource.get("value")).map(CmInlineUtils::flattenMapsKeepOriginal);
            } catch (CmHttpRequestException ex) {
                if (nullToEmpty(getErrorCodeSafe(ex)).equalsIgnoreCase("itemNotFound")) {
                    logger.debug("folder not found for path =< {} >", Joiner.on("/").join(path));
                    if (createIfMissing) {
                        createFolder(path);
                    }
                    return emptyList();
                } else {
                    throw ex;
                }
            }
        }

        private void createFolder(List<String> path) {
            if (path.size() > 1) {
                listFolderContent(path.subList(0, path.size() - 1), true);
            }
            logger.debug("create folder =< {} >", Joiner.on("/").join(path));
            Object payload = map("name", path.get(path.size() - 1), "folder", emptyMap(), "@microsoft.graph.conflictBehavior", "fail");
            if (path.size() == 1) {
                postResource(payload, "drives/%s/root/children", escapeUrlPart(getDriveId()));
            } else {
                postResource(payload, "drives/%s/root:/%s:/children", escapeUrlPart(getDriveId()), path.subList(0, path.size() - 1).stream().map(SharepointDmsProviderService::escapeUrlPart).collect(joining("/")));
            }
        }

        @Nullable
        private String getErrorCodeSafe(CmHttpRequestException ex) {
            try {
                if (!ex.hasJsonContent()) {
                    return null;
                } else {
                    Map<String, Object> map = ex.getContentAsJsonSafe();
                    if (map.containsKey("error") && map.get("error") instanceof Map) {
                        return toStringOrNull(((Map) map.get("error")).get("code"));
                    } else {
                        return null;
                    }
                }
            } catch (Exception exx) {
                logger.warn("error reading json response", exx);
                return null;
            }
        }

        private String getDriveId() {
            return driveId.get();
        }

        private String getListId() {
            return listId.get();
        }

        private String getSiteId() {
            return siteId.get();
        }

        private synchronized String getAccessToken() {
            if (isBlank(accessToken)) {
                acquireAccessToken();
            }
            return accessToken;
        }

        private String acquireDriveId() {
            String sharepointUrl = trimAndCheckNotBlank(config.getSharepointUrl(), "missing required sharepoint url param");
            Matcher matcher = Pattern.compile("(https?://([^/]+)/sites/([^/]+)(/([^/]+))?)/?").matcher(sharepointUrl);
            checkArgument(matcher.matches(), "invalid format for sharepoint url =< %s >", sharepointUrl);
            String hostname = checkNotBlank(matcher.group(2)),
                    site = checkNotBlank(matcher.group(3));
            String webUrl = checkNotBlank(matcher.group(1));
            Map<String, Object> driveInfo = ((List<Map<String, Object>>) getResource(format("sites/%s:/sites/%s:/drives", escapeUrlPart(hostname), escapeUrlPart(site))).get("value")).stream().filter(d -> toStringOrEmpty(d.get("webUrl")).equalsIgnoreCase(webUrl))
                    .collect(onlyElement("drive not found for hostname =< %s >, site =< %s >, weburl =< %s >", hostname, site, webUrl));
            logger.debug("drive info = \n\n{}\n", mapToLoggableString(driveInfo));
            String id = checkNotBlank(toStringOrNull(driveInfo.get("id")), "missing drive id");
            logger.debug("found drive id =< {} >", id);
            return id;
        }

        private String acquireListId() {//TODO fix duplicate code
            String sharepointUrl = trimAndCheckNotBlank(config.getSharepointUrl(), "missing required sharepoint url param");
            Matcher matcher = Pattern.compile("(https?://([^/]+)/sites/([^/]+)(/([^/]+))?)/?").matcher(sharepointUrl);
            checkArgument(matcher.matches(), "invalid format for sharepoint url =< %s >", sharepointUrl);
            String hostname = checkNotBlank(matcher.group(2)),
                    site = checkNotBlank(matcher.group(3));
            String webUrl = checkNotBlank(matcher.group(1));
            Map<String, Object> driveInfo = ((List<Map<String, Object>>) getResource(format("sites/%s:/sites/%s:/lists", escapeUrlPart(hostname), escapeUrlPart(site))).get("value")).stream().filter(d -> toStringOrEmpty(d.get("webUrl")).equalsIgnoreCase(webUrl))
                    .collect(onlyElement("list not found for hostname =< %s >, site =< %s >, weburl =< %s >", hostname, site, webUrl));
            logger.debug("list info = \n\n{}\n", mapToLoggableString(driveInfo));
            String id = checkNotBlank(toStringOrNull(driveInfo.get("id")), "missing list id");
            logger.debug("found list id =< {} >", id);
            return id;
        }

        private String acquireSiteId() {//TODO fix duplicate code
            String sharepointUrl = trimAndCheckNotBlank(config.getSharepointUrl(), "missing required sharepoint url param");
            Matcher matcher = Pattern.compile("(https?://([^/]+)/sites/([^/]+)(/([^/]+))?)/?").matcher(sharepointUrl);
            checkArgument(matcher.matches(), "invalid format for sharepoint url =< %s >", sharepointUrl);
            String hostname = checkNotBlank(matcher.group(2)),
                    site = checkNotBlank(matcher.group(3));
            String webUrl = checkNotBlank(matcher.group(1));
            Map<String, Object> info = getResource(format("sites/%s:/sites/%s:", escapeUrlPart(hostname), escapeUrlPart(site)));
            logger.debug("site info = \n\n{}\n", mapToLoggableString(info));
            String id = checkNotBlank(toStringOrNull(info.get("id")), "missing site id");
            logger.debug("found site id =< {} >", id);
            return id;
        }

        @Nullable
        private Map<String, Object> getResourceOrNull(String path) throws CmHttpRequestException {
            return doGetResource(path, true);
        }

        private Map<String, Object> getResource(String path) throws CmHttpRequestException {
            return doGetResource(path, false);
        }

        @Nullable
        private Map<String, Object> doGetResource(String path, boolean orNull) throws CmHttpRequestException {
            try {
                String token = getAccessToken();
                HttpGet request = new HttpGet(getGraphApiBaseUrl() + path);
                request.setHeader("Authorization", format("Bearer %s", token));
                request.setHeader("Accept", "application/json");
                logger.debug("get resource =< {} >", request);
                Map<String, Object> map = fromJson(checkStatusAndReadResponse(getHttpClient().execute(request)), MAP_OF_OBJECTS);
                logger.debug("got response = \n\n{}\n", mapToLoggableString(map));
                return map;
            } catch (CmHttpRequestException ex) {
                if (nullToEmpty(getErrorCodeSafe(ex)).equalsIgnoreCase("itemNotFound") && orNull) {
                    logger.debug("item not found for path =< {} >", path);
                    return null;
                } else {
                    throw ex;
                }
            } catch (IOException e) {
                throw new DmsException(e);
            }
        }

        private Map<String, Object> postResource(Object payload, String path, Object... params) throws CmHttpRequestException {
            try {
                String token = getAccessToken();
                HttpPost request = new HttpPost(getGraphApiBaseUrl() + format(path, params));
                request.setHeader("Authorization", format("Bearer %s", token));
                request.setHeader("Accept", "application/json");
                request.setHeader("Content-Type", "application/json");
                request.setEntity(new StringEntity(toJson(payload), APPLICATION_JSON));
                logger.debug("post resource =< {} >", request);
                Map<String, Object> map = fromJson(checkStatusAndReadResponse(getHttpClient().execute(request)), MAP_OF_OBJECTS);
                logger.debug("got response = \n\n{}\n", mapToLoggableString(map));
                return map;
            } catch (IOException e) {
                throw new DmsException(e);
            }
        }

        private SharepointDmsAuthProtocol getAuthProtocol() {
            return parseEnum(config.getSharepointAuthProtocol(), SharepointDmsAuthProtocol.class);
        }

        private synchronized void acquireAccessToken() {
            logger.debug("get sharepoint access token with protocol =< {} >", config.getSharepointAuthProtocol());
            switch (getAuthProtocol()) {
                case MSAZUREOAUTH2:
                    acqireMsAccessToken();
                    break;
                default:
                    throw unsupported("unsupported sharepoint auth protocol =< %s >", config.getSharepointAuthProtocol());
            }
        }

        private synchronized void refreshMsAccessToken() {
            acquireMsAccessToken(map(
                    "grant_type", "refresh_token",
                    "refresh_token", checkNotBlank(refreshToken)
            ));
        }

        private synchronized void acqireMsAccessToken() {
            acquireMsAccessToken(map(
                    "grant_type", "password",
                    "username", checkNotBlank(config.getSharepointUser(), "missing sharepoint auth usename"),
                    "password", checkNotBlank(config.getSharepointPassword(), "missing sharepoint auth user password")
            ));
        }

        private synchronized void acquireMsAccessToken(Map<String, Object> payload) {
            try (CloseableHttpClient client = HttpClients.createDefault()) {
                HttpPost tokenRequest = new HttpPost(format("%s/%s/oauth2/v2.0/token",
                        checkNotBlank(config.getSharepointAuthServiceUrl(), "missing sharepoint auth service url"),
                        firstNotBlank(config.getSharepointAuthTenantId(), "common")));
                FluentMap<String, Object> tokenRequestPayload = (FluentMap) map(
                        "client_id", checkNotBlank(config.getSharepointAuthClientId(), "missing sharepoint auth client id"),
                        "client_secret", checkNotBlank(config.getSharepointAuthClientSecret(), "missing sharepoint auth client secret"),
                        "scope", "openid offline_access https://graph.microsoft.com/.default"
                ).with(payload);
                tokenRequest.setEntity(new UrlEncodedFormEntity(tokenRequestPayload.toList((k, v) -> (NameValuePair) new BasicNameValuePair((String) k, (String) v)), StandardCharsets.UTF_8.name()));
                logger.debug("execute sharepoint oauth token request =< {} > with payload =\n\n{}\n", tokenRequest, mapToLoggableStringLazy(tokenRequestPayload));
                Map<String, String> tokenResponse = fromJson(checkStatusAndReadResponse(client.execute(tokenRequest)), MAP_OF_STRINGS);
                logger.debug("received sharepoint oauth token response = \n\n{}\n", mapToLoggableStringLazy(tokenResponse));
                String token = checkNotBlank(tokenResponse.get("access_token"), "missing sharepoint oauth access token in token response");
                logger.debug("acquired sharepoint oauth access token =< {} >", token);

                DecodedJWT jwt = JWT.decode(token);
                Map<String, String> info = map(jwt.getClaims()).mapValues(c -> c.asString());
                logger.debug("token info = \n\n{}\n", mapToLoggableStringLazy(info));

                Set<String> privileges = set(Splitter.on(" ").omitEmptyStrings().trimResults().split(nullToEmpty(info.get("scp"))));
                logger.debug("token privileges = {}", privileges);

                checkArgument(list(privileges).map(String::toLowerCase).contains("Files.ReadWrite.All".toLowerCase()), "missing required access privilege `Files.ReadWrite.All`");
                checkArgument(list(privileges).map(String::toLowerCase).contains("Sites.Read.All".toLowerCase()), "missing required access privilege `Sites.Read.All`");

                String refresh = checkNotBlank(tokenResponse.get("refresh_token"), "missing refresh token");
                ZonedDateTime release = now(), expiration = release.plusSeconds(toInt(tokenResponse.get("expires_in")));

                logger.debug("token will expire at = {}", toIsoDateTime(expiration));

                logger.debug("access token ok");

                accessToken = token;
                refreshToken = refresh;
                tokenRelease = release;
                tokenExpiration = expiration;
            } catch (Exception ex) {
                throw new DmsException(ex, "unable to authenticate sharepoint client");
            }
        }

        private CloseableHttpClient getHttpClient() {
            return HttpClients.custom().setConnectionManager(connectionManager).build();
        }

    }

}
