package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.TemplateData;
import com.webmonitor.core.model.userbase.Templates;

public interface ITemplate {

    /**获取模板列表（全部）**/
    Page<Templates> getAllTemplate(int pageno, int limit);

    /**获取模板列表(公司)**/
    Page<Templates> getTemplateByCom(String comid,int pageno,int limit);

    /**根据编号获取模板**/
    Templates getTemplateBySn(String templatename);

    /**添加模板**/
    void addTemplate(TemplateData templates);

    /**删除模板**/
    Boolean delTemplateByName(String id);

    /**更新模板**/
    Boolean updateTemplateByName(Templates templates);

    /**根据名称查找模板**/
    Page<Templates> getTemplateByName(String templatename);

    /**搜索全部模板（模板管理）**/
    Page<Templates> searchAllTemplate(String type,String content ,int pageno,int limit);

    /**搜索全部模板（模板配置）**/
    Page<Templates> searchSettingTemplate(String type,String content ,int pageno,int limit);

    /**普通用户搜索全部模板**/
    Page<Templates> searchTemplateByCom(String type,String agentnum,String content,int pageno,int limit);

    /**模板执行修改**/
    boolean excuteTemplate(String machineserial,String templateid);
}
