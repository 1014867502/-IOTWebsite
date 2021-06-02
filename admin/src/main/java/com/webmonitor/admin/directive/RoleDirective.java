package com.webmonitor.admin.directive;

import com.jfinal.template.Directive;
import com.jfinal.template.Env;
import com.jfinal.template.io.Writer;
import com.jfinal.template.stat.Scope;
import com.webmonitor.admin.auth.AuthService;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.model.Account;

public class RoleDirective extends Directive {

    @Override
    public void exec(Env env, Scope scope, Writer writer) {
        Account account = (Account)scope.getRootData().get(IndexService.loginAccountCacheName);
        if (account != null && account.isStatusOk()) {
            // 如果是超级管理员，或者拥有指定的角色则放行
            if (	AuthService.me.isSuperAdmin(account.getId()) ||
                    AuthService.me.hasRole(account.getId(), getRoleNameArray(scope))) {
                stat.exec(env, scope, writer);
            }
        }
    }

    /**
     * 从 #role 指令参数中获取角色名称数组
     */
    private String[] getRoleNameArray(Scope scope) {
        Object[] values = exprList.evalExprList(scope);
        String[] ret = new String[values.length];
        for (int i=0; i<values.length; i++) {
            if (values[i] instanceof String) {
                ret[i] = (String)values[i];
            } else {
                String tip = I18nKit.getI18nStr("error_role_name_only_string");
                throw new IllegalArgumentException(tip);
            }
        }
        return ret;
    }

    public boolean hasEnd() {
        return true;
    }
}
