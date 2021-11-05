package com.webmonitor.admin.orderlog;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.OrderLogMysqlDAL;
import com.webmonitor.core.idal.IOrderLog;
import com.webmonitor.core.model.userbase.TakeNoteEntity;

public class OrderLogService {
    public static final OrderLogService me=new OrderLogService();
    public static IOrderLog dal=new OrderLogMysqlDAL();

    public Page<TakeNoteEntity> getAllOrderLog(int pageno, int limit){
        return dal.getAllOrderLog(pageno,limit);
    }

    public Page<TakeNoteEntity> searchAlllOrderLog(String company,String content,int pageno,int limit){
        return dal.searchAlllOrderLog(company, content, pageno, limit);
    }

    public Page<TakeNoteEntity> getOrderLogBySn(int pageno,int limit,String  machinesen){
        return dal.getOrderLogBySn(pageno, limit, machinesen);
    }

    public Page<TakeNoteEntity> getOrderLogByDate(int pageno,int limit,String  machinesen,String begin,String end){
        return dal.getOrderLogByDate(pageno, limit, machinesen, begin, end);
    }
}
