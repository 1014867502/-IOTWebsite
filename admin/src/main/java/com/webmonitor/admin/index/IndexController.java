package com.webmonitor.admin.index;

import com.jfinal.aop.Inject;
import com.jfinal.captcha.CaptchaRender;
import com.jfinal.kit.HttpKit;
import com.jfinal.log.Log;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.dal.RoleType;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.util.*;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.*;

public class IndexController extends BaseController {
    @Inject
    IndexService srv;
    static Log log = Log.getLog(IndexController.class);

    //cookie 编解码的Key
    //private static final String aesTextKey = "ajiwl923jluLIY80JklU8IliKLujhn56jiwm";
    private static final String aesTextKey = "ajiwEIil23sfIY80JklU8Ilisdfsfen561234";

    public void rtcm32()
    {
        String msg = getPara("msg");
        if (!Tools.isEmpty(msg)){
            renderJson(msg);
        }
        else
        {
            String body = HttpKit.readData(getRequest());
        }
        return;
    }
    @Remark("首页")
    public void index() {
        if (notLogin()) {
            redirect("/toLogin");
            return;
        }
        String useid=getLoginAccount().getUserName();
        StaffData currentuser= StaffService.me.getStaffByName(useid);
        setCookie(IndexService.me.accessUserId,currentuser.getId().toString(),24*60*60,true);
        setAttr("userid", currentuser.getUAccountNum());
        setAttr("agentnum",currentuser.getAgentNumber());
        setAttr("writeright",currentuser.getSetPermission());
//        String projetid = getCookie(IndexService.me.accessProjectId);
//        if (Tools.isEmpty(projetid)){
//            projetid = list.size()>0?list.get(0).getProjId():"";
//            setCookie(IndexService.me.accessProjectId,list.get(0).getProjId(),24*60*60,true);
//        }
//        setAttr("projetid", projetid);
        render("homepage.html");
    }

    @Remark("仪表盘页")
    public void dashboard() {
        //render("dashboard.html");
        String projetid = getCookie(IndexService.me.accessUserId);
        setAttr("projetid", projetid);
        render("dashboardmain.html");
    }

    public void projectindex(){
        String useid=getLoginAccount().getUserName();
        StaffData currentuser= StaffService.me.getStaffByName(useid);
        setAttr("writeright",currentuser.getSetPermission());
        render("projectindex.html");
    }

    public void projecthome(){
        String  projId = getPara("projid");
        String useid=getLoginAccount().getUserName();
        //setAttr("projetid", list.size()>0?list.get(0).getName():"");
        setCookie(IndexService.me.accessProId,projId,24*60*60,true);
        setAttr("projetid", projId);
        render("home.html");
    }
    public void homeindex(){
        render("home.html");
    }

    //主页
    public void homepage(){
        String  projId = getPara("progroupid");
        setCookie(IndexService.me.accessProId,projId,24*60*60,true);
        setAttr("projetid", projId);
        render("homepage.html");
    }

    @Remark("没有权限展示页")
    public void noauth() {
        render("noauth.html");
    }

    @Remark("修改密码页")
    public void password() {
        String userid=getLoginAccount().getUserName();
        setAttr("userid",userid);
        render("password.html");
    }

    @Remark("修改密码")
    public void changePwd() {
        Result<String> result = Result.newOne();
        try {
            int accountId = getLoginAccount().getId();
            String oldPassword = getPara("oldPassword");
            String newPassword = getPara("password");
            result = srv.changePwd(accountId, oldPassword, newPassword);
        }catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("跳转到登陆页")
    public void toLogin() {
        //List<Record> users = Db.use("postgresql").find("select * from public.demotb");
        if (isLogin()) {
            redirect("/");
            return;
        }
        try {
            String cookieContent = getCookie("_monitor_login_username");
            if (!Tools.isEmpty(cookieContent)) {
                String content = DesKit.decrypt(cookieContent, aesTextKey);
                String[] arrContent = content.split("###");
                String username = arrContent[0];
                String password = arrContent[1];
                String remember = arrContent[2];
                setAttr("username", username);
                setAttr("password", password);
                setAttr("remember", remember);
            }
        } catch (Exception e) {}
        render("login.html");
    }

    @Remark("图形验证码")
    public void captcha() {
        renderCaptcha();
    }

    @Remark("登陆")
    public void doLogin() {
        Result<HashMap<String, String>> result = Result.newOne();
        try {
            boolean isCaptcha = Tools.isTrue(Tools.getConfigBool("isCaptcha", true));
            if (isCaptcha && !CaptchaRender.validate(this, getPara("vercode"))) {
                String tip = I18nKit.getI18nStr("error_verification_code_error");
                throw new BusinessException(tip);
            }
            String username = getPara("username");
            String password = getPara("password");
            String loginIp = IpKit.getRealIp(getRequest());
            boolean remember = Tools.isTrue(getPara("remember"));
            //result = srv.login(username, password, loginIp);
            result = IndexService.me.login(username, password, loginIp);
            if (remember) {
                String content = String.format("%s###%s###%s",username, password, remember);
                String cookieContent = DesKit.encrypt(content, aesTextKey).toString();
                setCookie("_monitor_login_username", cookieContent, (30 * 24 * 60 * 60), false);
            } else {
                removeCookie("_monitor_login_username");
            }
            String accessToken = result.getData().get("accessToken");
            int maxAgeInSeconds = Integer.parseInt(result.getData().get("maxAgeInSeconds"));
            setCookie(IndexService.accessTokenName, accessToken, maxAgeInSeconds, true);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }

    @Remark("登出")
    public void logout() {
        Result<String> result = Result.newOne();
        try {
            result = srv.logout(getCookie(IndexService.accessTokenName));
            removeCookie(IndexService.accessTokenName);
        } catch (Throwable e) {
            ExceptionUtil.handleThrowable(result, e);
        }
        renderJson(result);
    }


}
