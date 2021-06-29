package com.webmonitor.admin.devicelist;

import com.alibaba.fastjson.JSONArray;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.base.BaseAgentData;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;
import org.apache.log4j.jmx.Agent;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**控制与设备数据相关操作**/
public class DeviceController  extends BaseController {

    /**设备管理页面**/
    public void devicemanage(){
        String proid=getCookie(IndexService.me.accessProId);
        setAttr("projetid",proid);
        render("devicemanage.html");
    }

    /****/

    public void searchlist(){
        render("setting.html");
    }

    /**配置页面**/
    public void setting()
    {
        Result result=Result.newOne();
        try {
            String sn = getPara("sn");
            String sql="select * from machine_data where serial="+sn;
            MachineData machineData= Optional.ofNullable(MachineData.dao.findFirst(sql))
                    .orElseGet(MachineData::new);
            setAttr("machinedata",machineData);
            render("setting.html");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result,e);
        }
    }

    /**不同角色查询项目相关的设备列表**/
    public void getDeviceList(){
        Result<Page<AgentDataDao>> result=Result.newOne();
        String id=getPara("userid");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<AgentDataDao> page= AgentDataService.me.getDevicelistByParam(pageno,limit,id);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取未关联的设备列表**/
    public void getUnconnectDev(){
        String id=getPara("agentnum");
        int type=0;
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        String authority = currentuser.getGroupAssemble();
        int roletype = currentuser.getIRoleType();
        RoleType role = RoleType.getIndex(roletype);
        switch (role){
            case user:type=1;break;
            case companyadmin:type=1;break;
            case superadmin:type=0;break;
        }
        Result<Page<AgentDataDao>> result=Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 20);
        try{
            Page<AgentDataDao> agentDataDaos=DeviceListService.me.getUnconnectDeviceById(id,pageno,limit,type);
            result.success(agentDataDaos);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**搜索未关联设备列表**/
    public void searchUnconnectDev(){
        String agentnum=getPara("agentnum");
        String content=getPara("content");
        String type=getPara("type");
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        String authority = currentuser.getGroupAssemble();
        int roletype = currentuser.getIRoleType();
        RoleType role = RoleType.getIndex(roletype);
        String roles="";
        switch (role){
            case user:roles="consumer";break;
            case companyadmin:roles="consumer";break;
            case superadmin:roles="admin";break;
        }
        Result<Page<AgentDataDao>> result=Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 20);
        try{
            Page<AgentDataDao> agentDataDaos=DeviceListService.me.searchOutDevByParam(agentnum,content,pageno,limit,type,roles);
            result.success(agentDataDaos);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);


    }

    /**修改未关联设备**/
    public void changeConDev(){
        Result result=Result.newOne();
        String json=getPara("connectdevice");
        String projectid=getPara("projectid");
        Gson gson = new Gson();
        List<AgentTabll> agentDataDao= gson.fromJson(json, new TypeToken<List<AgentTabll>>(){}.getType());
        for(int i=0;i<agentDataDao.size();i++){
            DeviceListService.me.insertDeviceById(projectid,agentDataDao.get(i).getSerial());
        }
        renderJson(result.success("success"));
    }

    /**删除关联设备**/
    public void delConnectDev(){
        Result result=Result.newOne();
        String sn=getPara("sn");
        try{
            DeviceListService.me.deleteDeviceByGroupid(sn);
            result.success("success");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);

        }
        renderJson(result);
    }

    /**根据不同角色权限进行筛选设备**/
    public void searchDevice(){
        Result<Page<AgentData>> result=Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        String content=getPara("sn");
        String[] projects=new String[20];
        String agentnum=getPara("agentNumber");
        String state=getPara("state");
        StaffData currentuser = StaffService.me.getStaffById(userid);
        String authority = currentuser.getGroupAssemble();
        if(authority.length()>0){
            projects=authority.split("@");
        }
        try{
            Page<AgentData> agentDataList=AgentDataService.me.searchDeviceByParam(agentnum,content,projects,state,pageno,limit);
            result.success(agentDataList);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
