package com.webmonitor.admin.account;

import com.jfinal.kit.HashKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.admin.auth.AuthService;
import com.webmonitor.admin.common.interceptor.LoginSessionInterceptor;
import com.webmonitor.admin.common.kit.I18nKit;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.model.Account;
import com.webmonitor.core.model.Role;
import com.webmonitor.core.model.Session;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.vo.Result;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class AccountService {
    public static final AccountService me = new AccountService();

    public Page<Account> paginate(int pageNo, int limit) {
        Page<Account> page = Account.dao.paginate(pageNo, limit, "select *", "from sys_account " +
                " where func=10 or func=1 order by id desc");
        List<Account> list = page.getList();
        for(Account account:list) {
            account.removeSensitiveInfo();
        }
        return page;
    }

    public Account findById(int id) {
        Account account = Account.dao.findById(id);
        account.removeSensitiveInfo();
        return account;
    }
    public Account findByUsername(String username) {
        Account account = Account.dao.findFirst("select * from sys_account where userName='"+username+"'");
        account.removeSensitiveInfo();
        return account;
    }

    public Result<String> save(Account account) {
        if (exists(-1, account.getUserName())) {
            String tip = I18nKit.getI18nStr("error_username_existsed");
            throw new BusinessException(tip);
        }
        account.setSalt(HashKit.generateSalt(32));
        account.setPassword(HashKit.sha256(account.getSalt()+account.getPassword()));
        account.setStatus(Account.STATUS_OK);
        account.setCreateAt(new Date());
        account.save();
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    public Result<String> update(Account account) {
        //account.keep("id","nickName","storeId","email");  //只保留该model的这些属性，其他都删除
        account.keep("nickName","email","phone","name","surname","company","address");
        account.update();
        Result<String> result = Result.newOne();
        return result.success("ok");
    }

    public boolean exists(int id, String userName) {
        userName = userName.toLowerCase().trim();
        String sql = "select id from sys_account where lower(userName) = ? and id != ? limit 1";
        Integer accountId = Db.queryInt(sql, userName, id);
        return accountId != null;
    }

    //锁定账户
    public Result<String> lock(int lockedAccountId) {
        int n = Db.update("update sys_account set status = ? where id=?", Account.STATUS_LOCK_ID, lockedAccountId);
        if (n <= 0) {
            String tip = I18nKit.getI18nStr("error_lock_failed");
            throw new BusinessException(tip);
        }
        // 锁定后，强制退出登录
        List<Session> sessionList = Session.dao.find("select * from sys_session where accountId = ?", lockedAccountId);
        if (sessionList != null) {
            for (Session session : sessionList) {			// 处理多客户端同时登录后的多 session 记录
                IndexService.me.logout(session.getAccessToken());    // 清除登录 cache，强制退出
            }
        }
        return new Result<String>().success("ok");
    }

    //解锁账户
    public Result<String> unlock(int accountId) {
        int n = Db.update("update sys_account set status = ? where id = ?", Account.STATUS_OK , accountId);
        if (n <= 0) {
            String tip = I18nKit.getI18nStr("error_unlock_failed");
            throw new BusinessException(tip);
        }
        Db.update("delete from sys_session where accountId = ?", accountId);
        return new Result<String>().success("ok");
    }


    public void markAssignedRoles(Account account, List<Role> roleList) {
        String sql = "select accountId from sys_account_role where accountId=? and roleId=? limit 1";
        for (Role role : roleList) {
            Integer accountId = Db.queryInt(sql, account.getId(), role.getId());
            if (accountId != null) {
                // 设置 assigned 用于界面输出 checked
                role.put("assigned", true);
            }
        }
    }

    public Result<String> addRole(int accountId, int roleId) {
        Record accountRole = new Record().set("accountId", accountId).set("roleId", roleId);
        Db.save("sys_account_role", accountRole);
        return new Result<String>().success("ok");
    }

    public Result<String> deleteRole(int accountId, int roleId) {
        Db.delete("delete from sys_account_role where accountId=? and roleId=?", accountId, roleId);
        return new Result<String>().success("ok");
    }
    public Account findByEmail(String email) {
        String sql = "select * from sys_account where email ='"+email+"'";
        return Account.dao.findFirst(sql);
    }
    public Result<String> changePwd(int accountId, String newPassword) {
        Account account = Account.dao.findById(accountId);
        newPassword = newPassword.trim();
        String salt = account.getSalt();
        String hashedNewPass = HashKit.sha256(salt + newPassword);
        account.setPassword(hashedNewPass);
        account.update();
        return new Result<String>().success("ok");
    }
    public Result<String> addFunction(int accountId, int funId) {

        Account account = findById(accountId);
        account.update();
        return new Result<String>().success("ok");
    }

    public Result<String> deleteFunction(int accountId, int funId) {
        Account account = findById(accountId);
        account.update();
        return new Result<String>().success("ok");
    }
    public int getAccountClass()
    {
        return Account.CLASS_SURPERADMIN;
//        Account loginAccount = null;
//        loginAccount = LoginSessionInterceptor.getThreadLocalAccount();
//        Boolean showSuper = AuthService.me.isSuperAdmin(loginAccount.getId());
//        if (showSuper)
//            return Account.CLASS_SURPERADMIN;
//        else
//        {
//            if (Tools.isEmpty(loginAccount.getFunc()))
//                return  Account.CLASS_GENERAL;
//
//            if ((loginAccount.getFunc()&0x01)==1)
//                return Account.CLASS_ADMIN;
//            return Account.CLASS_GENERAL;
//        }
    }
    public int getAccountClass(String accountname)
    {
        return Account.CLASS_SURPERADMIN;
//        Account loginAccount = findByUsername(accountname);
//        Boolean showSuper = AuthService.me.isSuperAdmin(loginAccount.getId());
//        if (showSuper)
//            return Account.CLASS_SURPERADMIN;
//        else
//        {
//            if (Tools.isEmpty(loginAccount.getFunc()))
//                return  Account.CLASS_GENERAL;
//
//            if ((loginAccount.getFunc()&0x01)==1)
//                return Account.CLASS_ADMIN;
//            return Account.CLASS_GENERAL;
//        }
    }

}
