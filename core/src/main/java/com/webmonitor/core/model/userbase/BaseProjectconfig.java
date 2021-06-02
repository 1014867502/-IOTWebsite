package com.webmonitor.core.model.userbase;

public class BaseProjectconfig {
    public String getProjid() {
        return projid;
    }

    public void setProjid(String projid) {
        this.projid = projid;
    }

    public int getResultCallbackport() {
        return resultCallbackport;
    }

    public void setResultCallbackport(int resultCallbackport) {
        this.resultCallbackport = resultCallbackport;
    }

    public int getBasecallbackport() {
        return basecallbackport;
    }

    public void setBasecallbackport(int basecallbackport) {
        this.basecallbackport = basecallbackport;
    }

    public int getStationcallbackport() {
        return stationcallbackport;
    }

    public void setStationcallbackport(int stationcallbackport) {
        this.stationcallbackport = stationcallbackport;
    }

    public double getTimezone() {
        return timezone;
    }

    public void setTimezone(double timezone) {
        this.timezone = timezone;
    }

    public boolean getAutoclearbasedata() {
        return autoclearbasedata;
    }

    public void setAutoclearbasedata(boolean autoclearbasedata) {
        this.autoclearbasedata = autoclearbasedata;
    }

    public int getSolutioninterval() {
        return solutioninterval;
    }

    public void setSolutioninterval(int solutioninterval) {
        this.solutioninterval = solutioninterval;
    }

    public boolean getAutoclearraw() {
        return autoclearraw;
    }

    public void setAutoclearraw(boolean autoclearraw) {
        this.autoclearraw = autoclearraw;
    }

    public int getRelaytype() {
        return relaytype;
    }

    public void setRelaytype(int relaytype) {
        this.relaytype = relaytype;
    }

    public String getTargetIP() {
        return targetIP;
    }

    public void setTargetIP(String targetIP) {
        this.targetIP = targetIP;
    }

    public String getTargetPort() {
        return targetPort;
    }

    public void setTargetPort(String targetPort) {
        this.targetPort = targetPort;
    }

    public String getRoverAddress() {
        return roverAddress;
    }

    public void setRoverAddress(String roverAddress) {
        this.roverAddress = roverAddress;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    String projid;
    int resultCallbackport; //结果回传端口
    int basecallbackport;   //基站回传端口
    int stationcallbackport; //测站回传端口
    double timezone;         //时区
    boolean autoclearbasedata; //自动清理基站数据
    int solutioninterval;     //解算间隔
    boolean autoclearraw;      //自动清理原理数据
    int relaytype;            //转发方式
    String targetIP;          //目标IP
    String targetPort;        //目标端口
    String roverAddress;
    String note;              //备注
}
