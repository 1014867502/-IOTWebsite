package com.webmonitor.admin.template;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.dal.TemplateMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.idal.ITemplate;
import com.webmonitor.core.model.MachineInfoEntity;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.userbase.Templates;

import java.util.List;

public class TemplateService {
    public static final TemplateService me = new TemplateService();
    private static ITemplate dal=new TemplateMysqlDAL();

    public Page<Templates> showAllTemplate(int pageno,int limit){
        return dal.getAllTemplate(pageno, limit);
    }

    public Page<Templates> showTemplateByCom(String agentNum,int pageno,int limit){
        return dal.getTemplateByCom(agentNum, pageno, limit);
    }

    /**搜索模板（管理员）**/
    public Page<Templates> searchAllTemplate(String type,String content,int pageno,int limit){
        return dal.searchAllTemplate(type, content, pageno, limit);
    }

    /**搜索模板（普通用户）**/
    public Page<Templates> searchTemplateByCom(String type,String agentnum,String content,int pageno,int limit){
        return dal.searchTemplateByCom(type, agentnum, content, pageno, limit);
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

    /**更改配置**/
    public boolean excuteTemplate(List<MachineInfoEntity> machineInfoEntities, String templateName){
        boolean test=false;
        TemplateData template=TemplateData.dao.findFirst("select * from template_data where templateName='"+templateName+"'");
        Gson gson=new Gson();
        int rawport=0;
        int rawname=1;
        int resultport=0;
        MachineInfoEntity machineInfoEntity=gson.fromJson(template.getTemplateOrder(),new TypeToken<MachineInfoEntity>(){}.getType());
        String rawback=machineInfoEntity.getRawBackPort();
        String stationname=machineInfoEntity.getRawName();
        String rawresultport=machineInfoEntity.getResultPort();
        rawport=Integer.parseInt(rawback);
        resultport=Integer.parseInt(rawresultport);
        for(MachineInfoEntity item:machineInfoEntities){
            machineInfoEntity.setResultPort(String.valueOf(resultport));
            resultport++;
            machineInfoEntity.setRawBackPort(String.valueOf(rawport));
            rawport++;
            machineInfoEntity.setRawName(stationname+rawname);
            rawname++;
           test=DeviceListService.me.checkObjAllFieldsIsNull(item.getMachineSerial(),machineInfoEntity);
        }
        if(test){
            return true;
        }else{
           return false;
        }
    }
}
