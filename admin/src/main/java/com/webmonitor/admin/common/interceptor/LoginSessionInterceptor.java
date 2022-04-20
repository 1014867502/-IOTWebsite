package com.webmonitor.admin.common.interceptor;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.model.Account;
import com.webmonitor.core.util.AntPathMatcher;
import com.webmonitor.core.util.IpKit;
import com.webmonitor.core.vo.Result;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

//该拦截器结合了登陆判断与权限控制
public class LoginSessionInterceptor implements Interceptor {
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

    private static final ThreadLocal<Account> threadLocal = new ThreadLocal<Account>();

    public static Account getThreadLocalAccount() {
        return threadLocal.get();
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
        //检查用户是否登录
        Account loginAccount = null;
        Controller c = inv.getController();
        String accessToken = c.getCookie(IndexService.accessTokenName);
        if (accessToken != null) {
            loginAccount = IndexService.me.getLoginAccountWithAccessToken(accessToken);
            if (loginAccount != null) {
                String loginIp = IpKit.getRealIp(c.getRequest());
                loginAccount = IndexService.me.loginWithAccessToken(accessToken, loginIp);
            }
        }
        if (loginAccount == null) {
            c.removeCookie(IndexService.accessTokenName); // cookie 登录未成功，证明该 cookie 已经没有用处，删之
            if (c.getRequest()!=null&&isAjax(c.getRequest())) {
                String tip = I18nKit.getI18nStr("error_login_timeout");
                inv.getController().renderJson(new Result<>().error(tip));
            } else {
                inv.getController().redirect("/toLogin");
            }
            return;
        }

        threadLocal.set(loginAccount);
        System.gc();
        inv.invoke();
        c.setAttr(IndexService.loginAccountCacheName, loginAccount);

//        //权限控制
//        if (AuthService.me.isSuperAdmin(loginAccount.getId()) ||
//                AuthService.me.hasPermission(loginAccount.getId(), inv.getActionKey())) {
//            inv.invoke();
//
//            c.setAttr(IndexService.loginAccountCacheName, loginAccount);
//        } else {
//            if (isAjax(c.getRequest())) {
//                inv.getController().renderJson(new Result<String>().error("没有权限"));
//            } else {
//                inv.getController().redirect("/noauth");
//            }
//        }
    }

    private boolean isAjax(HttpServletRequest request) {
        if(request!=null){
            String acceptHeader = request.getHeader("Accept");
            if (acceptHeader.contains("application/json")
                    && "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With"))) {
                return true;
            }
        }
        return false;
    }
}
