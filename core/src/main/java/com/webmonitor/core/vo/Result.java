package com.webmonitor.core.vo;

import java.util.List;

public class Result<TData> {
    public enum Code {
        ok(0), logout(1001), error(1002), noauth(1003);

        //
        private int value = -1;

        Code(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }
    }

    public int code = Code.ok.getValue();
    public String msg = null;
    public TData data = null;

    public String toString() {
        StringBuilder dataBuilder = new StringBuilder();
        if (data instanceof List) {
            List dataList = (List) data;
            for (Object o:dataList) {
                dataBuilder.append(o);
            }
        } else {
            dataBuilder.append(data);
        }
        StringBuilder builder = new StringBuilder();
        builder.append("code = " + code);
        builder.append("       msg = " + msg);
        builder.append("       data = " + dataBuilder.toString());
        return builder.toString();
    }

    public void echo() {
        System.out.println(this.toString());
    }

    public Result<TData> success(TData data) {
        return this.ok(data, "succ");
    }

    public Result<TData> ok(TData data, String msg) {
        this.setCode(Code.ok);
        this.setMsg(msg);
        this.setData(data);

        return this;
    }

    public Result<TData> error(String msg) {
        this.setCode(Code.error);
        this.setMsg(msg);
        this.setData(null);

        return this;
    }

    public Result<TData> noauth(String msg) {
        this.setCode(Code.noauth);
        this.setMsg(msg);
        this.setData(null);
        return this;
    }

    public static <TData> Result<TData> newOne() {
        return new Result<TData>();
    }

    public Result<TData> setCode(Code code) {
        this.code = code.getValue();
        return this;
    }

    public Result<TData> setMsg(String msg) {
        this.msg = msg;
        return this;
    }

    public Result<TData> setData(TData data) {
        this.data = data;
        return this;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }

    public TData getData() {
        return data;
    }
}

