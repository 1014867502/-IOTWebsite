package com.webmonitor.admin.devicelist;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.util.OrderConstants;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.lang.reflect.Field;
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

    /**快速设置**/
    public void fastsetting(){
        render("fastsetting.html");
    }

    /**站点设置**/
    public void stationsetting(){
        String machinesn=getPara("machinedata");
        setAttr("machinedata",machinesn);
        render("stationsetting.html");
    }

    /**站点 解算设置**/
    public void stationcompute(){
        String machinesn=getPara("machinesn");
        setAttr("machinesn",machinesn);
        render("station_compute.html");
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
            setAttr("machinedata",sn);
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
//        int roletype = currentuser.getIRoleType();
//        RoleType role = RoleType.getIndex(roletype);
//        switch (role){
//            case user:type=1;break;
//            case companyadmin:type=1;break;
//            case superadmin:type=0;break;
//        }
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

    /**获取单个设备的详情**/
    public void getDeviceSetting(){
        String sn=getPara("machineSerial");
        Result result=Result.newOne();
        String sql="select * from machine_data where machineSerial='"+sn+"'";
        MachineData machineData= Optional.ofNullable(MachineData.dao.findFirst(sql))
                .orElseGet(MachineData::new);
        result.success(machineData);
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
            Page<AgentDataDao> agentDataDaos=DeviceListService.me.searchOutDevByParam(agentnum,content,pageno,limit,type,roles);//
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
            DeviceListService.me.insertDeviceById(projectid,agentDataDao.get(i).getMachineSerial());
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

    /**更改设备配置**/
    public void editSetting(){
        Result result=Result.newOne();
        Gson gson = new Gson();
        String json=getPara("setting");
        String machine=getPara("machinesn");
        MachineInfoEntity agentDataDao= gson.fromJson(json, new TypeToken<MachineInfoEntity>(){}.getType());
        boolean test=DeviceListService.checkObjAllFieldsIsNull(machine,agentDataDao);
        if(test){
            renderJson(result.success("修改成功"));
        }else{
            renderJson(result.error("修改失败"));
        }

    }

}
