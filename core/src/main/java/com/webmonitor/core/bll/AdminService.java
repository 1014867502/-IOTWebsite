package com.webmonitor.core.bll;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.util.exception.ExceptionUtil;

import java.util.ArrayList;
import java.util.List;

/**管理员执行方法**/
public class AdminService {
    public static final AdminService me = new AdminService();

    /**查看所有设备**/
    public String getAllDeviceById(int pageno,int limit){
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial ";
        return sql;
    }

    /**旗下设备的总数，在线离线情况**/
    public ProDevCount getDevCount(){
        return AgentDataService.me.getDevCount();
    }

    /**筛选设备**/
    public Page<AgentData> searchDeviceByParam(String content,String agentName,String[] projetcid,String state,int pageno,int limit){
        Page<AgentData> page=AgentDataService.me.searchDeviceByParam(content, agentName, projetcid, state, pageno, limit);
        return page;
    }

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


}
