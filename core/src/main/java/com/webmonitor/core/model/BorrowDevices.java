package com.webmonitor.core.model;

//过期设备
public class BorrowDevices {
    private int totalexpire;//总外借设备数
    private int currentexpire;//最近外借设备数
    private int outexpire;//过期设备数目
    private int inexpire;//未过期设备数目
    private int closeexpire;//快过期设备数目

    public int getTotalexpire() {
        return totalexpire;
    }

    public void setTotalexpire(int totalexpire) {
        this.totalexpire = totalexpire;
    }

    public int getCurrentexpire() {
        return currentexpire;
    }

    public void setCurrentexpire(int currentexpire) {
        this.currentexpire = currentexpire;
    }

    public int getOutexpire() {
        return outexpire;
    }

    public void setOutexpire(int outexpire) {
        this.outexpire = outexpire;
    }

    public int getInexpire() {
        return inexpire;
    }

    public void setInexpire(int inexpire) {
        this.inexpire = inexpire;
    }

    public int getCloseexpire() {
        return closeexpire;
    }

    public void setCloseexpire(int closeexpire) {
        this.closeexpire = closeexpire;
    }

    public BorrowDevices(int outexpire, int inexpire, int closeexpire) {
        this.outexpire = outexpire;
        this.inexpire = inexpire;
        this.closeexpire = closeexpire;
    }

    private BorrowDevices(Builder builder){
        outexpire=builder.outexpire;
        inexpire=builder.inexpire;
        closeexpire=builder.closeexpire;
        totalexpire=builder.totalexpire;
        currentexpire=builder.currentexpire;
    }

    public static class Builder{
        private int totalexpire;//总外借设备数
        private int currentexpire;//最近外借设备数
        private int outexpire;//过期设备数目
        private int inexpire;//未过期设备数目
        private int closeexpire;//快过期设备数目

        public Builder OutExpire(int outExpire){
            this.outexpire=outExpire;
            return this;
        }

        public Builder InExpire(int inExpire){
            this.inexpire=inExpire;
            return this;
        }

        public Builder CloseExpire(int closeExpire){
            this.closeexpire=closeExpire;
            return this;
        }

        public Builder TotalExpire(int totalExpire){
            this.totalexpire=totalExpire;
            return this;
        }
        public Builder CurrentExpire(int currentExpire){
            this.currentexpire=currentExpire;
            return this;
        }

        public BorrowDevices builder(){
            return new BorrowDevices(this);
        }
    }
}
