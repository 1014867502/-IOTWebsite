package com.webmonitor.admin.orderlog;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.company.CompanyService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.model.CompanyPage;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.userbase.TakeNoteEntity;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

public class OrderLogController extends BaseController {
    public void getAllOrderLog(){
        Result<Page<TakeNoteEntity>> result=Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<TakeNoteEntity> page= OrderLogService.me.getAllOrderLog(pageno,limit);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void searchAlllOrderLog(){
        Result<Page<TakeNoteEntity>> result=Result.newOne();
        String company=getPara("agentnum");
        String content=getPara("content");
        int pageno = getParaToInt("page")==null?1: getParaToInt("page");
        int limit = getParaToInt("limit")==null?1: getParaToInt("limit");
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        try{
            Page<TakeNoteEntity> page= OrderLogService.me.searchAlllOrderLog(currentuser,company,content,pageno,limit);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取当前设备的相关配置日志信息(根据日期查询)**/
    public void getOrderLogByDate(){
        Result<Page<TakeNoteEntity>> result=Result.newOne();
        String machinesn=getPara("machineserial");
        String begin=getPara("begin");
        String end=getPara("end");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<TakeNoteEntity> page= OrderLogService.me.getOrderLogByDate(pageno,limit,machinesn,begin,end);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void  getOrderLogBySn(){
        Result<Page<TakeNoteEntity>> result=Result.newOne();
        String machinesn=getPara("machineserial");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<TakeNoteEntity> page= OrderLogService.me.getOrderLogBySn(pageno,limit,machinesn);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
