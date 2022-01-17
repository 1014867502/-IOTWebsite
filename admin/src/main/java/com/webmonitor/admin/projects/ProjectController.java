package com.webmonitor.admin.projects;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.bll.ProjectService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.BaseDevicemap;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.model.userbase.ExportGNSSWord;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.List;

import static com.webmonitor.core.model.Response.ERROR_EXECUTE;
import static com.webmonitor.core.model.Response.SUCCESS_EXECUTE;

public class ProjectController extends BaseController {

    /**项目详情**/
    public void projectdetail(){
        String progroupid=getPara("progroupid");
        String agentnum=getPara("agentnum");
        setAttr("progroupid",progroupid);
        setAttr("agentnum",agentnum);
        render("projectdetail.html");
    }

    /**获取所有的项目列表**/
    public void getAllProjects(){
        Result<List<BaseProjects>> result=Result.newOne();
        List<BaseProjects> projectsData=new ArrayList<>();
        String userid = getCookie(IndexService.me.accessUserId);
        String agentnum=getPara("agentnum");
        StaffData user = StaffService.me.getStaffById(userid);
        try{
            String type = RoleType.getString(user.getIRoleType());
            switch (type) {
                case "superadmin":
                    projectsData= ProjectService.me.getProjectByComId(agentnum);
                    break;
                case "companyadmin":
                    String agentNumber = StaffService.me.getStaffById(userid).getAgentNumber();
                    projectsData= ProjectService.me.getProjectByComId(agentNumber);
                    break;
                case "user":
                    String userproject = StaffService.me.getStaffById(userid).getGroupAssemble();
                    String[] projects = userproject.split("@");
                    for (int i = 0; i < projects.length; i++) {
                       BaseProjects list1 =ProjectService.me.getProjectById(projects[i]);
                       projectsData.add(list1);
                    }
                    break;
                case "admin":
                    projectsData= ProjectService.me.getProjectByComId(agentnum);
                    break;
            }
            result.success(projectsData);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }


    /**根据用户id获取对应的项目列表**/
    public void getProjectsById(){
        String useid=getLoginAccount().getUserName();
        Result<List<BaseProjects>> result=Result.newOne();
        List<BaseProjects> projectsData=new ArrayList<>();
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",50);
        try{
            projectsData= ProjectService.me.getProjectlistById(useid);
            result.success(projectsData);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**根据项目id获取对应的项目**/
    public void getProjectById(){
        String projectid=getPara("projectid");
        Result<BaseProjects> result=Result.newOne();
        try{
            BaseProjects page= ProjectService.me.getProjectById(projectid);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**获取项目设备在线情况**/
    public void getProDevByGroupId(){
        String groupid=getPara("progroupid");
        String userid = getCookie(IndexService.me.accessUserId);
        String agentnum= StaffService.me.getStaffById(userid).getAgentNumber();
        Result result=Result.newOne();
        try{
            ProDevCount proDevCount=ProjectService.me.getProDevCountById(groupid,agentnum);
            result.success(proDevCount);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);

    }

    /**根据用户id获取用户对应的**/

    public void getAllDeviceByGroupid(){
        String groupid=getPara("progroupid");
        Result<Page<AgentData>> result=Result.newOne();
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",50);
        try{
            Page<AgentData> proDevCount= DeviceListService.me.getAllDeviceByGroupid(groupid,pageno,limit);
            result.success(proDevCount);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getAllProjectlist(){
        Result<List<ProjectsData>> result=Result.newOne();
        try{
            List<ProjectsData> list= ProjectsData.dao.find("select * from projects_data");
            result.success(list);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getProjectByComId(){
        String id=getPara("id");
        Result<List<BaseProjects>> result=Result.newOne();
        try{
            List<BaseProjects> list=ProjectService.me.getProjectByComId(id);
            result.success(list);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**根据公司获取分页的项目列表**/
    public void getProjectPageByComId(){
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",5);
        String agentnum=getPara("agentnum");
        Result<Page<BaseProjects>> result=Result.newOne();
        try{
            Page<BaseProjects> projects=ProjectService.me.getProjectByComIdPageData(agentnum,pageno,limit);
            result.success(projects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getProjectByName(){
        String name=getPara("name");
        Result result=Result.newOne();
        try{
            BaseProjects baseProjects=ProjectService.me.getProjectByName(name);
            result.success(baseProjects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getProjectByGroupId(){
        String name=getPara("name");
        Result result=Result.newOne();
        try{
            BaseProjects baseProjects=ProjectService.me.getProjectByName(name);
            result.success(baseProjects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取公司旗下项目的详情**/
    public void getProjectPageByNum(){
        String agentnum=getPara("agentNumber");
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",50);
        Result result=Result.newOne();
        try{
            Page<ProjectPage> baseProjects=ProjectService.me.getProjectPageByNum(agentnum,pageno,limit);
            result.success(baseProjects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error(ERROR_EXECUTE.getReport());
        }
        renderJson(result);
    }

    /**根据项目名查询项目**/
    public void searchProjectPageByName(){
        String agentnum=getPara("agentNumber");
        String content=getPara("content")==null?"":getPara("content");
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",50);
        Result result=Result.newOne();
        try{
            Page<ProjectPage> baseProjects=ProjectService.me.searchProjectPageByName(content.trim(),agentnum,pageno,limit);
            result.success(baseProjects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error(ERROR_EXECUTE.getReport());
        }
        renderJson(result);
    }

    /**根据用户名id获取项目**/
    public void getPageProjectById(){
        String userid=getPara("userid");
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",50);
        Result result=Result.newOne();
        try{
            Page<BaseProjects> baseProjects=ProjectService.me. getProjectsById(userid,pageno,limit);
            result.success(baseProjects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error(ERROR_EXECUTE.getReport());
        }
        renderJson(result);
    }

    /**搜索用户的项目列表**/
    public void seekProjectsById(){
        String content=getPara("content");
        String userid=getPara("userid");
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",50);
        Result result=Result.newOne();
        try{
            Page<BaseProjects> baseProjects=ProjectService.me.seekProjectsById(userid,content,pageno,limit);
            result.success(baseProjects);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error(ERROR_EXECUTE.getReport());
        }
        renderJson(result);
    }

    /**根据多选删除项目**/
    public void deleteProjectList(){
        Result result=Result.newOne();
        String data=getPara("json");
        Gson gson=new Gson();
        List<ProjectPage> sList =gson.fromJson(data,new TypeToken<List<ProjectPage>>(){}.getType());
        try{
            ProjectService.me.deleteProjectList(sList);
            result.success("成功");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
