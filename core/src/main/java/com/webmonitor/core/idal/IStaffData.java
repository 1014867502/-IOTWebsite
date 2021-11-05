package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
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
    Page<StaffDataEntity> getAllCustomByPage(String userid,int pageno,int limit);

    /**根据类别获取用户数量**/
    List<StaffDataEntity> getCountByType(String type);

    /**获取所有用户**/
    List<StaffDataEntity> getAlCustom();

    /**根据条件查询用户
     * @return**/
    Page<StaffDataEntity> searchCustomByParam(String content,String agentnum,int pageno, int limit);

     /**根据公司编号返回用户**/
     Page<StaffDataEntity> getCustomByComId(String agentnum,String userid,int pageno,int limit);
}
