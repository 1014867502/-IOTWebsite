package com.webmonitor.core.model.userbase;

public enum DevStateEnum {
    //所有 -1 online 0 离线 1 在线 2 正常 3 异常
    TYPE_All(-1),
    TYPE_Offline(0),
    TYPE_Online,
    TYPE_Ok,
    TYPE_Error,
    TYPE_Lowbattery,
    ;

    private DevStateEnum()
    {
        this.swigValue = SwigNext.next++;
    }
    private DevStateEnum(int swigValue)
    {
        this.swigValue = swigValue;
        SwigNext.next = swigValue+1;
    }
    public int swigValue()
    {
        return this.swigValue;
    }

    public static DevStateEnum swigToEnum(int swigValue)
    {
        DevStateEnum[] swigValues = DevStateEnum.class.getEnumConstants();
        if (swigValue < swigValues.length && swigValue >= 0 && swigValues[swigValue].swigValue == swigValue)
            return swigValues[swigValue];
        for (DevStateEnum swigEnum : swigValues)
            if (swigEnum.swigValue == swigValue)
                return swigEnum;
        return TYPE_Error;
    }

    private final int swigValue;
    private static class SwigNext
    {
        private static int next = 0;
    }
}