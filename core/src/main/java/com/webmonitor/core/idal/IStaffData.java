package com.webmonitor.core.idal;

import com.webmonitor.core.model.StaffData;

/**用户信息操作**/

public interface IStaffData {

    StaffData getStaffByName(String username);

    StaffData getStaffById(String userid);

    /**增删改**/
    void edit(String comid,String loginaccount,String realname,String dept,
              String roletype, String accounttype,String groupassemble);

    void add(String comid,String password,String realname,String dept,
             String roletype, String accounttype,String groupassemble);

    void delete(String loginaccount);

    void updateAuthorityById(String userid,String project);
}
