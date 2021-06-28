package com.webmonitor.admin.devicelist;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.dal.AgentDateMysqlDAL;
import com.webmonitor.core.dal.AgentTableMysqlDAL;
import com.webmonitor.core.idal.IAgent;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;

import java.util.ArrayList;
import java.util.List;

public class DeviceListService {
    public static final DeviceListService me = new DeviceListService();
    private static IAgentData dal=new AgentDateMysqlDAL();

    /**查找所有设备**/
    public Page<AgentData> getAllDevice(int pageno,int limit){
        Page<AgentData> page=dal.getAllDevice(pageno,limit);
        return  page;
    }

    /**未关联设备**/
   public Page<AgentDataDao> getUnconnectDeviceById(String projectid,int pageno,int limit,int type){
         Page<AgentDataDao> agentDataList=dal.getOutDeviceById(projectid,pageno,limit,type);
        return agentDataList;
    }

    /**检索未关联的设备**/
    public Page<AgentDataDao> searchOutDevByParam(String agentnum,String content, int pageno, int limit, String type, String role){
        return dal.searchOutDeviceByParam(agentnum, content, pageno, limit, type, role);
    }
    /**添加关联设备**/
    public void insertDeviceById(String projectid,String sn){
        dal.insertDeviceById(projectid,sn);
    }

    /**删除关联设备**/
    public void deleteDeviceByGroupid(String sn){
        dal.deleteDeviceByGroupid(sn);
    }

}
