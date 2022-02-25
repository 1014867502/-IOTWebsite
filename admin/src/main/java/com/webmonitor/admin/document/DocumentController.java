package com.webmonitor.admin.document;


import com.webmonitor.admin.base.BaseController;

public class DocumentController extends BaseController {

    public void webuserdoc() {
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
