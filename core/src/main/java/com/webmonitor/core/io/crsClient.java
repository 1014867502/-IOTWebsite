package com.webmonitor.core.io;

import com.jfinal.log.Log;

public class crsClient {
    private DataIoInterface mDataIoInterface = null;
    static Log log = Log.getLog(crsClient.class);

    public boolean isIsconneted() {
        return isconneted;
    }

    public void setIsconneted(boolean isconneted) {
        this.isconneted = isconneted;
    }

    public int getMsgtype() {
        return msgtype;
    }

    public void setMsgtype(int msgtype) {
        this.msgtype = msgtype;
    }

    private boolean isconneted;
    private int  msgtype;
    public  void Close()
    {
        mDataIoInterface.disConnect();
    }
    public  void ConnetSrv(String ip,int port)
    {
        msgtype = -1;
        isconneted = false;

        mDataIoInterface = new TcpSocketIo();

        mDataIoInterface.setConnect(ip,port);
        mDataIoInterface.regIoListener(mReceiverListener);
        mDataIoInterface.regConnectListener(mConnectListener);

        mDataIoInterface.connect();
    }
    public boolean sendMsg(String strCommand)
    {
        return mDataIoInterface.sendData(strCommand);
    }
    private ConnectListener mConnectListener = new ConnectListener() {
        @Override
        public void OnConnectCallBack(boolean bSucceed) {

            setIsconneted(bSucceed);
        }

        @Override
        public void OnDisConnectCallBack() {

        }
    };
    private ReceiverListener mReceiverListener = new ReceiverListener() {
        @Override
        public void OnReceiverCallBack(int nLength, byte[] data) {

            String strData = new String(data,0,nLength);
            log.error(strData);
            if (strData.toUpperCase().contains("@GNSS,WEB.CASTER.SERVER.START,OK"))
            {
                setMsgtype(1);
            }
            else if (strData.toUpperCase().contains("@GNSS,WEB.CASTER.SERVER.STOP,OK"))
            {
                setMsgtype(2);
            }
            else if (strData.toUpperCase().contains("@GNSS,WEB.CASTER.SERVER.STATE,OK"))
            {
                log.error("3");
                setMsgtype(3);
            }

        }
    };
}
