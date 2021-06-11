package com.webmonitor.core.idal;

import com.webmonitor.core.model.StaffData;

/**用户信息操作**/

public interface IStaffData {

    StaffData getStaffByName(String username);

    StaffData getStaffById(String userid);
}
