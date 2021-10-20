package com.webmonitor.core.model;

/**导入到agent_data的数据类**/
public class AgentFile {
    private String agentNumber;
    private String createTime;
    private String machineName;
    private String machineSerial;
    private String mainmodel;

    public String getAgentNumber() {
        return agentNumber;
    }

    public void setAgentNumber(String agenttNumber) {
        this.agentNumber = agentNumber;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    public String getMachineSerial() {
        return machineSerial;
    }

    public void setMachineSerial(String machineSerial) {
        this.machineSerial = machineSerial;
    }

    public String getMainmodel() {
        return mainmodel;
    }

    public void setMainmodel(String mainmodel) {
        this.mainmodel = mainmodel;
    }
}
