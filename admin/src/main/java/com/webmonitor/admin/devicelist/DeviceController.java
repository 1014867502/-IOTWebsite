package com.webmonitor.admin.devicelist;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.i18n.Res;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.upload.UploadFile;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.DeviceSensorList;
import com.webmonitor.core.model.userbase.ExportGNSSWord;
import com.webmonitor.core.util.*;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;
import net.sf.ehcache.util.PropertyUtil;
import sun.rmi.server.InactiveGroupException;

import java.awt.*;
import java.io.*;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.util.*;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.webmonitor.core.util.SocketTools.getIpAddress;


/**
 * 控制与设备数据相关操作
 **/
public class DeviceController extends BaseController {

    static HashMap<String, SocketClient> socketClientHashMap = new HashMap<String, SocketClient>();//用户的socket连接
    static HashMap<String, File> FileClientHashMap = new HashMap<>();
    static HashMap<String, UploadThread> ThreadHashMap = new HashMap<>();//执行线程；
    private boolean listenFlag = true;

    /**
     * 设备管理页面
     **/
    public void devicemanage() {
        String proid = getCookie(IndexService.me.accessProId);
        setAttr("projetid", proid);
        render("devicemanage.html");
    }

    /**
     * 快速设置
     **/
    public void fastsetting() {
        String userid = getCookie(IndexService.me.accessUserId);
        int writeright=StaffService.me.getStaffById(userid).getSetPermission();
        setAttr("writeright",writeright);
        render("fastsetting.html");
    }

    /**
     * 站点设置
     **/
    public void stationsetting() {
        String machinesn = getPara("machinedata");
        String useid=getLoginAccount().getUserName();
        String userid = getCookie(IndexService.me.accessUserId);
        String permission=StaffService.me.getStaffById(userid).getWebPermission();
        int writeright=StaffService.me.getStaffById(userid).getSetPermission();
        setAttr("writeright",writeright);
        setAttr("webauthority",permission);
        setAttr("machinedata", machinesn);
        render("stationsetting.html");
    }

    /**
     * 站点 解算设置
     **/
    public void stationcompute() {
        String machinesn = getPara("machinesn");
        setAttr("machinesn", machinesn);
        render("station_compute.html");
    }

    /**
     * 站点 坐标设置
     **/
    public void stationlocate() {
        String machinesn = getPara("machinesn");
        setAttr("machinesn", machinesn);
        render("station_locate.html");
    }

    /**
     * 站点 平台设置
     **/
    public void stationplatform() {
        String machinesn = getPara("machinesn");
        setAttr("machinesn", machinesn);
        render("station_platform.html");
    }

    /**
     * 站点 平台设置
     **/
    public void stationauxiliary() {
        String machinesn = getPara("machinesn");
        setAttr("machinesn", machinesn);
        render("station_auxiliary.html");
    }

    public void searchlist() {
        render("setting.html");
    }

    /**
     * 设备详情
     **/
    public void deviceinform() {
        String machinesn = getPara("machinedata");
        setAttr("machinedata", machinesn);
        render("device_inform.html");
    }

    /**
     * 设备其他设置
     **/
    public void deviceother() {
        String machinesn = getPara("machinedata");
        setAttr("machinedata", machinesn);
        render("device_othersetting.html");
    }

    /**
     * 配置页面
     **/
    public void setting() {
        Result result = Result.newOne();
        try {
            String sn = getPara("sn");
            String userid = getCookie(IndexService.me.accessUserId);
            String permission=StaffService.me.getStaffById(userid).getWebPermission();
            setAttr("webauthority",permission);
            setAttr("machinedata", sn);
            render("setting.html");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
    }

    /**
     * 下发命令页面
     **/
    public void deviceorder() {
        Result result = Result.newOne();
        try {
            String sn = getPara("sn");
            setAttr("machinedata", sn);
            render("order.html");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
    }

    /**
     * 配置日志页面
     **/
    public void deviceorderlog() {
        Result result = Result.newOne();
        try {
            String sn = getPara("sn");
            setAttr("machinedata", sn);
            render("device_orderlog.html");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
    }

    /**
     * 不同角色查询项目相关的设备列表
     **/
    public void getDeviceList() {
        Result<Page<AgentData>> result = Result.newOne();
        String id = getPara("userid");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try {
            Page<AgentData> page = AgentDataService.me.getDevicelistByParam(pageno, limit, id);
            result.success(page);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 获取未关联的设备列表
     **/
    public void getUnconnectDev() {
        String id = getPara("agentnum");
        int type = 0;
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        String authority = currentuser.getGroupAssemble();
//        int roletype = currentuser.getIRoleType();
//        RoleType role = RoleType.getIndex(roletype);
//        switch (role){
//            case user:type=1;break;
//            case companyadmin:type=1;break;
//            case superadmin:type=0;break;
//        }
        Result<Page<AgentDataDao>> result = Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 20);
        try {
            Page<AgentDataDao> agentDataDaos = DeviceListService.me.getUnconnectDeviceById(id, pageno, limit, type);
            result.success(agentDataDaos);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 获取单个设备的详情
     **/
    public void getDeviceSetting() {
        String sn = getPara("machineSerial");
        Result result = Result.newOne();
        String sql = "select * from machine_data where machineSerial='" + sn + "'";
        MachineData machineData = Optional.ofNullable(MachineData.dao.findFirst(sql))
                .orElseGet(MachineData::new);
        int second = Integer.parseInt(machineData.getRecordInterval()) * 3600;
        machineData.setRecordInterval(String.valueOf(second));
        result.success(machineData);
        renderJson(result);
    }

    /**
     * 搜索未关联设备列表
     **/
    public void searchUnconnectDev() {
        String agentnum = getPara("agentnum");
        String content = getPara("content");
        String type = getPara("type");
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        String authority = currentuser.getGroupAssemble();
        int roletype = currentuser.getIRoleType();
        RoleType role = RoleType.getIndex(roletype);
        String roles = "";
//        switch (role){
//            case user:roles="consumer";break;
//            case companyadmin:roles="consumer";break;
//            case superadmin:roles="admin";break;
//        }
        roles = "consumer";
        Result<Page<AgentDataDao>> result = Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 20);
        try {
            Page<AgentDataDao> agentDataDaos = DeviceListService.me.searchOutDevByParam(agentnum, content, pageno, limit, type, roles);//
            result.success(agentDataDaos);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 修改未关联设备
     **/
    public void changeConDev() {
        Result result = Result.newOne();
        String json = getPara("connectdevice");
        String projectid = getPara("projectid");
        Gson gson = new Gson();
        List<AgentTabll> agentDataDao = gson.fromJson(json, new TypeToken<List<AgentTabll>>() {
        }.getType());
        for (int i = 0; i < agentDataDao.size(); i++) {
            DeviceListService.me.insertDeviceById(projectid, agentDataDao.get(i).getMachineSerial());
        }
        renderJson(result.success("success"));
    }


    /**
     * 删除关联设备（项目）
     **/
    public void delConnectDev() {
        Result result = Result.newOne();
        String sn = getPara("sn");
        try {
            DeviceListService.me.deleteDeviceBySerial(sn);
            result.success("success");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);

        }
        renderJson(result);
    }

    /**
     * 批量删除关联设备
     **/
    public void delConnectDevlist() {
        Result result = Result.newOne();
        String json = getPara("json");
        try {
            Gson gson = new Gson();
            List<MachineInfoEntity> agentDataDao = gson.fromJson(json, new TypeToken<List<MachineInfoEntity>>() {
            }.getType());
            for (int i = 0; i < agentDataDao.size(); i++) {
                DeviceListService.me.deleteDeviceBySerial(agentDataDao.get(i).getMachineSerial());
            }
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);

        }
        renderJson(result);
    }

    /**
     * 删除关联设备（项目）
     **/
    public void reductionDev() {
        Result result = Result.newOne();
        String sn = getPara("sn");
        try {
            DeviceListService.me.reductionDeviceBySerial(sn);
            result.success("success");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);

        }
        renderJson(result);
    }

    /**
     * 根据不同角色权限进行筛选设备
     **/
    public void searchDevice() {
        Result<Page<AgentData>> result = Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        String content = getPara("sn");
        String[] projects = new String[20];
        String state = getPara("state");
        StaffData currentuser = StaffService.me.getStaffById(userid);
        String agentnum = (getPara("agentNumber") != null ? getPara("agentNumber") : currentuser.getAgentNumber());
        String authority = currentuser.getGroupAssemble();
        if (authority.length() > 0) {
            projects = authority.split("@");
        }
        try {
            if (state.equals("3")) {
                Page<AgentData> agentDataList = AgentDataService.me.getDevicelistByParam(pageno, limit, currentuser.getUAccountNum());
                result.success(agentDataList);
            } else {
                Page<AgentData> agentDataList = AgentDataService.me.searchDeviceByParam(currentuser.getIRoleType().toString(), content, agentnum, projects, state, pageno, limit);
                result.success(agentDataList);
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 搜索设备（首页）
     **/
    public void findDeviceByParam() {
        Result<Page<AgentData>> result = Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);

        String content = getPara("sn");
        String state = getPara("state");
        String projectid = getPara("projectid");
        String agentnum = getPara("comid");
        StaffData currentuser = StaffService.me.getStaffById(userid);
        int roletype = currentuser.getIRoleType();
        try {
            Page<AgentData> agentDataList = AgentDataService.me.seekDeviceByParam(currentuser, content, agentnum, projectid, state, pageno, limit);
            result.success(agentDataList);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }


    /**
     * 根据不同的条件筛选设备
     **/
    public void searchDeviceByCom() {
        Result<Page<AgentData>> result = Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        String content = getPara("sn");
        String agentnum = getPara("agentNumber");
        String state = getPara("state");
        try {
            Page<AgentData> agentDataList = AgentDataService.me.searchDeviceByCom(content, agentnum, state, pageno, limit);
            result.success(agentDataList);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 根据不同的条件筛选设备(项目页下的搜索)
     **/
    public void findDevice() {
        Result<Page<AgentData>> result = Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        String content = getPara("sn");
        String agentnum = getPara("agentNumber");
        String state = getPara("state");
        String projectid = getPara("groupid");
        try {
            Page<AgentData> agentDataList = AgentDataService.me.findDeviceByParam(content, agentnum, projectid, state, pageno, limit);
            result.success(agentDataList);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 更改设备配置
     **/
    public void editSetting() {
        Result<String> result = Result.newOne();
        Gson gson = new Gson();
        String json = getPara("setting");
        String machine = getPara("machinesn");
        boolean test = false;
        if (json.length() != 2) {
            MachineInfoEntity agentDataDao = gson.fromJson(json, new TypeToken<MachineInfoEntity>() {
            }.getType());
            test = DeviceListService.checkObjAllFieldsIsNull(machine, agentDataDao);
        }
        if (test) {
            result.setMsg("修改成功");
            result.success(machine);
            renderJson(result);
        } else {
            result.setMsg("修改失败");
            renderJson(result);
        }

    }

    /**
     * 删除设备
     **/
    public void deleteDevice() {
        Result result = Result.newOne();
        String serial = getPara("machineserial");
        int id = getParaToInt("id");
        try {
            AgentDataService.me.deletemachine(id);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 批量删除设备
     **/
    public void deleteDeviceList() {
        Result result = Result.newOne();
        String data = getPara("json");
        Gson gson = new Gson();
        List<AgentData> sList = gson.fromJson(data, new TypeToken<List<AgentData>>() {
        }.getType());
        try {
            AgentDataService.me.deletemachineList(sList);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 添加设备
     **/
    public void addDevice() {
        Result result = Result.newOne();
        String jsondata = getPara("json");
        Gson gson = new Gson();
        AgentData agentDataDao = gson.fromJson(jsondata, new TypeToken<AgentData>() {
        }.getType());
        try {
            DeviceListService.me.addDevice(agentDataDao);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 根据serial获取设备
     **/
    public void getDeviceBySerial() {
        Result result = Result.newOne();
        String machinesn = getPara("machineSerial");
        AgentDataDao agentDataDao = AgentDataDao.dao.findFirst("select * from agent_data where machineSerial='" + machinesn + "'");
        result.success(agentDataDao);
        renderJson(result);
    }

    /**
     * 根据设备serial码获取设备相关信息
     **/
    public void getDeviceDetailBySn() {
        Result result = Result.newOne();
        String machineserial = getPara("machinesn");
        AgentData agentData = AgentDataService.me.getDeviceDetailBySn(machineserial);
        result.success(agentData);
        renderJson(result);
    }

    /**
     * 修改设备的公司归属
     **/
    public void changeDeviceAgentBySerial() {
        Result result = Result.newOne();
        String machinesn = getPara("machineserial");
        String agentnum = getPara("agentnumber");
        try {
            DeviceListService.me.changeDeviceAgentBySerial(machinesn, agentnum);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 批量修改设备的公司归属
     **/
    public void changeDeviceAgentByList() {
        Result result = Result.newOne();
        String data = getPara("json");
        String agentnum = getPara("agentnumber");
        Gson gson = new Gson();
        List<AgentData> sList = gson.fromJson(data, new TypeToken<List<AgentData>>() {
        }.getType());
        try {
            DeviceListService.me.changeDeviceAgentByList(sList, agentnum);
            result.success("迁移成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
            result.success("迁移失败");
        }
        renderJson(result);
    }

    /**
     * 获取设备外接传感器列表
     **/
    public void getDeviceSensorList() {
        Result<Page<DeviceSensorList>> result = Result.newOne();
        String machinesn = getPara("machineserial");
        int pageno = getParaToInt("curr", 1);
        int limit = getParaToInt("nums", 6);
        try {
            Page<DeviceSensorList> deviceSensorListPage = DeviceListService.me.getDeviceSensorList(machinesn, pageno, limit);
            result.success(deviceSensorListPage);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 添加设备传感器
     **/
    public void addDeviceSensor() {
        Gson gson = new Gson();
        Result result = Result.newOne();
        String data = getPara("json");
        String machinesn = getPara("machinesn");
        DeviceSensorList deviceSensorList = gson.fromJson(data, new TypeToken<DeviceSensorList>() {
        }.getType());
        try {
            DeviceListService.me.addSensorByData(deviceSensorList, machinesn);
            SocketTools socketTools = new SocketTools();
            socketTools.updateSocket(machinesn);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 删除设备传感器
     **/
    public void delDeviceSensor() {
        Gson gson = new Gson();
        Result result = Result.newOne();
        String data = getPara("json");
        String machinesn = getPara("machineserial");
        DeviceSensorList deviceSensorList = gson.fromJson(data, new TypeToken<DeviceSensorList>() {
        }.getType());
        try {
            DeviceListService.me.delSensorByData(deviceSensorList, machinesn);
            SocketTools socketTools = new SocketTools();
            socketTools.updateSocket(machinesn);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 获取设备版本更新信息
     **/
    public void getDeviceUpdateLogBySerial() {
        Result<Page<UpdateData>> result = Result.newOne();
        String machinesn = getPara("machineserial");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try {
            Page<UpdateData> updateDataPage = DeviceListService.me.getUpdateDataBySerial(machinesn, pageno, limit);
            result.success(updateDataPage);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 判断是否是最新版本
     **/
    public void isLatestVersion() {
        Result<String> result = Result.newOne();
        String machinesn = getPara("machinesn");
        if (DeviceListService.me.isLatestVersion(machinesn)) {
            result.success("ok");
        } else {
            result.success("fail");
        }
        renderJson(result);
    }

    /**
     * 判断更新状态
     **/
    public void updateLatestVersion() {
        Result<String> result = Result.newOne();
        String machinesn = getPara("machineserial");
        try {
            UpdateData updateData = DeviceListService.me.getUpdateState(machinesn);
            if (updateData.getUpdateState() != null && updateData.getUpdateState() == 2) {
                result.success("pending");
            } else {
                result.success("finish");
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 判断设备是否在线
     **/
    public void isDeviceOnline() {
        Result<String> result = Result.newOne();
        String machinesn = getPara("machineserial");
        try {
            if (DeviceListService.me.isDeviceOnline(machinesn)) {
                result.success("online");
            } else {
                result.success("fail");
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 获取设备更新详情
     **/
    public void getDeviceUpdateDetail() {
        Result<String> result = Result.newOne();
        String machinesn = getPara("machineserial");
        try {
            String time = DeviceListService.me.getDeviceUpdateDetail(machinesn);
            result.success(time);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
            result.success(",");
        }
        renderJson(result);
    }

    /**
     * 接受命令
     **/
    public void sendorder() {
        Result<String> result = Result.newOne();
        String order = getPara("order").replace("\n","");
        String machinesn = getPara("machinesn");
        String userid = getCookie(IndexService.me.accessUserId);
        String test = "";
        try {
//            SocketTools socketTools=new SocketTools();
//            socketTools.orderSocket(machinesn,order);
            SocketClient socketClient = socketClientHashMap.get(userid);
            socketClient.setConnectime(System.currentTimeMillis());
            socketClient.realdata = "";
            socketClient.sendData("WebClient" + userid + "&" + machinesn + "&" + order);
            if (!order.equals("")) {
                socketClient.getall = true;
                while ((socketClient.realdata == null || socketClient.realdata.equals(""))&&(socketClient.getall)) {
                    TimeUnit.SECONDS.sleep(1);
//                    socketClient.setLatesttime(System.currentTimeMillis());
//                    if ((socketClient.getLatesttime() - socketClient.getConnectime() > 10000)) {
//                        break;
//                    }
                }
            } else {
                while ((socketClient.realdata == null || socketClient.realdata.equals(""))) {
                    TimeUnit.SECONDS.sleep(1);
                    socketClient.setLatesttime(System.currentTimeMillis());
                    if ((socketClient.getLatesttime() - socketClient.getConnectime() > 10000)) {
                        break;
                    }
                }
            }
            if (!socketClient.realdata.equals("") && !socketClient.getall) {
                test = socketClient.realdata;
                System.out.println(socketClient.realdata);
            } else {
                test = "设备结果返回超时";
            }
            socketClient.realdata = "";
            result.success(test);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
            result.success("设备结果返回超时");
        }
        renderJson(result);
    }

    /**
     * 连接socket
     **/
    public void condevsocket() {
        Result<String> result = Result.newOne();
        String machinesn = getPara("machinesn");
        String userid = getCookie(IndexService.me.accessUserId);
        try {
            if (!socketClientHashMap.containsKey(userid)) {
                SocketClient socketClient = new SocketClient();
                socketClient.connect(machinesn, userid);
                socketClientHashMap.put(userid, socketClient);
                if (socketClient.isOnlineFlag()){
                    result.success("连接成功");
                }else{
                    result.success("连接失败");
                }
            }else{
                result.success("连接成功");
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
            result.success("连接失败");
        }
        renderJson(result);
    }

    /**
     * 关闭socket
     **/
    public void closesocket() {
        Result<String> result = Result.newOne();
        String userid = getCookie(IndexService.me.accessUserId);
        try {
            SocketClient socketClient = socketClientHashMap.get(userid);
            socketClient.closeConnect();
            socketClientHashMap.remove(userid);
            result.success("成功");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 返回用户命令
     **/
    public void deviceorders() throws IOException {
        Result<List<DeviceOrder>> result = Result.newOne();
        String test = Tools.getConfig("获取单片机软件版本");
        Properties properties = new Properties();
        InputStream bufferedReader = DeviceController.class.getResourceAsStream("/dev/deviceorderCN.properties");
        properties.load(bufferedReader);
        Set<Object> keys = properties.keySet();//返回属性key的集合
        List<DeviceOrder> list = new ArrayList<>();
        for (Object key : keys) {
            DeviceOrder order = new DeviceOrder();
            order.setName(key.toString());
            order.setValue(properties.get(key).toString());
            list.add(order);
        }
        result.success(list);
        renderJson(result);
    }

    /**
     * 经纬度转XYZ
     **/
    public void blhtoxyz() {
        Result<Map<String, Object>> result = Result.newOne();
        try {
            double db = Double.parseDouble((getPara("lat") != null) ? getPara("lat") : "0");
            double dl = Double.parseDouble((getPara("lon") != null) ? getPara("lon") : "0");
            double dh = Double.parseDouble((getPara("height") != null) ? getPara("height") : "0");
            Map<String, Object> xyz = DeviceListService.me.WGS84_BLHtoXYZ(db, dl, dh);
            result.success(xyz);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * XYZ转经纬度
     **/
    public void xyztoblh() {
        Result<Map<String, Object>> result = Result.newOne();
        try {
            double x = Double.parseDouble((getPara("x") != null) ? getPara("x") : "0");
            double y = Double.parseDouble((getPara("y") != null) ? getPara("y") : "0");
            double z = Double.parseDouble((getPara("z") != null) ? getPara("z") : "0");
            Map<String, Object> xyz = DeviceListService.me.XYZToBLH(x, y, z);
            result.success(xyz);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 接受上传文件
     **/
    public void fileupload() {
        Result<String> result = Result.newOne();
        String userid = getPara("userid");
        String uploadPath = "/upload";
// 文件上传大小设置为20mb,此处不是单个文件大小，是指上传文件总大小
        String encoding = "utf-8";
        Integer maxPostSize = 1024 * 1024 * 20;
        UploadFile uploadFile = getFile("file", uploadPath, maxPostSize, encoding);
        String fileName = uploadFile.getOriginalFileName();
        File file = uploadFile.getFile();
        FileClientHashMap.put(userid + fileName, file);
        try {
            FileInputStream fis = new FileInputStream(file);
            //将字节流转化为字符流，编码指定为文件保存的编码
            InputStreamReader isr = new InputStreamReader(fis, "GBK");
            BufferedReader br = new BufferedReader(isr);
            String columnlist = br.readLine();
            br.close();
            isr.close();
            fis.close();
            result.success(columnlist);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        System.out.println(fileName);
        renderJson(result);
    }

    /**
     * 根据列名对应表，导入到数据库中
     **/
    public void fileinput() {
        Result<String> result = Result.newOne();
        String userid = getPara("userid") == null ? "" : getPara("userid");
        String stop = getPara("stop") == null ? "" : getPara("stop");
        String filename = getPara("filename") == null ? "" : getPara("filename");
        try {
//            String filename= new String(getPara("filename").toString().getBytes("iso8859_1"),"utf-8");
            if (stop.equals("")) {
                UploadThread thread = new UploadThread(FileClientHashMap.get(userid + filename), userid + filename);
                ThreadHashMap.put(userid + filename, thread);
                String sqlresult = thread.uploadexcute();
                result.success(sqlresult);
            } else {
                UploadThread thread = ThreadHashMap.get(userid + filename);
                thread.setInterrupted(true);
                result.success("执行已中止");
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 删除上传文件
     **/
    public void deleteuploadfile() {
        Result<String> result = Result.newOne();
        try {
            String filename = getPara("filename");
            File file = FileClientHashMap.get(filename);
            if (file.exists()) {
                FileClientHashMap.remove(filename);
                ThreadHashMap.get(filename).setInterrupted(true);
                ThreadHashMap.remove(filename);
                File file1 = new File(file.getAbsolutePath());
                if (file1.delete()) {
                    result.success("success");
                } else {
                    result.success("error");
                }
            } else {
                result.success("error");
            }
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    /**
     * 获取导入文件执行进度
     **/
    public void progressuploadfile() {
        Result<Integer> result = Result.newOne();
        try {
            String filename = getPara("filename");
            int progress = ThreadHashMap.get(filename).getProgress();
            result.success(progress);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

}
