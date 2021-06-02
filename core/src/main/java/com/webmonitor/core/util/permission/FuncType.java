package com.webmonitor.core.util.permission;

public enum FuncType {
    TYPE_NONE(0),	    //没有任何权限，普通用户
    TYPE_NEAREST_BASE(1),	//最近站功能0x01
    TYPE_BROADCAST_PAR(2),  //参数播发0x10
    TYPE_GNSSNET_CORE(4),  //连接VRS 0x100
    ;

    private FuncType()
    {
        this.swigValue = SwigNext.next++;
    }
    private FuncType(int swigValue)
    {
        this.swigValue = swigValue;
        SwigNext.next = swigValue+1;
    }
    public int swigValue()
    {
        return this.swigValue;
    }

    public static FuncType swigToEnum(int swigValue)
    {
        FuncType[] swigValues = FuncType.class.getEnumConstants();
        if (swigValue < swigValues.length && swigValue >= 0 && swigValues[swigValue].swigValue == swigValue)
            return swigValues[swigValue];
        for (FuncType swigEnum : swigValues)
            if (swigEnum.swigValue == swigValue)
                return swigEnum;
        return TYPE_NONE;
    }

    private final int swigValue;
    private static class SwigNext
    {
        private static int next = 0;
    }
}