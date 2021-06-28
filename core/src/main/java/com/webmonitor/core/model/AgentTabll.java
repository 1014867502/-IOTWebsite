package com.webmonitor.core.model;

/**给json报文转换**/
public class AgentTabll {
    private String date;
    private String serial;
    private String state;
    private int id;
    private String agentNumber;
    private String proGroupId;
    private String machineName;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAgentNumber() {
        return agentNumber;
    }

    public void setAgentNumber(String agentNumber) {
        this.agentNumber = agentNumber;
    }

    public String getProGroupId() {
        return proGroupId;
    }

    public void setProGroupId(String proGroupId) {
        this.proGroupId = proGroupId;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }
}
