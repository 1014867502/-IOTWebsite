package com.webmonitor.core.model.userbase;
//统计用户类型数量
public class CustomCount {
    private int sum;
    private int ordinaryusers;
    private int comadmins;
    private int superadmins;

    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum = sum;
    }

    public int getOrdinaryusers() {
        return ordinaryusers;
    }

    public void setOrdinaryusers(int ordinaryusers) {
        this.ordinaryusers = ordinaryusers;
    }

    public int getComadmins() {
        return comadmins;
    }

    public void setComadmins(int comadmins) {
        this.comadmins = comadmins;
    }

    public int getSuperadmins() {
        return superadmins;
    }

    public void setSuperadmins(int superadmins) {
        this.superadmins = superadmins;
    }
}
