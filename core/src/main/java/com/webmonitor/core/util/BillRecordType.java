package com.webmonitor.core.util;

public enum BillRecordType {
    TYPE_INCOME(0),	    //充值
    TYPE_PAY_STATIC_SOLUTION,	//静态解算支出
    TYPE_PAY_DYNAMIC_SOLUTION,
    TYPE_PAY_NTRIP_RTK_ACCOUNT,
    TYPE_PAY_RINEX,
    TYPE_PAY_VIRTUAL_RINEX,
    TYPE_PAY_COORD_CHANGE,
    TYPE_PAY_NTRIP_RTD_ACCOUNT,
    ;

    private BillRecordType()
    {
        this.swigValue = SwigNext.next++;
    }
    private BillRecordType(int swigValue)
    {
        this.swigValue = swigValue;
        SwigNext.next = swigValue+1;
    }
    public int swigValue()
    {
        return this.swigValue;
    }

    public static BillRecordType swigToEnum(int swigValue)
    {
        BillRecordType[] swigValues = BillRecordType.class.getEnumConstants();
        if (swigValue < swigValues.length && swigValue >= 0 && swigValues[swigValue].swigValue == swigValue)
            return swigValues[swigValue];
        for (BillRecordType swigEnum : swigValues)
            if (swigEnum.swigValue == swigValue)
                return swigEnum;
        return TYPE_INCOME;
    }

    private final int swigValue;
    private static class SwigNext
    {
        private static int next = 0;
    }
}
