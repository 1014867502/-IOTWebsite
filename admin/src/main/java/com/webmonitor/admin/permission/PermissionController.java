package com.webmonitor.admin.permission;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.common.interceptor.LoginSessionInterceptor;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class PermissionController extends BaseController {
    PermissionService srv = PermissionService.me;

    @Remark("会员权限列表页")
    public void index() {
        keepPara("currPage");
        render("index.html");
    }

    @Remark("会员权限列表")
    public void list() {

    }

    @Remark("会员权限编辑页")
    public void edit() {

    }

    @Remark("会员权限编辑")
    public void update() {

    }

    @Remark("会员权限删除")
    public void delete() {
        Result<String> result = Result.newOne();
        try {
            result = srv.delete(getParaToInt("id"));
        }catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("会员权限同步")
    public void sync() {
        Result<Map<String, String>> result = Result.newOne();
        try {
            Set<String> baseControllerMethodName = buildExcludedMethodName();
            ArrayList<String> excludes =new ArrayList<String>();
            excludes = (ArrayList<String>) LoginSessionInterceptor.excludes.clone();
            result = srv.sync(excludes, baseControllerMethodName);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    // 用于排除掉 BaseController 中的几个成为了 action 的方法
    private Set<String> buildExcludedMethodName() {
        Set<String> excludedMethodName = new HashSet<String>();
        Method[] methods = BaseController.class.getMethods();
        for (Method m : methods) {
            if (m.getParameterTypes().length == 0)
                excludedMethodName.add(m.getName());
        }
        return excludedMethodName;
    }
}
