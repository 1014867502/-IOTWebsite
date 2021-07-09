package com.webmonitor.core.model;

/**给json报文转换**/
public class AgentTabll {
    private String date;
    private String machineSerial;
    private String onlineState;
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

    public String getMachineSerial() {
        return machineSerial;
    }

    public void setMachineSerial(String machineSerial) {
        this.machineSerial = machineSerial;
    }

    public String getOnlineState() {
        return onlineState;
    }

    public void setOnlineState(String onlineState) {
        this.onlineState = onlineState;
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
