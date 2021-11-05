package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.userbase.TakeNoteEntity;

public interface IOrderLog {

    public Page<TakeNoteEntity> getAllOrderLog(int pageno, int limit);

    public Page<TakeNoteEntity> searchAlllOrderLog(String company,String content,int pageno,int limit);

    public Page<TakeNoteEntity> getOrderLogBySn(int pageno,int limit,String  machinesen);

    public Page<TakeNoteEntity> getOrderLogByDate(int pageno,int limit,String  machinesen,String begin,String end);
}
