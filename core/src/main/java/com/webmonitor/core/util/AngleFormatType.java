package com.webmonitor.core.util;

/**
 * Created by geo on 2017/9/11.
 */

public enum AngleFormatType
{
    FORMAT_ANGLE_DU_FENMIAO(0),	    //度.分秒;
    FORMAT_ANGLE_DU_FEN_MIAO_COLON,	//度:分:秒;
    FORMAT_ANGLE_DU_FEN_MIAO_UNIT,	//度°分′秒″;
    FORMAT_ANGLE_DECIMAL_DU,	    //度;
    FORMAT_ANGLE_MIAO,	            //秒;
    FORMAT_ANGLE_RADIAN,            //弧度;
    FORMAT_ANGLE_DU_FEN_MIAO_dms,	//度d分m秒s
    ;

    private AngleFormatType()
    {
        this.swigValue = SwigNext.next++;
    }
    private AngleFormatType(int swigValue)
    {
        this.swigValue = swigValue;
        SwigNext.next = swigValue+1;
    }
    public int swigValue()
    {
        return this.swigValue;
    }

    public static AngleFormatType swigToEnum(int swigValue)
    {
        AngleFormatType[] swigValues = AngleFormatType.class.getEnumConstants();
        if (swigValue < swigValues.length && swigValue >= 0 && swigValues[swigValue].swigValue == swigValue)
            return swigValues[swigValue];
        for (AngleFormatType swigEnum : swigValues)
            if (swigEnum.swigValue == swigValue)
                return swigEnum;
        return FORMAT_ANGLE_DU_FENMIAO;
    }

    private final int swigValue;
    private static class SwigNext
    {
        private static int next = 0;
    }

    public static int BLMODE_NONE = 0;
    public static int BLMODE_B = 2;
    public static int BLMODE_L = 1;

    //解析整型数;
    public  int parseInt(String strValue)
    {
        try
        {
            return Integer.parseInt(strValue);
        }
        catch (Exception e)
        {
            return 0;
        }
    }

    //解析浮点数;
    public  double parseDouble(String strValue)
    {
        try
        {
            return Double.parseDouble(strValue);
        }
        catch (Exception e)
        {
            return 0;
        }
    }

    public String toString(double dAngle)
    {
        return toString(dAngle, BLMODE_NONE);
    }

    public String toString(double dAngle, int mode)
    {
        return toString(dAngle, mode, mode == BLMODE_NONE?6:4);
    }

    // mode:0-普通，1-东西，2-南北
    public String toString(double dAngle, int mode, int nDecimalDigits)
    {
        // 如果是负数，就应该加上负号 [6/26/2009 HuangKun]
        boolean bNegative = false;
        if (dAngle < 1E-10 && Math.abs(dAngle) > 1E-10) {
            bNegative = true;
        }
        dAngle = Math.abs(dAngle);

        String strAngle = "";
        switch (this)
        {
            case FORMAT_ANGLE_DU_FENMIAO:// 度.分秒
            case FORMAT_ANGLE_DU_FEN_MIAO_COLON:// 度:分:秒
            case FORMAT_ANGLE_DU_FEN_MIAO_UNIT:// 度°分′秒″
            case FORMAT_ANGLE_DU_FEN_MIAO_dms:// 度d分m秒s
            {
                // 转化为度分秒 ;
                double Temp;
                double du, fen, miao;
                du = Math.floor(dAngle); // 不取小数;
                fen = dAngle - (int) du;
                Temp = fen * 60;
                fen = Math.floor(Temp); // 不取小数;
                miao = Temp - (int) fen;
                miao = miao * 60;

                if (Math.abs(miao - 60.0) < 1E-4)
                {
                    miao = 0.0;
                    fen = fen + 1.0;
                    if (Math.abs(fen - 60.0) < 1E-4)
                    {
                        fen = 0.0;
                        du += 1.0;
                    }
                }

                // 秒调整——等于60处理
                if (Math.abs(miao - 60.0) < 1E-5)
                {
                    miao = 0;
                    fen++;
                }

                // 分调整——等于60处理;
                if (Math.abs(fen - 60) < 1E-5)
                {
                    fen = 0;
                    du++;
                }

                String strSecond;
                strSecond = StringUtils.valueOf(miao, nDecimalDigits/*, false*/);
                if (strSecond.indexOf('.') == 1 || strSecond.length() <= 1)
                    strSecond = "0" + strSecond;

                if (AngleFormatType.FORMAT_ANGLE_DU_FEN_MIAO_COLON == this) {
                    strAngle = StringUtils.format("%d:%02d:%s", (int) (du), (int) (fen), strSecond);
                    if (mode == AngleFormatType.BLMODE_L) {
                        strAngle = (bNegative ? "W" : "E") + strAngle;
                        bNegative = false;
                    }
                    else if (mode == AngleFormatType.BLMODE_B){
                        strAngle = (bNegative ? "S" : "N") + strAngle;
                        bNegative = false;
                    }
                }
                else if (AngleFormatType.FORMAT_ANGLE_DU_FEN_MIAO_UNIT == this){
                    strAngle = StringUtils.format("%d°%02d′%s″", (int) (du), (int) (fen), strSecond);
                    if (mode == AngleFormatType.BLMODE_L) {
                        strAngle = (bNegative ? "W" : "E") + strAngle;
                        bNegative = false;
                    }
                    else if (mode == AngleFormatType.BLMODE_B){
                        strAngle = (bNegative ? "S" : "N") + strAngle;
                        bNegative = false;
                    }
                }
                else if (AngleFormatType.FORMAT_ANGLE_DU_FEN_MIAO_dms == this){
                    strAngle = StringUtils.format("%dd%02dm%ss", (int) (du), (int) (fen), strSecond);
                    if (mode == AngleFormatType.BLMODE_L) {
                        strAngle = (bNegative ? "W" : "E") + strAngle;
                        bNegative = false;
                    }
                    else if (mode == AngleFormatType.BLMODE_B){
                        strAngle = (bNegative ? "S" : "N") + strAngle;
                        bNegative = false;
                    }
                }
                else {
                    strSecond = strSecond.replace(".", "");
                    strAngle = StringUtils.valueOf("%d.%02d%s", (int) (du), (int) (fen), strSecond);
                }
            }
            break;
            case FORMAT_ANGLE_DECIMAL_DU:// 度
                strAngle = StringUtils.valueOf(dAngle, nDecimalDigits+4);
                break;
            case FORMAT_ANGLE_MIAO:// 秒
                strAngle = StringUtils.valueOf(dAngle * 3600.0, nDecimalDigits);
                break;
            case FORMAT_ANGLE_RADIAN:// 增加弧度格式
                strAngle = StringUtils.valueOf(dAngle * Math.PI / 180.0, nDecimalDigits + 6);
                break;
            default:
                break;
        }

        // 如果是负数，就应该加上负号 [6/26/2009 HuangKun]
        if (bNegative)
        {
            strAngle = StringUtils.format("-%s", strAngle);
        }

        return strAngle;
    }

    //通过自符串获取角度
    public double toValue(String strAngleString)
    {
        double dDegree = 0;
        if (strAngleString == null || strAngleString.isEmpty())
        {
            return dDegree;
        }
        boolean bNegative = false;
        if (strAngleString.charAt(0) == '-') {
            bNegative = true;
            strAngleString = strAngleString.substring(1);
        }

        String strDu, strFen, strMiao;
        switch (this)
        {
            case FORMAT_ANGLE_DU_FENMIAO://度.分秒
            {
                double a = 0.0, b = 0.0, c = 0.0;
                double du = 0.0, J1, J2;

                double angle = parseDouble(strAngleString);
                //度转换为弧度
                if (Math.abs(angle) > 1E-9) {
                    a = (int) (angle + 1E-12);
                    J1 = (angle + 1E-12) - a;

                    J2 = 100.0 * J1;
                    b = (int) (J2 + 1E-12);
                    J1 = (J2 + 1E-12) - b;

                    J2 = 100.0 * J1;
                    c = (int) (J2 + 1E-12);
                    J1 = (J2 + 1E-12) - c;

                    J2 = 100.0 * J1;
                    du = a + b / 60.0 + c / 3600.0 + J2 / 360000.0;
                }
                dDegree = du;
            }
            break;
            case FORMAT_ANGLE_DU_FEN_MIAO_UNIT:	//度°分′秒″
                strAngleString = strAngleString.replace("°", ":");
                strAngleString = strAngleString.replace("′", ":");
                strAngleString = strAngleString.replace("″", "");
            case FORMAT_ANGLE_DU_FEN_MIAO_dms:	//度d分m秒s
                strAngleString = strAngleString.replace("d", ":");
                strAngleString = strAngleString.replace("m", ":");
                strAngleString = strAngleString.replace("s", "");
            case FORMAT_ANGLE_DU_FEN_MIAO_COLON://度:分:秒
            {
                strAngleString = strAngleString.replace("W", "-");
                strAngleString = strAngleString.replace("S", "-");
                strAngleString = strAngleString.replace("E", "");
                strAngleString = strAngleString.replace("N", "");

                strDu = "";
                strFen = "";
                strMiao = "";

                String[] Res = strAngleString.split(":");
                if (Res.length > 0)
                    strDu = Res[0];
                if (Res.length > 1)
                    strFen = Res[1];
                if (Res.length > 2){
                    strMiao = Res[2];
                }

                if (strDu.indexOf('-') >= 0)
                {
                    dDegree = parseDouble(strDu)
                            - parseDouble(strFen)/60.0
                            - parseDouble(strMiao)/3600.0;
                }else {
                    dDegree = parseDouble(strDu)
                            + parseDouble(strFen) / 60.0
                            + parseDouble(strMiao) / 3600.0;
                }
            }
            break;
            case FORMAT_ANGLE_DECIMAL_DU://度
                dDegree = parseDouble(strAngleString);
                break;
            case FORMAT_ANGLE_MIAO: //秒
                dDegree = parseDouble(strAngleString)/3600.0;
                break;
            case FORMAT_ANGLE_RADIAN:// 增加弧度格式
                dDegree =  parseDouble(strAngleString) * 180.0 / Math.PI;
                break;
            default:
                break;
        }
        if (bNegative)
            dDegree *= -1;

        return dDegree;
    }

//    public String getAngleFormat()
//    {
//        switch (this)
//        {
//            case FORMAT_ANGLE_DU_FEN_MIAO_COLON:
//                return getString(R.string.radio_angle_format_dd_mm_ssss);
//            case FORMAT_ANGLE_DU_FEN_MIAO_UNIT:
//                return getString(R.string.radio_angle_format_dd_mm_ssss_);
//            case FORMAT_ANGLE_RADIAN:
//                return getString(R.string.radio_angle_format_radian);
//            case FORMAT_ANGLE_DU_FENMIAO:
//                return getString(R.string.radio_angle_format_dd_mmssss);
//            case FORMAT_ANGLE_DECIMAL_DU:
//            default:
//                return getString(R.string.radio_angle_format_dd_dddddd);
//        }
//    }
}

