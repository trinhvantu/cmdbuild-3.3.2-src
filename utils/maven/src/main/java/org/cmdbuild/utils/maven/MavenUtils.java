/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.maven;

import static com.google.common.base.Preconditions.checkArgument;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Iterables;
import java.io.File;
import static java.lang.String.format;
import java.util.Arrays;
import java.util.Collections;
import static java.util.Collections.emptyMap;
import java.util.Map;
import static java.util.stream.Collectors.joining;
import javax.annotation.Nullable;
import org.apache.commons.io.FileUtils;
import org.apache.maven.shared.invoker.DefaultInvocationRequest;
import org.apache.maven.shared.invoker.DefaultInvoker;
import org.apache.maven.shared.invoker.InvocationRequest;
import org.apache.maven.shared.invoker.InvocationResult;
import org.apache.maven.shared.invoker.Invoker;
import org.apache.maven.shared.invoker.MavenInvocationException;
import static org.cmdbuild.utils.io.CmIoUtils.tempDir;
import static org.cmdbuild.utils.io.CmPropertyUtils.toProperties;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MavenUtils {

    private final static Logger LOGGER = LoggerFactory.getLogger(MavenUtils.class);

    public static File getFileByArtifactId(String artifactId) {
        LOGGER.info("fetch artifact = {}", artifactId);
        File tempDir = tempDir("artifact");
        mavenInvoke("org.apache.maven.plugins:maven-dependency-plugin:2.8:get", ImmutableMap.of("artifact", artifactId));
        mavenInvoke("org.apache.maven.plugins:maven-dependency-plugin:2.8:copy", ImmutableMap.of("artifact", artifactId, "outputDirectory", tempDir.getAbsolutePath()));
        File file = Iterables.getOnlyElement(Arrays.asList(tempDir.listFiles()));
        checkArgument(file.exists() && file.isFile());
        return file;
    }

    /**
     * remove a file obtained by {@link #getFileByArtifactId(java.lang.String) }
     * and all related resources.
     *
     * Since {@link #getFileByArtifactId(java.lang.String) } currentlu creates a
     * new directory, and the file in it, this method is responsible to clean
     * the directory as well as the file. Implementation may change in the
     * future.
     *
     * @param file
     */
    public static void cleanupFileObtainedByArtifactId(File file) {
        FileUtils.deleteQuietly(file.getParentFile());
    }

    public static void mavenInvoke(String goal, @Nullable Map<String, String> params) {
        try {
            params = firstNotNull(params, emptyMap());
            LOGGER.info("execute `mvn {} {}`", goal, params.entrySet().stream().map(e -> format("-D%s=%s", e.getKey(), e.getValue())).collect(joining(" ")));
            InvocationRequest request = new DefaultInvocationRequest();
            request.setBatchMode(true);
            request.setGoals(Collections.singletonList(goal));
            request.setProperties(toProperties(params));
            request.setMavenOpts("-Dorg.slf4j.simpleLogger.defaultLogLevel=WARN");
            Invoker invoker = new DefaultInvoker();
            InvocationResult invocationResult = invoker.execute(request);
            checkArgument(invocationResult.getExitCode() == 0, "maven invocation failed");
        } catch (MavenInvocationException ex) {
            throw new RuntimeException(ex);
        }
    }

}
