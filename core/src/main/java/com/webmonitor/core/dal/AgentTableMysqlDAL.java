package com.webmonitor.core.dal;

import com.webmonitor.core.idal.IAgent;
import com.webmonitor.core.model.AgentTable;

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
}
