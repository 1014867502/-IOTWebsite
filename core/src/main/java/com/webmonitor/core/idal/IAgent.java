package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.CompanyPage;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.userbase.AuthorityEntity;

import java.util.List;

/**对应公司表**/
public interface IAgent {

    List<AgentTable> getAllcompanys();

    List<AgentTable> getAdminCompany(String groupagent);

    Page<CompanyPage> getAllcompanyPages(int pageno,int limit);

    Page<CompanyPage> getAdmincompanyPages(String agentnums,int pageno,int limit);

    AgentTable getAgentTableById(String comid);

    /**根据项目id获取公司列表**/
    List<AgentTable> getCompanyByGroupid(String Groupid);

    /**根据用户类型获取公司列表**/
    List<AgentTable> getCompanyByRole(String userid);


    /**添加公司**/
     void addCompany(String companyname);

    /**根据名称查询**/
    AgentTable getAgentTableByName(String comname);

    /**删除**/
    int deletCompany(String agentNumber);

    /**根据公司编码获取公司相关信息**/
    CompanyPage getCompanyDetialByNum(String agentNumber);

    /**根据用户类型获取公司列表**/
     ProDevCount getDeviceNumByAgentId(String groupAgentNumber);

     /**修改公司功能权限**/
     boolean modifyCompanyAuthority(String agentNumber,String web,String app);

    /**获取公司功能权限**/
    AuthorityEntity getComAuthorById(String agentNumber);

    /**获取全部功能权限**/
    AuthorityEntity getAllAuthor();
}
