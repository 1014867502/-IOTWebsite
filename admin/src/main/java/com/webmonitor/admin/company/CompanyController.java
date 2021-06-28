package com.webmonitor.admin.company;

import com.webmonitor.admin.base.BaseController;

public class CompanyController extends BaseController {

    public void CompanyDetail(){
        String agentNum=getPara("agentNumber");
        setAttr("agentNum",agentNum);
        render("CompanyDetail.html");
    }

}
