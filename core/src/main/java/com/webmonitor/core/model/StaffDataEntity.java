package com.webmonitor.core.model;

public class StaffDataEntity {
    private int id;
    private String agentNumber;
    private String agentName;
    private String uAccountNum;
    private String uPassword;
    private String uRealName;
    private String cDept;
    private int iRoleType;
    private String RoleType;
    private String iAccountType;
    private String groupAssemble;


    public String getRoleType() {
        return RoleType;
    }

    public void setRoleType(String roleType) {
        RoleType = roleType;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getuAccountNum() {
        return uAccountNum;
    }

    public void setuAccountNum(String uAccountNum) {
        this.uAccountNum = uAccountNum;
    }

    public String getuPassword() {
        return uPassword;
    }

    public void setuPassword(String uPassword) {
        this.uPassword = uPassword;
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName;
    }

    public String getcDept() {
        return cDept;
    }

    public void setcDept(String cDept) {
        this.cDept = cDept;
    }

    public int getiRoleType() {
        return iRoleType;
    }

    public void setiRoleType(int iRoleType) {
        this.iRoleType = iRoleType;
    }

    public String getiAccountType() {
        return iAccountType;
    }

    public void setiAccountType(String iAccountType) {
        this.iAccountType = iAccountType;
    }

    public String getGroupAssemble() {
        return groupAssemble;
    }

    public void setGroupAssemble(String groupAssemble) {
        this.groupAssemble = groupAssemble;
    }
}
