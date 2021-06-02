package com.webmonitor.admin.auth;

import com.jfinal.kit.StrKit;
import com.jfinal.plugin.activerecord.Db;

public class AuthService {
    public static final AuthService me = new AuthService();

    /**
     * 是否为超级管理员，role.id 值为 1 的为超级管理员
     */
    public boolean isSuperAdmin(int accountId) {
        Integer ret = Db.queryInt("select accountId from sys_account_role where accountId = ? and roleId = 1", accountId);
        return ret != null;
    }

    /**
     * 当前账号是否拥有某些角色
     */
    public boolean hasRole(int accountId, String[] roleNameArray) {
        if (roleNameArray == null || roleNameArray.length == 0) {
            return false;
        }
        Object[] param = new Object[roleNameArray.length+1];
        param[0] = accountId;
        StringBuffer sql = new StringBuffer()
                .append(" select ar.accountId from sys_account_role ar")
                .append(" inner join sys_role r on ar.roleId = r.id")
                .append(" where ar.accountId = ? ")
                .append(" and (");
        for (int i=0; i<roleNameArray.length; i++){
            param[i+1] = roleNameArray[i];
            sql.append(i==0?" ":" or ")
               .append(" r.name = ? ");
        }
        sql.append(")");

        Integer ret = Db.queryInt(sql.toString(), param);
        return ret != null;
    }

    /**
     * 是否拥有具体某个权限
     */
    public boolean hasPermission(int accountId, String actionKey) {
        if (StrKit.isBlank(actionKey)) {
            return false;
        }
        StringBuffer sql = new StringBuffer()
                .append(" select ar.accountId from (")
                .append("   select rp.roleId from sys_role_permission rp")
                .append("   inner join sys_permission p on rp.permissionId = p.id")
                .append("   where p.actionKey = ?")
                .append(" )as t inner join sys_account_role ar on t.roleId = ar.roleId")
                .append(" where ar.accountId = ?");
        Integer ret = Db.queryInt(sql.toString(), actionKey, accountId);
        return ret != null;
    }
}
