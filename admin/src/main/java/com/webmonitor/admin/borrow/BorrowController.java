package com.webmonitor.admin.borrow;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.model.*;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.List;


public class BorrowController extends BaseController {

    public static final BorrowController me = new BorrowController();


    public void getAllBorrow(){
        Result<Page<BorrowDataEntity>> result= Result.newOne();
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<BorrowDataEntity> borrowDataEntityPage=BorrowService.me.getAllBorrow(pageno,limit);
            result.success(borrowDataEntityPage);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
     }

     public void getDetailById(){
        Result<BorrowData> result=Result.newOne();
        String id=getPara("data");
        try{
            BorrowData borrowData=BorrowData.dao.findById(id);
            result.success(borrowData);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
     }

     public void add(){
        Result<String> result=Result.newOne();
        String data=getPara("data");
         Gson gson = new Gson();
        BorrowDataEntity borrowDataEntity= gson.fromJson(data, new TypeToken<BorrowDataEntity>() {
         }.getType());
        try {
            String userid = getCookie(IndexService.me.accessUserId);
            borrowDataEntity.setReturnStatus(0);
            borrowDataEntity.setuAccountNum(StaffService.me.getStaffById(userid).getUAccountNum());
            BorrowService.me.add(borrowDataEntity);
            result.success("success");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.success("error");
        }
         renderJson(result);
     }

     public void delete(){
         Result<String> result=Result.newOne();
         String data=getPara("data");
         try{
             BorrowService.me.delete(data);
             result.success("success");
         }catch (Throwable e){
             ExceptionUtil.handleThrowable(result,e);
             result.success("error");
         }
         renderJson(result);
     }

     public void deletelist(){
         Result<String> result=Result.newOne();
         String data=getPara("data");
         Gson gson=new Gson();
         try{
             List<BorrowDataEntity> borrowDataEntity= gson.fromJson(data, new TypeToken<List<BorrowDataEntity>>() {
             }.getType());
             borrowDataEntity.forEach(e-> BorrowService.me.delete(e.getId()));
             result.success("success");
         }catch (Throwable e){
             ExceptionUtil.handleThrowable(result,e);
             result.success("error");
         }
         renderJson(result);
     }

    public void returndevicelist(){
        Result<String> result=Result.newOne();
        String data=getPara("data");
        Gson gson=new Gson();
        try{
            List<BorrowDataEntity> borrowDataEntity= gson.fromJson(data, new TypeToken<List<BorrowDataEntity>>() {
            }.getType());
            borrowDataEntity.forEach(e-> BorrowService.me.returndevice(e.getMachineSerial()));
            result.success("success");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.success("error");
        }
        renderJson(result);
    }

    public void returndevcie(){
        Result<String> result=Result.newOne();
        String data=getPara("data");
        try{
            BorrowService.me.returndevice(data);
            result.success("success");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.success("error");
        }
        renderJson(result);
    }

     public void edit(){
         Result<String> result=Result.newOne();
         String data=getPara("data");
         Gson gson = new Gson();
         BorrowDataEntity borrowDataEntity= gson.fromJson(data, new TypeToken<BorrowDataEntity>() {
         }.getType());
         try {
             BorrowService.me.edit(borrowDataEntity);
             result.success("success");
         }catch (Throwable e){
             ExceptionUtil.handleThrowable(result,e);
             result.success("error");
         }
         renderJson(result);
     }

     public void search(){
        Result<Page<BorrowDataEntity>> result=Result.newOne();
        String content=getPara("content");
        String agentnum=getPara("agentnumber");
        String begin=getPara("begin");
        String end=getPara("end");
        String status=getPara("status");
        String lender=getPara("lender");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
           Page<BorrowDataEntity> borrowDataEntityPage= BorrowService.me.search(content,agentnum,begin,end,status,lender,pageno,limit);
           result.success(borrowDataEntityPage);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);

     }

     public void isExistSn(){
         Result<String> result = Result.newOne();
         String machineserial=getPara("machineSerial");
         try {
             if(AgentDataService.me.isExistDeviceDetailBySn(machineserial)){
                 if(!BorrowService.me.isExistBorrowsn(machineserial)){
                     result.success("true");
                 }else{
                     result.error("false");
                 }
             }else{
                 result.error("false");
             }
         } catch (Throwable e) {
             ExceptionUtil.handleThrowable(result, e);
         }
         renderJson(result);
     }

     public void countExpire(){
        Result<BorrowDevices> result =Result.newOne();
        try{
            BorrowDevices expireDevice=BorrowService.me.ExpireCount();
            result.success(expireDevice);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
     }

    public void deviceCount(){
        Result<BorrowDevices> result =Result.newOne();
        try{
            BorrowDevices expireDevice=BorrowService.me.DeviceCount();
            result.success(expireDevice);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
