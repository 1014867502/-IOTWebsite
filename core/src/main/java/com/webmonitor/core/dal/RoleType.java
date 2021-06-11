package com.webmonitor.core.dal;

public enum RoleType {
    users(0),//普通用户
    companyadmin(1),//供销商管理员
    superadmin(2),//超级管理员
    NONE(-1);


    private int index;

    public boolean Compare(int i) {
        return this.index == i;
    }

    public static RoleType getIndex(int type) {
        RoleType[] As = values();
        for(int i = 0; i < As.length; ++i) {
            if (As[i].Compare(type)) {
                return As[i];
            }
        }

        return NONE;
    }


    public int getIndex() {
        return this.index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    private RoleType(int index) {
        this.index = index;
    }
}
