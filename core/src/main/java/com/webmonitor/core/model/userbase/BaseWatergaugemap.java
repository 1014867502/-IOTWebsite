package com.webmonitor.core.model.userbase;

public class BaseWatergaugemap {
    public String getSavetime() {
        return savetime;
    }

    public void setSavetime(String savetime) {
        this.savetime = savetime;
    }

    public double getLevel() {
        return level;
    }

    public void setLevel(double level) {
        this.level = level;
    }

    String savetime;
    double level;
}
