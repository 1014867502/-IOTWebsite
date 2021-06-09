package com.webmonitor.core.bll;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.AgentDateMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;

public class AgentDataService {
    public static final AgentDataService me=new AgentDataService();
    private static IAgentData dal=new AgentDateMysqlDAL();

    /**查询当前项目对应的设备**/
    public Page<AgentDataDao> getDevicelistByParam(String id, String sn, String state, int page, int limit){
        return dal.getDeviceByParams(id,sn,state,page,limit);
    }

//    /**查询当前项目所有设备**/
//    public Page<AgentDataDao> getDevicelistById(String id,int page, int limit){
//        return dal.getDeviceByParams(id,sn,state,page,limit);
//    }
}
