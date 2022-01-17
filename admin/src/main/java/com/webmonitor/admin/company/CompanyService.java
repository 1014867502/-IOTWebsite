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
import com.webmonitor.core.model.userbase.AuthorityEntity;

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

    /**根据管理员获取公司**/
    public List<AgentTable> getAdminCompany(String groupagent){
        return dal.getAdminCompany(groupagent);
    }

    /**根据用户类型获取公司列表**/
    public List<AgentTable> getCompanyByRole(String userid){
        return dal.getCompanyByRole(userid);
    }

    /**获取所有公司**/
    public Page<CompanyPage> getAllCompanys(int pageno, int limit){
        return dal.getAllcompanyPages(pageno, limit);
    }

    /**获取管理员旗下公司**/
    public Page<CompanyPage> getAdminCompanys(String groupagent,int pageno, int limit){
        return dal.getAdmincompanyPages(groupagent,pageno, limit);
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

    /**根据公司id查找旗下设备的数目**/
    public ProDevCount getDeviceNumByAgentId(String agentNumbers){
        return dal.getDeviceNumByAgentId(agentNumbers);
    }

    /**获取公司功能权限列表**/
    public AuthorityEntity getComAuthorById(String agentNumber){
        return dal.getComAuthorById(agentNumber);
    }

    /**获取所有功能权限列表**/
    public AuthorityEntity getAllAuthor(){
        return dal.getAllAuthor();
    }

    /**修改公司功能权限**/
    public boolean modifyCompanyAuthority(String agentNumber,String web,String app){
        return dal.modifyCompanyAuthority(agentNumber, web, app);
    }


}
