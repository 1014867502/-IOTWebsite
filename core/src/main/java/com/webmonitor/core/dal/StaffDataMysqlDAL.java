package com.webmonitor.core.dal;

import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.StaffData;

public class StaffDataMysqlDAL implements IStaffData {
    @Override
    public StaffData getStaffByName(String username) {
        StaffData staffData=StaffData.dao.findFirst("select * from staff_data where uAccountNum='"+username+"'");
        return  staffData;
    }

    @Override
    public StaffData getStaffById(String userid) {
        StaffData staffData=StaffData.dao.findById(userid);
        return  staffData;
    }
}
