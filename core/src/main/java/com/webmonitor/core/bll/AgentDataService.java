package com.webmonitor.core.bll;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.*;

import java.util.List;

public class AgentDataService {
    public static final AgentDataService me=new AgentDataService();
    private static IAgentData dal=new AgentDataMysqlDAL();

    /**条件查询所有设备**/
    public Page<AgentData> searchDeviceByParam(String role,String content,String agentnum,String[] projectid,String state,int pageno,int limit){
        return dal.searchDeviceByParam(role,content,agentnum, projectid, state, pageno, limit);
    }

    /**首页上搜索框**/
    public Page<AgentData> seekDeviceByParam(StaffData currentuser, String content, String agentnum, String projectid, String state, int pageno, int limit){
        return dal.seekDeviceByParam(currentuser,content,agentnum, projectid, state, pageno, limit);
    }

    /**公司详情页上的搜索框**/
    public Page<AgentData> searchDeviceByCom(String content,String agentnum,String state,int pageno,int limit){
        return dal.searchDeviceByCom(content, agentnum, state, pageno, limit);
    }

    /**条件查询所有设备(根据y)**/
    public Page<AgentData> findDeviceByParam(String content,String agentnum,String projectid,String state,int pageno,int limit){
        return dal.findDeviceByParam(content,agentnum, projectid, state, pageno, limit);
    }

    /**不同角色查询当前项目对应的设备**/
    public Page<AgentData> getDevicelistByParam(int page, int limit,String userid){
        return dal.getDeviceByParams(page,limit,userid);
    }

    public Page<AgentData> getAllDevice(int pageno,int limit){
        return dal.getAllDevice(pageno,limit);
    }

    /**根据设备serial码获取设备相关信息**/
    public AgentData getDeviceDetailBySn(String machineserial){
        return  dal.getDeviceDetailBySn(machineserial);
    }

    /**根据设备serial码判断是否存在**/
    public boolean isExistDeviceDetailBySn(String machineserial){
        return  dal.isExistDeviceDetailBySn(machineserial);
    }


    public ProDevCount getDevCount(){
        return dal.getDevCountAdmin();
    }

    /**删除表上数据**/
    public void deletemachine(int id){
        dal.deleteDevice(id);
    }

    /**批量删除表上数据**/
    public void deletemachineList(List<AgentData> list){
        for(int i=0;i<list.size();i++){
            dal.deleteDevice(list.get(i).getId());
        }
    }

    public ProDevCount getCompangyDevCount(String comid){
        return dal.getDeviceCountByComid(comid);
    }

    public ProDevCount getCosumerDevCount(String[] projects,String agentNumber){
        return dal.getDeviceCountByUserid(projects,agentNumber);
    }

//    /**查询当前项目所有设备**/
//    public Page<AgentDataDao> getDevicelistById(String id,int page, int limit){
//        return dal.getDeviceByParams(id,sn,state,page,limit);
//    }
}
