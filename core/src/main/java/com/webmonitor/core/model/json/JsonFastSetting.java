package com.webmonitor.core.model.json;

/**针对快速配置页面设置json报文对应实体类**/
public class JsonFastSetting {
    private String computemode;//解算模式
    private String name;//测站编号
    private String odermode;//测站类型
    private String rateorder;//采样频率
    private String baselon;//基准站经度
    private String baselat;//基准站纬度
    private String baseheight;//基准站高度
    private String rawip;//原始通信ip（基站文件回传）
    private String rawport;//原始通信端口（基站文件回传端口）
    private String resultip;//结果状态ip（设备状态回传）
    private String resultport;//结果状态端口（设备状态回传）

    public String getComputemode() {
        return computemode;
    }

    public void setComputemode(String computemode) {
        this.computemode = computemode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOdermode() {
        return odermode;
    }

    public void setOdermode(String odermode) {
        this.odermode = odermode;
    }

    public String getRateorder() {
        return rateorder;
    }

    public void setRateorder(String rateorder) {
        this.rateorder = rateorder;
    }

    public String getBaselon() {
        return baselon;
    }

    public void setBaselon(String baselon) {
        this.baselon = baselon;
    }

    public String getBaselat() {
        return baselat;
    }

    public void setBaselat(String baselat) {
        this.baselat = baselat;
    }

    public String getBaseheight() {
        return baseheight;
    }

    public void setBaseheight(String baseheight) {
        this.baseheight = baseheight;
    }

    public String getRawip() {
        return rawip;
    }

    public void setRawip(String rawip) {
        this.rawip = rawip;
    }

    public String getRawport() {
        return rawport;
    }

    public void setRawport(String rawport) {
        this.rawport = rawport;
    }

    public String getResultip() {
        return resultip;
    }

    public void setResultip(String resultip) {
        this.resultip = resultip;
    }

    public String getResultport() {
        return resultport;
    }

    public void setResultport(String resultport) {
        this.resultport = resultport;
    }
}
