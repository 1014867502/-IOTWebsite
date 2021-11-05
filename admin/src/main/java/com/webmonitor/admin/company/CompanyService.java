package com.webmonitor.admin.company;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.ProjectService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.AgentTableMysqlDAL;
import com.webmonitor.core.dal.ProjectMysqlDAL;
import com.webmonitor.core.idal.IAgent;
import com.webmonitor.core.idal.IProject;
import com.webmonitor.core.model.AgentTable;
import com.webmonitor.core.model.CompanyPage;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.StaffData;

import java.util.List;

public class CompanyService {
    public static final CompanyService me=new CompanyService();
    private static IAgent dal=new AgentTableMysqlDAL();

    /**添加公司**/
    public void addCompany(String name){
        dal.addCompany(name);
    }


    /**根据项目id获取哦那公司列表**/
    AgentTable getAgentTableByName(String comname){
        return dal.getAgentTableByName(comname);
    }

    /**获取所有公司**/
    public List<AgentTable> getAllCompany(){
        return dal.getAllcompanys();
    }

    /**获取所有公司**/
    public Page<CompanyPage> getAllCompanys(int pageno, int limit){
        return dal.getAllcompanyPages(pageno, limit);
    }

    /**根据id查找公司**/
    public AgentTable getAgentById(String comid){
        return dal.getAgentTableById(comid);
    }

    /**删除**/
    public int deletagentByNum(String agentNumber){ return dal.deletCompany(agentNumber);}

    /**根据项目id查找公司列表**/
    public List<AgentTable> getAgentTableByProgroupid(String author){
        return dal.getCompanyByGroupid(author);
    }
}
