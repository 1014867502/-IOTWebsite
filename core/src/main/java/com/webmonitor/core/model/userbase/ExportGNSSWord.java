package com.webmonitor.core.model.userbase;

//GNSS表格类
public class ExportGNSSWord {
    private String createtiontime;
    private String dn;
    private String de;
    private String dh;
    private String totaldn;
    private String totalde;
    private String totaldh;
    private int type;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getCreatetiontime() {
        return createtiontime;
    }

    public void setCreatetiontime(String createtiontime) {
        this.createtiontime = createtiontime;
    }

    public String getDn() {
        return dn;
    }

    public void setDn(String dn) {
        this.dn = dn;
    }

    public String getDe() {
        return de;
    }

    public void setDe(String de) {
        this.de = de;
    }

    public String getDh() {
        return dh;
    }

    public void setDh(String dh) {
        this.dh = dh;
    }

    public String getTotaldn() {
        return totaldn;
    }

    public void setTotaldn(String totaldn) {
        this.totaldn = totaldn;
    }

    public String getTotalde() {
        return totalde;
    }

    public void setTotalde(String totalde) {
        this.totalde = totalde;
    }

    public String getTotaldh() {
        return totaldh;
    }

    public void setTotaldh(String totaldh) {
        this.totaldh = totaldh;
    }
}
