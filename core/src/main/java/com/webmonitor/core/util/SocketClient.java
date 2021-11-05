package com.webmonitor.core.util;


import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.List;

public class SocketClient {

    /**
     * socket对象
     *
     */
    private Socket mSocket;
    /**
     * 客户端id
     *
     */
    private String mClientId;
    private String sn;
    private String useid;
    private OutputStream outputStream;;
    // 输入流对象
    private InputStream is;
    // 输入流读取器对象
    private InputStreamReader isr ;
    private BufferedReader br ;
    private boolean mRecycleFlag = true;
    private boolean onlineFlag=true;
    private long connectime=0;
    private long latesttime=0;
    public String realdata;
    public String response;
    public boolean isOnlineFlag() { return onlineFlag; }
    public void setOnlineFlag(boolean onlineFlag) { this.onlineFlag = onlineFlag; }
    public boolean getall=false;
    public StringBuilder resultall=new StringBuilder();
    public long getConnectime() { return connectime; }
    public void setConnectime(long connectime) { this.connectime = connectime; }
    public long getLatesttime() { return latesttime; }
    public void setLatesttime(long latesttime) { this.latesttime = latesttime; }

    public SocketClient() {
        mSocket = new Socket();
    }


    /**
     * 连接socket
     *
     */
    public void connect(String machineserial,String userid) {
        {
            sn=machineserial;
            useid=userid;
            //如果关闭了要新建socket对象
            if (mSocket.isClosed()) {
                mSocket = new Socket();

            }
            try {
                //如果没连接则需要连接
                if (!mSocket.isConnected()) {
                    mSocket.connect(new InetSocketAddress("rjb.geoelectron.com", 9000),5000);
                    // 步骤1：从Socket 获得输出流对象OutputStream
                    // 该对象作用：发送数据
                    mClientId = "WebClient"+userid;
                    outputStream = mSocket.getOutputStream();
                    // 步骤2：写入需要发送的数据到输出流对象中
                    outputStream.write((mClientId+"\n").getBytes("utf-8"));
                    // 特别注意：数据的结尾加上换行符才可让服务器端的readline()停止阻塞
                    if (mSocket.isConnected()) {
                        // 步骤3：发送数据到服务端
                        outputStream.flush();
                    }
                    ReceiveDataRunnable runnable= new ReceiveDataRunnable();//自己创建的线程类
                    new Thread(runnable).start();//启动线程
                    /**
                     * 再建一个循环发送debug的定时线程
                     */
                    DebugRunnable debugRunnable=new DebugRunnable(userid,machineserial);
                    new Thread(debugRunnable).start();
                    //TODO
                }
            } catch (IOException e) {
                onlineFlag=false;
                e.printStackTrace();
                closeConnect();
            }
        }
    }

    /**
     * 发送数据到服务器
     *
     */
    public void sendData(final String sendData) {
        if (null != mSocket && !mSocket.isClosed()) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        // 步骤1：从Socket 获得输出流对象OutputStream
                        // 该对象作用：发送数据
                        outputStream = mSocket.getOutputStream();
                        // 步骤2：写入需要发送的数据到输出流对象中
                        outputStream.write((sendData+"\n").getBytes("utf-8"));
                        // 特别注意：数据的结尾加上换行符才可让服务器端的readline()停止阻塞
                        // 步骤3：发送数据到服务端
                        outputStream.flush();
                    } catch (IOException  e) {
                        e.printStackTrace();
                    }
                }
            }).start();

        } else {
        }
    }


    class ReceiveDataRunnable implements Runnable {
        /**
         * 接收服务器消息 变量
         */
        // 接收服务器发送过来的消息
//        String response;
        public ReceiveDataRunnable( ){
            try {
                is = mSocket.getInputStream();
                isr = new InputStreamReader(is);
                br = new BufferedReader(isr);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            DataInputStream input;
            while (mRecycleFlag) {
                try {
                    Thread.sleep(100);
                    //接收数据
                    if((response=br.readLine())!=null) {//循环读取

                        if(!response.equals("OK")&&!response.equals("test")&&!getall){
                            realdata=new String(response.getBytes(),"utf-8");
//                            latesttime=System.currentTimeMillis();
                        }
                        if(!response.equals("OK")&&!response.equals("test")&&getall){
                            String result=new String(response.getBytes(),"utf-8");
                            resultall.append(result+"\n");
//                            if(result.contains("@GNSS,GETALL,OK")){
//                                realdata=resultall.toString();
//                                getall=false;
//                                resultall.delete(0,resultall.length());
//                            }
                        }
                        if((response.equals("OK")||response.equals("test"))&&getall){
                            realdata=resultall.toString();
                            getall=false;
                            resultall.delete(0,resultall.length());
                        }
//                    Message message = new Message();
//                    message.obj = "接收到服务器数据: " + response;
//                    mHandler.sendMessage(message);
                        if (response.equalsIgnoreCase("exit")) {
                            //当客户端发送的信息为：exit时，关闭连接
                            br.close();
                            mSocket.close();
                            mRecycleFlag = false;
                        }
                    }else {
                        //客户端断开连接
                        mRecycleFlag = false;
                    }
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    mRecycleFlag = false;
                }
                finally {
                }
            }
            try {
                if (br != null) {
                    br.close();
                }
                if (mSocket != null) {
                    mSocket.close();
                }
            } catch (IOException e) {
                e.printStackTrace();

            }
        }
    }

    class DebugRunnable implements Runnable {
        /**
         * 接收服务器消息 变量
         */
        // 接收服务器发送过来的消息
        String sn;
        String client;
        public DebugRunnable(String id,String machineserial){
            sn=machineserial;
            client=id;
        }

        @Override
        public void run() {
            DataInputStream input;
            while (mRecycleFlag) {
                try {
                    Thread.sleep(5000);
                    sendData(mClientId+"&"+sn+"&DEBUG");
                } catch (Exception e) {
                    mRecycleFlag = false;
                }
                finally {
                }
            }
            try {
                if (br != null) {
                    br.close();
                }
                if (mSocket != null) {
                    mSocket.close();
                }
            } catch (IOException e) {
                e.printStackTrace();

            }
        }
    }
    /**
     * 断开连接
     *
     */
    public void closeConnect() {
        try {
            // 断开 客户端发送到服务器 的连接，即关闭输出流对象OutputStream
            if (outputStream!=null){
                outputStream.close();
            }
            if (is!=null){
                is.close();
            }
            if (isr!=null){
                isr.close();
            }
            if (br!=null){
                br.close();
            }
            if (mSocket!=null){
                mSocket.close();
            }

        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    public static String getIpAddress(){
        InetAddress addr = null;
        try {
            addr = InetAddress.getLocalHost();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return addr.getHostAddress();
    }
}
