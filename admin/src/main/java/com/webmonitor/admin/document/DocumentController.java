package com.webmonitor.admin.document;


import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.company.CompanyService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.CompanyPage;
import com.webmonitor.core.model.StaffData;

public class DocumentController extends BaseController {


    public void webuserdoc() {
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData staffData= StaffService.me.getStaffById(userid);
        String role= RoleType.getString(staffData.getIRoleType());
        setAttr("role",role);
        render("menu_user_doc.html");
    }

    public void webuserdoc_first(){
        render("webuserdoc_first.html");
    }

    public void webuserdoc_homepage(){
        render("webuserdoc_homepage.html");
    }

    public void webuserdoc_project(){
        render("webuserdoc_project.html");
    }

    public void webuserdoc_template(){
        render("webuserdoc_template.html");
    }

    public void webuserdoc_download(){
        render("webuserdoc_download.html");
    }

    public void webadmindoc(){render("menu_admin_doc.html");};

    public void webadmindoc_usermanage(){
        render("webadmindoc_users.html");
    }

    public void appuserdoc(){
        render("menu_appuser_doc.html");
    }

    public void appadmindoc(){
        render("menu_appadmin_doc.html");
    }


    public void appuserdoc_first(){
        render("appuserdoc_first.html");
    }

    public void appuserdoc_setdevice(){
        render("appuserdoc_setdevice.html");
    }

    public void appadmindoc_first(){
        render("appadmindoc_first.html");
    }

}
