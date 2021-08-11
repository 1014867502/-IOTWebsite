package com.webmonitor.admin.template;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.dal.TemplateMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.idal.ITemplate;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.userbase.Templates;

public class TemplateService {
    public static final TemplateService me = new TemplateService();
    private static ITemplate dal=new TemplateMysqlDAL();

    public Page<Templates> showAllTemplate(int pageno,int limit){
        return dal.getAllTemplate(pageno, limit);
    }

    public Page<Templates> showTemplateByCom(String agentNum,int pageno,int limit){
        return dal.getTemplateByCom(agentNum, pageno, limit);
    }

    public void addTemplate(TemplateData templates){
        dal.addTemplate(templates);
    }

    public  boolean updateTemplateById(Templates templates){
        return  dal.updateTemplateByName(templates);
    }

    public  boolean delTemplateById(String name){
       return  dal.delTemplateByName(name);
    }
}
