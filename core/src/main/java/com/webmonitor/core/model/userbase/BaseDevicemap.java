package com.webmonitor.core.model.userbase;

public class BaseDevicemap {
    int id;
    String projectid;
    String stationname;
    String name;
    String sn;
    int typeid;
    int onlinestate;
    double lat;
    double lon;
    double height;
    String pic;
    String devicemodel;
    String projectname;
    boolean remotemanage;
    int recordinterval;
    boolean backsolution;
    int communicationtype;
    String ip;
    int port;
    int listenport;
    String serialport;
    int baud;
    String devicenumber;
    //地图显示需要，修正的经纬度
    double transLat;
    double transLon;
    //关联设备ID
    String relationSn;
    String typeTitle;
    boolean judgesensor;//判断是否为传感器
    int warnsettingid;  //预警设置id

    public int getWarnsettingid() {
        return warnsettingid;
    }

    public void setWarnsettingid(int warnsettingid) {
        this.warnsettingid = warnsettingid;
    }



    public boolean isJudgesensor() {
        return judgesensor;
    }

    public void setJudgesensor(boolean judgesensor) {
        this.judgesensor = judgesensor;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProjectid() {
        return projectid;
    }

    public void setProjectid(String projectid) {
        this.projectid = projectid;
    }

    public String getStationname() {
        return stationname;
    }

    public void setStationname(String stationname) {
        this.stationname = stationname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public int getTypeid() {
        return typeid;
    }

    public void setTypeid(int typeid) {
        this.typeid = typeid;
    }

    public int getOnlinestate() {
        return onlinestate;
    }

    public void setOnlinestate(int onlinestate) {
        this.onlinestate = onlinestate;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getDevicemodel() {
        return devicemodel;
    }

    public void setDevicemodel(String devicemodel) {
        this.devicemodel = devicemodel;
    }

    public String getProjectname() {
        return projectname;
    }

    public void setProjectname(String projectname) {
        this.projectname = projectname;
    }

    public boolean getRemotemanage() {
        return remotemanage;
    }

    public void setRemotemanage(boolean remotemanage) {
        this.remotemanage = remotemanage;
    }

    public int getRecordinterval() {
        return recordinterval;
    }

    public void setRecordinterval(int recordinterval) {
        this.recordinterval = recordinterval;
    }

    public boolean getBacksolution() {
        return backsolution;
    }

    public void setBacksolution(boolean backsolution) {
        this.backsolution = backsolution;
    }

    public int getCommunicationtype() {
        return communicationtype;
    }

    public void setCommunicationtype(int communicationtype) {
        this.communicationtype = communicationtype;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getSerialport() {
        return serialport;
    }

    public void setSerialport(String serialport) {
        this.serialport = serialport;
    }

    public int getBaud() {
        return baud;
    }

    public void setBaud(int baud) {
        this.baud = baud;
    }

    public int getListenport() {
        return listenport;
    }

    public void setListenport(int listenport) {
        this.listenport = listenport;
    }

    public String getDevicenumber() {
        return devicenumber;
    }

    public void setDevicenumber(String devicenumber) {
        this.devicenumber = devicenumber;
    }

    public double getTransLat() {
        return transLat;
    }

    public void setTransLat(double transLat) {
        this.transLat = transLat;
    }

    public double getTransLon() {
        return transLon;
    }

    public void setTransLon(double transLon) {
        this.transLon = transLon;
    }

    public String getRelationSn() {
        return relationSn;
    }

    public void setRelationSn(String relationSn) {
        this.relationSn = relationSn;
    }

    public String getTypeTitle() {
        return typeTitle;
    }

    public void setTypeTitle(String typeTitle) {
        this.typeTitle = typeTitle;
    }
}
