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
    private String accounttime;
    private String appPermission;
    private String webPermission;
    private String groupAgentNumber;
    private int writePermission;

    public String getGroupAgentNumber() {
        return groupAgentNumber;
    }

    public void setGroupAgentNumber(String groupAgentNumber) {
        this.groupAgentNumber = groupAgentNumber;
    }

    public int getWritePermission() {
        return writePermission;
    }

    public void setWritePermission(int writePermission) {
        this.writePermission = writePermission;
    }

    public String getAppPermission() {
        return appPermission;
    }

    public void setAppPermission(String appPermission) {
        this.appPermission = appPermission;
    }

    public String getWebPermission() {
        return webPermission;
    }

    public void setWebPermission(String webPermission) {
        this.webPermission = webPermission;
    }

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

    public String getAccounttime() {
        return accounttime;
    }

    public void setAccounttime(String accounttime) {
        this.accounttime = accounttime;
    }
}
