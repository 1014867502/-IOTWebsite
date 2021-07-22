package com.webmonitor.admin.projects;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.core.bll.ProjectService;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.ProjectsData;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.model.userbase.ExportGNSSWord;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.List;

public class ProjectController extends BaseController {

    /**项目详情**/
    public void projectdetail(){
        String progroupid=getPara("progroupid");
        setAttr("progroupid",progroupid);
        render("projectdetail.html");
    }



    /**根据用户id获取对应的项目列表**/
    public void getProjectsById(){
        String useid=getLoginAccount().getUserName();
        Result<Page<Object>> result=Result.newOne();
        int pageno=getParaToInt("pageno",1);
        int limit=getParaToInt("limit",50);
        try{
            Page<Object> page= ProjectService.me.getProjectsById(useid,pageno,limit);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**获取项目设备在线情况**/
    public void getProDevByGroupId(){
        String groupid=getPara("progroupid");
        Result result=Result.newOne();
        try{
            ProDevCount proDevCount=ProjectService.me.getProDevCountById(groupid);
            result.success(proDevCount);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getAllDeviceByGroupid(){
        String groupid=getPara("progroupid");
        Result<Page<AgentData>> result=Result.newOne();
        int pageno=getParaToInt("pageno",1);
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
        int pageno=getParaToInt("pageno",1);
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
}
