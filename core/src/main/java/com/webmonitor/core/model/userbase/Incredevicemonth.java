package com.webmonitor.core.model.userbase;

import com.webmonitor.core.model.DeviceType;

import java.util.List;

public class Incredevicemonth {
    private String month;
    private List<DeviceType> devices;

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public List<DeviceType> getDevices() {
        return devices;
    }

    public void setDevices(List<DeviceType> devices) {
        this.devices = devices;
    }
}
