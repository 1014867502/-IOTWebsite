package com.webmonitor.admin.websocket;

import javax.websocket.Session;
import java.io.IOException;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import static org.apache.mina.core.IoUtil.broadcast;

public class MyWebSocket {
    private static final AtomicInteger onlineCount=new AtomicInteger(0);
    private static Hashtable<String, Session> sessionMap=new Hashtable<String, Session>();
    private static CopyOnWriteArraySet<MyWebSocket> webSocketSet=new CopyOnWriteArraySet<>();
    private String nickname;
    private Session session;

    public MyWebSocket(String sn){
        nickname="设备:"+sn;
    }

    public void onMessage(String message,Session session) throws IOException,InterruptedException {
        Map<String,Object> retMap=new HashMap<String,Object>();
        retMap.put("msg",message);
        retMap.put("nickname",nickname);
        broadcast(retMap);

    }
}
