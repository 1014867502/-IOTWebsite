package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.ProDevCount;

import java.util.Date;
import java.util.List;

/**关于对agent_data数据表的接口**/
public interface IAgentData {

    /**获取所有设备信息**/
    public Page<AgentData> getAllDevice(int pageno,int limit);

    /**筛选所有设备**/
    Page<AgentData> searchDeviceByParam(String content,String agentname,String[] projectid,String state,int pageno,int limit);

    /**筛选所有设备不根据权限限制**/
    Page<AgentData> findDeviceByParam(String content,String agentname,String projectid,String state,int pageno,int limit);


    /**获取设备表所有数据通过公司id**/
    Page<AgentData> getAllDeviceByComid(String Companyid,int pageno,int limit);

    /**查询当前项目旗下的所有设备（分页）**/
    public Page<AgentData> getAllDeviceByGroupid(String Groupid,int pageno,int limit);

    /**不同权限查询设备表内数据**/
    Page<AgentDataDao> getDeviceByParams(int pageno, int limit,String userid);

    /**查找未关联的设备**/
    Page<AgentDataDao> getOutDeviceById(String projectid,int pageno,int limit,int type);

    /**根据参数查找未关联设备**/
    Page<AgentDataDao> searchOutDeviceByParam(String agentnum,String content, int pageno, int limit, String type, String role);

    /**删除关联设备**/
    void deleteDeviceByGroupid(String sn);

    /**添加关联设备**/
    void insertDeviceById(String projectid,String sn);

    /**增删改**/
    void editDevice(String sn,String machinename);

    void addDevice(String sn, String comid, String state, String machinename);

    void deleteDevice(String sn);

    boolean isExitsn(String sn);

    /**获取账号所属设备的数目，在线离线情况**/
    ProDevCount getDevCountAdmin();

    /**获取公司旗下所有设备数目**/
    ProDevCount getDeviceCountByComid(String comid);

    /**获取用户属下的所有设备数目**/
    ProDevCount getDeviceCountByUserid(String[] authoritys);
}
