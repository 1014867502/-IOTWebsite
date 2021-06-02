package com.webmonitor.core.model.userbase;

public class BaseSumoffset {
    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
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

    public String getStationname() {
        return stationname;
    }

    public void setStationname(String stationname) {
        this.stationname = stationname;
    }

    int total;
    double sumdx;
    double sumdy;
    double sumdz;
    String stationname;
}
