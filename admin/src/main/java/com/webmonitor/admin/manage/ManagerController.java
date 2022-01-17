package com.webmonitor.admin.manage;

import com.jfinal.i18n.Res;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.company.CompanyService;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.*;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.AuthorityEntity;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.util.SocketTools;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.webmonitor.core.model.Response.*;

public class ManagerController extends BaseController {

    public void selectcompany() {
        String projetid = getCookie(IndexService.me.accessUserId);
        setAttr("projetid", projetid);
        render("selectcompany.html");
    }

    public void selectprojects(){
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData staffData=StaffService.me.getStaffById(userid);
        String agentnum=staffData.getAgentNumber();
        String name=staffData.getUAccountNum();
        setAttr("userid", userid);
        setAttr("agentnum",agentnum);
        setAttr("accountname",name);
        render("selectprojects.html");
    }

    public void companyprojects(){
        String agentnum=getPara("agentnum");
        String agentname=getPara("agentname");
        setAttr("agentNum",agentnum);
        setAttr("agentName",agentname);
        render("companyprojects.html");
    }

    public void templatemanage(){
        String userid = getCookie(IndexService.me.accessUserId);
        String useid=getLoginAccount().getUserName();
        String agentnum=StaffService.me.getStaffById(userid).getAgentNumber();
        String webpremission=StaffService.me.getStaffById(userid).getWebPermission();
        setAttr("webpremission",webpremission);
        setAttr("agentnum",agentnum);
        setAttr("userid",useid);
        render("templatemanage.html");
    }

    //设备管理页面
    public void devicemanage() {
//        String projetid = getCookie(IndexService.me.accessProjectId);
//        if (Tools.isEmpty(projetid))
//            projetid = "";
//        setAttr("projetid", projetid);
        render("selectcompany.html");
    }

    //供应商管理页面
    public void companymanage() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("selectcompany.html");
    }

    public void waterdevicehome() {
        render("sensordata.html");
    }

    /**超级管理员用户管理页面**/
    public void customermanage() {
        String userid = getCookie(IndexService.me.accessUserId);
        setAttr("userid", userid);
        render("customermanage.html");
    }

    /**普通管理员用户管理页面**/
    public void comadminmanage() {
        String userid = getCookie(IndexService.me.accessUserId);
        setAttr("userid", userid);
        render("comadminmanage.html");
    }

    public void comusermanage(){
        String userid = getCookie(IndexService.me.accessUserId);
        String agentnum=StaffService.me.getStaffById(userid).getAgentNumber();
        if (Tools.isEmpty(userid))
           userid = "";
        setAttr("userid", userid);
        setAttr("agentnum",agentnum);
        render("comusermanage.html");
    }

    public void sensordevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("sensorlist.html");
    }

    public void orderlog(){
        String userid = getCookie(IndexService.me.accessUserId);
        String useid=getLoginAccount().getUserName();
        setAttr("userid",useid);
        render("orderlog.html");
    }




    /**
     * 获取当前用户的项目列表
     **/
    public void getuserproject() {
        String pageno = getPara("pageno");
        int no = Integer.parseInt(pageno);
        Result<Page<Object>> result = Result.newOne();
        int pagesize = 5;
        List<BaseProjects> list = new ArrayList<>();
        try {
            String userid = getCookie(IndexService.me.accessUserId);
            StaffData currentuser = StaffService.me.getStaffById(userid);
            String authority = currentuser.getGroupAssemble();
            setCookie(IndexService.me.accessUserId, currentuser.getId().toString(), 24 * 60 * 60, true);
            int roletype = currentuser.getIRoleType();
            RoleType role = RoleType.getIndex(roletype);
            switch (role) {
                case user:
                    String[] projects = authority.split("@");
                    for (int i = no-1; i < projects.length; i++) {
                        BaseProjects baseProjects = ProjectService.me.getProjectById(projects[i]);
                        list.add(baseProjects);
                    }
                    setAttr("pagecount", projects.length);
                    setAttr("identity", "user");
                    Page<Object> page = new Page<Object>(Collections.singletonList(list), Integer.parseInt(pageno), pagesize, (projects.length / pagesize) + 1, projects.length);
                    result.success(page);
                    break;
                case superadmin:
                    setAttr("identity", "admin");
                    result.success(ProjectService.me.getAllProjectPageData(no, pagesize));
                    break;
                case companyadmin:
                    setAttr("identity", "user");
                    result.success(ProjectService.me.getProjectByComIdPageDataO(currentuser.getAgentNumber(), no, pagesize));
                    break;
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**获取用户项目数量**/
    public void getprojectcount(){
        Result result=Result.newOne();
        try {
            int count=0;
            String userid = getCookie(IndexService.me.accessUserId);
            StaffData currentuser = StaffService.me.getStaffById(userid);
            String authority = currentuser.getGroupAssemble();
            setCookie(IndexService.me.accessUserId, currentuser.getId().toString(), 24 * 60 * 60, true);
            int roletype = currentuser.getIRoleType();
            RoleType role = RoleType.getIndex(roletype);
            switch (role) {
                case user:
                    String[] projects = authority.split("@");
                    count=projects.length;
                    break;
                case superadmin:
                    count=ProjectService.me.getProjectCountByRight("admin","");
                    break;
                case companyadmin:
                    count=ProjectService.me.getProjectCountByRight("company",currentuser.getAgentNumber());
                    break;
            }
           result.success(count);
            renderJson(result);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }

    }

    /**获取所有公司**/
    public void getallCompanys(){
        Result<List<AgentTable>> result=Result.newOne();
        try{
            List<AgentTable> agentTables= CompanyService.me.getAllCompany();
            result.success(agentTables);
            renderJson(result);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result, e);
        }


    }

    /**判断用户权限身份**/
    public void judgeidentity(){
        Result result=Result.newOne();
        try {
            String identity="";
            String userid = getCookie(IndexService.me.accessUserId);
            StaffData currentuser = StaffService.me.getStaffById(userid);
            setCookie(IndexService.me.accessUserId, currentuser.getId().toString(), 24 * 60 * 60, true);
            int roletype = currentuser.getIRoleType();
            RoleType role = RoleType.getIndex(roletype);
            switch (role) {
                case user:
                    identity="user";
                    break;
                case superadmin:
                    identity="superadmin";
                    break;
                case companyadmin:
                    identity="company";
                    break;
                case admin:
                    identity="admin";
            }
            result.success(identity);
            renderJson(result);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
    }

    public void getDetailProject(){
        Result result=Result.newOne();
        String projectid=getPara("projectid");
        try {
            BaseProjects baseProjects = ProjectService.me.getProjectById(projectid);
            result.success(baseProjects);
            renderJson(result);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }


    }

    /**删除项目**/
    public void deleteproject(){
        Result<String> result=Result.newOne();
        String id=getPara("projectid");
        try{
            ProjectService.me.deleteProjectByid(id);
            result.success(SUCCESS_DELETE.getReport());
            renderJson(result);
        }catch(Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.success(ERROR_DELETE.getReport());
        }
        renderJson(result);

    }

    public void editproject(){
        String id=getPara("projectid");
        String comid=getPara("comid");
        String name=getPara("projectname");
        ProjectService.me.editProjectByid(id,comid,name);
    }

    public void addproject(){
        Result result=Result.newOne();
        ProjectsData account=getBean(ProjectsData.class);
        String comid=getPara("comid");
        String name=getPara("projectname");
        String lat=getPara("prolatitude");//纬度
        String lon=getPara("prolongitude");//经度
        String userid = getCookie(IndexService.me.accessUserId);
        ProjectService.me.addProject(userid,comid,name,lon,lat);
        renderJson(result.success("ok"));
    }

    public void getProDevCount(){
        Result result=Result.newOne();
        ProDevCount proDevCount=new ProDevCount();
        String id=getPara("userid");
        StaffData staffData=StaffService.me.getStaffByName(id);
        String role=RoleType.getString(staffData.getIRoleType());
        switch(role){
            case "superadmin":
                proDevCount=AdminService.me.getDevCount();
                break;
            case "companyadmin":
                proDevCount= CompanyAdminService.me.getDevCount(staffData.getAgentNumber());
                break;
            case "user":
                proDevCount= ConsumerService.me.getDevCount(staffData.getGroupAssemble().split("@"),staffData.getAgentNumber());
                break;
            case "admin":
                proDevCount=CompanyService.me.getDeviceNumByAgentId(staffData.getGroupAgentNumber());
        }
        renderJson(result.success(proDevCount));
    }


    /**根据角色获取公司列表**/
    public void getCompanyListByRole(){
        Result<List<AgentTable>> result=Result.newOne();
        String id=getPara("userid");
                List<AgentTable> agentTables=new ArrayList<>();
        StaffData staffData=StaffService.me.getStaffByName(id);
        String role=RoleType.getString(staffData.getIRoleType());
        switch(role){
            case "superadmin":
                agentTables=AdminService.me.getCompanyList();
                break;
            case "companyadmin":
               agentTables=ConsumerService.me.getCompanyListById(id);
                break;
            case "user":
               agentTables=ConsumerService.me.getCompanyListById(id);
                break;
            case "admin":
                agentTables=AdminService.me.getAdminCompanylist(id);
                break;

        }
        renderJson(result.success(agentTables));
    }


    /**获取所有公司的分页信息**/
    public void getAllCompanyPage(){
        Result<Page<CompanyPage>> result=Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData staffData=StaffService.me.getStaffById(userid);

        int pageno = getParaToInt("pageno", 1);
        int limit = getParaToInt("limit", 9);
        try{
            String role=RoleType.getString(staffData.getIRoleType());
            switch(role){
                case "superadmin":
                    Page<CompanyPage> page= CompanyService.me.getAllCompanys(pageno,limit);
                    result.success(page);
                    break;
                case "admin":
                    String groupagentnum=staffData.getGroupAgentNumber()!=null?staffData.getGroupAgentNumber():"";
                    Page<CompanyPage> page2=CompanyService.me.getAdminCompanys(groupagentnum,pageno,limit);
                    result.success(page2);
                    break;
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取公司的数目**/
    public void getAllCompanyList(){
        Result<List<AgentTable>> result=Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData staffData=StaffService.me.getStaffById(userid);
            try{
                String role=RoleType.getString(staffData.getIRoleType());
                switch(role){
                    case "superadmin":
                        List<AgentTable> list=CompanyService.me.getAllCompany();
                        result.success(list);
                        break;
                    case "admin":
                        String groupagent=staffData.getGroupAgentNumber()!=null?staffData.getGroupAgentNumber():"";
                        List<AgentTable> list2=CompanyService.me.getAdminCompany(groupagent);
                        result.success(list2);
                        break;
                }
        }catch(Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取接入点**/
    public void getConnectPoint(){
       Result<List<String>> result=Result.newOne();
       String ip=getPara("ip");
       String port=getPara("port");
       int port2=Integer.parseInt(port);
       try{
           SocketTools socketTools=new SocketTools();
           List<String> list=socketTools.getmStreamDetailList(ip,port2);
           result.success(list);
       }catch (Throwable e){
           ExceptionUtil.handleThrowable(result,e);
       }
       renderJson(result);
    }

    /**获取配置日志表数据**/
    public void getOrderLog(){
        Result<Page<CompanyPage>> result=Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 9);
        try{
            Page<CompanyPage> page= CompanyService.me.getAllCompanys(pageno,limit);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取所有功能权限**/
    public void getAllAuthor(){
        Result<AuthorityEntity> result=Result.newOne();
        try{
            AuthorityEntity authorityEntity=CompanyService.me.getAllAuthor();
            result.success(authorityEntity);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
