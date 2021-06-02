package com.webmonitor.core.util;


import com.webmonitor.core.config.JfinalCoreConfig;
import com.webmonitor.core.model.userbase.LonLat;

import java.io.File;
import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Tools {
    /**
     * 判空 Collection、Map、数组、Iterator、Iterable 类型对象中的元素个数是否为 0
     * 规则：
     * 1：null 返回 true
     * 2：List、Set 等一切继承自 Collection 的，返回 isEmpty()
     * 3：Map 返回 isEmpty()
     * 4：数组返回 length == 0
     * 5：Iterator 返回  ! hasNext()
     * 6：Iterable 返回  ! iterator().hasNext()
     */
    public static boolean isEmpty(Object o) {
        if (o == null) {
            return true;
        }
        if (o instanceof Collection) {
            return ((Collection<?>) o).isEmpty();
        }
        if (o instanceof Map) {
            return ((Map<?, ?>) o).isEmpty();
        }
        if (o.getClass().isArray()) {
            return Array.getLength(o) == 0;
        }
        if (o instanceof Iterator) {
            return !((Iterator<?>) o).hasNext();
        }
        if (o instanceof Iterable) {
            return !((Iterable<?>) o).iterator().hasNext();
        }
        if (o instanceof String) {
            if (o.toString().equals("")) {
                return true;
            }
        }
        return false;
    }

    /**
     * 对象组中是否存在 Empty Object
     * @param os 对象组
     * @return
     */
    public static boolean isOneEmpty(Object... os) {
        for (Object o : os) {
            if(isEmpty(o)){
                return true;
            }
        }
        return false;
    }

    /**
     * 对象组中是否全是 Empty Object
     * @param os
     * @return
     */
    public static boolean isAllEmpty(Object... os) {
        for (Object o : os) {
            if (!isEmpty(o)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 是否为数字
     * @param obj
     * @return
     */
    public static boolean isNum(Object obj) {
        try {
            Integer.parseInt(obj.toString());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 字符串是否为 true
     * @param str
     * @return
     */
    public static boolean isTrue(Object str) {
        if (isEmpty(str)) {
            return false;
        }
        str = str.toString().trim().toLowerCase();
        if (str.equals("true") || str.equals("on")) {
            return true;
        }
        return false;
    }

    /**
     * 格式化字符串->'str'
     * @param str
     * @return
     */
    public static String format(Object str) {
        return "'" + str.toString() + "'";
    }

    /**
     * 格式化文件路径中的目录分隔符
     * @param path 文件路径
     * @return
     */
    public static String formatPath(String path, Object... args) {
        return String.format(path.replace("/", File.separator), args);
    }

    /**
     * 强转->Integer
     * @param obj
     * @return
     */
    public static Integer toInt(Object obj) {
        return Integer.parseInt(obj.toString());
    }

    /**
     * 强转->Integer
     * @param obj
     * @param defaultValue
     * @return
     */
    public static Integer toInt(Object obj, int defaultValue) {
        if (isEmpty(obj)) {
            return defaultValue;
        }
        return toInt(obj);
    }

    /**
     * 强转->Long
     * @param obj
     * @return
     */
    public static long toLong(Object obj) {
        return Long.parseLong(obj.toString());
    }

    /**
     * 强转->Long
     * @param obj
     * @param defaultValue
     * @return
     */
    public static long toLong(Object obj, long defaultValue) {
        if (isEmpty(obj)) {
            return defaultValue;
        }
        return toLong(obj);
    }

    /**
     * 强转->Double
     * @param obj
     * @return
     */
    public static double toDouble(Object obj) {
        return Double.parseDouble(obj.toString());
    }
    public static double toDouble(Object obj,double defaultValue) {
        double rs = 0;
        try {
            rs = Double.parseDouble(obj.toString());
        }catch (Exception ex)
        {
            rs = defaultValue;
        }
        return rs;
    }

    /**
     * 强转->Boolean
     * @param obj
     * @return
     */
    public static Boolean toBoolean(Object obj) {
        return Boolean.parseBoolean(obj.toString());
    }

    /**
     * 强转->Boolean
     * @param obj
     * @param defaultValue
     * @return
     */
    public static Boolean toBoolean(Object obj, Boolean defaultValue) {
        if (isEmpty(obj)) {
            return defaultValue;
        }
        return toBoolean(obj);
    }

    /**
     * 强转->java.util.Date
     * @param str 日期字符串
     * @return
     */
    public static Date toDate(String str) {
        try {
            if (str == null || "".equals(str.trim()))
                return null;
            return new SimpleDateFormat("yyyy-MM-dd").parse(str.trim());
        } catch (Exception e) {
            throw new RuntimeException("Can not parse the parameter \"" + str + "\" to Date value.");
        }
    }

    public static String today() {
        Date date=new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

    public static String getCurrDateTime(String format) {
        Date date=new Date();
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(date);
    }
    public static boolean isValidDate(String str) {
        boolean convertSuccess=true;
        // 指定日期格式为四位年/两位月份/两位日期，注意yyyy/MM/dd区分大小写；
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            // 设置lenient为false. 否则SimpleDateFormat会比较宽松地验证日期，比如2007/02/29会被接受，并转换成2007/03/01
            format.setLenient(false);
            format.parse(str);
        } catch (ParseException e) {
            // e.printStackTrace();
            // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
            convertSuccess=false;
        }
        return convertSuccess;
    }

    public static String join(Collection<?> s) {
        return join(s, "", ",");
    }

    /**
     * 集合转字符串
     * @param s 集合
     * @param parcel 包裹符 e.g 'aa','bb'
     * @param sign 分割符 e.g 1,2
     * @return
     */
    public static String join(Collection<?> s, String parcel, String sign) {
        if (s.isEmpty())
            return "";
        Iterator<?> iter = s.iterator();
        StringBuilder sb = new StringBuilder(parcel + iter.next().toString() + parcel);
        while (iter.hasNext())
            sb.append(sign).append(parcel + iter.next() + parcel);
        return sb.toString();
    }

    /**
     * 删除开头字符串
     *
     * @param s 待处理字符串
     * @param sign 需要删除的符号
     * @return
     */
    public static String delStart(String s, String sign) {
        if (s.startsWith(sign)) {
            return s.substring(s.lastIndexOf(sign) + sign.length(), s.length());
        }
        return s;
    }

    /**
     * 删除末尾字符串
     *
     * @param s 待处理字符串
     * @param sign 需要删除的符号
     * @return
     */
    public static String delEnd(String s, String sign){
        if (isEmpty(s)) {
            return s;
        }
        if (s.endsWith(sign)) {
            return s.substring(0, s.lastIndexOf(sign));
        }
        return s;
    }

    /**
     * 获取配置项
     * @param key
     * @return
     */
    public static String getConfig(String key){
        String value = JfinalCoreConfig.getProps().get(key);
        if (value == null) {
            return "";
        }
        return value.trim();
    }

    /**
     * 获取配置项
     * @param key
     * @param defaultValue
     * @return
     */
    public static String getConfig(String key, String defaultValue){
        String value = JfinalCoreConfig.getProps().get(key);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }

    /**
     * 获取Bool配置
     * @param key
     * @param defaultValue
     * @return
     */
    public static boolean getConfigBool(String key, boolean defaultValue){
        return toBoolean(getConfig(key), defaultValue);
    }

    /**
     * 获取Int配置
     * @param key
     * @param defaultValue
     * @return
     */
    public static int getConfigInt(String key, int defaultValue){
        return toInt(getConfig(key), defaultValue);
    }

    /**
     * 消耗毫秒数
     * @param time
     */
    public static void costTime(long time) {
        System.err.println("Load Cost Time:" + (System.currentTimeMillis() - time) + "ms\n");
    }

    /**
     * 格式化输出JSON
     * @param json
     * @return
     */
    public static String formatJson(String json) {
        int level = 0;
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            if (level > 0 && '\n' == sb.charAt(sb.length() - 1)) {
                sb.append(getLevelStr(level));
            }
            switch (c) {
                case '{':
                case '[':
                    sb.append(c + "\n");
                    level++;
                    break;
                case ',':
                    sb.append(c + "\n");
                    break;
                case '}':
                case ']':
                    sb.append("\n");
                    level--;
                    sb.append(getLevelStr(level));
                    sb.append(c);
                    break;
                default:
                    sb.append(c);
                    break;
            }
        }
        return sb.toString();
    }

    private static String getLevelStr(int level){
        StringBuffer levelStr = new StringBuffer();
        for(int levelI = 0;levelI<level ; levelI++){
            levelStr.append("  ");
        }
        return levelStr.toString();
    }

    /**
     * 替换空格,换行符等
     *
     * @param s
     * @return
     */
    public static String replaceBlank(String s) {
        if (isEmpty(s)) {
            return s;
        }
        Pattern p = Pattern.compile("\\s*|\t|\r|\n");
        Matcher m = p.matcher(s);
        return m.replaceAll("");
    }

    /**
     * 是否超过了xx秒
     * @param oldTime 过去的时间点
     * @param timeoutSec 已过期时长
     * @return
     */
    public static boolean isTimeout(Long oldTime, int timeoutSec) {
        if (oldTime == null) {
            return true;
        }
        if ((System.currentTimeMillis() - oldTime) / 1000 > timeoutSec) {
            return true;
        }
        return false;
    }

    /**
     * 集合转数组
     * @param list
     * @return
     */
    public static Object[] toArray(List<Object> list) {
        Object[] os = new Object[list.size()];
        list.toArray(os);
        return os;
    }
    public static int Calendar_GPSweek(int year,int month,int day)
    {
        //计算GPS时
        int i;
        //注意时间只能是1980－2080年，其它时间暂时不考虑
        if (year < 1980)
        {
            if (year >= 80)
            {
                year += 1900;
            }
            else
            {
                year += 2000;
            }
        }

        //year=year+2000;
        i=(year-1980)*365-5+(year-1980)/4+1;//加1，是因为1980年也是闰年，应该算进去
        int SumMonthDay[]={0,31,59,90,120,151,181,212,243,273,304,334};
        int jday = SumMonthDay[month-1]+day;
        if((year%4)==0&&(month<=2))//如果该年是闰年，能被4整除，但月份为1、2月份，则日数减1
        {
            i--;
        }
        else
        {
            jday++;
        }
        i=i+SumMonthDay[month-1]+day-1;//－1是因为该天的天数不能加进去
        //allSecond = ( (i*24 + GPSTime.hour) * 60 + min ) * 60 + GPSTime.second;
        int week=i/7;

        return  week;
    }
    //比较日期大小
    public static int compareDate(Date date1, Date date2) {
        if (date1.before(date2)) {
            //System.out.println(date1 + "在" + date2 + "前面");
            return -1;
        } else if (date1.after(date2)) {
            //System.out.println(date1 + "在" + date2 + "后面");
            return 1;
        } else {
            //System.out.println("是同一天的同一时间");
            return 0;
        }
    }
    /// <summary>
    /// WGS84转化为火星坐标;
    /// </summary>
    /// <param name="wgLon">GPS坐标的经度;</param>
    /// <param name="wgLat">GPS坐标的纬度;</param>
    /// <returns>GCJ-02坐标;</returns>

    public static LonLat transform(double wgLon, double wgLat)
    {
//        if (outOfChina(wgLat, wgLon))
//        {
//            double mLat = wgLat;
//            double mLon = wgLon;
//            return new LonLat(mLon, mLat);
//        }
        //public static double a = 6378245.0;
        //public static double ee = 0.00669342162296594323;
        double a = 6378245.0;
        double ee = 0.00669342162296594323;

        double dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
        double dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
        double radLat = wgLat / 180.0 * Math.PI;
        double magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        double sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
        double mgLat = wgLat + dLat;
        double mgLon = wgLon + dLon;
        return new LonLat(mgLon, mgLat,0);
    }
    static public double transformLat(double x, double y)
    {
        double ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    static public double transformLon(double x, double y)
    {
        double ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
        return ret;
    }

}
