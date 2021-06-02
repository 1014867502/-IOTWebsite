package com.webmonitor.admin.auth;

import com.webmonitor.admin.common.interceptor.LoginSessionInterceptor;
import com.webmonitor.core.model.Account;

/**
 * 权限管理的 shared method 扩展
 *
 * 作为 #role、#permission 指令的补充，支持 #else 块
 *
 *
 * 使用示例：
 * #if (hasRole("权限管理员", "CEO", "CTO"))
 *   ...
 * #else
 *   ...
 * #end
 *
 * #if (hasPermission("/admin/project/edit"))
 *   ...
 * #else
 *   ...
 * #end
 */
public class AuthKit {
    /**
     * 当前账号是否拥有某些角色，超管通杀
     */
    public boolean hasRole(String... roleNameArray) {
        Account account = LoginSessionInterceptor.getThreadLocalAccount();
        if (account != null && account.isStatusOk()) {
            if (	AuthService.me.isSuperAdmin(account.getId()) ||
                    AuthService.me.hasRole(account.getId(), roleNameArray)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 当前账号是否拥有某些角色，排除超管
     */
    public boolean hasOnlyRole(String... roleNameArray) {
        Account account = LoginSessionInterceptor.getThreadLocalAccount();
        if (account != null && account.isStatusOk()) {
            if (AuthService.me.hasRole(account.getId(), roleNameArray)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 是否拥有具体某个权限
     */
    public boolean hasPermission(String actionKey) {
        Account account = LoginSessionInterceptor.getThreadLocalAccount();
        if (account != null && account.isStatusOk()) {
            if (	AuthService.me.isSuperAdmin(account.getId()) ||
                    AuthService.me.hasPermission(account.getId(), actionKey)) {
                return true;
            }
        }

        return false;
    }
}
