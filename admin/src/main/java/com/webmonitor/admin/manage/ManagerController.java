package com.webmonitor.admin.manage;

import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.util.Tools;

public class ManagerController extends BaseController {

    public void dashboard() {
        String projetid = getCookie(IndexService.me.accessProjectId);
        setAttr("projetid", projetid);
        render("dashboard.html");
    }

    //设备管理页面
    public void devicemanage() {
//        String projetid = getCookie(IndexService.me.accessProjectId);
//        if (Tools.isEmpty(projetid))
//            projetid = "";
//        setAttr("projetid", projetid);
        render("devicemanage.html");
    }

    //预警日志管理页面
    public void warninghome() {
        String projetid = getCookie(IndexService.me.accessProjectId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("devicemanage.html");
    }

    //雨量计的网页
    public void waterdevicehome() {
        render("sensordata.html");
    }

    public void gnssdevicehome() {
        String projetid = getCookie(IndexService.me.accessProjectId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("devicelist.html");
    }

    public void sensordevicehome() {
        String projetid = getCookie(IndexService.me.accessProjectId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("sensorlist.html");
    }

    //报告管理的网页
    public void reportdevicehome() {
        String projetid = getCookie(IndexService.me.accessProjectId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("reportlist.html");
    }

    public void sensordatahome() {
        String sn = getPara("sn");
        int type = getParaToInt("type");
        if (type == 0) {
            //雨量计
            setAttr("sensorsn", sn);
            render("sensordata.html");
        } else if (type == 1) {
            //含水计
            setAttr("sensorsn", sn);
            render("sensorwaterdata.html");
        } else if (type == 2) {
            //加速度计
            setAttr("projid", getPara("projid"));
            setAttr("sensorsn", sn);
            render("sensoraccelerationdata.html");
        }

    }

    public void gnssdatahome() {
        String sn = getPara("sn");
        int type = getParaToInt("type");
        if (type == 0) {
            //移动站
            setAttr("projid", getPara("projid"));
            setAttr("gnssSN", sn);
            render("gnssoffsetdata.html");
        } else if (type == 1) {
            //基站
        }

    }
}
