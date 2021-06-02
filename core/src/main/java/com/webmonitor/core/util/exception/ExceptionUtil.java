package com.webmonitor.core.util.exception;

import com.jfinal.i18n.I18n;
import com.jfinal.i18n.Res;
import com.jfinal.log.Log;
import com.webmonitor.core.vo.Result;

public class ExceptionUtil {
    static Log log = Log.getLog(ExceptionUtil.class);

    public static void handleThrowable(Result result, Throwable e) {
        if (e instanceof BusinessException) {
            result.error(e.getMessage());
            log.error("error: " + e.getMessage());
        } else {
            log.error("error: " + e.getMessage(), e);
            Res res = I18n.use();
            String tip = res.get("error_default_error_prompt");
            result.error(tip);
        }
    }
}
