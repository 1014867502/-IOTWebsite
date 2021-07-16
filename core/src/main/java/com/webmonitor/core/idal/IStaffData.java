package com.webmonitor.core.idal;

import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.StaffDataEntity;

import java.util.List;

/**用户信息操作**/

public interface IStaffData {

    StaffData getStaffByName(String username);

    StaffData getStaffById(String userid);

    /**增删改**/
    void edit(StaffData staffData);

    void add(StaffData staffData);

    void delete(String loginaccount);

    void updateAuthorityById(String userid,String project);

    /**搜索对应的用户**/
    List<StaffData> searchStaffData(String customname);

    /**获取用户列表**/
    List<StaffDataEntity> getAllCustomByPage(int pageno,int limit);

    /**根据类别获取用户数量**/
    List<StaffDataEntity> getCountByType(String type);

    /**获取所有用户**/
    List<StaffDataEntity> getAlCustom();

}
