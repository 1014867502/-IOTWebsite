package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IAgent;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.util.Tools;

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
}
