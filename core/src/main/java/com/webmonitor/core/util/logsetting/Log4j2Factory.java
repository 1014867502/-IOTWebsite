package com.webmonitor.core.util.logsetting;

import com.jfinal.log.ILogFactory;
import com.jfinal.log.Log;

public class Log4j2Factory implements ILogFactory {
    public Log4j2Factory() {
        // TODO Auto-generated constructor stub
    }

    @Override
    public Log getLog(Class<?> clazz) {
        return new Log4j2Log(clazz);
    }

    @Override
    public Log getLog(String name) {
        return new Log4j2Log(name);
    }
}
