package com.webmonitor.core.dal;

import com.webmonitor.core.idal.IGroupsTable;

import java.util.Random;

public class GroupTableMysqlDAL implements IGroupsTable {
    @Override
    public void addProject(String comid, String projectname) {
        Random random=new Random();
        String sql="INSERT INTO table_name ()\n" +
                "VALUES (value1,value2,value3,...);"
    }

    @Override
    public void deleteProject(String Projectid) {

    }

    @Override
    public void editproject(String projectid, String comid, String projctname) {

    }

    public boolean isExistTable(String id){
        
    }
}
