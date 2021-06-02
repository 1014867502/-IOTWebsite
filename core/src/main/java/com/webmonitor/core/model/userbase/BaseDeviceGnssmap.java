package com.webmonitor.core.model.userbase;

public class BaseDeviceGnssmap {
    public String getStationname() {
        return stationname;
    }

    public void setStationname(String stationname) {
        this.stationname = stationname;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
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

    public double getDx() {
        return dx;
    }

    public void setDx(double dx) {
        this.dx = dx;
    }

    public double getDy() {
        return dy;
    }

    public void setDy(double dy) {
        this.dy = dy;
    }

    public double getDz() {
        return dz;
    }

    public void setDz(double dz) {
        this.dz = dz;
    }

    public double getSumdx() {
        return sumdx;
    }

    public void setSumdx(double sumdx) {
        this.sumdx = sumdx;
    }

    public double getSumdy() {
        return sumdy;
    }

    public void setSumdy(double sumdy) {
        this.sumdy = sumdy;
    }

    public double getSumdz() {
        return sumdz;
    }

    public void setSumdz(double sumdz) {
        this.sumdz = sumdz;
    }

    public String getCreatetiontime() {
        return createtiontime;
    }

    public void setCreatetiontime(String createtiontime) {
        this.createtiontime = createtiontime;
    }

    String stationname;
    String sn;
    double lat;
    double lon;
    double height;
    double dx;
    double dy;
    double dz;
    double north;

    public double getNorth() {
        return north;
    }

    public void setNorth(double north) {
        this.north = north;
    }

    public double getEast() {
        return east;
    }

    public void setEast(double east) {
        this.east = east;
    }

    public double getAlt() {
        return alt;
    }

    public void setAlt(double alt) {
        this.alt = alt;
    }

    double east;
    double alt;
    double sumdx;
    double sumdy;
    double sumdz;
    String createtiontime;
}
