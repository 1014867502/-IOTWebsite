package com.webmonitor.core.util.io;

import java.io.*;
import java.net.Socket;

public class CRSTCPClient {
    //远程连接
    public static void connect(String host,int port){
        try {
            System.out.println("客户端启动...............");
            Socket sock = new Socket(host, port);
            // 创建一个写线程
            new TelnetWriter(sock.getOutputStream()).start();
            // 创建一个读线程
            new TelnetReader(sock.getInputStream()).start();
        } catch (Exception e) {
            // TODO: handle exception
        }
    }
}
//从控制台读取用户输入命令   线程类
class TelnetWriter extends Thread {
    private PrintStream out;

    public TelnetWriter(OutputStream out) {
        this.out = new PrintStream(out);
    }
    public void run() {
        try {
            // 包装控制台输入流
            BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
            // 反复将控制台输入写到Telnet服务程序
            while (true)
                out.println(in.readLine());
        } catch (IOException exc) {
            exc.printStackTrace();
        }
    }
}
//将响应数据打印到控制台   线程类
class TelnetReader extends Thread {
    private InputStreamReader in;

    public TelnetReader(InputStream in) {
        this.in = new InputStreamReader(in);
    }
    public void run() {
        try {
            // 反复将Telnet服务程序的反馈信息显示在控制台屏幕上
            while (true) {
                // 从Telnet服务程序读取数据
                int b = in.read();
                if (b == -1)
                    System.exit(0);
                // 将数据显示在控制台屏幕上
                System.out.print((char) b);
            }
        } catch (IOException exc) {
            exc.printStackTrace();
        }
    }
}
