/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.session;

import static com.google.common.base.Preconditions.checkArgument;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

public class ImpersonateRequest {

    private final String username;
    private final String group;
    private final String sponsor;

    public ImpersonateRequest(@Nullable String username, @Nullable String group) {
        this(username, group, null);
    }

    public ImpersonateRequest(@Nullable String username, @Nullable String group, @Nullable String sponsor) {
        this.username = username;
        this.group = group;
        this.sponsor = sponsor;
        checkArgument(isNotBlank(username) || isNotBlank(group) || isNotBlank(sponsor));
    }

    @Nullable
    public String getUsername() {
        return username;
    }

    @Nullable
    public String getGroup() {
        return group;
    }

    @Nullable
    public String getSponsor() {
        return sponsor;
    }

    public boolean hasUsername() {
        return isNotBlank(username);
    }

    public boolean hasGroup() {
        return isNotBlank(group);
    }

    public boolean hasSponsor() {
        return isNotBlank(sponsor);
    }

    @Override
    public String toString() {
        return "ImpersonateRequest{" + "username=" + username + ", group=" + group + ", sponsor=" + sponsor + '}';
    }

}
