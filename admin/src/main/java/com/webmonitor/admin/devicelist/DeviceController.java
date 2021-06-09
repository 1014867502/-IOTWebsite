package com.webmonitor.admin.devicelist;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.core.bll.AgentDataService;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.awt.print.Pageable;

/**控制与设备数据相关操作**/
public class DeviceController  extends BaseController {

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
}
