package com.webmonitor.core.util;

import com.jfinal.plugin.activerecord.Db;
import com.webmonitor.core.model.AgentTable;

import java.io.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class UploadThread{

    private int progress;
    private String name;
    private File file;
    private boolean interrupted=false;

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public File getFile() { return file; }
    public void setFile(File file) { this.file = file; }

    public boolean isInterrupted() {
        return interrupted;
    }

    public void setInterrupted(boolean interrupted) {
        this.interrupted = interrupted;
    }

    /**执行上传文件**/
    public  UploadThread(File file, String name){
        setFile(file);
        setName(name);
    }

    public String uploadexcute(){
        FutureTask<String> task = new FutureTask<String>(new CallableImpl());
        Thread thread = new Thread(task);
        thread.start();
        try {
            System.out.println("task.get() returns " + task.get());
            return task.get();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return "文件上传失败";
        }
    }




    class CallableImpl implements Callable<String> {
        @Override
        public String call() {
            /**执行上传文件**/
                try {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file),"GBK"));//换成你的文件名
                    String head=reader.readLine();//第一行信息，为标题信息，不用,如果需要，注释掉
                    String[] heads=head.split(",");
                    boolean columsbool=true;
                    int excutecount=0;
                    int rowCount=0;
                    String line = null;
                    reader.mark( ( int )file.length() + 1 );
                    while(reader.readLine()!=null){
                        rowCount++;
                    }
                    reader.reset();
                    while((line=reader.readLine())!=null&&!interrupted){
                        String colums="";//插入语句的列名
                        String insertvalue="";//插入语句的数值
                        String value="";
                        String[] values=line.split(",");
                        for(int i=0;i<values.length;i++){
                            if(i>1){
                                value+=",'"+values[i].replace('/','-')+"'";
                                if(i==3&&values.length==4){
//                                    if(values[i].length()<10){
//                                        return  "sn号长度有误";
//                                    }
                                    value+=",''";
                                }
                            }
                            else{
                                if(i==0){
                                    value+="'"+values[i].replace('/','-')+"'";
                                }
                                if(i==1){
                                    String sql="select agentNumber from agent_table where agentName like '%"+values[i]+"%'";
                                    AgentTable result= AgentTable.dao.findFirst(sql);
                                    if(result==null){
                                        return values[i]+" 公司名不存在";
                                    }else{
                                        value+=",'"+result.getAgentNumber()+"'";
                                    }
                                }

                            }
                        }
                        String sql="REPLACE INTO  agent_data (orderNumber,agentNumber,productCode,machineName,machineSerial,createTime,mainModel,proGroupId)" +
                                "VALUES("+value+ ",'0')";
                        Db.query(sql);
                        excutecount++;
                        progress=excutecount*100/rowCount;
                    }
                    reader.close();
                } catch (Exception e) {
                    e.printStackTrace();
                    return "文件上传失败";
                }
                return "文件上传成功！";
            }
        }


}
