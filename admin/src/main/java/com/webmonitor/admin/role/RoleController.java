package com.webmonitor.admin.role;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.auth.AuthService;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.permission.PermissionService;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.model.Permission;
import com.webmonitor.core.model.Role;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.LinkedHashMap;
import java.util.List;

public class RoleController extends BaseController {
    RoleService srv = RoleService.me;

    @Remark("角色列表页")
    public void index() {
        render("index.html");
    }

    @Remark("角色列表")
    public void list() {
        Result<Page<Role>> result = Result.newOne();
        try {
            int pageNo = getParaToInt("page", 1);
            int limit = getParaToInt("limit", 10);
            //登陆账户为超管角色才会显示超管角色
            Boolean showSuper = AuthService.me.isSuperAdmin(getLoginAccount().getId());
            Page<Role> page = srv.paginate(pageNo, limit, showSuper);
            result.success(page);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("角色新增页")
    public void add() {
        render("edit.html");
    }

    @Remark("角色新增")
    public void save() {
        Result<String> result = Result.newOne();
        try {
            result = srv.save(getBean(Role.class));
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("角色编辑页")
    public void edit() {
        Role data = srv.findById(getParaToInt("id"));
        setAttr("data", data);
        render("edit.html");
    }

    @Remark("角色更新")
    public void update() {
        Result<String> result = Result.newOne();

        System.out.println(getPara("role.name"));
        try {
            result = srv.update(getBean(Role.class));
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("角色删除")
    public void delete() {
        Result<String> result = Result.newOne();
        try {
            result = srv.delete(getParaToInt("id"));
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("角色指定权限页")
    public void assignPermissions() {
        Role role = srv.findById(getParaToInt("id"));
        List<Permission> permissionList = PermissionService.me.getAllPermissions();
        srv.markAssignedPermissions(role, permissionList);
        LinkedHashMap<String, List<Permission>> permissionMap = srv.groupByController(permissionList);

        setAttr("role", role);
        setAttr("permissionMap", permissionMap);
        render("assign_permissions.html");
    }

    @Remark("指定角色权限")
    public void addPermission() {
        Result<String> result = Result.newOne();
        try {
            result = srv.addPermission(getParaToInt("roleId"), getParaToInt("permissionId"));
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("删除角色权限")
    public void deletePermission() {
        Result<String> result = Result.newOne();
        try {
            result = srv.deletePermission(getParaToInt("roleId"), getParaToInt("permissionId"));
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }
}
