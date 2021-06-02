package com.webmonitor.core.model.userbase;

public class LonLat {
    double lon;

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getAlt() {
        return alt;
    }

    public void setAlt(double alt) {
        this.alt = alt;
    }

    double lat;
    double alt;
    public LonLat(double b,double l,double h)
    {
        lon = b;
        lat = l;
        alt = h;
    }
}
