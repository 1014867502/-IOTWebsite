package com.webmonitor.core.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

public class MD5Utils {
	private static  String folderName;
	public static String md5(String plainText) {
		byte[] secretBytes = null;
		try {
			secretBytes = MessageDigest.getInstance("md5").digest(
					plainText.getBytes());
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("no md5");
		}
		String md5code = new BigInteger(1, secretBytes).toString(16);
	
		for (int i = 0; i < 32 - md5code.length(); i++) {
			md5code = "0" + md5code;
		}
		folderName = md5code;
		return md5code;
	}
	
	public static String createFolderName(){
		Date date = new Date();
		return md5(String.valueOf(date.getTime()));
	}
	public static String getFolderName()
	{
		if (Tools.isEmpty(folderName))
		{
			return createFolderName();
		}
		return folderName;
	}
}
