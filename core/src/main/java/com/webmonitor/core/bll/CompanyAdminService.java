package com.webmonitor.core.bll;

import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.StaffData;

import java.util.ArrayList;
import java.util.List;

public class CompanyAdminService {
        public static final CompanyAdminService me=new CompanyAdminService();

    /**获取所有设备**/
    public String getAllDevice(String agentnumber){
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where agentNumber="+agentnumber;
        return sql;
    }

    /**获取供应商旗下设备的在线离线**/
    public ProDevCount getDevCount(String comid){
        return AgentDataService.me.getCompangyDevCount(comid);
    }

    /**检索未关联的设备**/
        public String searchOutDeviceByParam(String agentnum,String content, int pageno, int limit, String type, String role){
            String sql="";
            switch(type){
                case "0":
                    if(!content.isEmpty()&&content!=null){
                        String sn1 = "%" + content + "%";
                        sql = " from agent_data" +
                                " where proGroupId is null and machineSerial like '" + sn1 + "' and agentNumber="+agentnum;
                    }else{
                        sql=" from agent_data where (proGroupId is null or proGroupId=0) and agentNumber="+agentnum;
                    }
                    break;
                case "1":
                    if(!content.isEmpty()&&content!=null){
                        String sn1 = "%" + content + "%";
                        sql = " from agent_data" +
                                " where proGroupId is null and agentName like '" + sn1 + "'and agentNumber="+agentnum;
                    }else{
                        sql=" from agent_data where (proGroupId is null or proGroupId=0) and agentNumber="+agentnum;
                    }
                    break;
                case "2":
                    sql=" from agent_data where (proGroupId is null or proGroupId=0) and agentNumber="+agentnum;
                    break;
            }
            sql=sql+" order by createTime desc";
            return sql;
        }

        public List<AgentTable> getCompanyListById(String userid){
            List<AgentTable> agentTables=new ArrayList<>();
            try{
                StaffData staffData=StaffService.me.getStaffById(userid);
                agentTables=AgentTable.dao.find("select * from agent_table where agentNumber"+staffData.getAgentNumber());
            }catch (Exception ex){
                System.out.println(ex.getMessage());
            }
            return agentTables;
        }
}
