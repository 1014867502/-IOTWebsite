package com.webmonitor.core.dal;

public enum RoleType {
    user(0,"user"),//普通用户
    companyadmin(1, "companyadmin"),//供销商管理员
    superadmin(2, "superadmin"),//超级管理员
    admin(4, "admin"),//普通管理员
    test(3,"tester"),//安装测试人员
    NONE(-1, "NONE");


    private int index;
    private String value;

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
            if (As[i].getIndex()==type) {
                return As[i].getValue();
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
                break;
            case 4:
                name="普通管理员";
                break;
        }
        return name;
    }

    public int getIndex() {
        return this.index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    private RoleType(int index, String user) {
        this.index = index;
        this.value=user;
    }
}
