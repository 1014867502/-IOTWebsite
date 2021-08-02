package com.webmonitor.admin.devicelist;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.dal.CacheMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.idal.ICache;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.MachineData;
import com.webmonitor.core.model.MachineInfoEntity;
import com.webmonitor.core.util.OrderConstants;
import com.webmonitor.core.util.Tools;
import net.sf.ehcache.search.expression.Or;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

public class DeviceListService {
    public static final DeviceListService me = new DeviceListService();
    private static IAgentData dal=new AgentDataMysqlDAL();
    private static ICache cache=new CacheMysqlDAL();

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
    public void deleteDeviceBySerial(String sn){
        dal.deleteDeviceBySerial(sn);
    }

    /**删除关联设备**/
    public void reductionDeviceBySerial(String sn){
        dal.reductionDeviceBySerial(sn);
    }

    /**根据公司id查找对应的设备**/
    public Page<AgentData> getDeviceByComid(String comid,int pageno,int limit){
       return dal.getAllDeviceByComid(comid,pageno,limit);
    }

    public Page<AgentData> getAllDeviceByGroupid(String Groupid,int pageno,int limit){
        return dal.getAllDeviceByGroupid(Groupid, pageno, limit);
    }


    public static boolean checkObjAllFieldsIsNull(String machineserial,Object object) {
        String username="";
        String userpass="";
        if (null == object) {
            return false;
        }
        try {
            Gson gson = new Gson();
            MachineData machineData=MachineData.dao.findFirst("select * from machine_data where machineSerial='"+machineserial+"'");
            MachineInfoEntity agentDataDao1= gson.fromJson(machineData.toJson(), new TypeToken<MachineInfoEntity>(){}.getType());
            List<String> ListData= Tools.getListData(agentDataDao1,object);
            for (Field f : object.getClass().getDeclaredFields()) {
                f.setAccessible(true);
                if (f.get(object) != null) {
                    if(f.getName().equals("networkMountpointUse")){
                        username=username+f.get(object);
                    }
                    if(!username.equals("")&&f.getName().equals("networkMountpointPass")){
                        userpass=username+"|"+f.get(object);
                    }
                    if(ListData.contains(f.getName())){
                        String order=getOrder(f.getName());
                        if(!order.equals("")){
                            String path=order.substring(4,order.length()-1);
                            String value=order+f.get(object);
                            cache.add(machineserial,path,value);
                        }
                        if(order.equals("SET,NETWORK.MOUNTPOINTUSERPASS,")){
                            String path=order.substring(4,order.length()-1);
                            String value=order+userpass;
                            cache.add(machineserial,path,value);
                        }
                    }
                }
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**添加新设备**/
    public void addDevice(AgentData agentData){
        String state=String.valueOf(agentData.getOnlineState());
        dal.addDevice(agentData.getMachineSerial(),agentData.getAgentNumber(),state,agentData.getMachineName());
    }

    public static String getOrder(String order){
        String realorder="";
        switch(order){
            case "machineModel":
                break;
            case "mcuVer":
                break;
            case "firmwareVer":
                break;
            case "puwerLever":
                break;
            case "extVoltage":
                break;
            case "insideSpace":
                break;
            case "dataLink":
                break;
            case "timeZone":
                realorder=OrderConstants.TIMEZONE_Order;
                break;
            case "rtkPos":
                realorder=OrderConstants.RTK_POS_Order;
                break;
            case "imuWarn":
                realorder=OrderConstants.IMU_WARN_Order;
                break;
            case "rawName":
                realorder=OrderConstants.Name_Order;
                break;
            case "rawMode":
                realorder=OrderConstants.RAW_MODE_Order;
                break;
            case "recordInterval":
                realorder=OrderConstants.Interval_Order;
                break;
            case "rawIp":
                realorder=OrderConstants.RAW_IP_Order;
                break;
            case "rawPort":
                realorder=OrderConstants.RAW_Port_Order;
                break;
            case "resultIp":
                realorder=OrderConstants.RESULT_IP_Order;
                break;
            case "resultPort":
                realorder=OrderConstants.RESULT_PORT_Order;
                break;
            case "resultMsg":
                realorder=OrderConstants.RESULT_MSG_Order;
                break;
            case "resultRs232":
                realorder=OrderConstants.RESULT_RS232_Order;
                break;
            case "resultImu":
                realorder=OrderConstants.RESULT_IMU_Order;
                break;
            case "secondBase":
                realorder=OrderConstants.SECOND_BASE_Order;
                break;
            case "secondIp":
                realorder=OrderConstants.SECOND_IP_Order;
                break;
            case "secondPort":
                realorder=OrderConstants.SECOND_PORT_Order;
                break;
            case "rawRate":
                realorder=OrderConstants.RAW_RATE_Order;
                break;
            case "doubleInv":
                realorder=OrderConstants.RAW_DOUBLE_INV_Order;
                break;
            case "resultSmooth":
                realorder=OrderConstants.RESULT_SMOOTH_Order;
                break;
//            case "resultStatus":
//                break;
            case "extSensorEnabled":
                realorder=OrderConstants.ENABLED_Order;
                break;
            case "extSensorCmd":

                break;
            case "extSensorPower":
                realorder=OrderConstants.SENSOR_POWER_Order;
                break;
            case "scheduler":
                realorder=OrderConstants.SCHEDULER_Order;
                break;
            case "moveWarnEnabled":
                realorder=OrderConstants.MOVE_WARN_Order;
                break;
            case "moveWarnThreshold":
                realorder=OrderConstants.MOVE_WARN_THRESHOLD_Order;
                break;
            case "moveWarnBaud":
                realorder=OrderConstants.WARN_BAUD_Order;
                break;
            case "moveWarnCmd":
                realorder=OrderConstants.MOVE_WARN_CMD;
                break;
            case "dzIotEnabled":
                realorder=OrderConstants.DZ_IOT_ENABLED_Order;
                break;
            case "dzIotId":
                realorder=OrderConstants.DZ_IOT_ID_Order;
                break;
            case "dzIotIp":
                realorder=OrderConstants.DZ_IOT_IP_Order;
                break;
            case "dzIotPort":
                realorder=OrderConstants.DZ_IOT_PORT_Order;
                break;
            case "dzIotKey":
                realorder=OrderConstants.DZ_IOT_KEY_Order;
                break;
            case "dzIotGnssData":
                realorder=OrderConstants.DZ_IOT_GNSS_DATA_Order;
                break;
            case "cqIotEnabled":
                realorder=OrderConstants.CHONGQING_IOT_ENABLED_Order;
                break;
            case "cqIotTelecom":
                realorder=OrderConstants.CHONGQING_IOT_TELECOM;
                break;
            case "cqIotId":
                realorder=OrderConstants.CHONGQING_IOT_ID;
                break;
            case "cqIotUser":
                realorder=OrderConstants.CHONGQING_IOT_USER;
                break;
            case "cqIotKey":
                realorder=OrderConstants.CHONGQING_IOT_KEY;
                break;
            case "cqIotStatus":
                realorder=OrderConstants.CHONGQING_IOT_STATUS;
                break;
            case "oneNetEnabled":
                realorder=OrderConstants.ONENET_ENABLED;
                break;
            case "oneNetId":
                realorder=OrderConstants.ONENET_ID;
                break;
            case "oneNetUser":
                realorder=OrderConstants.ONENET_USER;
                break;
            case "oneNetKey":
                realorder=OrderConstants.ONENET_KEY;
                break;
            case "oneNetGnssData":
                realorder=OrderConstants.ONENET_GNSS_DATAD;
                break;
            case "wifiMode":
                break;
            case "wifiSsid":
                break;
            case "wifiPass":
                break;
            case "wifiDhcp":
                break;
            case "wifiMask":
                break;
            case "wifiGateway":
                break;
            case "wifiDns1":
                break;
            case "wifDns2":
                break;
            case "wifiExtAntenna":
                break;
            case "wifiBand":
                break;
            case "wifiSignalLevel":
                break;
            case "wifiPrefix":
                break;
            case "wifiApPass":
                break;
            case "wifiIp":
                break;
            case "networkStatus":
                break;
            case "networksignalLevel":
                break;
            case "networkEnabled":
                realorder=OrderConstants.NETWORK_ENABLED;
                break;
            case "networkApn":
                realorder=OrderConstants.NETWORK_APN;
                break;
            case "networkApnUser":
                realorder=OrderConstants.NETWORK_APNUSER;
                break;
            case "networkApnPass":
                realorder=OrderConstants.NETWORK_APNPASS;
                break;
            case "networkMode":
                realorder=OrderConstants.NETWORK_MODE;
                break;
            case "networkAddress":
                realorder=OrderConstants.NETWORK_ADDR;
                break;
            case "networkPort":
                realorder=OrderConstants.NETWORK_PORT;
                break;
            case "networkMountpoint":
                realorder=OrderConstants.NETWORK_MOUNTPOINT;
                break;
            case "networkMountpointPass":
                realorder=OrderConstants.NETWORK_MOUNTPOINTUSERPASS;
                break;
            case "networkUploadGga":
                realorder=OrderConstants.NETWORK_UPLOADGGA;
                break;
            case "coordcvtEnabled":
                realorder=OrderConstants.COORDCVT_ENABLED;
                break;
            case "coordcvtSrcDatum":

                break;
            case "coordcvtDstDatum":
                realorder=OrderConstants.COORDCVT_DST_DATUM;
                break;
            case "coordcvtSevenParam":
                realorder=OrderConstants.SEVEN_PARAM;
                break;
            case "coordcvtFourParam":
                realorder=OrderConstants.FOUR_PARAM;
                break;
            case "coordcvtProjParam":
                realorder=OrderConstants.COORDCVT_PROJ_PARAM;
                break;
            case "smsWakeup":
                realorder=OrderConstants.SMS_WAKEUP_Order;
                break;
            case "coordinatesX":
                realorder=OrderConstants.DEVICE_COORDINATES_X;
                break;
            case "coordinatesY":
                realorder=OrderConstants.DEVICE_COORDINATES_Y;
                break;
            case "coordinatesZ":
                realorder=OrderConstants.DEVICE_COORDINATES_Z;
                break;
            case "rawBackEnabled":
                realorder=OrderConstants.RAW_BACK_ENABLED;
                break;
            case "rawBackAddress":
                realorder=OrderConstants.RAW_BACK_ADDR;
                break;
            case "rawBackPort":
                realorder=OrderConstants.RAW_BACK_PORT;
                break;
            case "rawBackGnssData":
                realorder=OrderConstants.RAW_BACK_GNSS_DATA;
                break;
            case "rawBackUser":
                realorder=OrderConstants.RAW_BACK_USER;
                break;
            case "rawBackPass":
                realorder=OrderConstants.RAW_BACK_PASS;
                break;
            case "rawBackBaud":
                realorder=OrderConstants.RAW_BACK_BAUD;
                break;
            case "dzIotRtkResult":
                realorder=OrderConstants.DZ_IOT_RTK;
                break;
            case "moveWarnMems":
                realorder=OrderConstants.MOVE_WARN_MEMS;
                break;
            case "ntrIpBase":
                realorder=OrderConstants.RAW_NTRIP_BASE;
                break;
            case "connectState":
                break;
            case "baseLon":
                realorder= OrderConstants.GPS_BASE_LON;
                break;
            case "baseLat":
                realorder=OrderConstants.GPS_BASE_LAT;
                break;
            case "baseHeight":
                realorder=OrderConstants.GPS_BASE_HEIGHT;
                break;
            case "oneNetMode":
                realorder=OrderConstants.ONENET_MODE;
                break;
            case "accessKey":
                break;
            case "dzIotHttp":
                realorder=OrderConstants.DZ_IOT_HTTP_Order;
        }
        return realorder;
    }
}
