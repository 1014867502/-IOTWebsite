package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.bll.ProjectService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.idal.IAgent;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.AuthorityEntity;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.model.userbase.CustomCount;
import com.webmonitor.core.model.userbase.FuncAuthor;
import com.webmonitor.core.util.Tools;
import sun.management.Agent;

import java.util.*;

import static com.webmonitor.core.dal.RoleType.superadmin;

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
    public List<AgentTable> getAdminCompany(String groupagent) {
        String sql="select * from agent_table ";
        String[] agents=groupagent.split("@");
        for(int i=0;i<agents.length;i++){
            if(i!=0) {
                sql += " or agentNumber='" + agents[i] + "'";
            }else{
                sql+="  where (agentNumber='"+agents[i]+"'";
            }
        }
        sql+=" )";
        List<AgentTable> list=AgentTable.dao.find(sql);
        return list;
    }

    @Override
    public Page<CompanyPage> getAllcompanyPages(int pageno,int limit) {
        String sql=" from agent_table ";
        Page<Record> page = Db.paginate(pageno, limit, "select * ",sql);
        List<Record> recordList = page.getList();
        List<CompanyPage> rslist = new ArrayList<>();
        for (Record record : recordList) {
            CompanyPage map = new CompanyPage();
            map=getCompanyDetialByNum(record.getStr("agentNumber"));
            rslist.add(map);
        }
        return new Page<CompanyPage>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public Page<CompanyPage> getAdmincompanyPages(String agentnums, int pageno, int limit) {
        String sql=" from agent_table ";
        String[] agents=agentnums.split("@");
        for(int i=0;i<agents.length;i++){
            if(i!=0) {
                sql += " or agentNumber='" + agents[i] + "'";
            }else{
                sql+="  where (agentNumber='"+agents[i]+"'";
            }
        }
        sql+=" )";
        Page<Record> page = Db.paginate(pageno, limit, "select * ",sql);
        List<Record> recordList = page.getList();
        List<CompanyPage> rslist = new ArrayList<>();
        for (Record record : recordList) {
            CompanyPage map = new CompanyPage();
            map=getCompanyDetialByNum(record.getStr("agentNumber"));
            rslist.add(map);
        }
        return new Page<CompanyPage>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
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

    @Override
    public List<AgentTable> getCompanyByRole(String userid) {
        StaffData staffData= StaffService.me.getStaffById(userid);
        int roletype = staffData.getIRoleType();
        RoleType role = RoleType.getIndex(roletype);
        List<AgentTable> agentTables=new ArrayList<>();
        switch (role) {
            case admin:
                String[] companynum=staffData.getGroupAgentNumber().split("@");
                for(int i=0;i<companynum.length;i++){
                    AgentTable agentTable=AgentTable.dao.findFirst("select * from agent_table where agentNumber="+companynum[i]);
                    agentTables.add(agentTable);
                }
                break;
            case companyadmin:
                String agentnum=staffData.getAgentNumber();
                    AgentTable agentTable=AgentTable.dao.findFirst("select * from agent_table where agentNumber="+agentnum);
                    agentTables.add(agentTable);
              break;
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
        agentTable.setWebAuthority(WebAuthority.getAllString());
        agentTable.setAppAuthority(AppAuthority.getAllString());
        agentTable.save();
    }

    /**删除公司**/
    public int deletCompany(String agentNumber){
        int delete=Db.delete("delete from agent_table where agentNumber = ?", agentNumber);
        Db.delete("delete from projects_data where agentNumber=?",agentNumber);
        Db.delete("delete from template_data where agentNumber=?",agentNumber);
        Db.delete("delete from staff_data where agentNumber=?",agentNumber);
        Db.update("update agent_data set proGroupId = 0,agentNumber=1 where agentNumber=?",agentNumber);
        return delete;
    }

    @Override
    public CompanyPage getCompanyDetialByNum(String agentNumber) {
        CompanyPage companyPage=new CompanyPage();
        Record record=new Record();
        AgentTable agentTable=AgentTable.dao.findFirst("select * from agent_table where agentNumber="+agentNumber);
        companyPage.setAgentname(agentTable.getAgentName());
        companyPage.setAgentnum(agentTable.getAgentNumber());
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial " +
                "where b.connectState=1 and a.agentNumber='"+agentNumber+"'");
        companyPage.setOnlinesum(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial "+
                " where b.connectState=0 and a.agentNumber='"+agentNumber+"'");
        companyPage.setDeadsum(record.getInt("count(*)"));
        record=Db.findFirst(" select count(*) from projects_data d where d.agentNumber='"+agentNumber+"' and (select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.proGroupId=d.proGroupId)>0");
        companyPage.setProjectsum(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial "+
                "where a.agentNumber='"+agentNumber+"'");
        companyPage.setDevicesum(record.getInt("count(*)"));
        return companyPage;
    }

    @Override
    public ProDevCount getDeviceNumByAgentId(String groupAgent) {
        ProDevCount proDevCount=new ProDevCount();
        if(groupAgent!=null&&!groupAgent.equals("")){
            int sum=0,online=0,outline=0,urpoject=0,newcount=0;
            String[] agentnums=groupAgent.split("@");
            for(int i=0;i<agentnums.length;i++){
                Record record=new Record();
                record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial " +
                        "where b.connectState=1 and a.agentNumber='"+agentnums[i]+"'");
                online += record.getInt("count(*)");
                record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial "+
                        " where b.connectState=0 and a.agentNumber='"+agentnums[i]+"'");
                outline+=record.getInt("count(*)");
                record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial "+
                        "where a.agentNumber='"+agentnums[i]+"'");
                sum+=record.getInt("count(*)");
                record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where a.proGroupId=0 and a.agentNumber='"+agentnums[i]+"'");
                urpoject+=record.getInt("count(*)");
                record=Db.findFirst("select count(*) from agent_data  where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(createTime) and  agentNumber='"+agentnums[i]+"'");
                newcount+=record.getInt("count(*)");
            }
            proDevCount.setSum(sum);
            proDevCount.setOncount(online);
            proDevCount.setOutcount(outline);
            proDevCount.setNewcount(newcount);
            proDevCount.setUnprojcount(urpoject);
        }
        return proDevCount;
    }

    @Override
    public boolean modifyCompanyAuthority(String agentNumber, String web, String app) {
        AgentTable agentTable=getAgentTableById(agentNumber);
        List<StaffData> dataList=StaffData.dao.find("select * from staff_data where agentNumber='"+agentNumber+"' and iRoleType!=4 and iRoleType!=2");
        String[] webauthor=web.split("@");
        String[] appauthor=app.split("@");
        try{
            agentTable.setAppAuthority(app);
            agentTable.setWebAuthority(web);
            agentTable.update();
        for(int i=0;i<dataList.size();i++){
            Set<String> websame=new HashSet<>();
            Set<String> appsame=new HashSet<>();
            String modifyweb="";
            String modifyapp="";
            String[] userapp=dataList.get(i).getAppPermission().split("@");
            String[] userweb=dataList.get(i).getWebPermission().split("@");
            int userid=dataList.get(i).getId();
            for(int j=0;j<webauthor.length;j++){
                websame.add(webauthor[j]);
            }
            for(int k=0;k<userweb.length;k++){
                if(!websame.add(userweb[k])){
                    modifyweb+=userweb[k]+"@";
                }
            }
            int weblength=modifyweb.length();
            modifyweb=modifyweb.substring(0,weblength-1);
            for(int j=0;j<appauthor.length;j++){
                appsame.add(appauthor[j]);
            }
            for(int k=0;k<userapp.length;k++){
                if(!appsame.add(userapp[k])){
                    modifyapp+=userapp[k]+"@";
                }
            }
            int applength=modifyapp.length();
            modifyapp=modifyapp.substring(0,applength-1);
            dataList.get(i).setAppPermission(modifyapp);
            dataList.get(i).setWebPermission(modifyweb);
            if(!dataList.get(i).update()){
                throw new Exception();
            }
        }
            return true;
        }catch (Exception e){
            System.out.println(e.getMessage());
            return false;
        }
    }

    /**获取公司功能权限**/
    @Override
    public AuthorityEntity getComAuthorById(int roletype,String agentNumber) {
        AgentTable agentTable=getAgentTableById(agentNumber);

        String[] app=agentTable.getAppAuthority().split("@");

        List<FuncAuthor> weblist=new ArrayList<>();//允许权限
        List<FuncAuthor> applist=new ArrayList<>();//允许权限


        AuthorityEntity authorityEntity=new AuthorityEntity();
        if(agentTable.getWebAuthority()!=null&&agentTable.getWebAuthority()!=""){
        String[] web=agentTable.getWebAuthority().split("@");
        RoleType role = RoleType.getIndex(roletype);
        for(int i=0;i<web.length;i++){
            FuncAuthor funcAuthor=new FuncAuthor();
            if(WebAuthority.getString(Integer.parseInt(web[i])).equals("下发命令")&&role!=superadmin){
                continue;
            }
            funcAuthor.setName(WebAuthority.getString(Integer.parseInt(web[i])));
            funcAuthor.setValue(web[i]);
            weblist.add(funcAuthor);
            }
        }
        if(agentTable.getAppAuthority()!=null&&agentTable.getAppAuthority()!="") {
            for (int j = 0; j < app.length; j++) {
                FuncAuthor funcAuthor = new FuncAuthor();
                funcAuthor.setName(AppAuthority.getString(Integer.parseInt(app[j])));
                funcAuthor.setValue(app[j]);
                applist.add(funcAuthor);
            }
        }

        authorityEntity.setAppauthority(applist);
        authorityEntity.setWebauthority(weblist);

        return authorityEntity;
    }

    /**获取所有功能权限**/
    public AuthorityEntity getAllAuthor(){
        AuthorityEntity authorityEntity=new AuthorityEntity();


        List<FuncAuthor> allweblist=new ArrayList<>();//所有权限
        List<FuncAuthor> allapplist=new ArrayList<>();//所有权限
        if(WebAuthority.getAllString()!=null&&!AppAuthority.getAllString().equals("")) {
            String[] allweb = WebAuthority.getAllString().split("@");
            for (int k = 0; k < allweb.length; k++) {
                FuncAuthor funcAuthor = new FuncAuthor();
                funcAuthor.setName(WebAuthority.getString(Integer.parseInt(allweb[k])));
                funcAuthor.setValue(allweb[k]);
                allweblist.add(funcAuthor);
            }
        }
        if(AppAuthority.getAllString()!=null&&!AppAuthority.getAllString().equals("")) {
            String[] allapp = AppAuthority.getAllString().split("@");
            for (int z = 0; z < allapp.length; z++) {
                FuncAuthor funcAuthor = new FuncAuthor();
                funcAuthor.setName(AppAuthority.getString(Integer.parseInt(allapp[z])));
                funcAuthor.setValue(allapp[z]);
                allapplist.add(funcAuthor);
            }
        }
        authorityEntity.setAppauthority(allapplist);
        authorityEntity.setWebauthority(allweblist);
        return authorityEntity;
    }

}
