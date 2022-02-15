package com.webmonitor.admin.devicelist;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.dal.CacheMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.idal.ICache;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.BaseDevicemap;
import com.webmonitor.core.model.userbase.DeviceSensorList;
import com.webmonitor.core.util.OrderConstants;
import com.webmonitor.core.util.SocketTools;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.ExceptionUtil;
import net.sf.ehcache.search.expression.Or;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.webmonitor.core.dal.AgentDataMysqlDAL.getSubString;


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

    /*修改设备归属*/
    public void changeDeviceAgentBySerial(String sn,String agentnum){
        dal.updateDeivceAgentBySerial(sn,agentnum);
    }

    /*批量修改设备归属*/
    public void changeDeviceAgentByList(List<AgentData> list,String agentnum){
        for(int i=0;i<list.size();i++){
            dal.updateDeivceAgentBySerial(list.get(i).getMachineSerial(),agentnum);
        }
    }

    /**删除关联设备**/
    public void deleteDeviceBySerial(String sn){
        dal.deleteDeviceBySerial(sn);
    }

    /**批量删除关联设备**/
    public void deleteDeviceBylist(String sn){
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


    public static boolean  checkObjAllFieldsIsNull(String userid,String machineserial,Object object) {
        String username="";
        String userpass="";
        int commands=0;
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
                        if(order.equals("SET,NETWORK.MOUNTPOINTUSERPASS,")){
                            String path=order.substring(4,order.length()-1);
                            String value=order+userpass;
                            cache.add(machineserial,path,value);
                            System.out.println(path+value);
                            commands++;
                        }
                        if(!order.equals("")&&!order.equals("SET,NETWORK.MOUNTPOINTUSERPASS,")){
                            String path=order.substring(4,order.length()-1);
                            String value=order+f.get(object);
                            cache.add(machineserial,path,value);
                            System.out.println(path+value);
                            commands++;
                        }
                    }
                }
            }
            if(commands>0){
                SocketTools socketTools = new SocketTools();
                socketTools.updateSocket(userid,machineserial);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**获取设备更新状态**/
    public UpdateData getUpdateState(String machineSerial){
        UpdateData updateData=UpdateData.dao.findFirst("select * from update_data where machineSerial='"+machineSerial+"'");
        return updateData;
    }


    /**获取设备更新详情**/
    public String getDeviceUpdateDetail(String machineSerial){
        MachineData machineData=MachineData.dao.findFirst("select * from machine_data where machineSerial='"+machineSerial+"'");
        String version="";
        UpdateData updateData=UpdateData.dao.findFirst("select * from update_data order by updateTime desc limit 0,1");
        String time="";
        if(updateData!=null){
            time=updateData.getUpdateTime()==null?"":updateData.getUpdateTime();
        }
        version=machineData.getFirmwareVer()==null?"":machineData.getFirmwareVer();
        return time+","+version;

    }

    /**判断设备是否是最新版本**/
    public boolean isLatestVersion(String machineSerial){
        MachineData machineData=MachineData.dao.findFirst("select * from machine_data where machineSerial='"+machineSerial+"'");
        if(machineData.getFirmwareVer()!=null&&!machineData.getFirmwareVer().equals("")){
                String devicetype= AgentDataDao.dao.findFirst("select * from agent_data where machineSerial='"+machineSerial+"'").getFirmwareType();
                String version=machineData.getFirmwareVer().substring(4,12);
                VersionData versionData=VersionData.dao.findFirst("select * from version_data where downloadUrl='"+devicetype+"'");
                String latest=versionData.getVersionCode().toString();
                if(Integer.parseInt(version)>=Integer.parseInt(latest)){
                    return true;
                }else{
                    return false;
                }
        }else {
            return false;
        }
    }

    /**判断设备是否在线**/
    public boolean isDeviceOnline(String machineserial){
        boolean result=false;
        MachineData machineData=MachineData.dao.findFirst("select * from machine_data where machineSerial='"+machineserial+"'");
//        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//注意月份是MM
//        if(machineData.getUpdateTime()!=null) {
//            try {
//                Date date = simpleDateFormat.parse(machineData.getUpdateTime().replace('/', '-'));
//                Date now = new Date();
//                long ts = now.getTime() - date.getTime();
//                int time = (int) (ts / 3600000);//超过一小时就视作离线
//                if (time > 0) {
//                    result=false;
//                } else {
//                   result=true;
//                }
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//        }
        if(machineData.getConnectState()==1){
            result=true;
        }
        return result;
    }

    /**添加新设备**/
    public void addDevice(AgentData agentData){
        String state=String.valueOf(agentData.getOnlineState());
        dal.addDevice(agentData.getMachineSerial(),agentData.getAgentNumber(),state,agentData.getMachineName());
    }

    /**获取外接传感器列表**/
    public Page<DeviceSensorList> getDeviceSensorList(String machineserial,int pageno,int limit){
        return dal.getDeivceSensorList(machineserial,pageno,limit);
    }

    /**添加传感器**/
    public void addSensorByData(DeviceSensorList deviceSensorList,String machineserial){
        String add="";
        String sql="select extSensorCmd from machine_data where machineSerial='"+machineserial+"'";
        String str1=deviceSensorList.getInterval()+";"+deviceSensorList.getVoltage()+";8N1@"+deviceSensorList.getBruad()+";"+deviceSensorList.getCmd()+";"+deviceSensorList.getSn()+";"+deviceSensorList.getType()+";"+
                deviceSensorList.getVender()+";"+deviceSensorList.getRef();
        String result=Db.findFirst(sql).getStr("extSensorCmd");
        if(result.equals("")){
            add=str1;
        }else{
            add=result+"|"+str1;
        }
        String realorder=getOrder("extSensorCmd");
        String path=realorder.substring(4,realorder.length()-1);
        String value=realorder+add;
        cache.add(machineserial,path,value);
        dal.addSensorByData(deviceSensorList,machineserial);
    }

    /**删除传感器**/
    public void delSensorByData(DeviceSensorList deviceSensorList,String machineserial){
        String sql="select extSensorCmd from machine_data where machineSerial='"+machineserial+"'";
        String result=Db.findFirst(sql).getStr("extSensorCmd");
        String str1=deviceSensorList.getInterval()+";"+deviceSensorList.getVoltage()+";"+deviceSensorList.getBruad()+";"+deviceSensorList.getCmd()+";"+deviceSensorList.getSn()+";"+deviceSensorList.getType()+";"+
                deviceSensorList.getVender()+";"+deviceSensorList.getRef();
        String realorder=getOrder("extSensorCmd");
        String afterdel=getSubString(result,str1);
        String path=realorder.substring(4,realorder.length()-1);
        String value=realorder+afterdel;
        cache.add(machineserial,path,value);
        dal.delSensorByData(deviceSensorList,machineserial);
    }

    /**获取设备的更新信息**/
    public Page<UpdateData> getUpdateDataBySerial(String machineserial,int pageno,int limit){
        return dal.getDeviceUpdatelog(machineserial, pageno, limit);
    }



//    /**执行上传文件(可自选)**/
//    public String excuteUpload(HashMap<String,Integer> agentFile,File file){
//        try {
//            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file),"GBK"));//换成你的文件名
//            String head=reader.readLine();//第一行信息，为标题信息，不用,如果需要，注释掉
//            String[] heads=head.split(",");
//            boolean columsbool=true;
//            String line = null;
//            while((line=reader.readLine())!=null){
//                String colums="";//插入语句的列名
//                String insertvalue="";//插入语句的数值
//                String[] values=line.split(",");
//                for(Map.Entry<String,Integer>entry:agentFile.entrySet()){
//                    colums+=","+entry.getKey();
//                   insertvalue+=",'"+values[entry.getValue()].replace('/','-')+"'";
//                }
//                insertvalue=insertvalue.substring(1,insertvalue.length());
//                colums=colums.substring(1,colums.length());
//                columsbool=false;
//                String sql="REPLACE INTO  agent_data  "+"(" + colums + ",ProGroupId)VALUES(" + insertvalue+ ",'0')";
//                Db.query(sql);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "文件上传失败";
//        }
//        return "文件上传成功！";
//    }



    public Map<String, Object> XYZToBLH(double SourceX, double SourceY, double SourceZ){
        Map<String, Object> map = new HashMap<String, Object>();
        double destinationB=0,destinationL=0,destinationH=0;
        double da = 6378137.0;
        double df = 298.257223563;

        double e2;
        double A,F;
        double N;
        F=1.0/df;
        A=da;
        e2 = 2 * F - F * F;
        double dl=Math.atan2(SourceY, SourceX);
        destinationL=dl;

        double b1,b2,h1,h2;
        h1=Math.sqrt(Math.pow(SourceX,2)+Math.pow(SourceY,2)+Math.pow(SourceZ,2))-A;
        b1=Math.atan2((SourceZ/Math.sqrt(SourceX*SourceX+SourceY*SourceY)),(1.-e2*A/(A+h1)));

        if (Math.abs(SourceZ) < 1E-4)
        {
            destinationB = 0;
            destinationL = 0;
            destinationH = 0;
            map.put("DesB",destinationB);
            map.put("DesL",destinationL);
            map.put("DesH",destinationH);
            return map;
        }

        do
        {
            N=A/(Math.sqrt(1.-e2*Math.sin(b1)*Math.sin(b1)));
            h2=h1;b2=b1;
            h1=SourceZ/Math.sin(b1)-N*(1-e2);
            b1=Math.atan2((SourceZ/Math.sqrt(SourceX*SourceX+SourceY*SourceY)),(1.-e2*N/(N+h1)));

        }while(Math.abs(b2-b1)>Math.pow(10.0,-11)||Math.abs(h2-h1)>Math.pow(10.0,-5));

        destinationB=b1;
        N=A/(Math.sqrt(1.-e2*Math.sin(b1)*Math.sin(b1)));
        destinationH=SourceZ/Math.sin(b1)-N*(1-e2);
        destinationB = destinationB*180.0/Math.PI;
        destinationL = destinationL*180.0/Math.PI;
        map.put("DesB",destinationB);
        map.put("DesL",destinationL);
        map.put("DesH",destinationH);
        return map;
    }

    /**大地坐标转xyz**/
    public Map<String, Object> WGS84_BLHtoXYZ(double dB, double dL , double dH)
    {

        Map<String, Object> map = new HashMap<String, Object>();

        double XYZCorX,XYZCorY,XYZCorZ;
        double DB,DL;

        double e2;
        double cosb, sinb;
        double F;
        double N;

        F = 1.0 / 298.257223563;
        DB = dB * Math.PI / 180.0;
        DL = dL * Math.PI / 180.0;
        e2 = 2 * F - F * F;
        cosb = Math.cos(DB); sinb = Math.sin(DB);
        N = 6378137.0 / (Math.sqrt(1.0- e2 * sinb * sinb));
        XYZCorX = (N + DB) * cosb * Math.cos(DL);
        XYZCorY = (N + dH) * cosb * Math.sin(DL);
        XYZCorZ= (N * (1.0 - e2) + dH) * sinb;

        map.put("EcefX",XYZCorX);
        map.put("EcefY",XYZCorY);
        map.put("EcefZ",XYZCorZ);

        return  map;
    }

    /**获取项目内设备的的位置和信息**/
    public List<BaseDevicemap> getProjectGnssDevices(String projectid){
        return dal.getProjectGnssDevices(projectid);
    }

    /**获取设备的的位置和信息**/
    public BaseDevicemap getGnssDevicesBySn(String sn){
        return dal.getGnssDevicesBySn(sn);
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
                realorder=OrderConstants.EXT_SENSOR_CMD;
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
            case "rawSolution":
                realorder=OrderConstants.RAW_SOLUTION;
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
            case "secondNtripBase":
                realorder=OrderConstants.RAW_SECOND_NTRIP_BASE;
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
                break;
            case "ntripArg":
                realorder=OrderConstants.RAW_NTRIP_ARG;
                break;
            case "secondArg":
                realorder=OrderConstants.RAW_SECOND_NTRIP_ARG;
                break;
            case "gkCloudEnabled":
                realorder=OrderConstants.GK_CLOUD_ENABLED;
                break;
            case "gkCloudIp":
                realorder=OrderConstants.GK_CLOUD_IP;
                break;
            case "gkCloudChannel":
                realorder=OrderConstants.GK_CLOUD_CHANNEL;
                break;
            case "gkCloudID":
                realorder=OrderConstants.GK_CLOUD_ID;
                break;
            case "gkCloudPort":
                realorder=OrderConstants.GK_CLOUD_PORT;
                break;
            case "lianZhiEnabled":
                realorder=OrderConstants.LIANZHI_ENABLED;
                break;
            case "lianZhiIp":
                realorder=OrderConstants.LIANZHI_IP;
                break;
            case "lianZhiPort":
                realorder=OrderConstants.LIANZHI_PORT;
                break;
            case "lianZhiId":
                realorder=OrderConstants.LIANZHI_ID;
                break;
            case "lianZhiPhoneNum":
                realorder=OrderConstants.LIANZHI_PHONE_NUMBER;
                break;
            case "lianZhiGnssData":
                realorder=OrderConstants.LIANZHI_GNSS_DATA;
                break;
            case "wuLingEnabled":
                realorder=OrderConstants.WULING_ENABLED;
                break;
            case "wuLingId":
                realorder=OrderConstants.WULING_ID;
                break;
            case "wuLingUser":
                realorder=OrderConstants.WULING_USER;
                break;
            case "wuLingKey":
                realorder=OrderConstants.WULING_KEY;
                break;
            case "wuLingInterval":
                realorder=OrderConstants.WULING_INTERVAL;
        }
        return realorder;
    }
}
