package com.webmonitor.core.model.userbase;

public class BaseProjectmap {
    String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getIncharge() {
        return incharge;
    }

    public void setIncharge(String incharge) {
        this.incharge = incharge;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public int getDevicecount() {
        return devicecount;
    }

    public void setDevicecount(int devicecount) {
        this.devicecount = devicecount;
    }

    public String getProjId() {
        return projId;
    }

    public void setProjId(String projId) {
        this.projId = projId;
    }

    String projId;
    double lat;
    double lon;

    public double getAlt() {
        return alt;
    }

    public void setAlt(double alt) {
        this.alt = alt;
    }

    double alt;
    String address;
    String profile;
    String incharge;
    String telephone;
    int devicecount;

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    String createDate;

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    int state;

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

    //地图显示需要，修正的经纬度
    double transLat;
    double transLon;
}
