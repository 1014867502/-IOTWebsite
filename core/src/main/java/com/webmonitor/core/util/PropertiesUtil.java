package com.webmonitor.core.util;

import com.webmonitor.core.util.io.FileUtil;

import java.io.*;
import java.util.*;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;

public class PropertiesUtil {
    private static PropertiesUtil proputil;
    protected  Map<String, String> props = new HashMap<String, String>();
    protected  Properties propfile = new Properties();
    protected  String filepath;
    private PropertiesUtil(){}
    public static PropertiesUtil getInstance() {
        if (proputil != null) {
            return proputil;
        }
        proputil = new PropertiesUtil();
        return proputil;
    }

    public boolean LoadFile(String strFile) throws IOException {
        File file = new File(strFile);
        if (!file.exists()) {
            return false;
        }
        props.clear();
        Properties properties = FileUtil.getProp(file);
        Set<Object> keySet = properties.keySet();
        for (Object ks : keySet) {
            String key = ks.toString();
            props.put(key, properties.getProperty(key));
        }

        filepath = strFile;

        try {
            InputStream in;
            in = new BufferedInputStream(new FileInputStream(filepath));
            propfile.load(in);     ///加载属性列表
            in.close();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return true;
    }
    public  void SaveFile()
    {
        //保存属性到b.properties文件
        FileOutputStream oFile ;
        try {
            System.out.println("s"+filepath);
            oFile = new FileOutputStream(filepath, false);

            String wrBuffer;
            for (String key : props.keySet()) {
                propfile.setProperty(key, props.get(key));
                propfile.store(oFile, "");

//                wrBuffer = key+"="+props.get(key)+"\n";
//                oFile.write(wrBuffer.getBytes());
            }


            oFile.close();
        } catch (Exception e) {
            // TODO 自动生成的 catch 块
            e.printStackTrace();
        }
    }
//    public String getKeyValue(String key)
//    {
//        String rs = "";
//        for (String k : props.keySet()) {
//
//            if (k.equals(key))
//            {
//                return props.get(k);
//            }
//        }
//        return rs;
//    }
    public boolean addProp(String key,String value)
    {
        if (!props.containsKey(key))
        {
            props.put(key,value);
            return  true;
        }
        return  false;
    }
//    public void updateProp(String key,String value)
//    {
//        props.put(key,value);
//    }
}
