package com.webmonitor.admin.template;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.i18n.Res;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.ExportGNSSWord;
import com.webmonitor.core.model.userbase.Templates;
import com.webmonitor.core.util.SocketTools;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;
import org.apache.log4j.lf5.util.ResourceUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class TemplateController extends BaseController {

    /**模板设置页面**/
    public void setting(){
        String templatename=getPara("templatename");
        String type=getPara("type");
        setAttr("type",type);
        setAttr("templatename",templatename);
        render("template_setting.html");
    }

    /**快速设置模板页面**/
    public void fastsetting(){
        String templatename=getPara("templatename");
        setAttr("templatename",templatename);
        render("template_fastsetting.html");
    }

    /**快速设置模板页面**/
    public void stationsetting(){
        String templatename=getPara("templatename");
        setAttr("templatename",templatename);
        render("template_stationsetting.html");
    }

    /**解算设置页面**/
    public void computesetting(){
        String templatename=getPara("templatename");
        setAttr("templatename",templatename);
        render("template_compute.html");
    }

    /**坐标设置页面**/
    public void locatesetting(){
        String templatename=getPara("templatename");
        setAttr("templatename",templatename);
        render("template_locate.html");
    }

    /**平台设置页面**/
    public void  platformsetting(){
        String templatename=getPara("templatename");
        setAttr("templatename",templatename);
        render("template_platform.html");
    }

    /**辅助设置页面**/
    public void auxiliarysetting(){
        String templatename=getPara("templatename");
        setAttr("templatename",templatename);
        render("template_auxiliary.html");
    }






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
        String account=currentuser.getUAccountNum();
        templates.setUAccountNumber(account);
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
        Result<String> result=Result.newOne();
        String data=getPara("json");
        String templatename=getPara("templatename");
        String type=getPara("type");
        int type1=Integer.parseInt(type);
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        Templates templates=new Templates();
        templates.setTemplateName(templatename);
        templates.setTemplateOrder(data);
        templates.setType(type1);
        templates.setuAccountNum(currentuser.getUAccountNum());
        templates.setAgentNumber(currentuser.getAgentNumber());
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
    public void searchAllTemplate(){
        String content=getPara("content");
        String type=getPara("type");
        int pageno=getParaToInt("pageno",1);
        int limit=getParaToInt("limit",10);
        String userid = getCookie(IndexService.me.accessUserId);
        StaffData currentuser = StaffService.me.getStaffById(userid);
        Result<Page<Templates>> result=Result.newOne();
        try{
            if(RoleType.getString(currentuser.getIRoleType()).equals("superadmin")){
                Page<Templates> templatesPage=TemplateService.me.searchAllTemplate(type,content,pageno,limit);
                result.success(templatesPage);
            }else{
                Page<Templates> templatesPage=TemplateService.me.searchTemplateByCom(type,currentuser.getAgentNumber(),content,pageno,limit);
                result.success(templatesPage);
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**更改配置**/
    public void excuteTemplate(){
        Result result=Result.newOne();
        Gson gson=new Gson();
        SocketTools socketTools=new SocketTools();
        String data=getPara("json");
        List<MachineInfoEntity> sList =gson.fromJson(data,new TypeToken<List<MachineInfoEntity>>(){}.getType());
        String template=getPara("sn");
        boolean online=true;
        try{
            for(int i=0;i<sList.size();i++){
                String cursn=sList.get(i).getMachineSerial();
                int state=MachineData.dao.findFirst("select * from machine_data where machineSerial='"+cursn+"'").getConnectState();
                if(state==0){
                    online=false;
                    break;
                }
            }
            if(online){
                TemplateService.me.excuteTemplate(sList,template);
                for(int i=0;i<sList.size();i++){
                    socketTools.updateSocket(sList.get(i).getMachineSerial());
                }
                result.success("success");
            }else{
                result.success("设备不在线，修改失败");
            }
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
            result.success("error");
        }
       renderJson(result);
    }

    /**获取模板对应的设备配置**/
    public void getDeviceByTemplate(){
        String template=getPara("name");
        Result result=Result.newOne();
        String sql="select * from template_data where templateName='"+template+"'";
        TemplateData templatedata= Optional.ofNullable(TemplateData.dao.findFirst(sql))
                .orElseGet(TemplateData::new);
        String order=templatedata.getTemplateOrder();
        Gson gson=new Gson();
        MachineInfoEntity machineData=gson.fromJson(order,new TypeToken<MachineInfoEntity>(){}.getType());
        result.success(machineData);
        renderJson(result);
    }

    /**根据模板名获取模板**/
    public void getTemplateByName(){
        Result result=Result.newOne();
        String name=getPara("name");
        String sql="select * from template_data where templateName='"+name+"'";
        TemplateData templatedata= TemplateData.dao.findFirst(sql);
        result.success(templatedata);
        renderJson(result);
    }

    /**修改模板名**/
    public void updateModelNameByName(){
        Result result=Result.newOne();
        String name=getPara("name");
        String newname=getPara("newname");
        String sql="update template_data set templateName='"+newname+"' where templateName='"+name+"'";
        try{
            Db.update(sql);
            result.success("更新成功");
        }catch (Throwable e){
            result.error(e.getMessage());
        }
        renderJson(result);
    }

}
