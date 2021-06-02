package com.webmonitor.core.io;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

public class TcpSocketIo extends DataIoInterface {
	private static final Object mLock = new Object();

	// 当前连接的IP地址
	protected String mstrAddressIP = "192.168.10.1";//当前连接用到的IP地址
	protected int mnPort = 9000;
	
	private Socket msocketClient = null;
	private InputStream mInputStream = null;
	private OutputStream mOutputStream = null;
	// 读线程;
	ReadThread mReadThread = null;

	private SendStringThread mSendStringThread;

	@Override
	public void setConnect(String ip, int port) {
		mstrAddressIP = ip;
		mnPort = port;
	}

	@Override
	public boolean sendData(int nLength, byte[] data) {
		if(mOutputStream == null)return false;
		byte[] des=new byte[nLength];
		System.arraycopy(data, 0, des, 0, nLength);
		if(mSendStringThread!=null&&!mSendStringThread.isInterrupted()){
			return mSendStringThread.sendData(des);
		}
		return false;
	}
	class ReadThread extends Thread{
		public void run(){
			int nMaxBufLength = 1024;
			byte[] buffer = new byte[nMaxBufLength];
			int byteRead = -1;

			synchronized (mLock){
				while(!isInterrupted()){
					try{
						if(mInputStream != null){
							try {
								if (mInputStream.available() <= 0) {
									Thread.sleep(200);
									continue;
								}
							} catch (InterruptedException e) {
								continue;
							} catch (Exception e) {
								continue;
							}

							byteRead = mInputStream.read(buffer);
						    if(byteRead > 0 && byteRead <= buffer.length){
						    	if(mReceiverListener != null)
						    		mReceiverListener.OnReceiverCallBack(byteRead, buffer);
						    }
						    else/* if (byteRead < 0 || byteRead>buffer.length) */{
								//连接已断开
								disConnect();
								break;
							}
					    }
						else {
							break;
						}
					}catch (IOException e)
					{
						//连接已断开
						disConnect();
						break;
					}
				}//while(!isInterrupted())
			}//synchronized (mLock)
		}
	}

	/**
	 * 发送数据线程
	 */
	private class SendStringThread extends Thread {
		List<byte[]> listCommand=new ArrayList<>();		//发送队列
		Object lock=new Object();

		boolean sendData(byte[] bSend){
			synchronized(lock) {
				if (bSend != null && bSend.length != 0) {
					listCommand.add(bSend);        //添加到发送队列之后
					return true;
				}else {
					return false;
				}
			}
		}


		@Override
		public void run() {
			while (isConnected()&&!isInterrupted()){
				if (msocketClient != null&&listCommand.size()>0)
				{
					byte[] strCurrentSend;
					synchronized (lock) {
						strCurrentSend= listCommand.get(0);
						listCommand.remove(0);        //移除最前发送数据
					}

					try
					{
						if (!msocketClient.isClosed())
						{
							// 向输出流写数据
							byte[] buffer = strCurrentSend;
							if(buffer!=null&&buffer.length>0) {
								mOutputStream.write(buffer);
								mOutputStream.flush();
							}
						}
					}
					catch (Exception e)
					{
						if (!msocketClient.isClosed())
						{
							try
							{
								msocketClient.close();
								if (mInputStream != null)
								{
									mInputStream.close();
									mInputStream = null;
								}

								if (mOutputStream != null)
								{
									mOutputStream.close();
									mOutputStream = null;
								}
							}
							catch (IOException e1)
							{
								e1.printStackTrace();
							}
						}
						e.printStackTrace();
					}
				}
				else {
//					try {
//						sleep(500);
//
//					} catch (InterruptedException e) {
//						e.printStackTrace();
//					}
				}
			}
		}
	}

	//是否已连接
	public boolean isConnected()
	{
		if (msocketClient != null)
		{
			return !msocketClient.isClosed();
		}
		else
		{
			return false;
		}
	}
	
	boolean bConnecting = false;
	@Override
	public void connect() {
		if (mstrAddressIP == null) {
			return;
		}
		new Thread(new Runnable(){
			public void run()
			{
				if (bConnecting) {
					return;
				}
				synchronized (mLock) {
					bConnecting = true;
					String strAddressIP = mstrAddressIP;
					int nPort = mnPort;

					try {
						msocketClient = new Socket();
						msocketClient.connect(new InetSocketAddress(strAddressIP, nPort), 10000);
					}
					catch (UnknownHostException e) {
						bConnecting = false;
					}
					catch (IOException e) {
						bConnecting = false;
					}

					if (!bConnecting) {
						if (null != mConnectListener)
							mConnectListener.OnConnectCallBack(false);
						return;
					}

					try {
						mInputStream = msocketClient.getInputStream();
						mOutputStream = msocketClient.getOutputStream();
						mReadThread = new ReadThread();
						mReadThread.start();
					}
					catch (IOException e1) {
						try {
							if (msocketClient != null)
								msocketClient.close();
						} catch (IOException e2) {
							e2.printStackTrace();
						}
						msocketClient = null;

						e1.printStackTrace();

						if (null != mConnectListener)
							mConnectListener.OnConnectCallBack(false);
						bConnecting = false;
						return;
					}

					// 开启接受数据的线程;
					if (true == msocketClient.isConnected()) {
						//开启发送线程
						if (mSendStringThread != null) {
							mSendStringThread.interrupt();
							mSendStringThread = null;
						}

						mSendStringThread = new SendStringThread();
						mSendStringThread.start();
					}
					else if (!msocketClient.isClosed()) {
						try {
							msocketClient.close();
						} catch (IOException e) {
						}
					}

					if (null != mConnectListener) {
						mConnectListener.OnConnectCallBack(msocketClient.isConnected());
					}
					bConnecting = false;
				}
			}
		}).start();		
	}
	
	@Override
	public void disConnect() {
		if (null != mConnectListener)
			mConnectListener.OnDisConnectCallBack();
		
		mConnectListener = null;
		//结束读线程
		if(mReadThread != null){
			mReadThread.interrupt();
			mReadThread = null;
		}

		//结束发送线程
		if(mSendStringThread!=null){
			mSendStringThread.interrupt();
			mSendStringThread=null;
		}

		// 断开连接
		try
		{
			if (msocketClient != null) {
				msocketClient.close();
				msocketClient = null;
			}
			if (mInputStream != null) {
				mInputStream.close();
				mInputStream = null;
			}
			if (mOutputStream != null) {
				mOutputStream.close();
				mOutputStream = null;
			}
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}
}
