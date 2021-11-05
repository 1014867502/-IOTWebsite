package com.webmonitor.core.model;
/**公司分页上关于公司的部分详细信息**/
public class CompanyPage {
    private String agentname;//公司名
    private String agentnum;//公司编号
    private int devicesum;//设备总数
    private int projectsum;//项目数
    private int onlinesum;//在线设备数
    private int deadsum;//离线设备数

    public String getAgentname() {
        return agentname;
    }

    public void setAgentname(String agentname) {
        this.agentname = agentname;
    }

    public String getAgentnum() {
        return agentnum;
    }

    public void setAgentnum(String agentnum) {
        this.agentnum = agentnum;
    }

    public int getDevicesum() {
        return devicesum;
    }

    public void setDevicesum(int devicesum) {
        this.devicesum = devicesum;
    }

    public int getProjectsum() {
        return projectsum;
    }

    public void setProjectsum(int projectsum) {
        this.projectsum = projectsum;
    }

    public int getOnlinesum() {
        return onlinesum;
    }

    public void setOnlinesum(int onlinesum) {
        this.onlinesum = onlinesum;
    }

    public int getDeadsum() {
        return deadsum;
    }

    public void setDeadsum(int deadsum) {
        this.deadsum = deadsum;
    }
}
