package com.webmonitor.admin.borrow;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.BorrowDataMysqlDAL;
import com.webmonitor.core.idal.IBorrow;
import com.webmonitor.core.model.BorrowData;
import com.webmonitor.core.model.BorrowDataEntity;
import com.webmonitor.core.model.BorrowDevices;

public class BorrowService {
    public static final BorrowService me = new BorrowService();

    private static IBorrow dal=new BorrowDataMysqlDAL();

    public Page<BorrowDataEntity> getAllBorrow(int pageno,int limit){
        return dal.getAllBorrow(pageno, limit);
    }

    public void edit(BorrowDataEntity borrowDataEntity){
        BorrowData borrowData1=BorrowData.dao.findById(borrowDataEntity.getId());
        if(borrowData1.getAgentNumber()!=borrowDataEntity.getAgentNumber()){
            String sql="update agent_data set proGroupId=0 , agentNumber='"+borrowDataEntity.getAgentNumber()+"' where machineSerial='"+borrowDataEntity.getMachineSerial()+"'";
            Db.update(sql);
        }
        BorrowData borrowData=borrowDataEntity.convert(borrowDataEntity);
        dal.edit(borrowData);
    }

    public void delete(String id){
        dal.delete(id);
    }

    public void add( BorrowDataEntity borrowDataEntity){
       BorrowData borrowData=borrowDataEntity.convert(borrowDataEntity);
        dal.add(borrowData);
    }

    public void returndevice(String machineserial){
        dal.returndevice(machineserial);
    }

    public Page<BorrowDataEntity> search(String content,String agentnum,String begin,String end,String status,String lender,int pageno,int limit){
        return dal.searchBorrowByParam(content,agentnum,begin,end,status,lender,pageno,limit);
    }

    public Boolean isExistBorrowsn(String machineserial){
        return dal.isExistBorrowSn(machineserial);
    }

    /**返回快到期的设备数目**/
    public BorrowDevices ExpireCount(){
        return dal.ExpireCount();
    }

    public int outExpireCount(){
        return dal.outExpireCount();
    }

    public BorrowDevices DeviceCount(){
        return dal.DeviceCount();
    }

}
