package com.webmonitor.admin.devicelist;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.MachineData;
import com.webmonitor.core.model.userbase.BaseDevicemap;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

/**控制与设备数据相关操作**/
public class DeviceController  extends BaseController {

    /**设备管理页面**/
    public void devicemanage(){
        String proid=getCookie(IndexService.me.accessProId);
        setAttr("projetid",proid);
        render("devicemanage.html");
    }

    public void searchlist(){
        render("setting.html");
    }

    /**配置页面**/
    public void setting()
    {
        Result result=Result.newOne();
        try {
            String sn = getPara("sn");
            String sql="select * from machine_data where serial="+sn;
            MachineData machineData= Optional.ofNullable(MachineData.dao.findFirst(sql))
                    .orElseGet(MachineData::new);
            setAttr("machinedata",machineData);
            render("setting.html");
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result,e);
        }
    }

    /**查询项目相关的设备列表**/
    public void getDeviceList(){
        Result<Page<AgentDataDao>> result=Result.newOne();
        String id=getPara("projectid");
        String sn=getPara("sn");
        String state=getPara("state");
        int pageno = getParaToInt("page", 1);
        int limit = getParaToInt("limit", 50);
        try{
            Page<AgentDataDao> page= AgentDataService.me.getDevicelistByParam(id,sn,state,pageno,limit);
            result.success(page);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**获取当前项目的**/
}
