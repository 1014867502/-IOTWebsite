package com.webmonitor.admin.common.interceptor;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.core.util.AntPathMatcher;
import com.webmonitor.core.vo.Result;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;


public  class RequestInterceptor implements Interceptor {
    public static ArrayList<String> excludes = new ArrayList<String>();
    static {
        excludes.add("/captcha");
        excludes.add("/toLogin");
        excludes.add("/doLogin");
        excludes.add("/logout");
        excludes.add("/noauth");
        excludes.add("/common/**");
        excludes.add("/register");
        excludes.add("/forget");
        excludes.add("/addregister");
        excludes.add("/retrievePassword");
        excludes.add("/reportcharts/**");
        excludes.add("/version/downloadFileByCode");
        excludes.add("/rtcm32");
    }


    public void intercept(Invocation inv) {
        //跳过不需要登录就能打开的页面
        String uri = inv.getActionKey();
        AntPathMatcher pm = new AntPathMatcher();
        for (String pattern : excludes) {
            if (pm.match(pattern, uri)) {
                inv.invoke();
                return;
            }
        }
        Controller c = inv.getController();
        HttpServletResponse response = c.getResponse();
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Private-Network", "true");
        response.setHeader("Access-Control-Allow-Origin", "http://8.134.94.147:8080/");
        inv.invoke();
    }
}
