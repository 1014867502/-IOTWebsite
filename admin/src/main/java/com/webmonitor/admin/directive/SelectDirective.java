package com.webmonitor.admin.directive;

import com.jfinal.kit.JsonKit;
import com.jfinal.log.Log;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.template.Directive;
import com.jfinal.template.Env;
import com.jfinal.template.io.Writer;
import com.jfinal.template.stat.Scope;
import com.webmonitor.admin.directive.po.CustomDataSet;
import com.webmonitor.admin.directive.po.DictObj;
import com.webmonitor.admin.directive.po.ParamObj;
import com.webmonitor.core.util.Tools;

import java.util.ArrayList;
import java.util.List;

/**
 * select 组件指令
 * 参数1: option
 * 参数2: 默认值 (可选)
 * option 参数:
 * id       组件id
 * name     组件name
 * verify   校验方式名
 * dataSets 自定义数据集
 * sql      sql数据集  (二选一)
 * dictObj  字典表  (二选一)
 * className    样式名
 *
 * 调用方式:
 * 方式1: #select("{id:'ds',name:'ds',dictObj:{table:'sys_dict',object:'sys_object',field:'data_source'}}", "main")
 * 方式2: #select("{id:'type',name:'type',dataSets:[{name:'Table',value:'table'},{name:'View',value:'view'}]}", "table")
 * 方式3: #select("{id:'type',name:'type',sql:'select name, value from Tools'}", "table")
 */
public class SelectDirective extends Directive {
    private static final Log log = Log.getLog(SelectDirective.class);

    @Override
    public void exec(Env env, Scope scope, Writer writer) {
        try {
            Object[] values = exprList.evalExprList(scope);
            String defaultValue = "";
            if (values.length == 2) {//第二个参数是默认值
                defaultValue = String.valueOf(values[1]);
            }
            String strParam = String.valueOf(values[0]);
            ParamObj obj = JsonKit.parse(strParam, ParamObj.class);
            List<CustomDataSet> dataSetList = obj.getDataSets();
            StringBuffer result = new StringBuffer();
            result.append("<select ");
            if(!Tools.isEmpty(obj.getId())) {
                result.append("id='"+obj.getId()+"' ");
                result.append("lay-filter='"+obj.getId()+"' ");
            }
            if(!Tools.isEmpty(obj.getName())) {
                result.append("name='"+obj.getName()+"' ");
            }
            if(!Tools.isEmpty(obj.getVerify())) {
                result.append("lay-verify='"+obj.getVerify()+"' ");
            }
            if(obj.isSearch()){
                result.append("lay-search ");
            }
            if(obj.isMultiple()){
                result.append("multiple='multiple' ");
            }
            result.append(">");
            String[] arrDefaults = new String[]{};
            if(!Tools.isEmpty(defaultValue)) {
                arrDefaults = defaultValue.split(",");
            }
            if (!Tools.isEmpty(dataSetList)) {
                for (CustomDataSet set : dataSetList) {
                    String selected = "";
                    for(String defaultVal : arrDefaults) {
                        if (!Tools.isEmpty(defaultVal) && defaultVal.equals(set.getValue())) {
                            selected = "selected";
                        }
                    }
                    result.append("<option value='"+set.getValue()+"' "+selected+">"+set.getName()+"</option>");
                }
            }
            if(!Tools.isEmpty(obj.getSql()) || !Tools.isEmpty(obj.getDictObj())){
                List<Record> recordList = new ArrayList<>();
                if (!Tools.isEmpty(obj.getSql())) {
                    recordList = Db.find(obj.getSql());
                }
                if (!Tools.isEmpty(obj.getDictObj())) {
                    DictObj dictObj = obj.getDictObj();
                    String sql = "select name, value from " + dictObj.getTable() + " where object=? and field=?";
                    recordList = Db.find(sql, dictObj.getObject(), dictObj.getField());
                }
                for (Record record : recordList) {
                    String name = record.getStr("name");
                    String value = record.getStr("value");
                    String selected = "";
                    for(String defaultVal : arrDefaults) {
                        if (!Tools.isEmpty(defaultVal) && defaultVal.equals(value)) {
                            selected = "selected";
                        }
                    }
                    result.append("<option value='" + value + "' " + selected + ">" + name + "</option>");
                }
            }
            result.append("</select>");
            writer.write(result.toString());
        } catch (Exception e) {
            try {
                writer.write("has error:"+e.getMessage());
            }catch (Exception ex){}
            log.error("SelectDirective has error:"+e);
        }
    }
}
