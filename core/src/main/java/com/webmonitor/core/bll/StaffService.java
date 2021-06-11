package com.webmonitor.core.bll;

import com.webmonitor.core.dal.ProjectMysqlDAL;
import com.webmonitor.core.dal.StaffDataMysqlDAL;
import com.webmonitor.core.idal.IProject;
import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.StaffData;

public class StaffService {
    public static final StaffService me=new StaffService();
    private static IStaffData dal=new StaffDataMysqlDAL();

    public StaffData getStaffByName(String username){
        return dal.getStaffByName(username);
    }

    public StaffData getStaffById(String userid){
        return dal.getStaffById(userid);
    }
}
