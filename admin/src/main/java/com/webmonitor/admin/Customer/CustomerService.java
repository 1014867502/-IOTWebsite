package com.webmonitor.admin.Customer;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.*;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.Permission;
import com.webmonitor.core.model.Role;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.StaffDataEntity;
import com.webmonitor.core.model.userbase.FuncAuthor;
import com.webmonitor.core.util.MD5Utils;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.vo.Result;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

public class CustomerService {
    public static final CustomerService me = new CustomerService();

    private static IStaffData dal=new StaffDataMysqlDAL();

    /**分页查询用户数据**/
    public Page<StaffData> paginate(String customername,int pageNo, int limit) {
        return StaffData.dao.paginate(pageNo, limit, "select *", "from staff_data where uAccountNum like '%"+customername+"%'");
    }

    /**根据用户id查找用户**/
    public StaffData findById(int roleId) {
        return StaffData.dao.findById(roleId);
    }

    /**新增用户**/
    public Result<String> save(StaffDataEntity staffData,String select,String right,String appright,String selectcom) {
        Result<String> result = Result.newOne();
        StaffData staffData1=new StaffData();
        staffData1.setAgentNumber(staffData.getAgentNumber());
        staffData1.setCDept(staffData.getcDept());
        staffData1.setIAccountType(staffData.getiAccountType());
        staffData1.setIRoleType(staffData.getiRoleType());
        if(staffData.getiRoleType()== RoleType.superadmin.getIndex() ||staffData.getiRoleType()== RoleType.admin.getIndex()){
            staffData1.setIAccountType("1");
        }
        staffData1.setAccountTime(staffData.getAccounttime());
        staffData1.setSetPermission(staffData.getWritePermission());
        String password=staffData.getuPassword();
        String code= MD5Utils.md5(password)+"0";
        staffData1.setUPassword(code);
        staffData1.setURealName(staffData.getuRealName());
        staffData1.setUAccountNum(staffData.getuAccountNum());
        staffData1.setGroupAgentNumber(selectcom);
        switch(RoleType.getString(staffData1.getIRoleType())){
            case "user":
                if(select.equals("empty")){
                    staffData1.setGroupAssemble("");
                }else{
                    staffData1.setGroupAssemble(select);
                }
                staffData1.setWebPermission(right);
                staffData1.setAppPermission(appright);
                break;
            case "companyadmin":
                staffData1.setGroupAssemble("all");//供销商公司所有项目
                staffData1.setWebPermission(right);
                staffData1.setAppPermission(appright);
                break;
            case "superadmin":
                staffData1.setGroupAssemble("all");//所有项目
                staffData1.setWebPermission(WebAuthority.getAllString());
                staffData1.setAppPermission(AppAuthority.getAllString());
                break;
            case "test":
                staffData1.setAppPermission(appright);
                break;
            case "admin":
                staffData1.setWebPermission(WebAuthority.getAllString());
                staffData1.setAppPermission(AppAuthority.getAllString());
                break;
        }
        if(staffData1.save()){
            result.success("成功");
        }else{
            result.success("失败");
        }
        return result;
    }

    /**根据id判断用户是否存在**/
    public boolean exists(int staffid) {
        String sql = "select id from staff_data where id="+staffid;
        Integer id = Db.queryInt(sql);
        return id != null;
    }



    /**更新用户资料**/
    public Result<String> update(StaffDataEntity staffData,String select,String right,String appright,String selectcom) {
        Result<String> result = Result.newOne();
        StaffData staffData1=new StaffData();
        StaffData staffData2=StaffData.dao.findById(staffData.getId());
        staffData1.setId(staffData.getId());
        staffData1.setAgentNumber(staffData.getAgentNumber());
        staffData1.setCDept(staffData.getcDept());
        staffData1.setIAccountType(staffData.getiAccountType());
        staffData1.setIRoleType(staffData.getiRoleType());
        staffData1.setAccountTime(staffData.getAccounttime());
        staffData1.setSetPermission(staffData.getWritePermission());
        String password=staffData.getuPassword();
        String oldpassword=StaffData.dao.findById(staffData.getId()).getUPassword();
        if(!password.equals("")&&!oldpassword.equals(password)){
            String code= MD5Utils.md5(password)+"0";
            staffData1.setUPassword(code);
        }
        staffData1.setURealName(staffData.getuRealName());
        staffData1.setUAccountNum(staffData.getuAccountNum());
        staffData1.setGroupAgentNumber(selectcom);
        staffData1.setWebPermission(right);
        staffData1.setAppPermission(appright);
        switch(RoleType.getString(staffData1.getIRoleType())){
            case "user":
                if(select.equals("empty")){
                    staffData1.setGroupAssemble("");
                }else{
                    staffData1.setGroupAssemble(select);
                }
                staffData1.setWebPermission(right);
                staffData1.setAppPermission(appright);
                break;
            case "companyadmin":
                staffData1.setGroupAssemble("all");//供销商公司所有项目
                staffData1.setWebPermission(right);
                staffData1.setAppPermission(appright);
                break;
            case "superadmin":
                staffData1.setGroupAssemble("all");//所有项目
                staffData1.setWebPermission(WebAuthority.getAllString());
                staffData1.setAppPermission(AppAuthority.getAllString());
                break;
            case "admin":
                staffData1.setWebPermission(WebAuthority.getAllString());
                staffData1.setAppPermission(AppAuthority.getAllString());
                break;
            case "test":
                staffData1.setAppPermission(appright);
                break;
        }
        if(staffData1.update()){
            result.success("成功");
        }else{
            result.success("失败");
        }
        return result;
    }

    /**删除用户资料**/
    public Result<String> delete(final int roleId) {
        if (roleId == 1) {
            String tip = I18nKit.getI18nStr("error_super_account_cannot_deleted");
            throw new BusinessException(tip);
        }
        boolean flag = Db.tx(new IAtom() {
            public boolean run() throws SQLException {
                StaffData.dao.deleteById(roleId);
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

    /**获取所有用户**/
    public Page<StaffDataEntity> getAllCustom(String userid,int pageno,int limit){
        return dal.getAllCustomByPage(userid,pageno,limit);
    }

    /**获取各类别的用户数量**/
    public int getCountByType(String type){
        List<StaffDataEntity> list=dal.getCountByType(type);
        return list.size();
    }

    /**获取所有的用户的数量**/
    public int getAllcount(){
        List<StaffDataEntity> list=dal.getAlCustom();
        return list.size();
    }

    /**搜索用户**/
    public Page<StaffDataEntity> searchCustomByParam(StaffData staffData,String content,String agentnum,int pageno,int limit){
        return dal.searchCustomByParam(staffData,content,agentnum, pageno, limit);
    }


    /**根据公司号查找用户**/
    public Page<StaffDataEntity> getCustomByComId(String agentnum,String userid,int pageno,int limit){
        return dal.getCustomByComId(agentnum,userid, pageno, limit);
    }


    /**--------------------------------------------------------------------------------**/

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

    /**获取用户web权限内容**/
    public List<FuncAuthor> getWebAuthorityById(String userid){
        return dal.getWebAuthorityById(userid);
    }


    /**获取用户app权限内容**/
    public List<FuncAuthor> getAppAuthorityById(String userid){
        return dal.getAppAuthorityById(userid);
    }
}
