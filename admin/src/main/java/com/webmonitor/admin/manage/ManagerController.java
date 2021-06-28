package com.webmonitor.admin.manage;

import com.jfinal.i18n.Res;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.company.CompanyService;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.*;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ManagerController extends BaseController {

    public void selectproject() {
        String projetid = getCookie(IndexService.me.accessUserId);
        setAttr("projetid", projetid);
        render("selectproject.html");
    }

    //设备管理页面
    public void devicemanage() {
//        String projetid = getCookie(IndexService.me.accessProjectId);
//        if (Tools.isEmpty(projetid))
//            projetid = "";
//        setAttr("projetid", projetid);
        render("selectproject.html");
    }

    //供应商管理页面
    public void companymanage() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("selectproject.html");
    }

    public void waterdevicehome() {
        render("sensordata.html");
    }

    public void gnssdevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("devicelist.html");
    }

    public void sensordevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("sensorlist.html");
    }

    //报告管理的网页
    public void reportdevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("reportlist.html");
    }

    public void sensordatahome() {
        String sn = getPara("sn");
        int type = getParaToInt("type");
        if (type == 0) {
            //雨量计
            setAttr("sensorsn", sn);
            render("sensordata.html");
        } else if (type == 1) {
            //含水计
            setAttr("sensorsn", sn);
            render("sensorwaterdata.html");
        } else if (type == 2) {
            //加速度计
            setAttr("projid", getPara("projid"));
            setAttr("sensorsn", sn);
            render("sensoraccelerationdata.html");
        }

    }

    public void gnssdatahome() {
        String sn = getPara("sn");
        int type = getParaToInt("type");
        if (type == 0) {
            //移动站
            setAttr("projid", getPara("projid"));
            setAttr("gnssSN", sn);
            render("gnssoffsetdata.html");
        } else if (type == 1) {
            //基站
        }

    }

    /**
     * 获取当前用户的项目列表
     **/
    public void getuserproject() {
        String pageno = getPara("pageno");
        int no = Integer.parseInt(pageno);
        Result<Page<Object>> result = Result.newOne();
        int pagesize = 10;
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
                    result.success(ProjectService.me.getProjectByComIdPageData(currentuser.getAgentNumber(), no, pagesize));
                    break;
            }
            renderJson(result);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
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

    /**获取所有项目**/
    public void getallproject(){
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
                    identity="admin";
                    break;
                case companyadmin:
                    identity="user";
                    break;
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
        Result result=Result.newOne();
        String id=getPara("projectid");
        ProjectService.me.deleteProjectByid(id);
        renderJson(result.success("ok"));
    }

    public void editproject(){
        String id=getPara("projectid");
        String comid=getPara("comid");
        String name=getPara("projectname");
        ProjectService.me.editProjectByid(id,comid,name);
    }

    public void addproject(){
        Result result=Result.newOne();
        String comid=getPara("comid");
        String name=getPara("projectname");
        String userid=getPara("userid");
        ProjectService.me.addProject(userid,comid,name);
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
                proDevCount= ConsumerService.me.getDevCount(staffData.getGroupAssemble().split("@"));
                break;
        }
        renderJson(result.success(proDevCount));
    }


    /**根据角色获取公司列表**/
    public void getCompanyListByRole(){
        Result<List<AgentTable>> result=Result.newOne();
        String id=getPara("userid");
        StaffData staffData=StaffService.me.getStaffByName(id);
        String role=RoleType.getString(staffData.getIRoleType());
        List<AgentTable> agentTables=new ArrayList<>();
        switch(role){
            case "superadmin":
                agentTables=AdminService.me.getCompanyList();
                break;
            case "companyadmin":
               agentTables=CompanyService.me.getAllCompany();
                break;
            case "user":
               agentTables=ConsumerService.me.getCompanyListById(id);
                break;
        }
        renderJson(result.success(agentTables));
    }


    /**获取所有公司的分页信息**/
    public void getAllCompanyPage(){
        Result<Page<AgentTable>> result=Result.newOne();
        int pageno = getParaToInt("pageno", 1);
        int limit = getParaToInt("limit", 20);
        try{
            Page<AgentTable> page= CompanyService.me.getAllCompanys(pageno,limit);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取公司的数目**/
    public void getAllCompanyList(){
        Result<List<AgentTable>> result=Result.newOne();
        try{
            List<AgentTable> list=CompanyService.me.getAllCompany();
            result.success(list);
        }catch(Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
