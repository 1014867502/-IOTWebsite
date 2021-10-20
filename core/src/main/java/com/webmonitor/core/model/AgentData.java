package com.webmonitor.core.model;

import java.util.Date;

/**设备表**/
public class AgentData {
    private int id;
    private String agentNumber;
    private String machineSerial;
    private int onlineState;
    private String machineName;
    private Date createTime;
    private String agentName;
    private int progroupid;
    private String proGroupName;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProgroupid() {
        return progroupid;
    }

    public void setProgroupid(int progroupid) {
        this.progroupid = progroupid;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getAgentNumber() {
        return agentNumber;
    }

    public void setAgentNumber(String agentNumber) {
        this.agentNumber = agentNumber;
    }

    public String getMachineSerial() {
        return machineSerial;
    }


    public void setMachineSerial(String machineSerial) {
        this.machineSerial = machineSerial;
    }

    public int getOnlineState() {
        return onlineState;
    }

    public void setOnlineState(int onlineState) {
        this.onlineState = onlineState;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }


    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getProGroupName() {
        return proGroupName;
    }

    public void setProGroupName(String proGroupName) {
        this.proGroupName = proGroupName;
    }
}
