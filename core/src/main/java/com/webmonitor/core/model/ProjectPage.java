package com.webmonitor.core.model;

public class ProjectPage {
    private String projectname;
    private String projectid;
    private int devicenum;
    private String createtime;


    public String getProjectid() {
        return projectid;
    }

    public void setProjectid(String projectid) {
        this.projectid = projectid;
    }

    public String getProjectname() {
        return projectname;
    }

    public void setProjectname(String projectname) {
        this.projectname = projectname;
    }

    public int getDevicenum() {
        return devicenum;
    }

    public void setDevicenum(int devicenum) {
        this.devicenum = devicenum;
    }

    public String getCreatetime() {
        return createtime;
    }

    public void setCreatetime(String createtime) {
        this.createtime = createtime;
    }
}
