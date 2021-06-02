package com.webmonitor.core.util;

import com.jfinal.kit.PathKit;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ProcessUtil {
    public static void startProgram(String programPath) throws IOException {
        if (!Tools.isEmpty(programPath)) {
            try {
                String programName = programPath.substring(programPath.lastIndexOf("\\") + 1, programPath.lastIndexOf("."));
                List<String> list = new ArrayList<String>();
                list.add("cmd.exe");
                list.add("/c");
                list.add("start");
                list.add("\"" + programName + "\"");
                list.add("\"" + programPath + "\"");
                ProcessBuilder pBuilder = new ProcessBuilder(list);
                pBuilder.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    public static void runExe(String exePath)
    {
        try {

//            String nircmd = PathKit.getWebRootPath() + File.separator+"WEB-INF"
//                    +File.separator+"classes"+File.separator + "nircmd.exe";
//            String command = nircmd+" elevate  "+"\""+exePath+"\"";
            String command = "cmd /c  "+"\""+exePath+"\"";
            Runtime.getRuntime().exec(command);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public static boolean findProcess(String processName) {
        BufferedReader bufferedReader = null;
        try {
            Process proc = Runtime.getRuntime().exec("tasklist -fi " + '"' + "imagename eq " + processName +'"');
            bufferedReader = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String line = null;
            while ((line = bufferedReader.readLine()) != null) {
                if (line.contains(processName)) {
                    return true;
                }
            }
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (Exception ex) {}
            }
        }
    }
    /**
     * 检查进程是否存在，存在则杀死进程
     * @param procName
     */
    public static String killProcess(String procName) {
        String result = "";
        //判断是否存在进程
        Boolean existProc = false;
        existProc = findProcess(procName);

        // 存在，则先杀死该进程
        if (existProc) {
            BufferedReader br = null;
            try {
                if (!Tools.isEmpty(procName)) {
                    //执行cmd命令
                    String command = "taskkill /F /IM " + procName;
                    Runtime runtime = Runtime.getRuntime();
                    Process process = runtime.exec("cmd /c " + command);
                    br = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
                    String line = null;
                    StringBuilder build = new StringBuilder();
                    while ((line = br.readLine()) != null) {
                        build.append(line);
                    }
                }
            } catch (Exception e) {
                result = "关闭程序进程异常："+e.getMessage();
                return result;
            } finally {
                if (br != null) {
                    try {
                        br.close();
                    } catch (Exception ex) {}
                }
            }
        }
        return result;
    }
    public static String readDBfilePath()
    {
        int position=0;
        String[] bufstring=new String[1024];
        //打开带读取的文件
        String line=null;
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader("C:\\Program Files\\CRS\\runpath.txt"));

            while((line=br.readLine())!=null) {
                bufstring[position]=line;
                position++;
                break;
            }
            br.close();//关闭文件
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return line;
    }
}
