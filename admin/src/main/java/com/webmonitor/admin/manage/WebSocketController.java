package com.webmonitor.admin.manage;

import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.devicelist.DeviceController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.admin.websocket.MyWebSocket;
import com.webmonitor.core.util.SocketClient;
import com.webmonitor.core.util.exception.ExceptionUtil;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Hashtable;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static com.webmonitor.admin.devicelist.DeviceController.socketClientHashMap;

@ServerEndpoint("/websocket")
public class WebSocketController extends BaseController {
    private static final AtomicInteger onlineCount=new AtomicInteger(0);
    private static Hashtable<String, Session> sessionMap=new Hashtable<String, Session>();
    private static CopyOnWriteArraySet<MyWebSocket> webSocketSet=new CopyOnWriteArraySet<>();
    private String nickname;
    private Session session;

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("连接打开了OPEN");
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("关闭websocket");
    }

    @OnMessage
    public void onMessage(Session session, String key) throws IOException {
        //向客户端返回发送过来的消息
        String[] content=key.split("@");
        String machinesn=content[0];
        String order=content[1];
        order = order.replaceAll("\r|\n", "");
        String userid=content[2];
            if (!socketClientHashMap.containsKey(userid)) {
                SocketClient socketClient = new SocketClient();
                socketClient.connect(machinesn, userid);
                socketClient.setSession(session);
                socketClientHashMap.put(userid, socketClient);
                socketClient.sendData("WebClient" + userid + "&" + machinesn + "&" + order.trim());
            }else{
                try {
                    SocketClient socketClient = socketClientHashMap.get(userid);
                    socketClient.setConnectime(System.currentTimeMillis());
                    socketClient.realdata = "";
                    socketClient.setSession(session);
                    socketClient.sendData("WebClient" + userid + "&" + machinesn + "&" + order.trim());
                }catch (Exception e){
                    System.out.println(e.getMessage());
                }
            }
        System.out.println("发送一条消息：--"+key);
    }

    @OnError
    public void onError(Throwable throwable,Session session) {}


}