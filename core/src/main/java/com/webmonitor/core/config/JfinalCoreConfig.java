package com.webmonitor.core.config;

import com.jfinal.config.JFinalConfig;

import java.util.HashMap;
import java.util.Map;

public abstract class JfinalCoreConfig extends JFinalConfig {
    protected static Map<String, String> props = new HashMap<String, String>();

    public static Map<String, String> getProps() {
        return props;
    }

    /**
     * 20190513
     * @param key
     * @param value
     */
    public static  void setProps(String key,String value)
    {
        if (props.containsKey(key))
        {
            return;
        }
        else
        {
            props.put(key,value);
        }
    }
}
