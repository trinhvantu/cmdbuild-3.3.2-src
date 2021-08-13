/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.lang;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Stopwatch;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import static java.util.Arrays.asList;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinWorkerThread;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.function.Function;
import static java.util.function.Function.identity;
import java.util.function.Supplier;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.utils.lang.LambdaExceptionUtils.Runnable_WithExceptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CmExecutorUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static ThreadFactory namedThreadFactory(Class classe) {
        return namedThreadFactory(classe.getName());
    }

    public static ThreadFactory namedThreadFactory(String name) {
        return new NamedThreadFactory(name);
    }

    public static ExecutorService executorService(String name, @Nullable Runnable init, @Nullable Runnable cleanup) {
        return new MyThreadPoolExecutor(name, init, cleanup);
    }

    public static ExecutorService executorService(String name, @Nullable Runnable init) {
        return executorService(name, init, null);
    }

    public static ScheduledExecutorService scheduledExecutorService(String name, @Nullable Runnable init, @Nullable Runnable cleanup) {
        return new MyScheduledExecutor(name, init, cleanup);
    }

    public static ForkJoinPool buildForkJoinPool(Consumer<Integer> onStart) {
        checkNotNull(onStart);
        return new ForkJoinPool(Runtime.getRuntime().availableProcessors(), new ForkJoinPool.ForkJoinWorkerThreadFactory() {

            private int i = 0;

            @Override
            public ForkJoinWorkerThread newThread(ForkJoinPool p) {
                return new ForkJoinWorkerThread(p) {
                    @Override
                    protected void onStart() {
                        onStart.accept(i++);
                    }
                };
            }
        }, null, false);
    }

    public static void shutdownQuietly(ExecutorService... executors) {
        asList(executors).forEach((executor) -> executor.shutdownNow());
        asList(executors).forEach((executor) -> {
            try {
                executor.awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException ex) {
            }
        });
        asList(executors).forEach((executor) -> {
            if (!executor.isTerminated()) {
                LOGGER.warn("executor service = {} failed to stop in time", executor);
            }
        });
    }

    public static void runSafe(Runnable runnable) {
        try {
            runnable.run();
        } catch (Exception ex) {
            LOGGER.error(marker(), "error executing runnable", ex);
        }
    }

    public static <T> Consumer<T> safe(Consumer<T> consumer) {
        return (t) -> {
            try {
                consumer.accept(t);
            } catch (Exception ex) {
                LOGGER.error(marker(), "error consuming item = {}", t, ex);
            }
        };
    }

    public static Runnable safe(Runnable_WithExceptions<?> runnable) {
        return () -> runSafe(runnable);
    }

    public static Runnable safeRunnable(Runnable runnable) {
        return () -> runSafe(runnable);
    }

    @Nullable
    public static <T> T safe(Supplier<T> supplier) {
        try {
            return supplier.get();
        } catch (Exception ex) {
            LOGGER.error(marker(), "error accessing item = {}", ex);
            return null;
        }
    }

    public static <T> T awaitCompletionIgnoreInterrupt(Future<T> future) {
        while (true) {
            try {
                return future.get();
            } catch (InterruptedException ex) {
                LOGGER.trace("interrupted", ex);
            } catch (ExecutionException ex) {
                throw runtime(ex.getCause());//TODO check this
            }
        }
    }

    public static void sleepSafe(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            LOGGER.warn("sleep interrupted", ex);
        }
    }

    public static <T> T waitFor(Future<T> future) {
        try {
            return future.get();
        } catch (InterruptedException | ExecutionException ex) {
            throw runtime(ex);
        }
    }

    public static <T, O> O waitFor(Supplier<T> supplier, Function<T, Boolean> condition, Function<T, O> getter) {
        return waitUntil(supplier, condition, getter, 120, false);
    }

    public static void waitUntil(Supplier<Boolean> condition) {
        waitUntil(condition, 120);
    }

    public static void waitUntil(Supplier<Boolean> condition, int timeout) {
        waitUntil(condition, timeout, false);
    }

    public static void waitSafeUntil(Supplier<Boolean> condition, int timeout) {
        waitUntil(condition, timeout, true);
    }

    private static void runSafe(Runnable_WithExceptions<?> runnable) {
        try {
            runnable.run();
        } catch (Exception ex) {
            LOGGER.error(marker(), "error executing runnable", ex);
        }
    }

    private static void waitUntil(Supplier<Boolean> condition, int timeout, boolean safe) {
        waitUntil(condition, identity(), identity(), timeout, safe);
    }

    @Nullable
    private static <T, O> O waitUntil(Supplier<T> supplier, Function<T, Boolean> condition, Function<T, O> getter, int timeout, boolean safe) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            T item;
            while (true) {
                item = supplier.get();
                if (condition.apply(item) || !(timeout <= 0 || stopwatch.elapsed(TimeUnit.SECONDS) < timeout)) {
                    break;
                }
                sleepSafe(100);
            }
            checkArgument(condition.apply(item) == true, "error: condition not true after %s seconds", timeout);
            return getter.apply(item);
        } catch (Exception ex) {
            if (safe) {
                LOGGER.warn("", ex);
                return null;
            } else {
                throw runtime(ex);
            }
        }
    }

    public static <T extends ExecutorService> RestartableExecutorHelper<T> restartable(Supplier<T> supplier) {
        return new RestartableExecutorHelperImpl<>(supplier);
    }

    private static class RestartableExecutorHelperImpl<T extends ExecutorService> implements RestartableExecutorHelper<T> {

        private final Supplier<T> supplier;
        private T instance;

        public RestartableExecutorHelperImpl(Supplier<T> supplier) {
            this.supplier = checkNotNull(supplier);
        }

        @Override
        public synchronized T get() {
            return checkNotNull(instance, "executor is not running");
        }

        @Override
        public synchronized T start() {
            checkArgument(!isRunning());
            return instance = checkNotNull(supplier.get());
        }

        @Override
        public synchronized void stop() {
            checkArgument(isRunning());
            T inst = instance;
            instance = null;
            shutdownQuietly(inst);
        }

        @Override
        public boolean isRunning() {
            return instance != null;
        }

    }

    private static class NamedThreadFactory implements ThreadFactory {

        private final AtomicInteger counter = new AtomicInteger(0);
        private final String name;

        public NamedThreadFactory(String name) {
            this.name = checkNotBlank(name);
        }

        @Override
        public Thread newThread(Runnable r) {
            checkNotNull(r);
            return new Thread(r, format("%s-%s", name, counter.getAndIncrement()));
        }
    }

    private static class MyThreadPoolExecutor extends ThreadPoolExecutor {

        private final Runnable init;
        private final Runnable cleanup;

        public MyThreadPoolExecutor(String name, @Nullable Runnable init, @Nullable Runnable cleanup) {
            super(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS, new SynchronousQueue<Runnable>(), namedThreadFactory(name));
            this.init = init != null ? safeRunnable(init) : () -> {
            };
            this.cleanup = cleanup != null ? safeRunnable(cleanup) : () -> {
            };
        }

        @Override
        protected void beforeExecute(Thread t, Runnable r) {
            super.beforeExecute(t, r);
            init.run();
        }

        @Override
        protected void afterExecute(Runnable r, Throwable t) {
            super.afterExecute(r, t);
            cleanup.run();
        }

    }

    private static class MyScheduledExecutor extends ScheduledThreadPoolExecutor {

        private final Runnable init;
        private final Runnable cleanup;

        public MyScheduledExecutor(String name, @Nullable Runnable init, @Nullable Runnable cleanup) {
            super(1, namedThreadFactory(name));
            this.init = init != null ? safeRunnable(init) : () -> {
            };
            this.cleanup = cleanup != null ? safeRunnable(cleanup) : () -> {
            };
        }

        @Override
        protected void beforeExecute(Thread t, Runnable r) {
            super.beforeExecute(t, r);
            init.run();
        }

        @Override
        protected void afterExecute(Runnable r, Throwable t) {
            super.afterExecute(r, t);
            cleanup.run();
        }
    }
}
