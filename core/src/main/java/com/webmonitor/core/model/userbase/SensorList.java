package com.webmonitor.core.model.userbase;


//给类用来返回传感器列表数据
public class SensorList {
    public String getSensorname() {
        return sensorname;
    }

    public void setSensorname(String sensorname) {
        this.sensorname = sensorname;
    }

    public String getSensorid() {
        return sensorid;
    }

    public void setSensorid(String sensorid) {
        this.sensorid = sensorid;
    }

    private String sensorname;
    private String sensorid;
    private String sensorserial;

    public int getSensortype() {
        return sensortype;
    }

    public String getSensorserial() {
        return sensorserial;
    }

    public void setSensorserial(String sensorserial) {
        this.sensorserial = sensorserial;
    }

    public void setSensortype(int sensortype) {
        this.sensortype = sensortype;
    }

    private int sensortype;

}
