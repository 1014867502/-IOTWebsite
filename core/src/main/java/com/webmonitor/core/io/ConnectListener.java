package com.webmonitor.core.io;

public abstract class ConnectListener {
	public enum CommanderStatus
	{
		SUCCESS, 
		FAIL, 
		STATE, 
	}
	public abstract void OnConnectCallBack(boolean bSucceed);
	public abstract void OnDisConnectCallBack();
}
