package com.webmonitor.core.model.userbase;

public class SensorLastdata {
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemV() {
        return itemV;
    }

    public void setItemV(String itemV) {
        this.itemV = itemV;
    }

    public String getLasttime() {
        return lasttime;
    }

    public void setLasttime(String lasttime) {
        this.lasttime = lasttime;
    }

    public int getSensortype() {
        return sensortype;
    }

    public void setSensortype(int sensortype) {
        this.sensortype = sensortype;
    }

    String itemName;
    String itemV;
    String lasttime;
    int    sensortype;
}
