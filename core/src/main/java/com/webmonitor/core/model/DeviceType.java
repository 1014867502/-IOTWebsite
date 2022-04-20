package com.webmonitor.core.model;
/**设备类型数目**/
public class DeviceType {
    private String type;
    private int count;
    private String month;
    private String agentname;

//    public DeviceType(String type,int count,String month,String agentname){
//        this.type=type;
//        this.count=count;
//        this.month=month;
//        this.agentname=agentname;
//    }


    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getAgentname() {
        return agentname;
    }

    public void setAgentname(String agentname) {
        this.agentname = agentname;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
