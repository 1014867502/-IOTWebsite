package com.webmonitor.admin.template;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.devicelist.DeviceListService;
import com.webmonitor.core.dal.AgentDataMysqlDAL;
import com.webmonitor.core.dal.TemplateMysqlDAL;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.idal.ITemplate;
import com.webmonitor.core.model.MachineInfoEntity;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.userbase.Templates;
import com.webmonitor.core.util.StringUtils;

import java.util.List;

public class TemplateService {
    public static final TemplateService me = new TemplateService();
    private static ITemplate dal=new TemplateMysqlDAL();

    public Page<Templates> showAllTemplate(int pageno,int limit){
        return dal.getAllTemplate(pageno, limit);
    }

    public Page<Templates> getAdminTemplate(String groupagent,int pageno, int limit){
        return dal.getAdminTemplate(groupagent, pageno, limit);
    }

    public Page<Templates> showTemplateByCom(String agentNum,int pageno,int limit){
        return dal.getTemplateByCom(agentNum, pageno, limit);
    }

    /**搜索模板**/
    public Page<Templates> searchAllTemplate(StaffData staffData,String type, String content, int pageno, int limit){
        return dal.searchAllTemplate(staffData,type, content, pageno, limit);
    }

    /**搜索模板**/
    public Page<Templates> searchSettingTemplate(StaffData staffData,String type,String content,int pageno,int limit){
        return dal.searchSettingTemplate(staffData,type, content, pageno, limit);
    }

    /**搜索模板（普通用户）**/
    public Page<Templates> searchTemplateByCom(String type,String agentnum,String content,int pageno,int limit){
        return dal.searchTemplateByCom(type, agentnum, content, pageno, limit);
    }

    public void addTemplate(TemplateData templates){
        dal.addTemplate(templates);
    }

    public  boolean updateTemplateById(Templates templates){
        return  dal.updateTemplateByName(templates);
    }

    public  boolean delTemplateById(String name){
       return  dal.delTemplateByName(name);
    }

    /**升级版本**/


    /**更改配置**/
    public boolean excuteTemplate(String userid,List<MachineInfoEntity> machineInfoEntities, String templateName){
        boolean test=false;
        TemplateData template=TemplateData.dao.findFirst("select * from template_data where templateName='"+templateName+"'");
        Gson gson=new Gson();
        int rawBackport=0;
        int numlen=0;
        int rawname=1;
        int rawport=0;
        String number="";
        String sign="";
        MachineInfoEntity machineInfoEntity=gson.fromJson(template.getTemplateOrder(),new TypeToken<MachineInfoEntity>(){}.getType());
        String rawsolution=machineInfoEntity.getRawSolution();
        String rawmode=machineInfoEntity.getRawMode();
        String compute=rawsolution+rawmode;
        String rawback=(machineInfoEntity.getRawBackPort()!=null&&machineInfoEntity.getRawBackPort().equals(""))?"0":machineInfoEntity.getRawBackPort();//原始端口
        String stationname=machineInfoEntity.getRawName();//编号
        String lasttwo=stationname.substring(stationname.length()-1,stationname.length());
        if(StringUtils.isNumeric(lasttwo)){
            String[] numbsers=StringUtils.splitNumber(stationname);
            String[] signs=StringUtils.splitSign(stationname);
            String lastsign=signs[signs.length-1];
            String lastnum=numbsers[numbsers.length-1];
            int lastindex=stationname.lastIndexOf(lastsign);
            stationname=stationname.substring(0,lastindex+lastsign.length());
            numlen=lastnum.length();
            rawname=Integer.valueOf(lastnum);
        }
        String raw=machineInfoEntity.getRawPort();//基站文件回传|观测端口
        rawBackport=Integer.parseInt(rawback==null?"0":rawback);
        rawport=Integer.parseInt(raw==null?"0":raw);
        switch(machineInfoEntity.getNameType()){
            case 0:
                for(MachineInfoEntity item:machineInfoEntities) {
                    machineInfoEntity.setRawName(item.getRawName());
                    if(template.getType()==1){//1快速配置 2详细配置
                        if(!compute.equals("00")){
                            machineInfoEntity.setRawPort(String.valueOf(rawport));
                            rawport++;
                        }
                    }else{
                        if(compute.equals("00")){
                            machineInfoEntity.setRawBackPort(String.valueOf(rawBackport));
                            rawBackport++;
                        } else{
                            machineInfoEntity.setRawPort(String.valueOf(rawport));
                            rawport++;
                            machineInfoEntity.setRawBackPort(String.valueOf(rawBackport));
                            rawBackport++;
                        }
                    }
                    test = DeviceListService.me.checkObjAllFieldsIsNull(userid, item.getMachineSerial(), machineInfoEntity);
                }
                break;
            case 1:
                for(MachineInfoEntity item:machineInfoEntities) {
                    machineInfoEntity.setRawName(item.getMachineSerial());
                    if(template.getType()==1){//1快速配置 2详细配置
                        if(!compute.equals("00")){
                            machineInfoEntity.setRawPort(String.valueOf(rawport));
                            rawport++;
                        }
                    }else{
                        if(compute.equals("00")){
                            machineInfoEntity.setRawBackPort(String.valueOf(rawBackport));
                            rawBackport++;
                        } else{
                            machineInfoEntity.setRawPort(String.valueOf(rawport));
                            rawport++;
                            machineInfoEntity.setRawBackPort(String.valueOf(rawBackport));
                            rawBackport++;
                        }
                    }
                    test = DeviceListService.me.checkObjAllFieldsIsNull(userid, item.getMachineSerial(), machineInfoEntity);
                }
                break;
            case 2:
                for(MachineInfoEntity item:machineInfoEntities){
                    if(template.getType()==1){//1快速配置 2详细配置
                        if(!compute.equals("00")){
                            machineInfoEntity.setRawPort(String.valueOf(rawport));
                            rawport++;
                            String rawname1=String.format("%0"+numlen+"d",rawname);
                            machineInfoEntity.setRawName(stationname+rawname1);
                            rawname++;
                        }else{
                            String rawname1=String.format("%0"+numlen+"d",rawname);
                            machineInfoEntity.setRawName(stationname+rawname1);
                            rawname++;
                        }
                    }else{
                        if(compute.equals("00")){
                            machineInfoEntity.setRawBackPort(String.valueOf(rawBackport));
                            rawBackport++;
                            String rawname1=String.format("%0"+numlen+"d",rawname);
                            machineInfoEntity.setRawName(stationname+rawname1);
                            machineInfoEntity.setRawName(stationname+rawname);
                            rawname++;
                        } else{
                            machineInfoEntity.setRawPort(String.valueOf(rawport));
                            rawport++;
                            machineInfoEntity.setRawBackPort(String.valueOf(rawBackport));
                            rawBackport++;
                            String rawname1=String.format("%0"+numlen+"d",rawname);
                            machineInfoEntity.setRawName(stationname+rawname1);
                            machineInfoEntity.setRawName(stationname+rawname);
                            rawname++;
                        }
                    }
                    test=DeviceListService.me.checkObjAllFieldsIsNull(userid,item.getMachineSerial(),machineInfoEntity);
                }
                break;
        }

        if(test){
            return true;
        }else{
           return false;
        }
    }
}
