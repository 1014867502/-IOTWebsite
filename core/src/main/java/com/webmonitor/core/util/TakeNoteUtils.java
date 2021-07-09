package com.webmonitor.core.util;


public class TakeNoteUtils {


    public static void Note(String serial,int sate,String order,String data){
        String function="";
        switch (order){
            case "DEVICE.CUR_DATALINK":
                function = "数据链";
                break;
            case "DEVICE.TIMEZONE":
                function ="设置时区";
                break;
            case "DEVICE.RTK_POS":
                function ="RTK解算";
                break;
            case "DEVICE.IMU_WARN":
                function="IMU触发RTK紧急模式";
                break;
            case "DEVICE.FRESET":
                function = "恢复出厂";
                break;
            case "DEVICE.RAW.NAME":
                function = "测站名称";
                break;
            case "DEVICE.DEVICE.RAW.MODE":
                function = "测站模式";
                break;
            case "DEVICE.RAW.INTERVAL":
                function = "记录间隔";
                break;
            case "DEVICE.RAW.IP":
                function = "原始数据通信IP";
                break;
            case "DEVICE.DEVICE.RAW.PORT":
                function = "原始数据通信端口";
                break;
            case "DEVICE.RAW.RESULT_IP":
                function = "结果回传IP";
                break;
            case "DEVICE.RAW.RESULT_PORT":
                function = "结果回传端口";
                break;
            case "DEVICE.RAW.RESULT_MSG":
                function = "回传消息";
                break;
            case "DEVICE.RAW.RESULT_RS232":
                function = "串口输出结果消息";
                break;
            case "DEVICE.RAW.RESULT_IMU":
                function = "回传GEOINS数据，回传频率（秒）";
                break;
            case "DEVICE.RAW.NTRIP_BASE":
                function = "使用Ntrip做基站";
                break;
            case "DEVICE.RAW.SECOND_BASE":
                function = "第二基站";
                break;
            case "DEVICE.RAW.SECOND_IP":
                function = "第2基站IP";
                break;
            case "DEVICE.RAW.SECOND_PORT":
                function = "第2基站端口";
                break;
            case "DEVICE.RAW.RATE":
                function = "静态采样间隔";
                break;
            case "DEVICE.RAW.DOUBLE_INV":
                function = "双周期解算";
                break;
            case "DEVICE.RAW.RESULT_SMOOTH":
                function = "结果进行平滑";
                break;
            case "DEVICE.EXT_SENSOR.ENABLED":
                function = "开启外接传感器";
                break;
            case "DEVICE.EXT_SENSOR.POWER":
                function = "外接传感器电源输出";
                break;
            case "DEVICE.EXT_SENSOR.CMD":
                function = "外接传感器读取参数";
                break;
            case "DEVICE.EXT_SENSOR.SEND":
                function = "手动发送读取命令";
                break;
            case "DEVICE.SCHEDULER":
                function = "定时开关机";
                break;

            case "DEVICE.MOVE_WARN.ENABLED":
                function = "开启位移报警";
                break;
            case "DEVICE.MOVE_WARN.THRESHOLD":
                function = "位移阈值";
                break;
            case "DEVICE.MOVE_WARN.BAUD":
                function = "输出串口波特率";
                break;
            case "DEVICE.MOVE_WARN.CMD":
                function = "报警命令";
                break;
            case "DEVICE.DZ_IOT.ENABLED":
                function = "开启连接地灾平台";
                break;
            case "DEVICE.DZ_IOT.ID":
                function = "地灾平台分配的ID";
                break;
            case "DEVICE.DZ_IOT.IP":
                function = "地灾平台服务器地址";
                break;
            case "DEVICE.DZ_IOT.PORT":
                function = "地灾平台服务器端口";
                break;
            case "DEVICE.DZ_IOT.KEY":
                function = "地灾平台分配的KEY";
                break;
            case "DEVICE.DZ_IOT.HTTP":
                function = "HTTP上传结果";
                break;
            case "DEVICE.DZ_IOT.GNSS_DATA":
                function = "是否上传RTCM3.2";
                break;
            case "DEVICE.CHONGQING_IOT.ENABLED":
                function = "开启重启地灾平台";
                break;
            case "DEVICE.CHONGQING_IOT.TELECOM":
                function = "重庆平台运营商";
                break;
            case "DEVICE.CHONGQING_IOT.ID":
                function = "重庆平台设备ID";
                break;
            case "DEVICE.CHONGQING_IOT.USER":
                function = "重庆平台产品ID";
                break;
            case "DEVICE.CHONGQING_IOT.KEY":
                function = "重庆平台鉴权码";
                break;
            case "DEVICE.ONENET.ENABLED":
                function = "连接Onenet平台";
                break;
            case "DEVICE.ONENET.MODE":
                function = "Onenet模式";
                break;
            case "DEVICE.ONENET.ID":
                function = "onenet平台设备ID";
                break;
            case "DEVICE.ONENET.USER":
                function = "onenet平台产品ID";
                break;
            case "DEVICE.ONENET.KEY":
                function = "onenet设备鉴权信息";
                break;
            case "DEVICE.ONENET.PKEY":
                function = "onenet产品key";
                break;
            case "DEVICE.ONENET.GNSS_DATA":
                function = "onenet平台数据流";
                break;
            case "DEVICE.WIFI.MODE":
                function = "WIFI模式";
                break;
            case "DEVICE.WIFI.SSID":
                function = "路由器SSID";
                break;
            case "DEVICE.WIFI.PASS":
                function = "路由器密码";
                break;
            case "DEVICE.WIFI.DHCP":
                function = "开启DHCP";
                break;
            case "DEVICE.WIFI.IP":
                function = "静态IP";
                break;
            case "DEVICE.WIFI.MASK":
                function = "子网掩码";
                break;
            case "DEVICE.WIFI.GATEWAY":
                function = "网关";
                break;
            case "DEVICE.WIFI.DNS1":
                function = "自定义DNS1";
                break;
            case "DEVICE.WIFI.DNS2":
                function = "自定义DNS2";
                break;
            case "DEVICE.WIFI.EXT_ANTENNA":
                function = "开关WIFI天线外置功放";
                break;
            case "DEVICE.WIFI.BAND5G":
                function = "是否使用5G频段组网";
                break;
            case "NETWORK.ENABLED":
                function = "开启网络模块";
                break;
            case "NETWORK.APN":
                function = "网络APN";
                break;
            case "NETWORK.APNUSER":
                function = "APN用户名";
                break;
            case "NETWORK.APNPASS":
                function = "APN密码";
                break;
            case "NETWORK.MODE":
                function = "网络差分传输协议";
                break;
            case "NETWORK.ADDR":
                function = "网络服务器地址";
                break;
            case "NETWORK.PORT":
                function = "网络服务器端口";
                break;
            case "NETWORK.MOUNTPOINT":
                function = "网络Ntrip接入点";
                break;
            case "NETWORK.MOUNTPOINTUSERPASS":
                function = "网络Ntrip用户名或密码";
                break;
            case "NETWORK.UPLOADGGA":
                function = "网络Ntrip上传GGA间隔";
                break;
            case "GPS.COORDCVT.ENABLED":
                function = "是否启用平面坐标转换输出";
                break;
            case "GPS.COORDCVT.SRC_DATUM":
                function = "源参考椭球";
                break;
            case "GPS.COORDCVT.DST_DATUM":
                function = "目标参考椭球";
                break;
            case "GPS.COORDCVT.SEVEN_PARAM":
                function = "七参数";
                break;
            case "GPS.COORDCVT.PROJ_PARAM":
                function = "投影参数";
                break;
            case "GPS.COORDCVT.FOUR_PARAM":
                function = "四参数";
                break;
            case "GPS.ELE_MASK":
                function = "卫星截止角";
                break;
            case "DEVICE.SMS_WAKEUP":
                function = "短信唤醒";
                break;
            case "DEVICE.COORDINATES.X":
                function = "基准坐标X";
                break;
            case "DEVICE.COORDINATES.Y":
                function = "基准坐标Y";
                break;
            case "PORTS.RAW_BACK.ENABLED":
                function = "原始数据回传";
                break;
            case "PORTS.RAW_BACK.ADDR":
                function = "原始数据服务器地址";
                break;
            case "PORTS.RAW_BACK.PORT":
                function = "原始数据回传服务器端口";
                break;
            case "PORTS.RAW_BACK.GNSS_DATA":
                function = "原始数据类型";
                break;
            case "PORTS.RAW_BACK.USER":
                function = "Ntrip基站使用的接入点";
                break;
            case "PORTS.RAW_BACK.PASS":
                function = "Ntrip基站使用的密码";
                break;
            case "PORTS.RAW_BACK.BAUD":
                function = "串口使用的波特率";
                break;
        }
    }
}
