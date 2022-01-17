package com.webmonitor.core.model.userbase;

import java.util.Date;

/**这个是连表查询过的项目实体类**/
public class BaseProjects {
    private String id;
    private String projectid;
    private String progroupname;
    private int devicenum;
    private String createtime;
    private String agentname;
    private String agentnumber;
    private String proLongitude;
    private String proLatitude;

    public String getProLongitude() {
        return proLongitude;
    }

    public void setProLongitude(String proLongitude) {
        this.proLongitude = proLongitude;
    }

    public String getProLatitude() {
        return proLatitude;
    }

    public void setProLatitude(String proLatitude) {
        this.proLatitude = proLatitude;
    }

    public String getAgentnumber() {
        return agentnumber;
    }

    public void setAgentnumber(String agentnumber) {
        this.agentnumber = agentnumber;
    }

    public String getAgentname() {
        return agentname;
    }

    public void setAgentname(String agentname) {
        this.agentname = agentname;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectid() {
        return projectid;
    }

    public void setProjectid(String projectid) {
        this.projectid = projectid;
    }

    public String getProgroupname() {
        return progroupname;
    }

    public void setProgroupname(String progroupname) {
        this.progroupname = progroupname;
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
