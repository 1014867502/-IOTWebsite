package com.webmonitor.core.idal;


import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.*;

//外借页面的借口
public interface IBorrow {


        BorrowData getBorrowDataById(String id);//根据id获取对应borrow数据

        void edit(BorrowData borrowData);//编辑

        void add(BorrowData borrowData);//添加

        void delete(String id);//删除

        void returndevice(String id);//归还设备

    /**根据条件查询用户
     * @return**/
    Page<BorrowDataEntity> searchBorrowByParam(String content,String agentnum,String begin,String end,String borrowstatus,String lender,int pageno,int limit);

     //获取所有数据
    Page<BorrowDataEntity> getAllBorrow(int pageno,int limit);

    boolean isExistBorrowSn(String machineSerial);

    /**获取快到期的设备数目**/
     BorrowDevices ExpireCount();

    /**获取快到期的设备数目**/
    int outExpireCount();

    /**获取综合信息**/
    BorrowDevices DeviceCount();
}
