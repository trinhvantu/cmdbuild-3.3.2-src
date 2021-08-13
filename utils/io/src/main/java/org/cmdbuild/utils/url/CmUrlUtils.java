/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.url;

import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkArgument;
import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.Iterables.getLast;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import static java.lang.String.format;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import static java.util.Arrays.stream;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.apache.commons.codec.binary.Base64;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.utils.io.CmIoUtils.copy;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.io.CmIoUtils.tempDir;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.io.CmIoUtils.toDataSource;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.toImmutableMap;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowFunction;

public class CmUrlUtils {

    public static String encodeUrlParams(Map<String, ? extends Object> params) {
        try {
            return params.entrySet().stream().map(rethrowFunction(e -> format("%s=%s", URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8.name()), URLEncoder.encode(toStringOrEmpty(e.getValue()), StandardCharsets.UTF_8.name())))).collect(joining("&"));
        } catch (UnsupportedEncodingException ex) {
            throw runtime(ex);
        }
    }

    public static Map<String, String> decodeUrlParams(@Nullable String params) {
        if (isBlank(params)) {
            return emptyMap();
        } else {
            return Splitter.on("&").omitEmptyStrings().trimResults().splitToList(params).stream().map((v) -> {
                try {
                    Matcher matcher = Pattern.compile("([^=]+)=(.*)").matcher(v);
                    if (matcher.matches()) {
                        return Pair.of(matcher.group(1), URLDecoder.decode(matcher.group(2), StandardCharsets.UTF_8.name()));
                    } else {
                        return Pair.of(v, (String) null);
                    }
                } catch (Exception ex) {
                    throw runtime(ex, "error deconding url param token = %s", v);
                }
            }).collect(toImmutableMap(Pair::getKey, Pair::getValue));
        }
    }

    public static DataSource urlToDataSource(String url) {
        checkNotBlank(url);
        Matcher matcher = Pattern.compile("^data:(.*?);base64,(.+)").matcher(url);
        if (matcher.find()) {
            String contentType = matcher.group(1);
            byte[] data = Base64.decodeBase64(checkNotBlank(matcher.group(2)));
            return newDataSource(data, contentType);
        } else if (url.startsWith("classpath:")) {
            return newDataSource(CmUrlUtils.class.getClassLoader().getResourceAsStream(url.replaceFirst("classpath:", "")));
        } else {
            try {
                URLConnection connection = new URL(url).openConnection();
                String contentType = connection.getContentType();
                byte[] data = toByteArray(connection.getInputStream());
                return newDataSource(data, contentType);
            } catch (MalformedURLException ex) {
                throw runtime(ex);
            } catch (IOException ex) {
                throw runtime(ex);
            }
        }
    }

    public static byte[] urlToByteArray(String url) {
        checkNotBlank(url);
        Matcher matcher = Pattern.compile("^data:.*;base64,").matcher(url);
        if (matcher.find()) {
            url = matcher.replaceFirst("");
            return Base64.decodeBase64(checkNotBlank(url));
        } else {
            try (InputStream in = new URL(url).openStream()) {
                return toByteArray(in);
            } catch (MalformedURLException ex) {
                throw runtime(ex);
            } catch (IOException ex) {
                throw runtime(ex);
            }
        }
    }

    public static String urlToString(String url) {
        return readToString(urlToDataSource(url));
    }

    public static String toDataUrl(byte[] data) {
        return toDataUrl(newDataSource(data));
    }

    public static String toDataUrl(DataHandler data) {
        return toDataUrl(toDataSource(data));
    }

    public static String toFileUrl(DataHandler data) {
        return toFileUrl(toDataSource(data));
    }

    public static String toDataUrl(DataSource data) {
        return format("data:%s;base64,%s", nullToEmpty(data.getContentType()), Base64.encodeBase64String(toByteArray(data)));
    }

    public static String toFileUrl(DataSource data) {
        try {
            File tempDir = tempDir();
            File tempFile = new File(tempDir, firstNotBlank(data.getName(), "file.raw"));
            tempFile.deleteOnExit();
            copy(data.getInputStream(), tempFile);
            return checkNotBlank(tempFile.getAbsoluteFile().toURI().toASCIIString());
        } catch (IOException ex) {
            throw runtime(ex);
        }
    }

    public static String buildUrlPath(String... parts) {
        return stream(parts).collect(joining("/")).replaceAll("[/]+", "/");
    }

    public static String getUrlPathFilename(String path) {
        return checkNotBlank(getLast(list(path.replaceFirst("[/]+$", "").replaceFirst("^[/]+", "").split("/")), null), "unable to get filename from url path =< %s >", path);
    }

    public static String getUrlPathParent(String path) {
        List<String> parts = list(path.replaceFirst("[/]+$", "").replaceFirst("^[/]+", "").split("/"));
        checkArgument(!parts.isEmpty(), "cannot get parent of path =< %s >: path is empty or root", path);
        parts.remove(parts.size() - 1);
        String res = Joiner.on("/").join(parts);
        if (path.matches("^/.*")) {
            res = "/" + res;
        }
        return res;
    }

}
