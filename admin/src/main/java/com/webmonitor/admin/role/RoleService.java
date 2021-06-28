package com.webmonitor.admin.role;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.model.Permission;
import com.webmonitor.core.model.Role;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.vo.Result;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

public class RoleService {
    public static final RoleService me = new RoleService();

    public Page<Role> paginate(int pageNo, int limit, boolean showSuper) {
        String condition = "";
        if (!showSuper) {
            condition = " where id != 1 ";
        }
        return Role.dao.paginate(pageNo, limit, "select *", "from sys_role "+condition+" order by id asc");
    }

    public Role findById(int roleId) {
        return Role.dao.findById(roleId);
    }

    public Result<String> save(Role role) {
        if (exists(-1, role.getName())) {
            String tip = I18nKit.getI18nStr("error_name_existsed");
            throw new BusinessException(tip);
        }
        role.setName(role.getName().trim());
        role.setCreateAt(new Date());
        role.save();
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    public boolean exists(int roleId, String name) {
        name = name.toLowerCase().trim();
        String sql = "select id from sys_role where lower(name) = ? and id != ? limit 1";
        Integer id = Db.queryInt(sql, name, roleId);
        return id != null;
    }

    public Result<String> update(Role role) {
        if (exists(role.getId(), role.getName())) {
            String tip = I18nKit.getI18nStr("error_name_existsed");
            throw new BusinessException(tip);
        }
        role.setName(role.getName().trim());
        role.update();
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    public Result<String> delete(final int roleId) {
        if (roleId == 1) {
            String tip = I18nKit.getI18nStr("error_super_account_cannot_deleted");
            throw new BusinessException(tip);
        }
        boolean flag = Db.tx(new IAtom() {
            public boolean run() throws SQLException {
                Db.delete("delete from sys_account_role where roleId=?", roleId);
                Db.delete("delete from sys_role_permission where roleId=?", roleId);
                Role.dao.deleteById(roleId);
                return true;
            }
        });
        if (!flag) {
            String tip = I18nKit.getI18nStr("error_delete_failed");
            throw new BusinessException(tip);
        }
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    public Result<String> addPermission(int roleId, int permissionId) {
        if (roleId == 1) {
            String tip = I18nKit.getI18nStr("error_super_account_not_need_assigned");
            throw new BusinessException(tip);
        }
        Record rolePermission = new Record().set("roleId", roleId).set("permissionId", permissionId);
        Db.save("sys_role_permission", rolePermission);
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    /**
     * 删除权限
     */
    public Result<String> deletePermission(int roleId, int permissionId) {
        if (roleId == 1) {
            String tip = I18nKit.getI18nStr("error_super_account_not_need_assigned");
            throw new BusinessException(tip);
        }
        Db.delete("delete from sys_role_permission where roleId=? and permissionId=?", roleId, permissionId);
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    /**
     * 标记出 role 拥有的权限，用于在界面输出 checkbox 的 checked 属性
     * 未来用 permission left join role_permission 来优化
     */
    public void markAssignedPermissions(Role role, List<Permission> permissionList) {
        // id 为 1 的超级管理员默认拥有所有权限
        if (role.getId() == 1) {
            for (Permission permission : permissionList) {
                permission.put("assigned", true);
            }
            return ;
        }

        String sql = "select roleId from sys_role_permission where roleId=? and permissionId=? limit 1";
        for (Permission permission : permissionList) {
            Integer roleId = Db.queryInt(sql, role.getId(), permission.getId());
            if (roleId != null) {
                // 设置 assigned 用于界面输出 checked
                permission.put("assigned", true);
            }
        }
    }

    /**
     * 根据 controller 将 permission 进行分组
     */
    public LinkedHashMap<String, List<Permission>> groupByController(List<Permission> permissionList) {
        LinkedHashMap<String, List<Permission>> ret = new LinkedHashMap<String, List<Permission>>();

        for (Permission permission : permissionList) {
            String controller = permission.getController();
            List<Permission> list = ret.get(controller);
            if (list == null) {
                list = new ArrayList<Permission>();
                ret.put(controller, list);
            }

            list.add(permission);
        }

        return ret;
    }

    /**--------------------------------------------------------------------------------**/


}
