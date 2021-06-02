package com.webmonitor.admin.overview;

import com.webmonitor.admin.base.BaseController;

public class OverviewController extends BaseController {
    public void index(){
        render("index.html");
    }
    public void map()
    {
        render("map.html");
    }
}
