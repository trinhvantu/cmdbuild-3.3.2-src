/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.menu;

import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.orm.annotations.CardAttr;
import org.cmdbuild.dao.orm.annotations.CardMapping;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;

@CardMapping("_Menu")
public class MenuInfoImpl implements MenuInfo {

    private final long id;
    private final String group;
    private final TargetDevice targetDevice;

    private MenuInfoImpl(MenuInfoImplBuilder builder) {
        this.id = builder.id;
        this.group = checkNotBlank(builder.group);
        this.targetDevice = firstNotNull(builder.targetDevice, TD_DEFAULT);
    }

    @Override
    @CardAttr(ATTR_ID)
    public Long getId() {
        return id;
    }

    @Override
    @CardAttr("GroupName")
    public String getGroup() {
        return group;
    }

    @Override
    @CardAttr("TargetDevice")
    public TargetDevice getTargetDevice() {
        return targetDevice;
    }

    public static MenuInfoImplBuilder builder() {
        return new MenuInfoImplBuilder();
    }

    public static MenuInfoImplBuilder copyOf(MenuInfo source) {
        return new MenuInfoImplBuilder()
                .withId(source.getId())
                .withGroup(source.getGroup())
                .withTargetDevice(source.getTargetDevice());
    }

    public static class MenuInfoImplBuilder implements Builder<MenuInfoImpl, MenuInfoImplBuilder> {

        private Long id;
        private String group;
        private TargetDevice targetDevice;

        public MenuInfoImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public MenuInfoImplBuilder withGroup(String group) {
            this.group = group;
            return this;
        }

        public MenuInfoImplBuilder withTargetDevice(TargetDevice targetDevice) {
            this.targetDevice = targetDevice;
            return this;
        }

        @Override
        public MenuInfoImpl build() {
            return new MenuInfoImpl(this);
        }

    }
}
