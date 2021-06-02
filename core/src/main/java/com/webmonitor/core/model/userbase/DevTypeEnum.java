package com.webmonitor.core.model.userbase;

public enum DevTypeEnum {
    TYPE_GNSS(1),
    TYPE_Sensor,
    TYPE_Camera,
    ;

    private DevTypeEnum()
    {
        this.swigValue = SwigNext.next++;
    }
    private DevTypeEnum(int swigValue)
    {
        this.swigValue = swigValue;
        SwigNext.next = swigValue+1;
    }
    public int swigValue()
    {
        return this.swigValue;
    }

    public static DevTypeEnum swigToEnum(int swigValue)
    {
        DevTypeEnum[] swigValues = DevTypeEnum.class.getEnumConstants();
        if (swigValue < swigValues.length && swigValue >= 0 && swigValues[swigValue].swigValue == swigValue)
            return swigValues[swigValue];
        for (DevTypeEnum swigEnum : swigValues)
            if (swigEnum.swigValue == swigValue)
                return swigEnum;
        return TYPE_GNSS;
    }

    private final int swigValue;
    private static class SwigNext
    {
        private static int next = 0;
    }
}