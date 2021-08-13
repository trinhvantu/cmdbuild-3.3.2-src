/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.impl;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import java.io.InputStream;
import javax.annotation.Nullable;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.cmdbuild.client.rest.core.RestWsClient;
import org.cmdbuild.client.rest.core.AbstractServiceClientImpl;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.client.rest.api.CustomComponentApi;
import org.cmdbuild.client.rest.model.CustomComponentInfo;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;

public class CustomPageApiImpl extends AbstractServiceClientImpl implements CustomComponentApi {

    public CustomPageApiImpl(RestWsClient restClient) {
        super(restClient);
    }

    @Override
    public CustomComponentApiResponse uploadCustomPage(InputStream data, String description, @Nullable String targetDevice) {
        checkNotNull(data, "data param cannot be null");
        HttpEntity multipart;
        if (description.isBlank()) {
            multipart = MultipartEntityBuilder.create()
                    .addBinaryBody("file", listenUpload("custom page upload", data), ContentType.APPLICATION_OCTET_STREAM, "file.zip")
                    .build();
        } else {
            String jsonbody = "{\"description\":\"" + description + "\",\"device\":\"" + parseEnumOrDefault(targetDevice, TD_DEFAULT) + "\",\"active\":true}";
            multipart = MultipartEntityBuilder.create()
                    .addBinaryBody("file", listenUpload("custom page upload", data), ContentType.APPLICATION_OCTET_STREAM, "file.zip")
                    .addBinaryBody("data", jsonbody.getBytes(), ContentType.APPLICATION_JSON, "data")
                    .build();
        }
        JsonNode jsonNode = post("custompages?merge=true", multipart).asJackson().get("data");
        CustomComponentInfo customPageInfo = fromJson(jsonNode, CustomComponentInfoImpl.class);
        return new CustomComponentApiResponse() {
            @Override
            public CustomComponentInfo getCustomComponentInfo() {
                return customPageInfo;
            }

            @Override
            public CustomComponentApi then() {
                return CustomPageApiImpl.this;
            }
        };
    }

    @Override
    public CustomComponentApiResponse uploadCustomWidget(InputStream data, String description, @Nullable String targetDevice) {
        checkNotNull(data, "data param cannot be null");
        String jsonbody = "{\"device\":\"" + parseEnumOrDefault(targetDevice, TD_DEFAULT) + "\",\"active\":true,\"description\":\"" + description + "\"}";
        HttpEntity multipart = MultipartEntityBuilder.create()
                .addBinaryBody("file", listenUpload("custom widget upload", data), ContentType.APPLICATION_OCTET_STREAM, "file.zip")
                .addBinaryBody("data", jsonbody.getBytes(), ContentType.APPLICATION_JSON, "data")
                .build();
        JsonNode jsonNode = post("components/widget?merge=true", multipart).asJackson().get("data");
        CustomComponentInfo customWidgetInfo = fromJson(jsonNode, CustomComponentInfoImpl.class);
        return new CustomComponentApiResponse() {
            @Override
            public CustomComponentInfo getCustomComponentInfo() {
                return customWidgetInfo;
            }

            @Override
            public CustomComponentApi then() {
                return CustomPageApiImpl.this;
            }
        };
    }

    @Override
    public CustomComponentApiResponse uploadCustomContextMenu(InputStream data, String description, @Nullable String targetDevice) {
        checkNotNull(data, "data param cannot be null");
        String jsonbody = "{\"device\":\"" + parseEnumOrDefault(targetDevice, TD_DEFAULT) + "\",\"active\":true,\"description\":\"" + description + "\"}";
        HttpEntity multipart = MultipartEntityBuilder.create()
                .addBinaryBody("file", listenUpload("context menu upload", data), ContentType.APPLICATION_OCTET_STREAM, "file.zip")
                .addBinaryBody("data", jsonbody.getBytes(), ContentType.APPLICATION_JSON, "data")
                .build();
        JsonNode jsonNode = post("components/contextmenu?merge=true", multipart).asJackson().get("data");
        CustomComponentInfo contextMenu = fromJson(jsonNode, CustomComponentInfoImpl.class);
        return new CustomComponentApiResponse() {
            @Override
            public CustomComponentInfo getCustomComponentInfo() {
                return contextMenu;
            }

            @Override
            public CustomComponentApi then() {
                return CustomPageApiImpl.this;
            }
        };
    }

    @JsonDeserialize(builder = CustomComponentInfoImplBuilder.class)
    public static class CustomComponentInfoImpl implements CustomComponentInfo {

        private final long id;
        private final String name, description;

        private CustomComponentInfoImpl(CustomComponentInfoImplBuilder builder) {
            this.id = (builder.id);
            this.name = checkNotBlank(builder.name);
            this.description = nullToEmpty(builder.description);
        }

        @Override
        public long getId() {
            return id;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getDescription() {
            return description;
        }

        public static CustomComponentInfoImplBuilder builder() {
            return new CustomComponentInfoImplBuilder();
        }
    }

    public static class CustomComponentInfoImplBuilder implements Builder<CustomComponentInfoImpl, CustomComponentInfoImplBuilder> {

        private Long id;
        private String name;
        private String description;

        @JsonProperty("_id")
        public CustomComponentInfoImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public CustomComponentInfoImplBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public CustomComponentInfoImplBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        @Override
        public CustomComponentInfoImpl build() {
            return new CustomComponentInfoImpl(this);
        }

    }

}
