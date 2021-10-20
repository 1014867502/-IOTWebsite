package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IAgent;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.util.Tools;
import sun.management.Agent;

import java.util.ArrayList;
import java.util.List;

public class AgentTableMysqlDAL implements IAgent {


    /**
     * 获取所有公司
     * @return
     */
    @Override
    public List<AgentTable> getAllcompanys() {
        List<AgentTable> list=AgentTable.dao.find("select * from agent_table");
        return list;
    }

    @Override
    public Page<AgentTable> getAllcompanyPages(int pageno,int limit) {
        String sql=" from agent_table ";
        Page<Record> page = Db.paginate(pageno, limit, "select * ",sql);
        List<Record> recordList = page.getList();
        List<AgentTable> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentTable map = new AgentTable();
            map.setAgentName(record.getStr("agentName"));
            map.setAgentNumber(record.getStr("agentNumber"));
            rslist.add(map);
        }
        return new Page<AgentTable>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public AgentTable getAgentTableById(String comid) {
        AgentTable agentTable=new AgentTable();
        try{
           agentTable=AgentTable.dao.findFirst("select * from agent_table where agentNumber="+comid);
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return agentTable;
    }

    /**根据名称查询**/
    public AgentTable getAgentTableByName(String comname) {
        AgentTable agentTable=new AgentTable();
        try{
            agentTable=AgentTable.dao.findFirst("select * from agent_table where agentName like '%"+comname+"%'");
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return agentTable;
    }

    /**根据项目id获取公司列表**/
    @Override
    public List<AgentTable> getCompanyByGroupid(String Groupid) {
        List<AgentTable> agentTables=new ArrayList<>();
        String sql = "SELECT distinct c.*  from agent_data a ,projects_data b, agent_table c where a.proGroupId=b.proGroupId and c.agentNumber=a.agentNumber " +
                        "and ( a.proGroupId="  + Groupid + ")";
        List<Record> records=Db.find(sql);
        for (Record record : records) {
            AgentTable agentTable=new AgentTable();
            agentTable.setId(record.getInt("id"));
            agentTable.setAgentNumber(record.getStr("agentNumber"));
            agentTable.setAgentName(record.getStr("agentName"));
            agentTables.add(agentTable);
        }
        return agentTables;
    }

//    /**根据项目id获取公司列表**/
//    @Override
//    public List<AgentTable> getCompanyByGroupid(String Groupid) {
//        List<AgentTable> agentTables=new ArrayList<>();
//        String sql1="";
//        String[] strings=Groupid.split("@");
//        if(strings.length>0){
//            sql1=" a.proGroupId="+strings[0];
//            if(strings.length>1) {
//                for (int i = 1; i < strings.length; i++) {
//                    sql1 = sql1 + " OR a.proGroupId=" + strings[i];
//                }
//                String sql = "SELECT distinct c.*  from agent_data a ,projects_data b, agent_table c where a.proGroupId=b.proGroupId and c.agentNumber=a.agentNumber " +
//                        "and (" + sql1 + ")";
//                List<Record> records=Db.find(sql);
//                for (Record record : records) {
//                    AgentTable agentTable=new AgentTable();
//                    agentTable.setId(record.getInt("id"));
//                    agentTable.setAgentNumber(record.getStr("agentNumber"));
//                    agentTable.setAgentName(record.getStr("agentName"));
//                    agentTables.add(agentTable);
//                }
//
//            }
//        }
//        return agentTables;
//    }

    /**添加公司**/
    public void addCompany(String companyname){
        AgentTable latest=AgentTable.dao.findFirst("select *  from agent_table  order by id desc limit 0,1");
        int agentid=latest.getId()+1;
        AgentTable agentTable=new AgentTable();
        agentTable.setAgentName(companyname);
        agentTable.setAgentNumber(String.valueOf(agentid));
        agentTable.save();
    }

    /**删除公司**/
    public int deletCompany(String agentNumber){
        int delete=Db.delete("delete from agent_table where agentNumber = ?", agentNumber);
        return delete;
    }

}
