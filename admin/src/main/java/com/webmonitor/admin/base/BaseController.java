package com.webmonitor.admin.base;

import com.jfinal.core.Controller;
import com.jfinal.core.NotAction;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.core.model.Account;

import java.util.HashMap;
import java.util.Map;

public class BaseController extends Controller {

    @NotAction
    public Account getLoginAccount() {
        String accessToken = getCookie(IndexService.accessTokenName);
        return IndexService.me.getLoginAccountWithAccessToken(accessToken);
    }

    @NotAction
    public boolean isLogin() {
        return getLoginAccount() != null;
    }

    @NotAction
    public boolean notLogin() {
        return !isLogin();
    }

    @NotAction
    protected Map<String, String> getSearchParamMap() {
        Map<String, String> resultMap = new HashMap<>();
        Map<String, String[]> paramMap = getParaMap();
        for (String key : paramMap.keySet()) {
            if (key.startsWith("search.")) {
                String[] objVal = paramMap.get(key);
                String newKey = key.substring(7);
                String newVal = "";
                for (String value : objVal) {
                    newVal += value + ",";
                }
                newVal = newVal.length() > 0 ? newVal.substring(0, newVal.length()-1) : "";
                resultMap.put(newKey, newVal);
            }
        }
        return resultMap;
    }
}
