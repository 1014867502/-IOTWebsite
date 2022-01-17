package com.webmonitor.admin.gen;

import com.jfinal.plugin.activerecord.generator.MetaBuilder;

import javax.sql.DataSource;

public class _MetaBuilder extends MetaBuilder {

    public _MetaBuilder(DataSource dataSource) {
        super(dataSource);
    }

    protected boolean isSkipTable(String tableName){
        return !tableName.startsWith("machine_data");
    }
}
