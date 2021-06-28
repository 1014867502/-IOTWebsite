package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.AgentTable;

import java.util.List;

/**对应公司表**/
public interface IAgent {

    List<AgentTable> getAllcompanys();

    Page<AgentTable> getAllcompanyPages(int pageno,int limit);
}
