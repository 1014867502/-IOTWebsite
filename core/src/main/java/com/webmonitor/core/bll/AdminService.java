package com.webmonitor.core.bll;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.util.exception.ExceptionUtil;

import java.util.ArrayList;
import java.util.List;

/**管理员执行方法**/
public class AdminService {
    public static final AdminService me = new AdminService();

    /**查看所有设备**/
    public String getAllDeviceById(int pageno,int limit){
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber order by b.updateTime desc";
        return sql;
    }

    /**旗下设备的总数，在线离线未关联，最新情况**/
    public ProDevCount getDevCount(){
        return AgentDataService.me.getDevCount();
    }


//    /**筛选设备**/
//    public Page<AgentData> searchDeviceByParam(String content,String agentnum,String[] projetcid,String state,int pageno,int limit){
//        Page<AgentData> page=AgentDataService.me.searchDeviceByParam(content,agentnum, projetcid, state, pageno, limit);
//        return page;
//    }

    /**检索未关联的设备**/
    public String searchOutDeviceByParam(String content, int pageno, int limit, String type){
        String sql="";
        switch(type){
            case "0":
                if(!content.isEmpty()&&content!=null){
                    String sn1 = "%" + content + "%";
                    sql = " from agent_data" +
                            " where proGroupId is null and machineSerial like '" + sn1 + "'";
                }else{
                    sql=" from agent_data where proGroupId is null or proGroupId=0";
                }
                break;
            case "1":
                if(!content.isEmpty()&&content!=null){
                    String sn1 = "%" + content + "%";
                    sql = " from agent_data" +
                            " where proGroupId is null and agentName like '" + sn1 + "'";
                }else{
                    sql=" from agent_data where proGroupId is null or proGroupId=0";
                }
                break;
            case "2":
                sql=" from agent_data where proGroupId is null or proGroupId=0";
                break;
        }
        sql=sql+" order by createTime desc";
        return sql;
    }

    /**获取公司列表**/
    public List<AgentTable> getCompanyList(){
        List<AgentTable> agentTables=new ArrayList<>();
        try{
            agentTables=AgentTable.dao.find("select * from agent_table");
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return agentTables;
    }

    /**获取普通管理员所有设备**/
    public String getAdminDevice(String userid){
        StaffData currentuser= StaffService.me.getStaffByName(userid);
        String coms=currentuser.getGroupAgentNumber().replace("@",",");
        String sql="";
        if(!currentuser.getGroupAgentNumber().isEmpty()){
            sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where  a.agentNumber in("+coms+")";
            sql+=" order by b.updateTime desc";
        }
        return sql;
    }

    /**获取管理员的公司列表**/
    public List<AgentTable> getAdminCompanylist(String userid){
        List<AgentTable> agentTables=new ArrayList<>();
        try{
            StaffData staffData=StaffService.me.getStaffByName(userid);

            String[] agentnums=staffData.getGroupAgentNumber().split("@");
            for(int j=0;j<agentnums.length;j++) {
                AgentTable agentTable=new AgentTable();
                Record record=new Record();
                record= Db.findFirst("SELECT a.* FROM agent_table a where a.agentNumber='"+agentnums[j]+"'");
                agentTable.setId(record.getInt("id"));
                agentTable.setAgentName(record.getStr("agentName"));
                agentTable.setAgentNumber(record.getStr("agentNumber"));
                agentTables.add(agentTable);
            }

//            else{
//                String[] projects=staffData.getGroupAssemble().split("@");
//                for(int i=0;i<projects.length;i++){
//                    Record record=new Record();
//                    AgentTable agentTable=new AgentTable();
//                    record= Db.findFirst("SELECT a.* FROM agent_table a,projects_data b where a.agentNumber=b.agentNumber and b.proGroupId="+projects[i]);
//                    agentTable.setId(record.getInt("id"));
//                    agentTable.setAgentName(record.getStr("agentName"));
//                    agentTable.setAgentNumber(record.getStr("agentNumber"));
//                    if(agentTables.isEmpty()){
//                        agentTables.add(agentTable);
//                    }else{
//                        for(int k=0;k<agentTables.size();k++){
//                            if(!agentTable.getAgentName().equals(agentTables.get(i).getAgentName())){
//                                agentTables.add(agentTable);
//                            }
//                        }
//                    }
//                }
//            }

        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return agentTables;
    }
}
