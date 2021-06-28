package com.webmonitor.core.bll;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.model.*;

import java.util.ArrayList;
import java.util.List;

public class ConsumerService {
    public static final ConsumerService me=new ConsumerService();


    /**获取用户下属设备的在线离线情况**/
    public ProDevCount getDevCount(String[] projects){
        return AgentDataService.me.getCosumerDevCount(projects);
    }

    /**获取用户下属所有设备**/
    public String getAllDevice(String userid){
        StaffData currentuser= StaffService.me.getStaffByName(userid);
        String[] projects=currentuser.getGroupAssemble().split("@");
        String sql=" from agent_data where proGroupId="+projects[0];
        for(int i=1;i<projects.length;i++){
            sql=sql+" or proGroupId="+projects[i];
        }
        return sql;
    }

    /**获取公司列表**/
    public List<AgentTable> getCompanyListById(String userid){
        List<AgentTable> agentTables=new ArrayList<>();
        try{
            StaffData staffData=StaffService.me.getStaffById(userid);
            String[] projects=staffData.getGroupAssemble().split("@");
            for(int i=0;i<projects.length;i++){
               Record record=new Record();
               AgentTable agentTable=new AgentTable();
               record= Db.findFirst("SELECT a.* FROM agent_table a,projects_data b where a.agentNumber=b.agentNumber and b.proGroupId="+projects[i]);
               agentTable.setId(record.getInt("id"));
               agentTable.setAgentName(record.getStr("agentName"));
               agentTable.setAgentNumber(record.getStr("agentNumber"));
               agentTables.add(agentTable);
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return agentTables;
    }
}
