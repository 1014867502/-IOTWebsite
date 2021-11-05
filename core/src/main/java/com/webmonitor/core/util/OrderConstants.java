package com.webmonitor.core.util;


import com.webmonitor.core.bll.AdminService;

public class OrderConstants  {

    public static final OrderConstants me = new OrderConstants();

    //测站名称
    public static String Name_Order="SET,DEVICE.RAW.NAME,";

    //记录间隔，单位秒
    public static String Interval_Order="SET,DEVICE.RAW.INTERVAL,";

    //数据链

    //原始数据通信IP
    public static String RAW_IP_Order="SET,DEVICE.RAW.IP,";

    //原始端口
    public static String RAW_Port_Order="SET,DEVICE.RAW.PORT,";

    //开启第2基站
    public static String SECOND_BASE_Order="SET,DEVICE.RAW.SECOND_BASE,";

    //第2基站原始数据IP
    public static String SECOND_IP_Order="SET,DEVICE.RAW.SECOND_IP,";

    //第2基站原始数据端口
    public static String SECOND_PORT_Order="SET,DEVICE.RAW.SECOND_PORT,";

    //结果回传IP
    public static String RESULT_IP_Order="SET,DEVICE.RAW.RESULT_IP,";

    //结果回传端口
    public static String RESULT_PORT_Order="SET,DEVICE.RAW.RESULT_PORT,";

    //0关闭定时  定时开关机
    public static String SCHEDULER_Order="SET,DEVICE.SCHEDULER,";

    //开启外接传感器0-关闭；1-开启
    public static String ENABLED_Order="SET,DEVICE.EXT_SENSOR.ENABLED,";


    //设置时区
    public static String  TIMEZONE_Order="SET,DEVICE.TIMEZONE,";

    //重启
    public static String RESTART_MODEL="SET,DEVICE.RESET";

    //关机
    public static String DEVICE_POWEROFF="SET,DEVICE.POWEROFF";

    //恢复出厂设置
    public static String DEVICE_FRESET="SET,DEVICE.FRESET";

    //WiFi开关设置
    public static String DEVICE_ENABLE_WIFI="SET,DEVICE.ENABLE_WIFI,";

    //设置WiFi模式
    public static String DEVICE_WIFI_MODE= "SET,DEVICE.WIFI.MODE,";

    //设置wifissid
    public static String DEVICE_WIFI_SSID ="SET,DEVICE.WIFI.SSID,";

    //设置WiFi—password
    public static String DEVICE_WIFI_PASSWORD = "SET,DEVICE.WIFI.PASS,";

    //自动获取ip
    public static String WIFI_DHCP ="SET,DEVICE.WIFI.DHCP,";

    //测站模式
    public static String RAW_MODE_Order ="SET,DEVICE.RAW.MODE,";

    //解算模式
    public static String RAW_SOLUTION="SET,DEVICE.RAW.SOLUTION,";

    //采样频率:
    public static String RAW_RATE_Order ="SET,DEVICE.RAW.RATE,";

    //双周期解算:
    public static String RAW_DOUBLE_INV_Order ="SET,DEVICE.RAW.DOUBLE_INV,";

    //结果平滑::
    public static String RESULT_SMOOTH_Order ="SET,DEVICE.RAW.RESULT_SMOOTH,";

    //频段
    public static String WIFI_BAND5G_Order = "SET,DEVICE.WIFI.BAND5G,";

    //wifiAP密码
    public static String WIFI_PREFIX="SET,DEVICE.WIFI.PREFIX,";

    //wifiAP密码
    public static String WIFI_AP_PASS="SET,DEVICE.WIFI.AP_PASS,";

    //开启rtk
    public static String RTK_POS_Order = "SET,DEVICE.RTK_POS,";

    //IMU触发RTK紧急模式，参数为触发角度，0关闭
    public static String IMU_WARN_Order = "SET,DEVICE.IMU_WARN,";

    //显示语言设置
    public static String CUR_LANGUAGE_Order = "SET,DEVICE.CUR_LANGUAGE,";//CHINESE/ENGLISH

    // 回传消息设置
    public static String RESULT_MSG_Order ="SET,DEVICE.RAW.RESULT_MSG,";

    //串口输出结果消息
    public static String RESULT_RS232_Order ="SET,DEVICE.RAW.RESULT_RS232,";

    //回传频率
    public static String RESULT_IMU_Order ="SET,DEVICE.RAW.RESULT_IMU,";

    //开启电源输出
    public static String SENSOR_POWER_Order="SET,DEVICE.EXT_SENSOR.POWER,";

    //位移报警
    public static String MOVE_WARN_Order = "SET,DEVICE.MOVE_WARN.ENABLED,";

    //位移阈值，单位毫米。
    public static String MOVE_WARN_THRESHOLD_Order="SET,DEVICE.MOVE_WARN.THRESHOLD,";

    //输出串口波特率
    public static String WARN_BAUD_Order="SET,DEVICE.MOVE_WARN.BAUD,";

    //报警命令
    public static String MOVE_WARN_CMD ="SET,DEVICE.MOVE_WARN.CMD,";

    //开启连接地灾平台；0-关闭，1-开启
    public static String  DZ_IOT_ENABLED_Order="SET,DEVICE.DZ_IOT.ENABLED,";

    //地灾平台http://ghiot.cigem.cn分配的ID
    public static String DZ_IOT_ID_Order="SET,DEVICE.DZ_IOT.ID,";

    //地灾平台服务器地址
    public static String DZ_IOT_IP_Order="SET,DEVICE.DZ_IOT.IP,";

    //地灾平台服务器端口
    public static String DZ_IOT_PORT_Order="SET,DEVICE.DZ_IOT.PORT,";

    //地灾平台分配的KEY
    public static String DZ_IOT_KEY_Order ="SET,DEVICE.DZ_IOT.KEY,";

    //是否上传RTCM3.2
    public static String DZ_IOT_GNSS_DATA_Order ="SET,DEVICE.DZ_IOT.GNSS_DATA,";

    //HTTP上传结果时填写
    public static String DZ_IOT_HTTP_Order="SET,DEVICE.DZ_IOT.HTTP,";

    //上传RTK解算结果
    public static String DZ_IOT_RTK="SET,DEVICE.DZ_IOT.RTK_RESULT,";

    //开启重庆地灾平台
    public static String CHONGQING_IOT_ENABLED_Order="SET,DEVICE.CHONGQING_IOT.ENABLED,";

    //运营商设置
    public static String CHONGQING_IOT_TELECOM="SET,DEVICE.CHONGQING_IOT.TELECOM,";

    //重庆平台设备id
    public static String CHONGQING_IOT_ID="SET,DEVICE.CHONGQING_IOT.ID,";

    //重庆平台产品ID
    public static String CHONGQING_IOT_USER="SET,DEVICE.CHONGQING_IOT.USER,";

    //重庆平台鉴权码
    public static String CHONGQING_IOT_KEY="SET,DEVICE.CHONGQING_IOT.KEY,";

    //重庆平台状态（430-440，与RTK网络状态一致）
    public static String CHONGQING_IOT_STATUS="SET,DEVICE.CHONGQING_IOT.STATUS,";

    //连接Onenet平台
    public static String ONENET_ENABLED="SET,DEVICE.ONENET.ENABLED,";

    //模式
    public static String ONENET_MODE="SET,DEVICE.ONENET.MODE,";

    //
    public static String ONENET_PKEY= "SET,DEVICE.ONENET.PKEY,";

    //Onenet平台设备ID
    public static String ONENET_ID="SET,DEVICE.ONENET.ID,";

    //Onenet平台产品ID
    public static String ONENET_USER="SET,DEVICE.ONENET.USER,";

    //Onenet平台鉴权信息
    public static String ONENET_KEY="SET,DEVICE.ONENET.KEY,";

    //Onenet平台数据流ID
    public static String ONENET_GNSS_DATAD="SET,DEVICE.ONENET.GNSS_DATA,";

    //是否开启网络模块
    public static String NETWORK_ENABLED="SET,NETWORK.ENABLED,";

    //网络模块APN设置
    public static String NETWORK_APN="SET,NETWORK.APN,";

    //网络模块APN用户名
    public static String NETWORK_APNUSER="SET,NETWORK.APNUSER,";

    //网络模块APN密码
    public static String NETWORK_APNPASS="SET,NETWORK.APNPASS,";

    //短信唤醒
    public static String SMS_WAKEUP_Order="SET,DEVICE.SMS_WAKEUP,";

    //网络差分传输协议 NTRIP/PPP
    public static String NETWORK_MODE="SET,NETWORK.MODE,";

    //网络模块服务器地址，支持IP或域名
    public static String NETWORK_ADDR="SET,NETWORK.ADDR,";

    //网络模块服务器端口
    public static String NETWORK_PORT="SET,NETWORK.PORT,";

    //Ntrip接入点
    public static String NETWORK_MOUNTPOINT="SET,NETWORK.MODE.MOUNTPOINT,";

    //Ntrip用户名|密码
    public static String NETWORK_MOUNTPOINTUSERPASS="SET,NETWORK.MOUNTPOINTUSERPASS,";

    //Ntrip上传GGA间隔（秒）
    public static String NETWORK_UPLOADGGA="SET,NETWORK.UPLOADGGA,";

    //设置是否启用平面坐标转换输出
    public static String COORDCVT_ENABLED = "SET,GPS.COORDCVT.ENABLED,";

    //设置源参考椭球
    public static String COORDCVT_DST_DATUM="SET,GPS.COORDCVT.DST_DATUM,";

    //设置七参数
    public static String SEVEN_PARAM="SET,GPS.COORDCVT.SEVEN_PARAM,";

    //设置四参数
    public static String FOUR_PARAM="SET,GPS.COORDCVT.FOUR_PARAM,";

    //设置设置投影参数
    public static String COORDCVT_PROJ_PARAM = "SET,GPS.COORDCVT.PROJ_PARAM,";

    public static String RAW_BACK_ENABLED="SET,PORTS.RAW_BACK.ENABLED,";//设置原始数据回传

    public static String RAW_BACK_ADDR="SET,PORTS.RAW_BACK.ADDR,";//设置作客户端时服务器地址

    public static String RAW_BACK_PORT="SET,PORTS.RAW_BACK.PORT,";//设置回传服务器端口

    public static String RAW_BACK_GNSS_DATA="SET,PORTS.RAW_BACK.GNSS_DATA,";//设置数据类型

    public static String RAW_BACK_USER="SET,PORTS.RAW_BACK.USER,";//Ntrip基站使用的接入点

    public static String RAW_BACK_PASS="SET,PORTS.RAW_BACK.PASS,";//Ntrip基站使用的密码

    public static String RAW_BACK_BAUD="SET,PORTS.RAW_BACK.BAUD,";//串口使用的波特率

    public static String MOVE_WARN_MEMS="SET,DEVICE.MOVE_WARN.MEMS,";//倾斜报警

    public static String RAW_NTRIP_BASE="SET,DEVICE.RAW.NTRIP_BASE,";//使用Ntrip做基站数据来源

    public static String RAW_SECOND_NTRIP_BASE="SET,DEVICE.RAW.SECOND_NTRIP_BASE,";//使用Ntrip做第二基站数据来源

    public static String GPS_BASE_LON="SET,GPS.BASE.LON,";//经度

    public static String GPS_BASE_LAT="SET,GPS.BASE.LAT,";//纬度

    public static String GPS_BASE_HEIGHT="SET,GPS.BASE.HEIGHT,";//高度

    public static String DEVICE_COORDINATES_X="SET,DEVICE.COORDINATES.X,";//设置基准坐标，用于计算位移

    public static String DEVICE_COORDINATES_Y="SET,DEVICE_COORDINATES_Y,";//设置基准坐标，用于计算位移

    public static String DEVICE_COORDINATES_Z="SET,DEVICE_COORDINATES_Z,";//设置基准坐标，用于计算位移

    public static String RAW_NTRIP_ARG="SET,DEVICE.RAW.NTRIP_ARG,";//NTRIP参数，IP|端口|接入点|用户名|密码(core数据1)

    public static String RAW_SECOND_NTRIP_ARG="SET,DEVICE.RAW.SECOND_NTRIP_ARG,";//第二cores

    public static String EXT_SENSOR_CMD="SET,DEVICE.EXT_SENSOR.CMD,";//增加设备传感器
}
