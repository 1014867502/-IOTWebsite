package com.webmonitor.admin.common.kit;


import com.webmonitor.core.util.Tools;

public class APP {
    // 应用版权
    private String copyright;
    // 应用域名
    private String domain;
    // 应用名称
    private String name;
    // 应用描述
    private String descr;
    //
    private String rinexDatapath;

    private String rinexConvertoutputpath;

    private static APP app;

    private APP(){}

    public static APP getInstance() {
        if (app != null) {
            return app;
        }
        app = new APP();
        app.setName(Tools.getConfig("app_main_title"));
        app.setDomain(Tools.getConfig("app_domain"));
        app.setCopyright(Tools.getConfig("app_copyright"));
        app.setDescr(Tools.getConfig("app_descr"));
        app.setRinexDatapath(Tools.getConfig("app_rinexData_path"));
        app.setRinexConvertoutputpath(Tools.getConfig("app_rinexConvert_output_path"));
        return app;
    }

    public String getCopyright() {
        return copyright;
    }

    public void setCopyright(String copyright) {
        this.copyright = copyright;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescr() {
        return descr;
    }

    public void setDescr(String descr) {
        this.descr = descr;
    }

    public String getRinexDatapath() {
        return rinexDatapath;
    }

    public void setRinexDatapath(String rinexDatapath) {
        this.rinexDatapath = rinexDatapath;
    }

    public String getRinexConvertoutputpath() {
        return rinexConvertoutputpath;
    }

    public void setRinexConvertoutputpath(String rinexConvertoutputpath) {
        this.rinexConvertoutputpath = rinexConvertoutputpath;
    }
}
