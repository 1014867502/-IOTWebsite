package com.webmonitor.core.model.userbase;

public class BaseDevcount {
    int stateok;

    public int getStateok() {
        return stateok;
    }

    public void setStateok(int stateok) {
        this.stateok = stateok;
    }

    public int getStateerror() {
        return stateerror;
    }

    public void setStateerror(int stateerror) {
        this.stateerror = stateerror;
    }

    public int getStateonline() {
        return stateonline;
    }

    public void setStateonline(int stateonline) {
        this.stateonline = stateonline;
    }

    public int getStateoffline() {
        return stateoffline;
    }

    public void setStateoffline(int stateoffline) {
        this.stateoffline = stateoffline;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    int stateerror;
    int stateonline;
    int stateoffline;
    int total;

    public int getLowbattery() {
        return lowbattery;
    }

    public void setLowbattery(int lowbattery) {
        this.lowbattery = lowbattery;
    }

    public int getNomalbattery() {
        return nomalbattery;
    }

    public void setNomalbattery(int nomalbattery) {
        this.nomalbattery = nomalbattery;
    }

    int lowbattery;
    int nomalbattery;
}
