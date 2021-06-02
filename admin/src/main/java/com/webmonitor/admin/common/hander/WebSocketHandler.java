package com.webmonitor.admin.common.hander;

import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jfinal.handler.Handler;
import com.jfinal.kit.StrKit;
/**
 * https://my.oschina.net/u/136848/blog/781896 
 * @author Javen
 * 2016年11月6日
 */
public class WebSocketHandler extends Handler{

	private Pattern filterUrlRegxPattern;
	
	public WebSocketHandler(String filterUrlRegx) {
		if (StrKit.isBlank(filterUrlRegx))
			throw new IllegalArgumentException("The para filterUrlRegx can not be blank.");
		filterUrlRegxPattern = Pattern.compile(filterUrlRegx);
	}
	
	
	@Override
	public void handle(String target, HttpServletRequest request, HttpServletResponse response, boolean[] isHandled) {
		if (filterUrlRegxPattern.matcher(target).find())
			return ;
		else
			next.handle(target, request, response, isHandled);
	}

}