package com.webmonitor.admin.version;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.admin.template.TemplateService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.VersionData;
import com.webmonitor.core.model.userbase.Templates;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.io.File;

public class VersionController extends BaseController {

    public void getAll(){
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",10);
        Result<Page<VersionData>> result=Result.newOne();
        try{
            Page<VersionData> versionPage= VersionService.me.getAllVersion(pageno,limit);
            result.success(versionPage);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**下载对应的文件**/
    public void downloadFile(){
        String filename = getPara("filename");
        filename = filename.replace(":", "");
        String basepath = "C:\\FirmwareUpdate\\Latest";
        String path = basepath + "\\" + filename +".bin";
        File report = new File(path);
        if (report.exists()) {
            renderFile(report);
        }
    }
}
