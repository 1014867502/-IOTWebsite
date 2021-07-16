package com.webmonitor.admin.company;

import com.jfinal.i18n.Res;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.CompanyAdminService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.model.*;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.List;

public class CompanyController extends BaseController {

    public void CompanyDetail(){
        String agentNum=getPara("agentNumber");
        setAttr("agentNum",agentNum);
        render("CompanyDetail.html");
    }

    public void getCompanyCount(){
        Result<ProDevCount> result=Result.newOne();
        String agentNum=getPara("agentNumber");
        try{
            ProDevCount proDevCount= CompanyAdminService.me.getDevCount(agentNum);
            result.success(proDevCount);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getCompanyById(){
        Result<AgentTable> result=Result.newOne();
        String agentNum=getPara("agentNumber");
        try{
            AgentTable agentTable=CompanyService.me.getAgentById(agentNum);
            result.success(agentTable);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getAllDeviceByComid(){
        Result<Page<AgentData>> result=Result.newOne();
        String comid=getPara("agentnum");
        int pageno = getParaToInt("pageno", 1);
        int limit = getParaToInt("limit", 20);
        try{
            Page<AgentData> daoPage= DeviceListService.me.getDeviceByComid(comid,pageno,limit);
            result.success(daoPage);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);

    }

    public void getCompanyListByGroupId(){
        List<AgentTable> agentTables=new ArrayList<>();
        Result result=Result.newOne();
       String projectid=getPara("projectid");
        try{
            agentTables=CompanyService.me.getAgentTableByProgroupid(projectid);
            result.success(agentTables);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    public void getAllCompany(){
        List<AgentTable> agentTables=new ArrayList<>();
        Result result=Result.newOne();
        try{
            agentTables=CompanyService.me.getAllCompany();
            result.success(agentTables);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }
}
