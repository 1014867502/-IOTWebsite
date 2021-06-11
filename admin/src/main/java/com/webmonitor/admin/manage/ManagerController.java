package com.webmonitor.admin.manage;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.ProjectService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ManagerController extends BaseController {

    public void selectproject() {
        String projetid = getCookie(IndexService.me.accessUserId);
        setAttr("projetid", projetid);
        render("selectproject.html");
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
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("devicemanage.html");
    }

    public void waterdevicehome() {
        render("sensordata.html");
    }

    public void gnssdevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("devicelist.html");
    }

    public void sensordevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
        if (Tools.isEmpty(projetid))
            projetid = "";
        setAttr("projetid", projetid);
        render("sensorlist.html");
    }

    //报告管理的网页
    public void reportdevicehome() {
        String projetid = getCookie(IndexService.me.accessUserId);
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

    /**
     * 获取当前用户的项目列表
     **/
    public void getuserproject() {
        String pageno = getPara("pageno");
        int no = Integer.parseInt(pageno);
        Result<Page<Object>> result = Result.newOne();
        int pagesize = 10;
        List<BaseProjects> list = new ArrayList<>();
        try {
            String userid = getCookie(IndexService.me.accessUserId);
            StaffData currentuser = StaffService.me.getStaffById(userid);
            String authority = currentuser.getGroupAssemble();
            setCookie(IndexService.me.accessUserId, currentuser.getId().toString(), 24 * 60 * 60, true);
            int roletype = currentuser.getIRoleType();
            RoleType role = RoleType.getIndex(roletype);
            switch (role) {
                case users:
                    String[] projects = authority.split("@");
                    for (int i = 0; i < projects.length; i++) {
                        BaseProjects baseProjects = ProjectService.me.getProjectById(projects[i]);
                        list.add(baseProjects);
                    }
                    Page<Object> page = new Page<Object>(Collections.singletonList(list), Integer.parseInt(pageno), pagesize, (projects.length / pagesize) + 1, projects.length);
                    result.success(page);
                    break;
                case superadmin:
                    result.success(ProjectService.me.getAllProjectPageData(no, pagesize));
                    break;
                case companyadmin:
                    result.success(ProjectService.me.getProjectByComIdPageData(currentuser.getAgentNumber(), no, pagesize));
                    break;
            }
            renderJson(result);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
    }
}
