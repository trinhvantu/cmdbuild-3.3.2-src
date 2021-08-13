/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.uicomponents.widget;

import org.cmdbuild.uicomponents.data.UiComponentDataImpl;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import java.util.List;
import static java.util.stream.Collectors.toList;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.uicomponents.utils.UiComponentUtils.getCodeFromExtComponentData;
import static org.cmdbuild.uicomponents.utils.UiComponentUtils.getComponentFile;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.lang.CmStringUtils.normalize;
import org.springframework.stereotype.Component;
import org.cmdbuild.uicomponents.UiComponentInfo;
import org.cmdbuild.uicomponents.data.UiComponentData;
import org.cmdbuild.uicomponents.data.UiComponentRepository;
import static org.cmdbuild.uicomponents.data.UiComponentType.UCT_WIDGET;
import org.cmdbuild.uicomponents.utils.UiComponentUtils;
import static org.cmdbuild.uicomponents.utils.UiComponentUtils.toComponentInfo;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

@Component
public class WidgetComponentServiceImpl implements WidgetComponentService {

    private final UiComponentRepository repository;
    private final OperationUserSupplier user;

    public WidgetComponentServiceImpl(UiComponentRepository repository, OperationUserSupplier userStore) {
        this.repository = checkNotNull(repository);
        this.user = checkNotNull(userStore);
    }

    @Override
    public List<UiComponentInfo> getAll() {
        return repository.getAllByType(UCT_WIDGET).stream().map(UiComponentUtils::toComponentInfo).collect(toList());
    }

    @Override
    public List<UiComponentInfo> getAllActive() {
        return getAll().stream().filter(UiComponentInfo::getActive).collect(toList());
    }

    @Override
    public List<UiComponentInfo> getActiveForCurrentUserAndDevice() {
        TargetDevice targetDevice = user.getUser().getTargetDevice();
        return getAll().stream().filter(UiComponentInfo::getActive).filter(c -> c.allowsTargetDevice(targetDevice)).collect(toList());
    }

    @Override
    public UiComponentInfo get(Long id) {
        return toComponentInfo(repository.getById(id));
    }

    @Override
    @Nullable
    public UiComponentInfo getOneByCodeOrNull(String type) {
        UiComponentData component = repository.getByTypeAndNameOrNull(UCT_WIDGET, checkNotBlank(type));
        return component == null ? null : toComponentInfo(component);
    }

    @Override
    public void delete(Long id) {
        repository.delete(id);
    }

    @Override
    public UiComponentInfo createOrUpdate(byte[] data) {
        String name = getCodeFromExtComponentData(data);
        UiComponentData componentData = repository.getByTypeAndNameOrNull(UCT_WIDGET, name);
        if (componentData == null) {
            return create(data);
        } else {
            return update(componentData.getId(), data);
        }
    }

    @Override
    public UiComponentInfo create(byte[] data) {
        UiComponentData componentData = repository.create(UiComponentDataImpl.builder().withData(data).withName(getCodeFromExtComponentData(data)).withType(UCT_WIDGET).build());
        return toComponentInfo(componentData);
    }

    @Override
    public UiComponentInfo update(Long id, byte[] data) {
        UiComponentData componentData = repository.getById(id);
        checkArgument(equal(componentData.getName(), getCodeFromExtComponentData(data)), "invalid component code mismatch");
        componentData = repository.update(UiComponentDataImpl.copyOf(componentData).withData(data).build());
        return toComponentInfo(componentData);
    }

    @Override
    public UiComponentInfo update(UiComponentInfo component) {
        UiComponentData data = repository.getById(component.getId());
        data = repository.update(UiComponentDataImpl.copyOf(data)
                .withActive(component.getActive())
                .withDescription(component.getDescription())
                .withTargetDevice(component.getTargetDevice()).build());
        return toComponentInfo(data);
    }

    @Override
    public byte[] getWidgetFile(String name, String filePath) {
        UiComponentData componentData = repository.getByTypeAndName(UCT_WIDGET, name);
        return getComponentFile(componentData, componentData.getData(), filePath, true);//TODO js compression config
    }

    @Override
    public DataHandler getWidgetData(String code) {
        UiComponentData componentData = repository.getByTypeAndName(UCT_WIDGET, code);
        return newDataHandler(componentData.getData(), "application/zip", format("%s.zip", normalize(componentData.getName())));
    }

}
