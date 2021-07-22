package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.userbase.BaseProjects;

import java.util.List;

/**这个是针对groups_data表的接口**/

public interface IProject {
    /**获取所有项目**/
    List<BaseProjects> getAllProjects();
    /**根据项目id获取项目**/
    BaseProjects getProjectById(String projectid);

    /**根据项目名称获取项目**/
    BaseProjects getProjectByName(String projectname);

    /**根据项目归属公司查询**/
    List<BaseProjects> getProjectsByComId(String id);

    /**获取所有项目的分页**/
    Page<Object> getProjectsPageData(int pageno, int limit);

    /**获取相关公司所有项目的分页**/
    Page<Object> getProjectsByComIdPageData(String comid,int pageno, int limit);

    /**获取用户项目数量,通过判断是否管理员**/
    int getProjectCountById(String type,String comid);

    void addProject(String userid,String comid,String projectname);

    void deleteProject(String Projectid);

    void editproject(String projectid,String comid,String projctname);

    /**获取项目里设备的数目**/
    int getProDevCountById(String projectid);

    /**获取项目里在线设备的数目**/
    int getProDevOnCountById(String projectid);

    /**获取项目里离线设备的数目**/
    int getProDevOutCountById(String projectid);

    /**根据用户id获取对应的项目列表**/
    Page<Object> getProjectsById(String userid,int pageno,int limit);
}
