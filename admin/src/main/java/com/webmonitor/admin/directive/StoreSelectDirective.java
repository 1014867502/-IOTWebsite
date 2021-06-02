package com.webmonitor.admin.directive;

import com.jfinal.kit.JsonKit;
import com.jfinal.log.Log;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.template.Directive;
import com.jfinal.template.Env;
import com.jfinal.template.io.Writer;
import com.jfinal.template.stat.Scope;
import com.webmonitor.admin.auth.AuthService;
import com.webmonitor.admin.directive.po.ParamObj;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.model.Account;
import com.webmonitor.core.util.Tools;

import java.util.ArrayList;
import java.util.List;

/**
 * 门店select 组件指令  该组件是供数据权限区分时使用的
 * 调用方式:
 * 方式: #storeselect("{id:'type',name:'type'}", "defaultValue")
 */
public class StoreSelectDirective extends Directive {
    private static final Log log = Log.getLog(StoreSelectDirective.class);

    @Override
    public void exec(Env env, Scope scope, Writer writer) {
        try {
            Object[] values = exprList.evalExprList(scope);
            String strParam = String.valueOf(values[0]);
            String defaultValue = "";
            if (values.length == 2) {//第二个参数是默认值
                defaultValue = String.valueOf(values[1]);
            }
            ParamObj obj = JsonKit.parse(strParam, ParamObj.class);
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
            boolean flag = true;//下拉框是否需要显示"请选择"
            List<Record> recordList = new ArrayList<>();
            //此处为与普通select不同的地方，假如账户为前台，则加上条件限制
            List<Object> paras = new ArrayList<Object>();
            Account account = (Account)scope.getRootData().get(IndexService.loginAccountCacheName);
            String sql = "select name, id value from sports_store";
            if (account != null) {
                if (AuthService.me.hasRole(account.getId(), new String[]{"前台"})) {
                    sql += " where id = ?";
                    //paras.add(account.getStoreId());
                    flag = false;
                }
            }
            recordList = Db.find(sql, paras.toArray());
            if (flag) {
                result.append("<option value=''>Selected</option>");
            }
            for (Record record : recordList) {
                String name = record.getStr("name");
                String value = record.getStr("value");
                String selected = "";
                if (!Tools.isEmpty(defaultValue) && defaultValue.equals(value)) {
                    selected = "selected";
                }
                result.append("<option value='" + value + "' " + selected + ">" + name + "</option>");
            }
            result.append("</select>");
            writer.write(result.toString());
        } catch (Exception e) {
            try {
                writer.write("has error:"+e.getMessage());
            }catch (Exception ex){}
            log.error("storeSelectDirective has error:"+e);
        }
    }
}
