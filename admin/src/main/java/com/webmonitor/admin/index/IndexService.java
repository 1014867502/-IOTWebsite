package com.webmonitor.admin.index;

import com.jfinal.kit.HashKit;
import com.jfinal.kit.StrKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.core.model.Account;
import com.webmonitor.core.model.Session;
import com.webmonitor.core.util.MD5Utils;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.vo.Result;

import java.util.Date;
import java.util.HashMap;
//这里是登录方法的服务层
public class IndexService {
    public static final IndexService me = new IndexService();
    // 存放登录用户的 cacheName
    public static final String loginAccountCacheName = "loginAccount";
    //保存accessToken的 cookie 名称
    public static final String accessTokenName = "accessToken";
    //保存该问项目的cookie
    public static final String accessUserId = "accessUserId";

    //保存该问项目的cookie
    public static final String accessProId = "accessUserId";

    //返回return给，遇到异常报错
    public Result<HashMap<String, String>> login(String userName, String password, String loginIp) throws BusinessException {
        //userName = userName.toLowerCase().trim();
        userName = userName.trim();
        password = password.trim();
        Account loginAccount = getGeoAccount(userName);
        if (loginAccount == null) {
            String tip = I18nKit.getI18nStr("error_usernamepassword_incorrect");
            throw new BusinessException(tip);
        }
//        if (loginAccount.isStatusLockId()) {
//            String tip = I18nKit.getI18nStr("error_account_locked");
//            throw new BusinessException(tip);
//        }
//        String salt = loginAccount.getSalt();
//        String hashedPass = HashKit.sha256(salt + password);

        String hashedPass = MD5Utils.md5(password)+"0";
        if (loginAccount.getPassword().equals(hashedPass) == false) {
            String tip = I18nKit.getI18nStr("error_usernamepassword_incorrect");
            throw new BusinessException(tip);
        }
        long liveSeconds = 120 * 60;
        int maxAgeInSeconds = (int)liveSeconds;
        long expireAt = System.currentTimeMillis() + (liveSeconds * 1000);
        // 保存登录 session 到数据库
        Session session = new Session();
        String accessToken = StrKit.getRandomUUID();
        session.setAccessToken(accessToken);
        session.setAccountId(loginAccount.getId());
        session.setUserId(userName);
        session.setExpireAt(expireAt);
        if (!session.save()) {
            String tip = I18nKit.getI18nStr("error_save_session_fail");
            throw new BusinessException(tip);
        }
        loginAccount.removeSensitiveInfo(); // 移除 password 与 salt 属性值
        loginAccount.put("accessToken", accessToken);   // 保存一份 accessToken 到 loginAccount 备用
        CacheKit.put(loginAccountCacheName, accessToken, loginAccount);
        //createLoginLog(loginAccount.getId(), loginIp);
        Result<HashMap<String, String>> result = Result.newOne();
        HashMap map = new HashMap();
        map.put("accessToken", accessToken);
        map.put("maxAgeInSeconds", String.valueOf(maxAgeInSeconds));
        result.success(map);
        return result;
    }

    /**
     * 创建登录日志
     */
    private void createLoginLog(Integer accountId, String loginIp) {
        Record loginLog = new Record().set("accountId", accountId).set("ip", loginIp).set("loginAt", new Date());
        Db.save("sys_account_login_log", loginLog);
    }

    //根据token值获取相关Account
    public Account getLoginAccountWithAccessToken(String accessToken) {
        return CacheKit.get(loginAccountCacheName, accessToken);
    }

    //根据token和登录ip获取相关account
    public Account loginWithAccessToken(String accessToken, String loginIp) {
        Session session = Session.dao.findById(accessToken);
        if (session == null) {      // session 不存在
            return null;
        }
        if (session.isExpired()) {  // session 已过期
            session.delete();		// 被动式删除过期数据，此外还需要定时线程来主动清除过期数据
            return null;
        }

        Account loginAccount = IndexService.me.getGeoAccount(session.getUserId());
        //Account loginAccount = Account.dao.findById(session.getAccountId());
        // 找到 loginAccount 并且 是正常状态 才允许登录
        if (loginAccount != null /*&& loginAccount.isStatusOk()*/) {
            loginAccount.removeSensitiveInfo();                                 // 移除 password 与 salt 属性值
            loginAccount.put("accessToken", accessToken);                          // 保存一份 sessionId 到 loginAccount 备用
            CacheKit.put(loginAccountCacheName, accessToken, loginAccount);
            //createLoginLog(loginAccount.getId(), loginIp);
            return loginAccount;
        }
        return null;
    }


    //退出登录，更新列表中数据
    public Result<String> logout(String accessToken) {
        if (accessToken != null) {
            CacheKit.remove(loginAccountCacheName, accessToken);
            Session.dao.deleteById(accessToken);
        }
        return new Result<String>().success("ok");
    }

    //改变密码
    public Result<String> changePwd(int accountId, String oldPassword, String newPassword) {
        Account account = Account.dao.findById(accountId);
        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();
        String salt = account.getSalt();
        String hashedPass = HashKit.sha256(salt + oldPassword);
        if (account.getPassword().equals(hashedPass) == false) {
            String tip = I18nKit.getI18nStr("error_current_password_incorrect");
            throw new BusinessException(tip);
        }
        String hashedNewPass = HashKit.sha256(salt + newPassword);
        account.setPassword(hashedNewPass);
        account.update();
        return new Result<String>().success("ok");
    }

    public Account getGeoAccount(String userid){
        String sql = "SELECT * from staff_data where uAccountNum='"+userid+"'";
        Record record = Db.findFirst(sql);
        if (!Tools.isEmpty(record)){
            Account account = new Account();
            account.setUserName(userid);
            account.setNickName(userid);
            account.setID(0);
            account.setPassword(record.getStr("uPassword"));
            return  account;
        }
        return null;
    }
}
