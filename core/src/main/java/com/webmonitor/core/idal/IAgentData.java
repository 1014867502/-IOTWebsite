package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.BaseDevicemap;
import com.webmonitor.core.model.userbase.DeviceSensorList;
import com.webmonitor.core.model.userbase.Templates;

import java.util.Date;
import java.util.List;

/**关于对agent_data数据表的接口**/
public interface IAgentData {

    /**获取所有设备信息**/
    public Page<AgentData> getAllDevice(int pageno,int limit);

    List<BaseDevicemap> getProjectGnssDevices(String projectid);

    BaseDevicemap getGnssDevicesBySn(String sn);

    /**筛选所有设备**/
    Page<AgentData> searchDeviceByParam(String type,String content,String agentNum,String[] projectid,String state,int pageno,int limit);

    /**公司详情页上的搜索框**/
    Page<AgentData> searchDeviceByCom(String content,String agentnum,String state,int pageno,int limit);

    /**筛选所有设备不根据权限限制**/
    Page<AgentData> findDeviceByParam(String content,String agentname,String projectid,String state,int pageno,int limit);


    /**获取设备表所有数据通过公司id**/
    Page<AgentData> getAllDeviceByComid(String Companyid,int pageno,int limit);

    /**查询当前项目旗下的所有设备（分页）**/
    public Page<AgentData> getAllDeviceByGroupid(String Groupid,int pageno,int limit);

    /**不同权限查询设备表内数据**/
    Page<AgentData> getDeviceByParams(int pageno, int limit,String userid);

    /**查找未关联的设备**/
    Page<AgentDataDao> getOutDeviceById(String projectid,int pageno,int limit,int type);

    /**根据参数查找未关联设备**/
    Page<AgentDataDao> searchOutDeviceByParam(String agentnum,String content, int pageno, int limit, String type, String role);

    /**根据设备serial码获取设备相关信息**/
    AgentData getDeviceDetailBySn(String machineserial);

    /**根据设备serial码获取设备相关信息**/
    boolean isExistDeviceDetailBySn(String machineserial);

    /**取消关联设备（项目）**/
    void deleteDeviceBySerial(String sn);

    /**取消关联设备（全局）**/
    void reductionDeviceBySerial(String sn);

    /**添加关联设备**/
    void insertDeviceById(String projectid,String sn);

    /**修改设备的归属**/
    void updateDeivceAgentBySerial(String sn,String agentnum);

    /**增删改**/
    void editDevice(String sn,String machinename);

    void addDevice(String sn, String comid, String state, String machinename);

    /**删除表中数据**/
    void deleteDevice(int id);

    boolean isExitsn(String sn);

    /**获取账号所属设备的数目，在线离线情况**/
    ProDevCount getDevCountAdmin();

    /**获取公司旗下所有设备数目**/
    ProDevCount getDeviceCountByComid(String comid);

    /**获取设备外接传感器列表**/
    Page<DeviceSensorList> getDeivceSensorList(String machineserial,int pageno,int limit);

    /**获取用户属下的所有设备数目**/
    ProDevCount getDeviceCountByUserid(String[] authoritys,String agentNumber);


    /**添加设备的传感器**/
    void addSensorByData(DeviceSensorList deviceSensorList,String machineserial);

    /**删除设备的传感器**/
    void delSensorByData(DeviceSensorList deviceSensorList,String machineserial);

    /**获取设备的更新记录**/
    Page<UpdateData> getDeviceUpdatelog(String machineserial,int pageno,int limit);

    /**首页上的搜索框**/
    Page<AgentData> seekDeviceByParam(StaffData currentuser, String content, String agentnum, String projectid, String state, int pageno, int limit);
}
