package com.webmonitor.core.bll;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.ProDevCount;

public class AgentDataService {
    public static final AgentDataService me=new AgentDataService();
    private static IAgentData dal=new AgentDataMysqlDAL();

    /**条件查询所有设备**/
    public Page<AgentData> searchDeviceByParam(String role,String content,String agentnum,String[] projectid,String state,int pageno,int limit){
        return dal.searchDeviceByParam(role,content,agentnum, projectid, state, pageno, limit);
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

    public ProDevCount getDevCount(){
        return dal.getDevCountAdmin();
    }

    public ProDevCount getCompangyDevCount(String comid){
        return dal.getDeviceCountByComid(comid);
    }

    public ProDevCount getCosumerDevCount(String[] projects){
        return dal.getDeviceCountByUserid(projects);
    }

//    /**查询当前项目所有设备**/
//    public Page<AgentDataDao> getDevicelistById(String id,int page, int limit){
//        return dal.getDeviceByParams(id,sn,state,page,limit);
//    }
}
