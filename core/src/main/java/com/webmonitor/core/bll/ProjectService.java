package com.webmonitor.core.bll;


import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.ProjectMysqlDAL;
import com.webmonitor.core.idal.IProject;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.ProjectPage;
import com.webmonitor.core.model.ProjectsData;
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

    /**根据项目名称获取项目**/
    public BaseProjects getProjectByName(String projectname){
        return dal.getProjectByName(projectname);
    }

    /**根据用户id获取对应的项目**/
    public Page<BaseProjects> getProjectsById(String userid,int pageno,int limit){
        return dal.getProjectsById(userid,pageno,limit);
    }

    /**根据公司编号分页获取项目**/
    public Page<BaseProjects> getProjectByComIdPageData(String comid,int pageno, int limit){
        return dal.getProjectsByComIdPageData(comid,pageno,limit);
    }

    /**根据公司编号分页获取项目**/
    public Page<Object> getProjectByComIdPageDataO(String comid,int pageno, int limit){
        return dal.getProjectsByComIdPageDataO(comid,pageno,limit);
    }

    /**根据用户id获取对应的项目列表**/
    public List<BaseProjects> getProjectlistById(String userid){
        return dal.getProjectlistById(userid);
    }

    /**根据用户id查找对应的项目列表**/
    public Page<BaseProjects> seekProjectsById(String userid,String content,int pageno,int limit){
        return dal.seekProjectsById(userid, content, pageno, limit);
    }

    //查询所有项目的id号码
    public List<Integer> getAllProjectId(){
        return dal.getAllProjectId();
    }

    /**根据用户身份返回项目数量**/
    public int getProjectCountByRight(String type,String comid){
        return dal.getProjectCountById(type,comid);
    }

    public void deleteProjectByid(String projectid){
        dal.deleteProject(projectid);
    }

    public void editProjectByid(String projectid,String comid,String projectname){
        dal.editproject(projectid,comid,projectname);
    }

    public void addProject(String userid,String comid,String projectname,String proLatitude,String proLongitude){
        dal.addProject(userid,comid,projectname,proLatitude,proLongitude);
    }


    /**根据项目id查找对应项目设备情况**/
    public ProDevCount getProDevCountById(String projectid,String agentNumber){
        ProDevCount proDevCount=new ProDevCount();
        proDevCount.setSum(dal.getProDevCountById(projectid,agentNumber));
        proDevCount.setOncount(dal.getProDevOnCountById(projectid,agentNumber));
        proDevCount.setOutcount(dal.getProDevOutCountById(projectid,agentNumber));
        proDevCount.setNewcount(dal.getProDevNewCountById(projectid,agentNumber));
        return proDevCount;
    }


    /**根据公司编号获取旗下项目信息**/
    public Page<ProjectPage> getProjectPageByNum(String agentnum,int pageno,int limit){
        return dal.getProjectPageByNum(agentnum,pageno,limit);
    }




    /**根据项目名找项目**/
    public Page<ProjectPage> searchProjectPageByName(String content,String agentnum,int pageno,int limit){
        return dal.searchProjectPageByNum(content, agentnum, pageno, limit);
    }

    /**批量删除项目**/
    public void deleteProjectList(List<ProjectPage> projectPageList){
        for(int i=0;i<projectPageList.size();i++){
            dal.deleteProject(projectPageList.get(i).getProjectid());
        }
    }

}
