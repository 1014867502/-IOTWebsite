package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IBorrow;
import com.webmonitor.core.model.BorrowData;
import com.webmonitor.core.model.BorrowDataEntity;
import com.webmonitor.core.model.BorrowDevices;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class BorrowDataMysqlDAL implements IBorrow {
    @Override
    public BorrowData getBorrowDataById(String id) {
        BorrowData borrowData=BorrowData.dao.findFirst("select * from borrow_data where id="+id);
        return borrowData;
    }

    @Override
    public void edit(BorrowData borrowData) {
        borrowData.update();
    }

    @Override
    public void add(BorrowData borrowData) {
        borrowData.save();
    }

    @Override
    public void delete(String id) {
        Db.delete("DELETE FROM borrow_data WHERE id="+id);
    }

    @Override
    public void returndevice(String machineserial) {
        Db.update("update agent_data set borrowStatus=1,agentNumber=1,proGroupId=0 where machineSerial='"+machineserial+"'");
        BorrowData borrowData=BorrowData.dao.findFirst("select * from borrow_data where machineSerial='"+machineserial+"'");
        borrowData.setReturnStatus(1);
        borrowData.update();
    }

    @Override
    public Page<BorrowDataEntity> searchBorrowByParam(String content, String agentnum, String begin, String end,String borrowstatus,String lender, int pageno, int limit) {
        String sql="  from borrow_data a left join agent_data b  on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber ";
        if(!agentnum.equals("all")){
            sql+=" where a.agentNumber='"+agentnum+"'";
        }
        if(!content.equals("")){
            if(agentnum.equals("all")&&!sql.contains("where")){
                sql+="where a.machineSerial like '%"+content.trim()+"%'";
            }else{
                sql+=" and a.machineSerial like '%"+content.trim()+"%'";
            }
        }
        if(!borrowstatus.equals("all")){
            if(!sql.contains("where")){
                sql+=" where a.returnStatus='"+borrowstatus+"'";
            }else{
                sql+=" and a.returnStatus='"+borrowstatus+"'";
            }
        }
        if(!begin.equals("")&&!end.equals("")){
            if(!sql.contains("where")){
                sql+=" where a.beginTime >'"+begin+"' and a.beginTime< '"+end+"'";
            }else{
                sql+=" and  a.beginTime >'"+begin+"' and a.beginTime< '"+end+"'";
            }
        }
        if(!lender.equals("")){
            if(!sql.contains("where")){
                sql+="where a.lender like '%"+lender.trim()+"%'";
            }else{
                sql+=" and a.lender like '%"+lender.trim()+"%'";
            }
        }
//        if(!end.equals("")){
//            if(!sql.contains("where")){
//                sql+=" where a.endTime<='"+end+"'";
//            }else{
//                sql+=" and a.endTime<='"+end+"'";
//            }
//        }
        Page<Record> page=Db.paginate(pageno,limit,"select b.machineName,a.*,c.agentName",sql+" order by endTime asc");
        List<Record> recordList=page.getList();
        List<BorrowDataEntity> rslist=new ArrayList<>();
        for(Record record:recordList){
            BorrowDataEntity map=new BorrowDataEntity();
            map.setAgentName(record.getStr("agentName"));
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setLender(record.getStr("lender"));
            map.setContent(record.getStr("content"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setBeginTime(record.getDate("beginTime"));
            map.setEndTime(record.getDate("endTime"));
            map.setId(record.getStr("id"));
            map.setReturnStatus(record.getInt("returnStatus"));
            rslist.add(map);
        }
        return new Page<BorrowDataEntity>(rslist,page.getPageNumber(),page.getPageSize(),page.getTotalRow(),page.getTotalRow());
    }

    @Override
    public Page<BorrowDataEntity> getAllBorrow(int pageno, int limit) {
        String sql="  from borrow_data a left join agent_data b  on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.returnStatus=0";
        Page<Record> page=Db.paginate(pageno,limit,"select b.machineName,a.*,c.agentName",sql+" order by endTime asc");
        List<Record> recordList=page.getList();
        List<BorrowDataEntity> rslist=new ArrayList<>();
        for(Record record:recordList){
            BorrowDataEntity map=new BorrowDataEntity();
            map.setLender(record.getStr("lender"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setuAccountNum(record.getStr("uAccountNum"));
            map.setAgentName(record.getStr("agentName"));
            map.setContent(record.getStr("content"));
            map.setMachineName(record.getStr("machineName"));
            map.setBeginTime(record.getDate("beginTime"));
            map.setEndTime(record.getDate("endTime"));
            map.setId(record.getStr("id"));
            map.setReturnStatus(record.getInt("returnStatus")!=null?record.getInt("returnStatus"):0);
            rslist.add(map);
        }
        return new Page<BorrowDataEntity>(rslist,page.getPageNumber(),page.getPageSize(),page.getTotalRow(),page.getTotalRow());
    }

    @Override
    public boolean isExistBorrowSn(String machineSerial) {
        if(BorrowData.dao.findFirst("select * from borrow_data where machineSerial='"+machineSerial+"' and returnStatus=0")!=null){
            return true;
        }else{
            return false;
        }
    }

    @Override
    public BorrowDevices ExpireCount() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) + 7);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        String sql="select count(*) from borrow_data where endTime between CURDATE() and '"+result+"' and returnStatus=0 ";
        int closecount=Db.queryInt(sql);
        sql="SELECT count(*) FROM `borrow_data` where CURDATE() >= endTime and returnStatus=0";
        int outcount=Db.queryInt(sql);
        BorrowDevices expireDevice=new BorrowDevices.Builder().CloseExpire(closecount).OutExpire(outcount).builder();
        return expireDevice;
    }

    @Override
    public int outExpireCount() {
        Date date=new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String now=format.format(date);
        String sql="select count(*) from borrow_data where endTime <'"+now+"'";
        int count=Db.queryInt(sql);
        return count;
    }

    @Override
    public BorrowDevices DeviceCount() {
        Calendar calendar = Calendar.getInstance();
        Date date=new Date();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) + 7);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        String now=format.format(date);
        String sql="select count(*) from borrow_data where endTime between CURDATE() and '"+result+"' and returnStatus=0 ";
        int closecount=Db.queryInt(sql);
        sql="SELECT count(*) FROM `borrow_data` where CURDATE() >= endTime and returnStatus=0";
        int outcount=Db.queryInt(sql);
        sql="select count(*) from borrow_data where endTime <'"+now+"'";
        int incount=Db.queryInt(sql);
        sql="select count(*) from borrow_data where returnStatus=0";
        int totalcount=Db.queryInt(sql);
        sql="select count(*) from borrow_data where beginTime between CURDATE() and '"+result+"' and returnStatus=0";
        int currentcount=Db.queryInt(sql);
        BorrowDevices borrowDevices=new BorrowDevices.Builder().CloseExpire(closecount).OutExpire(outcount).InExpire(incount).TotalExpire(totalcount).CurrentExpire(currentcount).builder();
        return borrowDevices;
    }


}
