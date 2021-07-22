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
    public void deleteDeviceByGroupid(String sn){
        dal.deleteDeviceByGroupid(sn);
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
        dal.addDevice(agentData.getMachineName(),agentData.getAgentNumber(),state,agentData.getMachineName());
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
                break;
            case "rtkPos":
                break;
            case "imuWarn":
                break;
            case "rawName":
                break;
            case "rawMode":
                break;
            case "recordInterval":
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
                break;
            case "resultRs232":
                break;
            case "resultImu":
                break;
            case "secondBase":
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
                break;
            case "resultSmooth":
                break;
            case "resultStatus":
                break;
            case "extSensorEnabled":
                break;
            case "extSensorCmd":
                break;
            case "extSensorPower":
                break;
            case "scheduler":
                break;
            case "moveWarnEnabled":
                break;
            case "moveWarnThreshold":
                break;
            case "moveWarnBaud":
                break;
            case "moveWarnCmd":
                break;
            case "dzIotEnabled":
                break;
            case "dzIotId":
                break;
            case "dzIotIp":
                break;
            case "dzIotPort":
                break;
            case "dzIotKey":
                break;
            case "dzIotGnssData":
                break;
            case "cqIotEnabled":
                break;
            case "cqIotTelecom":
                break;
            case "cqIotId":
                break;
            case "cqIotUser":
                break;
            case "cqIotKey":
                break;
            case "cqIotStatus":
                break;
            case "oneNetEnabled":
                break;
            case "oneNetId":
                break;
            case "oneNetUser":
                break;
            case "oneNetKey":
                break;
            case "oneNetGnssData":
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
                break;
            case "networkApn":
                break;
            case "networkApnUser":
                break;
            case "networkApnPass":
                break;
            case "networkMode":
                break;
            case "networkAddress":
                realorder=OrderConstants.NETWORK_ADDR;
                break;
            case "networkPort":
                realorder=OrderConstants.NETWORK_PORT;
                break;
            case "networkMountpoint":
                break;
            case "networkMountpointPass":
                realorder=OrderConstants.NETWORK_MOUNTPOINTUSERPASS;
                break;
            case "networkUploadGga":
                break;
            case "coordcvtEnabled":
                break;
            case "coordcvtSrcDatum":
                break;
            case "coordcvtDstDatum":
                break;
            case "coordcvtSevenParam":
                break;
            case "coordcvtFourParam":
                break;
            case "coordcvtProjParam":
                break;
            case "smsWakeup":
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
                break;
            case "rawBackAddress":
                break;
            case "rawBackPort":
                break;
            case "rawBackGnssData":
                break;
            case "rawBackUser":
                break;
            case "rawBackPass":
                break;
            case "rawBackBaud":
                break;
            case "dzIotRtkResult":
                break;
            case "moveWarnMems":
                break;
            case "ntrIpBase":
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
                break;
            case "accessKey":
                break;
        }
        return realorder;
    }
}
