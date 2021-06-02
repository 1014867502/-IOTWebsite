package com.webmonitor.admin.directive;

import com.jfinal.template.Directive;
import com.jfinal.template.Env;
import com.jfinal.template.io.Writer;
import com.jfinal.template.stat.Scope;
import com.webmonitor.admin.auth.AuthService;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.model.Account;

public class PermissionDirective extends Directive {
    @Override
    public void exec(Env env, Scope scope, Writer writer) {
        Account account = (Account)scope.getRootData().get(IndexService.loginAccountCacheName);
        if (account != null && account.isStatusOk()) {
            // 如果是超级管理员，或者拥有指定的权限则放行
            if (	AuthService.me.isSuperAdmin(account.getId()) ||
                    AuthService.me.hasPermission(account.getId(), getPermission(scope))) {
                stat.exec(env, scope, writer);
            }
        }
    }

    /**
     * 从 #permission 指令参数中获取 permission
     */
    private String getPermission(Scope scope) {
        Object value = exprList.eval(scope);
        if (value instanceof String) {
            return (String)value;
        } else {
            String tip = I18nKit.getI18nStr("error_permission_par_only_string");
            throw new IllegalArgumentException(tip);
        }
    }

    public boolean hasEnd() {
        return true;
    }
}
