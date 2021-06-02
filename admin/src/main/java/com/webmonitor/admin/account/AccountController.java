package com.webmonitor.admin.account;

import com.jfinal.i18n.I18n;
import com.jfinal.i18n.Res;
import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.auth.AuthService;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.common.interceptor.LoginSessionInterceptor;
import com.webmonitor.core.config.annotation.Remark;
import com.webmonitor.core.model.Account;
//import com.webmonitor.core.model.Dict;
//import com.webmonitor.core.model.Ntripgroup;
import com.webmonitor.core.util.Tools;
import com.webmonitor.core.util.exception.BusinessException;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.util.ArrayList;
import java.util.List;

public class AccountController extends BaseController {
    AccountService srv = AccountService.me;

    @Remark("账户列表页")
    public void index() {
        render("index.html");
    }

}
