package com.webmonitor.core.util;

import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class ValueSmooth {
    private List<ValueData> mValueList = new ArrayList<>();

    private static final int mMax = 12;
    private  int[] mCoe = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };

    private int mStep = 12;

    private Date mLastTime = new Date(2000,1,1,0,0);

    public void reset()
    {
        mLastTime = new Date(2000,1,1,0,0);

        mValueList.clear();
    }

    public void setStep(int value)
    {
        mStep = value;

        if (mStep < 1)
        {
            mStep = 1;
        }

        if (mStep > 12)
        {
            mStep = 12;
        }
    }

    public int getStep()
    {
        return mStep;
    }

    public double addValue(Date time, double value)
    {
        if (time ==null)
        {
            return 0xFFFFFFFF;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(time);

        if (calendar.get(Calendar.YEAR)<2015)
        {
            return 0xFFFFFFFF;
        }

        Calendar lastTimecalendar = Calendar.getInstance();
        lastTimecalendar.setTime(mLastTime);

        double minute = calendar.get(Calendar.MINUTE) - lastTimecalendar.get(Calendar.MINUTE);

        // 如果时间间隔大于24小时，就重新初始化 [4/7/2020  18:39:07 HuangKun]
        if (minute > 1440)
        {
            reset();
        }
        //========================================================================

        double sum = 0;


        ValueData tem = new ValueData();
        tem.time = time;
        tem.velue = value;

        mValueList.add(tem);

        while (mValueList.size() > mStep)
        {
            mValueList.remove(0);
        }

        int nSum_Coe = 0;
        int nCount = mValueList.size();

        for (int i = 0; i < nCount; i++)
        {
            nSum_Coe += mCoe[i];

            sum += mValueList.get(i).velue * mCoe[i];
        }

        sum /= nSum_Coe;
        value = sum;
        //value = sum / mValueList.GetSize();

        mLastTime = time;

        return value;
    }
    class ValueData
    {
        public Date time=new Date();
        public double velue;
    }
}
