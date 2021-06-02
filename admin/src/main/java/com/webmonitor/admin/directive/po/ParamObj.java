package com.webmonitor.admin.directive.po;

import java.util.List;

public class ParamObj {
    private String id;
    private String name;
    private String verify;
    private List<CustomDataSet> dataSets;
    private String sql;
    private DictObj dictObj;
    private String className;
    private String classNameCondition;
    private boolean search = false;
    private boolean multiple = false;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVerify() {
        return verify;
    }

    public void setVerify(String verify) {
        this.verify = verify;
    }

    public List<CustomDataSet> getDataSets() {
        return dataSets;
    }

    public void setDataSets(List<CustomDataSet> dataSets) {
        this.dataSets = dataSets;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public DictObj getDictObj() {
        return dictObj;
    }

    public void setDictObj(DictObj dictObj) {
        this.dictObj = dictObj;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public boolean isSearch() {
        return search;
    }

    public void setSearch(boolean search) {
        this.search = search;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public String getClassNameCondition() {
        return classNameCondition;
    }

    public void setClassNameCondition(String classNameCondition) {
        this.classNameCondition = classNameCondition;
    }
}
