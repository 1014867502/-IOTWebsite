package com.webmonitor.core.bll;

import com.webmonitor.core.dal.ProjectMysqlDAL;
import com.webmonitor.core.dal.StaffDataMysqlDAL;
import com.webmonitor.core.idal.IProject;
import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.StaffData;

import java.util.List;

public class StaffService {
    public static final StaffService me=new StaffService();
    private static IStaffData dal=new StaffDataMysqlDAL();

    public StaffData getStaffByName(String username){
        return dal.getStaffByName(username);
    }

    public StaffData getStaffById(String userid){
        return dal.getStaffById(userid);
    }

//    public void editStaff(String agentNumber,String loginaccount,String realname,String dept,String groupassemble,String roletype,String accountype){
//        dal.edit(agentNumber,loginaccount,realname,dept,roletype,accountype,groupassemble);
//    }

    public void deleteStaff(String loginaccount){
        dal.delete(loginaccount);
    }

//    public void addStaff(String agentNumber,String password,String realname,String dept,String groupassemble,String roletype,String accounttype){
//        dal.add(agentNumber,password,realname,dept,roletype,accounttype,groupassemble);
//    }

    public void updateauthor(String userid,String projectid){
        dal.updateAuthorityById(userid,projectid);
    }

    public List<StaffData> getStaffByComId(String agentNumber){return  dal.getStaffDataByComid(agentNumber);}
}
