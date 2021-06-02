package com.webmonitor.core.model.userbase;

//雨量计表格类
public class ExportRainWord {
    private String beginTime;
    private String endTime;
    private String duration;
    private String rainfall;
    private String maxIntensity;
    private int type;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(String beginTime) {
        this.beginTime = beginTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getRainfall() {
        return rainfall;
    }

    public void setRainfall(String rainfall) {
        this.rainfall = rainfall;
    }

    public String getMaxIntensity() {
        return maxIntensity;
    }

    public void setMaxIntensity(String maxIntensity) {
        this.maxIntensity = maxIntensity;
    }
}
