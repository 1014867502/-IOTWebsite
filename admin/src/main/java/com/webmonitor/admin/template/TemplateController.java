package com.webmonitor.admin.template;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.StaffDataEntity;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.userbase.ExportGNSSWord;
import com.webmonitor.core.model.userbase.Templates;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

public class TemplateController extends BaseController {

    /**查看模板**/
    public void showTemplateByRole(){
        Result<Page<Templates>> result=Result.newOne();
        String id=getLoginAccount().getUserName();
        StaffData currentuser= StaffService.me.getStaffByName(id);
        String role=RoleType.getString(currentuser.getIRoleType());
        int pageno=getParaToInt("pageno",1);
        int limit=getParaToInt("limit",10);
        try{
            switch (role){
                case "superadmin":
                    Page<Templates> templatesPage1=TemplateService.me.showAllTemplate(pageno,limit);
                    result.success(templatesPage1);
                    break;
                default:
                    Page<Templates> templatesPage=TemplateService.me.showTemplateByCom(currentuser.getAgentNumber(),pageno,limit);
                    result.success(templatesPage);
                    break;
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }


    /**添加模板**/
    public void addTemplate(){
        Result<String> result=Result.newOne();
        String data=getPara("json");
        String templatename=getPara("templatename");
        String type=getPara("type");
        int type1=Integer.parseInt(type);
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        TemplateData templates=new TemplateData();
        templates.setTemplateName(templatename);
        templates.setTemplateOrder(data);
        templates.setType(type1);
        templates.setUAccountNumber(currentuser.getUAccountNum());
        templates.setAgentNumber(currentuser.getAgentNumber());
        try{
            TemplateService.me.addTemplate(templates);
            result.success("添加成功");
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error("修改失败");
        }
        renderJson(result);

    }

    /**修改模板**/
    public void updateTemplate(){
        String json=getPara("jsondata");
        Gson gson=new Gson();
        Templates templates=gson.fromJson(json, new TypeToken<Templates>(){}.getType());
        Result<String> result=Result.newOne();
        try{
            if(TemplateService.me.updateTemplateById(templates)){
                result.success("修改成功");
            }else{
                result.error("修改失败");
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error("修改失败");
        }
        renderJson(result);
    }


    /**删除模板**/
    public void delTemplate(){
        String id=getPara("id");
        Result<String> result=Result.newOne();
        try{
            if(TemplateService.me.delTemplateById(id)){
                result.success("删除成功");
            }else{
                result.error("删除失败");
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.error("删除失败");
        }
        renderJson(result);
    }

    /**搜索模板（全部）**/


    /**搜索模板（公司）**/
}
