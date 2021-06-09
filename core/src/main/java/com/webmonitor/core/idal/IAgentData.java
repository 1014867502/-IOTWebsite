package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;

import java.util.List;

/**关于对agent_data数据表的接口**/
public interface IAgentData {

    /**获取设备表所有数据通过公司id**/
    List<AgentData> getAllDeviceByCid(String Companyid);

    /**查询设备表内数据**/
    Page<AgentDataDao> getDeviceByParams(String Companyid, String sn, String state, int pageno, int limit);


}
