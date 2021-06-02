package com.webmonitor.core.model.userbase;

//含水率计的表格类
public class ExportSoilWord {
    private String datetime;
    private String node;
    private String temperature;
    private String moisture;
    private String qxDipX;
    private String qxDipY;
    private String qxElenYaw;
//    private int type;
//
//    public int getType() {
//        return type;
//    }
//
//    public void setType(int type) {
//        this.type = type;
//    }

    public String getDatetime() {
        return datetime;
    }

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getMoisture() {
        return moisture;
    }

    public void setMoisture(String moisture) {
        this.moisture = moisture;
    }

    public String getQxDipX() {
        return qxDipX;
    }

    public void setQxDipX(String qxDipX) {
        this.qxDipX = qxDipX;
    }

    public String getQxDipY() {
        return qxDipY;
    }

    public void setQxDipY(String qxDipY) {
        this.qxDipY = qxDipY;
    }

    public String getQxElenYaw() {
        return qxElenYaw;
    }

    public void setQxElenYaw(String qxElenYaw) {
        this.qxElenYaw = qxElenYaw;
    }
}
