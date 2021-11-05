package com.webmonitor.core.model;

public enum Response {
    SUCCESS_EDIT("修改成功"),
    ERROR_EDIT("修改失败"),
    SUCCESS_DELETE("删除成功"),
    ERROR_DELETE("删除失败"),
    SUCCESS_EXECUTE("执行成功"),
    ERROR_EXECUTE("执行失败");

    private String report;

    Response(String i) {
        this.report=i;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }
}
