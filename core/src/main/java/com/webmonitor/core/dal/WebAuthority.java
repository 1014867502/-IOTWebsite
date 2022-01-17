package com.webmonitor.core.dal;

public enum WebAuthority {
    fastset(0,"快速设置"),
    computeset(1,"解算设置"),
    localset(2,"坐标系统"),
    platformset(3,"平台对接"),
    auxiliaryset(4,"辅助功能"),
    orderset(5,"下发命令"),
    logset(6,"配置日志"),
    otherset(7,"其他设置"),
    NONE(-1, "NONE");

    private int index;
    private String value;

    WebAuthority(int index, String name) {
        this.index = index;
        this.value=name;
    }

    public boolean Compare(int i) {
        return this.index == i;
    }

    public static WebAuthority getIndex(int type) {
       WebAuthority[] As = values();
        for(int i = 0; i < As.length; ++i) {
            if (As[i].Compare(type)) {
                return As[i];
            }
        }

        return NONE;
    }

    public static String getAllString(){
        WebAuthority[] As = values();
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
        WebAuthority[] As = values();
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
