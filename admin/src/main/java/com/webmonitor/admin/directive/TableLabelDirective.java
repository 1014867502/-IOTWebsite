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
 * 标签 组件指令
 * 参数1: option
 * 参数2: 默认值 (可选)
 * option 参数:
 * id
 * name     要进行取值的字段名
 * dataSets 自定义数据集
 * sql      sql数据集  (二选一)
 * dictObj  字典表  (二选一)
 * className    样式名
 *
 * 调用方式:
 * 方式1: #tableLabel("{name:'ds',dictObj:{table:'sys_dict',object:'sys_object',field:'data_source'}}")
 * 方式2: #tableLabel("{name:'type',dataSets:[{name:'Table',value:'table'},{name:'View',value:'view'}]}")
 * 方式3: #tableLabel("{name:'type',sql:'select name, value from Tools'}")
 */
public class TableLabelDirective extends Directive {
    private static final Log log = Log.getLog(TableLabelDirective.class);

    @Override
    public void exec(Env env, Scope scope, Writer writer) {
        try {
            Object[] values = exprList.evalExprList(scope);
            String strParam = String.valueOf(values[0]);
            ParamObj obj = JsonKit.parse(strParam, ParamObj.class);
            String className = "";
            if(!Tools.isEmpty(obj.getClassName())) {
                className = obj.getClassName();
            }
            List<CustomDataSet> dataSetList = obj.getDataSets();
            StringBuffer result = new StringBuffer();
            result.append("{{# var data = d."+obj.getName()+".toString();\n var datas = data.split(',');\n");
            result.append(" layui.each(datas, function(index, item){ }}");
            if (!Tools.isEmpty(dataSetList)) {
                for (CustomDataSet set : dataSetList) {
                    result.append("{{# if(item == '"+set.getValue()+"'){ }}");
                    result.append("<span class='"+className+"'>"+set.getName()+"</span>");
                    result.append("{{# } }}");
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
                    result.append("{{# if(item == '"+value+"'){ }}");
                    result.append("<span class='"+className+"'>"+name+"</span>");
                    result.append("{{# } }}");
                }
            }
            result.append("{{# }); }}");
            writer.write(result.toString());
        } catch (Exception e) {
            try {
                writer.write("has error");
                log.error("LabelDirective has error:"+e);
            }catch (Exception ex){}
        }
    }
}
