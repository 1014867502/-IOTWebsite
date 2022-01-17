package com.webmonitor.admin.Customer;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.admin.company.CompanyService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.admin.permission.PermissionService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.AuthorityEntity;
import com.webmonitor.core.model.userbase.CustomCount;
import com.webmonitor.core.util.MD5Utils;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
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
        String userid=getPara("userid");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<StaffDataEntity>  list=srv.getAllCustom(userid,pageno,limit);
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
//        try {
//           staffjson=new String(getPara("json").getBytes("8859_1"), "utf8");
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
        String webright=getPara("webright");
        String appright=getPara("appright");
        String select=getPara("select");
        String selectcom=getPara("selectcom");
        selectcom=(selectcom==null)?"":selectcom;
        select=(select==null)?"":select;
        select=select.replace(',','@');
        webright=(webright==null)?"":webright;
        webright=webright.replace(',','@');
        appright=(appright==null)?"":appright;
        appright=appright.replace(',','@');
        selectcom=selectcom.replace(',','@');
        Result result=Result.newOne();
        Gson gson=new Gson();
        StaffDataEntity staffData= gson.fromJson(staffjson, new TypeToken<StaffDataEntity>(){}.getType());
        if(staffData.getiRoleType()==3){
            staffData.setGroupAssemble("all");
            webright="";
            staffData.setWritePermission(0);
        }
        try {
           result=srv.save(staffData,select,webright,appright,selectcom);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("用户资料编辑")
    public void edit() {

        String staffjson=getPara("json");
//        try {
//            staffjson=new String(getPara("json").getBytes("8859_1"), "utf8");
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
        Result<String> result = Result.newOne();
        String select=getPara("select");
        String webright=getPara("webright");
        String appright=getPara("appright");
        String selectcom=getPara("selectcom");
        selectcom=(selectcom==null)?"":selectcom;
        select=(select==null)?"":select;
        webright=(webright==null)?"":webright;
        webright=webright.replace(',','@');
        appright=(appright==null)?"":appright;
        appright=appright.replace(',','@');
        select=select.replace(',','@');
        selectcom=selectcom.replace(',','@');
        Gson gson=new Gson();
        StaffDataEntity staffData= gson.fromJson(staffjson, new TypeToken<StaffDataEntity>(){}.getType());
        StaffData staffData1=StaffData.dao.findById(staffData.getId());
        if(staffData.getuPassword()==""){
            staffData.setuPassword(staffData1.getUPassword());
        }
        try {
            result = srv.update(staffData,select,webright,appright,selectcom);
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

    /**批量删除用户**/
    public void deletelist() {
        Result<String> result = Result.newOne();
        String json=getPara("json");
        try {
            Gson gson=new Gson();
            List<StaffDataEntity> staffData= gson.fromJson(json, new TypeToken<List<StaffDataEntity>>(){}.getType());
            for(int k=0;k<staffData.size();k++){
                result = srv.delete(staffData.get(k).getId());
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /*批量重置密码*/
    public void repasswordlist(){
        Result<String> result = Result.newOne();
        String json=getPara("json");
        try {
            Gson gson=new Gson();
            List<StaffDataEntity> staffDatalist= gson.fromJson(json, new TypeToken<List<StaffDataEntity>>(){}.getType());
            for(int k=0;k<staffDatalist.size();k++){
                StaffData staffData= StaffService.me.getStaffByName(staffDatalist.get(k).getuAccountNum());
                String code= MD5Utils.md5("123456")+"0";
                staffData.setUPassword(code);
                staffData.update();
                result.success("success");
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }


    /**重置密码**/
    public void repassword(){
        Result<String> result = Result.newOne();
        String userid=getPara("uAccountname");
        try {
            StaffData staffData= StaffService.me.getStaffByName(userid);
            String code= MD5Utils.md5("123456")+"0";
            staffData.setUPassword(code);
            staffData.update();
            result.success("success");
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

    /**根据用户id获取用户的权限身份**/
    public void getprojectsById(){
        Result result=Result.newOne();
        String id=getLoginAccount().getUserName();
        StaffData currentuser= StaffService.me.getStaffByName(id);
        result.success(currentuser.getGroupAssemble());
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
        String account=getPara("content");
        String agentnum=getPara("agentnumber");
        int pageno=getParaToInt("page",1);
        int limit =getParaToInt("limit",50);
        Result<Page<StaffDataEntity>> result=Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        try{
                    Page<StaffDataEntity> customlist=CustomerService.me.searchCustomByParam(currentuser,account.trim(),agentnum,pageno,limit);
                    result.success(customlist);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**按公司编号查找用户**/
    public void getCustomByComid(){
        String agentnum=getPara("agentNumber");
        String userid=getPara("userid");
        int pageno=getParaToInt("page",1);
        int limit =getParaToInt("limit",50);
        Result<Page<StaffDataEntity>> result=Result.newOne();
        try{
            Page<StaffDataEntity> customlist=CustomerService.me.getCustomByComId(agentnum,userid,pageno,limit);
            result.success(customlist);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);

    }

    /**普通用户修改登录密码**/
    public void changePassword(){
        Result<String> result=Result.newOne();
        String newpassword=getPara("newpassword");
        String userid=getPara("userid");
        try{
            StaffData staffData= StaffService.me.getStaffByName(userid);
            String code= MD5Utils.md5(newpassword)+"0";
            staffData.setUPassword(code);
            staffData.update();
            result.success("success");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**判断当前密码是否正确**/
    public void isCorrectPassword(){
        Result<String> result=Result.newOne();
        String oldpassword=getPara("oldpassword");
        String userid=getPara("userid");
        try{
            StaffData staffData=StaffService.me.getStaffByName(userid);
            String hashedPass = MD5Utils.md5(oldpassword)+"0";
            if (staffData.getUPassword().equals(hashedPass) == false) {
                result.success("error");
            }else{
                result.success("success");
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取用户的权限**/
    public void getAuthority(){
        Result<AuthorityEntity> result=Result.newOne();
        String userid=getPara("userid");
        try{
            StaffData staffData=StaffService.me.getStaffById(userid);
            AuthorityEntity authorityEntity=new AuthorityEntity();
            AuthorityEntity authorityEntity1=CompanyService.me.getComAuthorById(staffData.getAgentNumber());
            authorityEntity.setAppauthority(CustomerService.me.getAppAuthorityById(userid));
            authorityEntity.setWebauthority(CustomerService.me.getWebAuthorityById(userid));
            authorityEntity.setComwebauthor(authorityEntity1.getWebauthority());
            authorityEntity.setComappauthor(authorityEntity1.getAppauthority());
            authorityEntity.setWriteright(staffData.getSetPermission());
            result.success(authorityEntity);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

}
