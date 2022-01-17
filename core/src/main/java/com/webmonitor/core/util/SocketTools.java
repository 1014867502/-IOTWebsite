package com.webmonitor.core.util;

import com.jfinal.log.Log;

import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class SocketTools {

    private static final String NTRIP_USER = "";
    private static final String NTRIP_PASS = "";
    private Socket socket = null;
    /*连接线程*/
    private Thread connectThread;
    private OutputStream outputStream;
    // 存放源列表
    private ArrayList<String> mStreamDetailList = new ArrayList<String>();

    public void initSocket(String ipaddress,int port) {
        if (socket == null && connectThread == null) {
            if (mStreamDetailList.size() > 0) {
                mStreamDetailList.clear();
            }
            InputStream inputStream = null;
            InputStreamReader isr = null;
            BufferedReader br = null;
            String data = "";
            socket = new Socket();
            try {
                /*超时时间为2秒*/
                socket.connect(new InetSocketAddress(ipaddress, port), 5000);
                /*连接成功的话  发送心跳包*/
                if (socket.isConnected()) {
                    String requestmsg = "GET /" + " HTTP/1.0\r\n";
                    requestmsg += "User-Agent: NTRIP tuffGNSS\r\n";
                    requestmsg += "Accept: */*\r\n";
                    requestmsg += "Connection: close\r\n";
                    requestmsg += "Authorization: Basic " + ToBase64(NTRIP_USER + ":" + NTRIP_PASS);
                    requestmsg += "\r\n\r\n";
                    sendOrder(requestmsg);
                    /*因为Toast是要运行在主线程的  这里是子线程  所以需要到主线程哪里去显示toast*/
//                            toastMsg("socket已连接");
                    inputStream = socket.getInputStream();
                    // 输入流读取器对象
                    isr = new InputStreamReader(inputStream, "UTF-8");
                    br = new BufferedReader(isr);
                    while ((data = br.readLine()) != null) {
                        String senMsg = data.trim();
                        Log.getLog(this.getClass()).info("服务器传来的数据:" + senMsg);
                        if (senMsg.contains("ENDSOURCETABLE")) {
                            releaseSocket();
//                                    workHandler.sendEmptyMessage(1);
                        } else if (senMsg.contains("STR;")) {
                            String[] strLine = senMsg.split(";");
                            String s = strLine[1];
                            mStreamDetailList.add(s);
                        }
                    }
                    inputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
                if (e instanceof SocketTimeoutException) {
                    Log.getLog(this.getClass()).info("连接超时，正在重连:", e);
//                            releaseSocket();
                } else if (e instanceof NoRouteToHostException) {
                    Log.getLog(this.getClass()).info("该地址不存在，请检查:", e);
                } else if (e instanceof ConnectException) {
                    Log.getLog(this.getClass()).info("连接异常或被拒绝，请检查:", e);
                }
            }
        }
    }

    /*发送数据*/
    public void sendOrder(final String order) {
        if (socket != null && socket.isConnected()) {
            /*发送指令*/
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        outputStream = socket.getOutputStream();
                        if (outputStream != null) {
                            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream, "UTF-8");
                            BufferedWriter bufferedWriter = new BufferedWriter(outputStreamWriter);
                            PrintWriter pw = new PrintWriter(bufferedWriter, true);
//                    PrintWriter pw = new PrintWriter(new BufferedWriter(new OutputStreamWriter(mSocketClient.getOutputStream(), StandardCharsets.UTF_8)),true);
                            pw.println(order);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }).start();

        } else {
//            toastMsg("socket连接错误,请重试");
        }
    }

    private String ToBase64(String in) {
        Base64.Encoder encoder = Base64.getEncoder();
        String encodedText = encoder.encodeToString(in.getBytes());
        return encodedText;
    }

    /*释放资源*/
    private void releaseSocket() {
        if (outputStream != null) {
            try {
                outputStream.close();

            } catch (IOException e) {
                e.printStackTrace();
            }
            outputStream = null;
        }
        if (socket != null) {
            try {
                socket.close();
                Log.getLog(this.getClass()).info("服务器资源：已释放");
            } catch (IOException ignored) {
            }
            socket = null;
        }
        if (connectThread != null) {
            connectThread = null;
        }
    }

    public List<String> getmStreamDetailList(String ip,int port) {
        initSocket(ip,port);
        List<String> list=mStreamDetailList;
        releaseSocket();
        return list;
    }

    /**执行完操作，告诉服务器**/
    public void updateSocket(String userid,String machineserial) {
        OutputStream outputStream=null;
        if (socket == null && connectThread == null) {
            if (mStreamDetailList.size() > 0) {
                mStreamDetailList.clear();
            }
            InputStream inputStream = null;
            socket = new Socket();
            try {
                /*超时时间为2秒*/
                socket.connect(new InetSocketAddress("rjb.geoelectron.com", 9000), 5000);
                outputStream = socket.getOutputStream();
                outputStream.write(("WebClient"+userid+"\n").getBytes("utf-8"));
                /*连接成功的话  发送心跳包*/
                if (socket.isConnected()) {
                    String requestmsg = "WebClient"+userid+"&WebRequest&"+machineserial;
                    outputStream.write((requestmsg+"\n").getBytes("utf-8"));
                    /*因为Toast是要运行在主线程的  这里是子线程  所以需要到主线程哪里去显示toast*/
//                    if (outputStream != null) {
//                        try {
//                            Log.getLog(this.getClass()).info("服务器资源：已释放");
//                        } catch (IOException ignored) {
//                        }
//                        socket = null;
                }
            } catch (IOException e) {
                e.printStackTrace();
                if (e instanceof SocketTimeoutException) {
                    Log.getLog(this.getClass()).info("连接超时，正在重连:", e);
//                            releaseSocket();
                } else if (e instanceof NoRouteToHostException) {
                    Log.getLog(this.getClass()).info("该地址不存在，请检查:", e);
                } else if (e instanceof ConnectException) {
                    Log.getLog(this.getClass()).info("连接异常或被拒绝，请检查:", e);
                }
            }finally{
                try {
                    outputStream.close();
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                        }
//                        outputStream = null;
//                    }
//                    if (socket != null) {
//                        try {
            }
        }
    }

    /**直接发送命令**/
    public void orderSocket(String machineserial,String order) {
            InputStream inputStream = null;
            InputStreamReader isr = null;
            BufferedReader br = null;
            String data = "";
            socket = new Socket();
            try {
                /*超时时间为2秒*/
                socket.connect(new InetSocketAddress("rjb.geoelectron.com", 9000), 5000);
                /*连接成功的话  发送心跳包*/
                if (socket.isConnected()) {
                    String requestmsg =  "WebClient"+getIpAddress()+"&"+machineserial+"&"+order+"\n";
                    sendOrder(requestmsg);
                    inputStream = socket.getInputStream();
                    isr = new InputStreamReader(inputStream, "UTF-8");
                    br = new BufferedReader(isr);
                    while((data = br.readLine()) != null) {
                        String senMsg = data.trim();
                        Log.getLog(this.getClass()).info("服务器传来的数据:" + senMsg);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
                if (e instanceof SocketTimeoutException) {
                    Log.getLog(this.getClass()).info("连接超时，正在重连:", e);
                } else if (e instanceof NoRouteToHostException) {
                    Log.getLog(this.getClass()).info("该地址不存在，请检查:", e);
                } else if (e instanceof ConnectException) {
                    Log.getLog(this.getClass()).info("连接异常或被拒绝，请检查:", e);
                }
                releaseSocket();
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
