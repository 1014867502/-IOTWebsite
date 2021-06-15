package com.webmonitor.core.bll;


import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.ProjectMysqlDAL;
import com.webmonitor.core.idal.IProject;
import com.webmonitor.core.model.GroupsData;
import com.webmonitor.core.model.userbase.BaseProjects;

import java.util.List;

public class ProjectService {
    public static final ProjectService me=new ProjectService();
    private static IProject dal=new ProjectMysqlDAL();

    /**获取所有项目**/
    public List<BaseProjects> getAllProjects(){
       return dal.getAllProjects();
    }

    /**根据项目编号获取项目**/
    public BaseProjects getProjectById(String id){
        return dal.getProjectById(id);
    }

    /**根据公司编号获取项目**/
    public List<BaseProjects> getProjectByComId(String comid){
        return dal.getProjectsByComId(comid);
    }

    /**获取分页所有项目**/
    public Page<Object> getAllProjectPageData(int pageno, int limit){
        return dal.getProjectsPageData(pageno,limit);
    }


    /**根据公司编号分页获取项目**/
    public Page<Object> getProjectByComIdPageData(String comid,int pageno, int limit){
        return dal.getProjectsByComIdPageData(comid,pageno,limit);
    }

    /**根据用户身份返回项目数量**/
    public int getProjectCountByRight(String type,String comid){
        return dal.getProjectCountById(type,comid);
    }
}
