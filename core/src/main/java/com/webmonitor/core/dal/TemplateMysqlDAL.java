package com.webmonitor.core.dal;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.ITemplate;
import com.webmonitor.core.model.MachineInfoEntity;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.base.BaseProject;
import com.webmonitor.core.model.userbase.Templates;

import java.util.ArrayList;
import java.util.List;

public class TemplateMysqlDAL implements ITemplate {

    /**获取模板列表（全部）**/
    @Override
    public Page<Templates> getAllTemplate(int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        List<Templates> rslist = new ArrayList<>();
        for (Record record : recordList) {
            Templates map = new Templates();
            map.setType(record.getInt("type"));
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setAgentName(record.getStr("agentName"));
            map.setuAccountNum(record.getStr("uAccountNumber"));
            map.setTemplateName(record.getStr("templateName"));
            map.setTemplateOrder(record.getStr("templateOrder"));
            rslist.add(map);
        }
        return new Page<Templates>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**获取模板列表(公司)**/
    @Override
    public Page<Templates> getTemplateByCom(String comid,int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber where a.agentNumber="+comid;
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        List<Templates> rslist = new ArrayList<>();
        for (Record record : recordList) {
            Templates map = new Templates();
            map.setType(record.getInt("type"));
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setAgentName(record.getStr("agentName"));
            map.setuAccountNum(record.getStr("uAccountNumber"));
            map.setTemplateName(record.getStr("templateName"));
            map.setTemplateOrder(record.getStr("templateOrder"));
            rslist.add(map);
        }
        return new Page<Templates>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


    @Override
    public Templates getTemplateBySn(String templatename) {
        return null;
    }

    @Override
    public void addTemplate(TemplateData templates) {
        Record template = new Record().set("agentNumber",templates.getAgentNumber()).set("type", templates.getType()).set("templateName",templates.getTemplateName())
                .set("uAccountNumber",templates.getUAccountNumber()).set("templateOrder",templates.getTemplateOrder());
        Db.save("template_data", template);
    }

    @Override
    public Boolean delTemplateByName(String id) {
        Boolean result=false;
        try{
            Db.delete("delete from template_data where id = ?", id);
            result=true;
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return result;
    }

    @Override
    public Boolean updateTemplateByName(Templates templates) {
        Boolean result=false;
        try{
            Db.update("update template_data set templateOrder = ? where templateName=?",templates.getTemplateOrder(),templates.getTemplateName());
            result=true;
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return result;
    }

    @Override
    public Page<Templates> getTemplateByName(String templatename) {
        return null;
    }

    /**搜索模板（全部）模板管理**/
    public Page<Templates> searchAllTemplate(String type,String content ,int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        if(!type.equals("all")){
            if(!content.isEmpty()){
                sql=sql+" where a.agentNumber="+type+" and templateName like '%"+content+"%'";
            }else{
                sql=sql+" where a.agentNumber="+type;
            }
        }else{
            if(!content.isEmpty()){
                sql=sql+" where  templateName like '%"+content+"%'";
            }
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        List<Templates> rslist = new ArrayList<>();
        for (Record record : recordList) {
            Templates map = new Templates();
            map.setType(record.getInt("type"));
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setAgentName(record.getStr("agentName"));
            map.setuAccountNum(record.getStr("uAccountNumber"));
            map.setTemplateName(record.getStr("templateName"));
            map.setTemplateOrder(record.getStr("templateOrder"));
            rslist.add(map);
        }
        return new Page<Templates>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


    /**搜索模板（全部）配置模板**/
    public Page<Templates> searchSettingTemplate(String type,String content ,int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        switch(type){
            case "0":
                break;
            case "1":
                sql=sql+" where templateName like '%"+content+"%'";
                break;
            case "2":
                sql=sql+" where b.agentName like '%"+content+"%'";
                break;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        List<Templates> rslist = new ArrayList<>();
        for (Record record : recordList) {
            Templates map = new Templates();
            map.setType(record.getInt("type"));
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setAgentName(record.getStr("agentName"));
            map.setuAccountNum(record.getStr("uAccountNumber"));
            map.setTemplateName(record.getStr("templateName"));
            map.setTemplateOrder(record.getStr("templateOrder"));
            rslist.add(map);
        }
        return new Page<Templates>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

   /**搜索模板（公司）**/
   public Page<Templates> searchTemplateByCom(String type,String agentnum,String content ,int pageno,int limit){
       String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber where b.agentNumber="+agentnum;
       switch(type){
           case "0":
               break;
           case "1":
               sql=sql+" and templateName like '%"+content+"%'";
               break;
       }
       Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
       List<Record> recordList = page.getList();
       List<Templates> rslist = new ArrayList<>();
       for (Record record : recordList) {
           Templates map = new Templates();
           map.setType(record.getInt("type"));
           map.setId(record.getInt("id"));
           map.setAgentNumber(record.getStr("agentNumber"));
           map.setAgentName(record.getStr("agentName"));
           map.setuAccountNum(record.getStr("uAccountNumber"));
           map.setTemplateName(record.getStr("templateName"));
           map.setTemplateOrder(record.getStr("templateOrder"));
           rslist.add(map);
       }
       return new Page<Templates>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
   }

    @Override
    public boolean excuteTemplate(String machineserial, String templateName) {
       return false;
    }
}
