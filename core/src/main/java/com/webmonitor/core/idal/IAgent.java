package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.CompanyPage;

import java.util.List;

/**对应公司表**/
public interface IAgent {

    List<AgentTable> getAllcompanys();

    Page<CompanyPage> getAllcompanyPages(int pageno,int limit);

    AgentTable getAgentTableById(String comid);

    /**根据项目id获取公司列表**/
    List<AgentTable> getCompanyByGroupid(String Groupid);

    /**添加公司**/
     void addCompany(String companyname);

    /**根据名称查询**/
    AgentTable getAgentTableByName(String comname);

    /**删除**/
    int deletCompany(String agentNumber);

    /**根据公司编码获取公司相关信息**/
    CompanyPage getCompanyDetialByNum(String agentNumber);

}
