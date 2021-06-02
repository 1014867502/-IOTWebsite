package com.webmonitor.admin.common.kit;

import com.jfinal.i18n.I18n;
import com.jfinal.i18n.Res;

public class I18nKit {

    public I18nKit()
    {
        lang = "zh";
    }

    private  String lang;
    public  String getLanguage()
    {
        return lang;
    }
    public  void setLanguage(String lang)
    {
        this.lang = lang;
    }
    public static String getI18nStr(String key) {
        String value="";
        Res res = I18n.use();
        // 直接获取数据
        value = res.get(key);
        return value;
    }
}
