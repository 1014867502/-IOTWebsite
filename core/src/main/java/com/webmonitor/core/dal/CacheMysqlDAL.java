package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.ICache;
import com.webmonitor.core.model.CacheOrder;

public class CacheMysqlDAL implements ICache {

    /**添加内容到指令表**/
    @Override
    public void add(String machineserial, String orderpath, String ordervalue) {
        String account="";
        CacheOrder cacheOrder=CacheOrder.dao.findFirst("select * from cache_order where orderPath='"+orderpath+"'  and machineSerial='"+machineserial+"'");
        if(cacheOrder!=null){
            Record staff=new Record().set("id",cacheOrder.getId()).set("machineSerial",machineserial).set("orderPath",orderpath).set("orderValue",ordervalue);
            Db.update("cache_order",staff);
        }else{
            Record staff=new Record().set("machineSerial",machineserial).set("orderPath",orderpath).set("orderValue",ordervalue);
            Db.save("cache_order",staff);
        }

    }

    @Override
    public void getAll() {

    }

    @Override
    public void getCacheBySn(String machineserial) {

    }
}
