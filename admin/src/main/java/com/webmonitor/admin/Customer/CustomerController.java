package com.webmonitor.admin.Customer;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.permission.PermissionService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.CustomCount;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
/**实现用户管理的增删查改功能**/
public class CustomerController extends BaseController {
    CustomerService srv = CustomerService.me;

    @Remark("用户列表页")
    public void index() {
        render("index.html");
    }

    @Remark("用户列表")
    public void list() {
        Result result=Result.newOne();
        List<StaffDataEntity> list=new ArrayList<>();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            list=srv.getAllCustom(pageno,limit);
            result.success(list);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    @Remark("用户新增页")
    public void add() {
        render("edit.html");
    }

    @Remark("添加新用户")
    public void save() {
        String staffjson=getPara("json");
        String select=getPara("select");
        select=select.replace(',','@');
        Result result=Result.newOne();
        Gson gson=new Gson();
        StaffDataEntity staffData= gson.fromJson(staffjson, new TypeToken<StaffDataEntity>(){}.getType());
        try {
           result=srv.save(staffData,select);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("用户资料编辑")
    public void edit() {
        String staffjson=getPara("json");
        Result<String> result = Result.newOne();
        String select=getPara("select");
        select=select.replace(',','@');
        Gson gson=new Gson();
        StaffDataEntity staffData= gson.fromJson(staffjson, new TypeToken<StaffDataEntity>(){}.getType());
        StaffData staffData1=StaffData.dao.findById(staffData.getId());
        if(staffData.getuPassword()==""){
            staffData.setuPassword(staffData1.getUPassword());
        }
        try {
            result = srv.update(staffData,select);
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

//    @Remark("角色指定权限页")
//    public void assignPermissions() {
//        Role role = srv.findById(getParaToInt("id"));
//        List<Permission> permissionList = PermissionService.me.getAllPermissions();
//        srv.markAssignedPermissions(role, permissionList);
//        LinkedHashMap<String, List<Permission>> permissionMap = srv.groupByController(permissionList);
//
//        setAttr("role", role);
//        setAttr("permissionMap", permissionMap);
//        render("assign_permissions.html");
//    }

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

/**-----------------------------------------------------------------------**/
    /**根据用户id获取用户的权限身份**/
    public void getauthorById(){
        Result result=Result.newOne();
        String id=getLoginAccount().getUserName();
        StaffData currentuser= StaffService.me.getStaffByName(id);
        result.success(RoleType.getString(currentuser.getIRoleType()));
        renderJson(result);
    }

    /**判断是否存在账号|获取**/
    public void getStaffByNum(){
        Result result=Result.newOne();
        String accountname=getPara("accountname");
        try{
            StaffData staffData=StaffService.me.getStaffByName(accountname);
            result.success(staffData);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取所有用户的数量**/
    public void getAllCount(){
        Result result=Result.newOne();
        try{
            int count=CustomerService.me.getAllcount();
            result.success(count);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取各类别用户数量**/
    public void getCountByType(){
        Result result=Result.newOne();
        CustomCount customCount=new CustomCount();
        try{
            for(int i=0;i<3;i++){
                int count=0;
                String usertype=String.valueOf(i);
                count=CustomerService.me.getCountByType(usertype);
                String type=RoleType.getTypeName(i);
                switch (type){
                    case "普通用户":
                        customCount.setOrdinaryusers(count);
                        break;
                    case "供销商管理员":
                        customCount.setComadmins(count);
                        break;
                    case "超级管理员":
                        customCount.setSuperadmins(count);
                }
            }
            int sum=CustomerService.me.getAllcount();
            customCount.setSum(sum);
            result.success(customCount);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**用户条件查询**/
    public void searchCustomByParam(){
        String account=getPara("account");
        String roletype=getPara("roletype");
        String comid=getPara("agentNumber");
        int pageno=getParaToInt("page",1);
        int limit =getParaToInt("limit",50);
        Result<Page<StaffDataEntity>> result=Result.newOne();
        try{
            Page<StaffDataEntity> customlist=CustomerService.me.searchCustomByParam(account,comid,roletype,pageno,limit);
            result.success(customlist);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
