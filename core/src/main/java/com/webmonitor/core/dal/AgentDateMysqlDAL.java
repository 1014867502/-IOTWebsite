package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.userbase.BaseWarnLogmap;
import com.webmonitor.core.util.Tools;

import java.util.ArrayList;
import java.util.List;

public class AgentDateMysqlDAL implements IAgentData {
    @Override
    public List<AgentData> getAllDeviceByCid(String Companyid) {
        return null;
    }

    @Override
    public Page<AgentDataDao> getDeviceByParams(String companyid, String sn, String state, int pageno, int limit) {
        String sql = "";
        //判断是否sn是否为空，项目id不能为空
        if((sn==null||sn.isEmpty())&&(!state.equals("2"))){
            sql=" FROM agent_data" +
                    " WHERE state= "+state+" and proGroupId="+companyid;
        }
        else if(state.isEmpty()){
            sql=" FROM agent_data" +
                    " WHERE serial='"+sn+"' and proGroupId="+companyid;
        }
        else if(state.equals("2")){
            sql=" from agent_data" +
                    " where proGroupId="+companyid;
        }
        else {
            String sn1 = "%" + sn + "%";
            sql = " from agent_data" +
                    " where proGroupId=" + companyid + " and serial like '" + sn1 + "' and a.State=" + state;
        }
        sql=sql+" order by date desc";
        Page<Record> page = Db.paginate(pageno, limit, "select *",sql);
        List<Record> recordList = page.getList();
        List<AgentDataDao> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentDataDao map = new AgentDataDao();
            map.setState(record.getStr("state"));
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setDate(record.getStr("date"));
            map.setProGroupId(record.getInt("proGroupId"));
            map.setSerial(record.getStr("serial"));
            map.setMachineName(record.getStr("machineName"));
            rslist.add(map);
        }
        return new Page<AgentDataDao>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**查询当前项目的所有设备（分页）**/


}
