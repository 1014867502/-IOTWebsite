package com.webmonitor.core.dal;

public enum RoleType {
    user(0),//普通用户
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

    public static String getString(int type) {
        String s="";
        RoleType[] As = values();
        for(int i = 0; i < As.length; ++i) {
            if (As[i].Compare(type)) {
                return As[i].getIndex(i).toString();
            }
        }
        return "none";
    }

    public static String getTypeName(int type){
        String name="";
        switch(type){
            case 0:
                name="普通用户";
                break;
            case 1:
                name="供销商管理员";
                break;
            case 2:
                name="超级管理员";
                break;
            case 3:
                name="安装测试人员";
        }
        return name;
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
