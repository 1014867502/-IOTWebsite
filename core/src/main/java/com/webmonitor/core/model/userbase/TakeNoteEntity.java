package com.webmonitor.core.model.userbase;

/**配置日志实体类**/
public class TakeNoteEntity {
    private String agentName ;
    private String machineSerial;
    private String workTime;
    private String resSate;
    private String funProperties;
    private String setFromwork;
    private int type;

    public String getResSate() {
        return resSate;
    }

    public void setResSate(String resSate) {
        this.resSate = resSate;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getMachineSerial() {
        return machineSerial;
    }

    public void setMachineSerial(String machineSerial) {
        this.machineSerial = machineSerial;
    }

    public String getWorkTime() {
        return workTime;
    }

    public void setWorkTime(String workTime) {
        this.workTime = workTime;
    }

    public String getFunProperties() {
        return funProperties;
    }

    public void setFunProperties(String funProperties) {
        this.funProperties = funProperties;
    }

    public String getSetFromwork() {
        return setFromwork;
    }

    public void setSetFromwork(String setFromwork) {
        this.setFromwork = setFromwork;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
