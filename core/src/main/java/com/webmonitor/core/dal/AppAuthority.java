package com.webmonitor.core.dal;

public enum AppAuthority {
    deviceinfo(0,"设备信息"),
    netset(1,"网络设置"),
    stationset(2,"站点设置"),
    localset(3,"坐标系统"),
    sensorset(4,"外界传感器"),
    platformset(5,"平台对接"),
    devcontrol(6,"设备控制"),
    auxiliary(7,"辅助功能"),
    logset(8,"配置日志"),
    devupdate(9,"固件升级"),
    devlog(10,"设备日志"),
    ordetest(11,"指令调试功能"),
    NONE(-1, "NONE");

    private int index;
    private String value;

    AppAuthority(int index, String name) {
        this.index = index;
        this.value=name;
    }

    public boolean Compare(int i) {
        return this.index == i;
    }

    public static AppAuthority getIndex(int type) {
        AppAuthority[] As = values();
        for(int i = 0; i < As.length; ++i) {
            if (As[i].Compare(type)) {
                return As[i];
            }
        }

        return NONE;
    }

    public static String getAllString(){
        AppAuthority[] As = values();
        String sum="";
        for(int i = 0; i < As.length-1; ++i) {
            sum+=As[i].getIndex()+"@";
        }
        int length=sum.length();
        sum=sum.substring(0,length-1);
        return sum;
    }

    public static String getString(int type) {
        String s="";
        AppAuthority[] As = values();
        for(int i = 0; i < As.length; ++i) {
            if (As[i].getIndex()==type) {
                return As[i].getValue();
            }
        }
        return "none";
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
