package com.webmonitor.core.model;

import java.util.Date;

public class BorrowDataEntity {
    String id;
    String machineSerial;
    String agentNumber;
    String machineName;
    String agentName;
    String uAccountNum;
    Date beginTime;
    Date endTime;
    String lender;
    String content;
    String phoneNumber;
    int returnStatus;

    public BorrowData convert(BorrowDataEntity borrowDataEntity){
        BorrowData borrowData=new BorrowData();
        if(borrowDataEntity.getId()!=null){
            borrowData.setId(Integer.parseInt(borrowDataEntity.getId()));
        }
        borrowData.setReturnStatus(borrowDataEntity.getReturnStatus());
        borrowData.setEndTime(borrowDataEntity.getEndTime());
        borrowData.setUAccountNum(borrowDataEntity.getuAccountNum());
        borrowData.setBeginTime(borrowDataEntity.getBeginTime());
        borrowData.setMachineSerial(borrowDataEntity.getMachineSerial());
        borrowData.setAgentNumber(borrowDataEntity.getAgentNumber());
        borrowData.setPhoneNumber(borrowDataEntity.getPhoneNumber());
        borrowData.setContent(borrowDataEntity.getContent());
        borrowData.setLender(borrowDataEntity.getLender());
        return borrowData;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMachineSerial() {
        return machineSerial;
    }

    public void setMachineSerial(String machineSerial) {
        this.machineSerial = machineSerial;
    }

    public String getAgentNumber() {
        return agentNumber;
    }

    public void setAgentNumber(String agentNumber) {
        this.agentNumber = agentNumber;
    }

    public String getuAccountNum() {
        return uAccountNum;
    }

    public void setuAccountNum(String uAccountNum) {
        this.uAccountNum = uAccountNum;
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }


    public int getReturnStatus() {
        return returnStatus;
    }

    public void setReturnStatus(int returnStatus) {
        this.returnStatus = returnStatus;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    public String getLender() {
        return lender;
    }

    public void setLender(String lender) {
        this.lender = lender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
