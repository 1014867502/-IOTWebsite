package com.webmonitor.core.idal;
/**这是针对Groups_data表的接口**/
public interface IGroupsTable {

    void addProject(String comid,String projectname);

    void deleteProject(String Projectid);

    void editproject(String projectid,String comid,String projctname);

}
