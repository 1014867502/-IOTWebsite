package com.webmonitor.core.idal;

/**指令表对应接口**/
public interface ICache {

    void add(String machineserial,String orderpath,String ordervalue);

    void getAll();

    void getCacheBySn(String machineserial);

}
