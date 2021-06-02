package com.webmonitor.admin.common.kit;

import com.jfinal.kit.LogKit;
import com.jfinal.kit.PathKit;
import com.webmonitor.core.util.PropertiesUtil;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.io.FileUtil;

import java.io.File;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

public class StartInit {

    /**
     * 初始化配置
     */
    public static void initConfig(Map<String, String> props) {
        String resPath = PathKit.getRootClassPath() + File.separator;
        // 加载默认配置
        boolean flag = loadConfig(props, resPath + "pro");
        if (flag) {
            LogKit.info("默认配置加载成功:(resources/pro)\n");
        }
        // 加载本地配置
        flag = loadConfig(props, resPath + "dev");
        if (flag) {
            LogKit.info("开发配置覆盖成功:(resources/dev)\n");
        }
        try {

            initWebConfig();
            // 加载运行环境配置
            String envConfigPath = Tools.getConfig("env_config_path");
            if (!Tools.isEmpty(envConfigPath)) {
                flag = loadConfig(props, envConfigPath);
                if (flag) {
                    LogKit.info(String.format("环境配置覆盖成功:%s\n", envConfigPath));
                }
            }
        } catch (Exception e) {
            LogKit.error(String.format("加载环境配置异常:%s", e.getMessage()));
        }

    }
    private static void initWebConfig()
    {
        String configfile = PathKit.getRootClassPath() + File.separator+"dev"+
                File.separator+"websetting.properties";
        try {

            PropertiesUtil.getInstance().LoadFile(configfile);
        } catch (Exception e) {
            LogKit.error(String.format("加载环境配置异常:%s", e.getMessage()));
        }


    }

    /**
     * 加载配置
     *
     * @param path
     * @return
     */
    private static boolean loadConfig(Map<String, String> props, String path) {
        if (!FileUtil.isDir(path)) {
            return false;
        }
        File[] files = FileUtil.getFiles(path);
        for (File file : files) {
            if (!file.getName().endsWith(".properties")) {
                continue;
            }
            Properties properties = FileUtil.getProp(file);
            Set<Object> keySet = properties.keySet();
            for (Object ks : keySet) {
                String key = ks.toString();
                props.put(key, properties.getProperty(key));
            }
            LogKit.info(file.getName());
        }
        return true;
    }
}
