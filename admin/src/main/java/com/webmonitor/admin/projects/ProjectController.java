package com.webmonitor.admin.projects;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.core.bll.ProjectService;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.userbase.ExportGNSSWord;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

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
}
