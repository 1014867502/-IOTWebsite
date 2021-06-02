package com.webmonitor.admin.permission;

import com.jfinal.core.Action;
import com.jfinal.core.JFinal;
import com.jfinal.kit.StrKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.model.Permission;
import com.webmonitor.core.util.AntPathMatcher;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.vo.Result;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class PermissionService {
    public static final PermissionService me = new PermissionService();

    public Page<Permission> paginate(int pageNo, int limit) {
        return Permission.dao.paginate(pageNo, limit, "select *", "from sys_permission order by actionKey asc, remark asc");
    }

    public Permission findById(int id) {
        return Permission.dao.findById(id);
    }

    public Result<String> update(Permission permission) {
        permission.keep("id", "remark");
        permission.update();
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    public Result<String> delete(final int permissionId) {
        boolean flag = Db.tx(new IAtom() {
            public boolean run() throws SQLException {
                Db.delete("delete from sys_role_permission where permissionId = ?", permissionId);
                Permission.dao.deleteById(permissionId);
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

    public Result<Map<String, String>> sync(ArrayList<String> excludes, Set<String> baseControllerMethodName) {
        Result<Map<String, String>> result = Result.newOne();
        int counter = 0;
        List<String> allActionKeys = JFinal.me().getAllActionKeys();
        for (String actionKey : allActionKeys) {
                String[] urlPara = new String[1];
                Action action = JFinal.me().getAction(actionKey, urlPara);

                if (action == null || contains(excludes, action.getActionKey())
                        || baseControllerMethodName.contains(action.getMethodName())) {
                    continue ;
                }
                String controller = action.getControllerClass().getName();
                String sql = "select * from sys_permission where actionKey=? and controller = ? limit 1";
                Permission permission = Permission.dao.findFirst(sql, actionKey, controller);
                if (permission == null) {
                    permission = new Permission();
                    permission.setActionKey(actionKey);
                    permission.setController(controller);
                    setRemarkValue(permission, action);
                    permission.save();
                    counter++;
                } else {
                    // 如果 remark 字段是空值，才去尝试使用 @Remark 注解中的值
                    if (StrKit.isBlank(permission.getRemark())) {
                        setRemarkValue(permission, action);
                        if (permission.update()) {
                            counter++;
                        }
                    }
                }
        }
        if (counter == 0) {
            Map<String, String> map = new HashMap<>();
            String tip = I18nKit.getI18nStr("tip_permission_not_need_updated");
            map.put("message", tip);
            result.success(map);
        } else {
            Map<String, String> map = new HashMap<>();
            String tip = I18nKit.getI18nStr("tip_successful_permission_update");
            map.put("message", tip + counter);
            result.success(map);
        }
        return result;
    }

    private void setRemarkValue(Permission permission, Action action) {
        Remark remark = action.getMethod().getAnnotation(Remark.class);
        if (remark != null && StrKit.notBlank(remark.value())) {

//            Res resEn = I18n.use("en_US");
//            // 直接获取数据
//            String title = resEn.get(remark.value());
            permission.setRemark(remark.value());
        }
    }

    private boolean contains(ArrayList<String> excludes, String url) {
        AntPathMatcher pm = new AntPathMatcher();
        for (String pattern : excludes) {
            if (pm.match(pattern, url)) {
                return true;
            }
        }
        return false;
    }

    public List<Permission> getAllPermissions() {
        return Permission.dao.find("select * from sys_permission order by controller asc");
    }
}
