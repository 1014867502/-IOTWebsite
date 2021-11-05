package com.webmonitor.core.model;

/**这个针对项目设备的在线离线情况**/
public class ProDevCount {
    private int sum;
    private int outcount;
    private int oncount;
    private int unprojcount;
    private int newcount;

    public int getUnprojcount() {
        return unprojcount;
    }

    public void setUnprojcount(int unprojcount) {
        this.unprojcount = unprojcount;
    }

    public int getNewcount() {
        return newcount;
    }

    public void setNewcount(int newcount) {
        this.newcount = newcount;
    }

    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum = sum;
    }

    public int getOutcount() {
        return outcount;
    }

    public void setOutcount(int outcount) {
        this.outcount = outcount;
    }

    public int getOncount() {
        return oncount;
    }

    public void setOncount(int oncount) {
        this.oncount = oncount;
    }
}
