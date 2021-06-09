package com.webmonitor.core.model;

import java.util.Date;

/**设备表**/
public class AgentData {
    private String agentNumber;
    private String serial;
    private int state;
    private String machinname;
    private Date daytime;

    public String getAgentNumber() {
        return agentNumber;
    }

    public void setAgentNumber(String agentNumber) {
        this.agentNumber = agentNumber;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public String getMachinname() {
        return machinname;
    }

    public void setMachinname(String machinname) {
        this.machinname = machinname;
    }


    public Date getDaytime() {
        return daytime;
    }

    public void setDaytime(Date daytime) {
        this.daytime = daytime;
    }
}
