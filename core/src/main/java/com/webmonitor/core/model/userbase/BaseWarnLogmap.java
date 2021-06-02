package com.webmonitor.core.model.userbase;

public class BaseWarnLogmap {
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDeviceNumber() {
        return DeviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        DeviceNumber = deviceNumber;
    }

    public String getCreatetiontime() {
        return createtiontime;
    }

    public void setCreatetiontime(String createtiontime) {
        this.createtiontime = createtiontime;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getSolvetype() {
        return solvetype;
    }

    public void setSolvetype(int solvetype) {
        this.solvetype = solvetype;
    }

    public String getSolvenote() {
        return solvenote;
    }

    public void setSolvenote(String solvenote) {
        this.solvenote = solvenote;
    }

    public String getSolvetime() {
        return solvetime;
    }

    public void setSolvetime(String solvetime) {
        this.solvetime = solvetime;
    }

    public String getSolveperson() {
        return solveperson;
    }

    public void setSolveperson(String solveperson) {
        this.solveperson = solveperson;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public String getProjectid() {
        return projectid;
    }

    public void setProjectid(String projectid) {
        this.projectid = projectid;
    }

    int id;                 //数据库id
    String name;            //设备名称
    String DeviceNumber;              //设备sn号
    String createtiontime;  //创建时间
    int level;            //消息等级
    String content;      //消息内容
    int solvetype;       //处理方式
    String solvenote;   //处理描述
    String solvetime;   //处理时间
    String solveperson; //处理人
    int state;        //信息状态
    String projectid; //所属项目id
}
