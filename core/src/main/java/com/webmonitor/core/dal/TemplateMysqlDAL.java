package com.webmonitor.core.dal;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.ITemplate;
import com.webmonitor.core.model.MachineInfoEntity;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.base.BaseProject;
import com.webmonitor.core.model.userbase.Templates;

import java.util.ArrayList;
import java.util.List;

public class TemplateMysqlDAL implements ITemplate {

    /**获取模板列表（全部）**/
    @Override
    public Page<Templates> getAllTemplate(int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber where a.id<>1 ";
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
    public Page<Templates> getAdminTemplate(String groupagent, int pageno, int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        String[] agents=groupagent.split("@");
        for(int i=0;i<agents.length;i++){
            if(i!=0) {
                sql += " or a.agentNumber='" + agents[i] + "'";
            }else{
                sql+="  where (a.agentNumber='"+agents[i]+"'";
            }
        }
        sql+=" )";
        if(sql.contains("where")){
            sql+=" and a.id<>1";
        }else{
            sql+=" where a.id<>1";
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

    /**获取模板列表(公司)**/
    @Override
    public Page<Templates> getTemplateByCom(String comid,int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber where a.agentNumber="+comid +" and a.id<>1";
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
    public Page<Templates> searchAllTemplate(StaffData staffData,String type, String content , int pageno, int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        if(!type.equals("all")){
            if(!content.isEmpty()){
                sql=sql+" where a.agentNumber="+type+"  and templateName like '%"+content+"%'";
            }else{
                sql=sql+" where a.agentNumber="+type+" ";
            }
        }else{
            int roletype = staffData.getIRoleType();
            RoleType role = RoleType.getIndex(roletype);
            switch (role) {
                case admin:
                    String[] agents=staffData.getGroupAgentNumber().split("@");
                    for(int i=0;i<agents.length;i++){
                        if(i!=0) {
                            sql += " or a.agentNumber='" + agents[i] + "'";
                        }else{
                            sql+="  where (a.agentNumber='"+agents[i]+"'";
                        }
                    }
                    sql+=" ) and a.id<>1";
            }
            if(!content.isEmpty()&&sql.contains("where")){
                sql=sql+" and  templateName like '%"+content+"%'";
            }else{
                sql=sql+" where  templateName like '%"+content+"%'";
            }
        }
        if(sql.contains("where")){
            sql+=" and a.id<>1";
        }else{
            sql+=" where a.id<>1";
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
    public Page<Templates> searchSettingTemplate(StaffData staffData,String type,String content ,int pageno,int limit) {
        String sql = "  from template_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        String role=RoleType.getString(staffData.getIRoleType());
        switch(type){
            case "0":
                if(content!=null&&!content.equals("")){
                    sql=sql+" where templateName like '%"+content+"%'";
                }
                break;
            case "1":
                sql=sql+" where templateName like '%"+content+"%'";
                break;
            case "2":
                sql=sql+" where b.agentName like '%"+content+"%'";
                break;
        }
        switch(role){
            case "admin":
                String groupagent=staffData.getGroupAgentNumber().replace("@",",");
                if(type.equals("0")&&content.equals("")){
                    sql+=" where a.agentNumber In( "+groupagent+")";
                }else{
                    sql+=" and a.agentNumber In( "+groupagent+")";
                }
                break;
            case "companyadmin":
                if(sql.contains("where")){
                    sql+=" and a.agentNumber='"+staffData.getAgentNumber()+"'";
                }else{
                    sql+=" where a.agentNumber='"+staffData.getAgentNumber()+"'";
                }
                break;
            case "user":
                if(sql.contains("where")){
                    sql+=" and a.agentNumber='"+staffData.getAgentNumber()+"'";
                }else{
                    sql+=" where a.agentNumber='"+staffData.getAgentNumber()+"'";
                }
                break;
        }
        if(sql.contains("where")){
            sql+=" and a.id<>1";
        }else{
            sql+=" where a.id<>1";
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
               sql=sql+" and templateName like '%"+content+"%' and a.id<>1";
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
