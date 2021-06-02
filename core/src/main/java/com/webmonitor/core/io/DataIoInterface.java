package com.webmonitor.core.io;

import java.io.UnsupportedEncodingException;


//为具体的IO规定更丰富的接口
public abstract class DataIoInterface{
   	public void regConnectListener(ConnectListener listener)
   {
	   mConnectListener = listener;
   }
   	public void regIoListener(ReceiverListener listener)
   {
	   mReceiverListener = listener;
   }
   	public void unRegIoListener()
   {
	   mReceiverListener = null;
   }
   	public DataIoInterface getDiffIo(){return this;}

   	public boolean sendData(String strCommand)
   	{
		byte[] temData = null;
		try {
			temData = HexCommandtoByte(strCommand.getBytes("GB2312"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (null == temData) 
			return false;
			
		return sendData(temData.length, temData);
   	}
	public abstract void setConnect(String ip,int port);
   	public abstract boolean sendData(int nLength, byte[] data);
   	public abstract void connect();
   	public abstract void disConnect();
   
   	//公共成员变量
   	protected ConnectListener mConnectListener = null;
   	protected ReceiverListener mReceiverListener = null;
	public byte[] HexCommandtoByte(byte[] data) {
		if (data == null) {
			return null;
		}
		int nLength = data.length; 
		if (nLength < 10 || data[2] != ' ' 
			|| data[5] != ' '||data[8] != ' ') {
			return data;
		}
		
		//十六进制发送
		//去除\r\n;
		while (true) {
			if (data[nLength-1] == '\n')
				nLength--;
			else if (data[nLength-1] == '\r')
				nLength--;
			else if (data[nLength-1] == ' ')
				nLength--;
			else 
				break;
			if (nLength < 8) {
				return null;
			}
		}
		
		String strTemString = new String(data, 0, nLength);
		String[] strings = strTemString.split(" ");
		nLength = strings.length;
		data = new byte[nLength];			
		for (int i = 0; i < nLength; i++) {
			if (strings[i].length() != 2) {
				return null;
			}
			try {
				data[i] = (byte)Integer.parseInt(strings[i], 16);
			} catch (Exception e) {
				return null;
			}
		}
	
		return data;
	}
}
