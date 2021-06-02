package com.webmonitor.core.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 权限一键同步功能时，自动向 permission 表的 remark 字段中
 * 添加 @Remark 注解的内容，注意只在 remark 字段为空时才添加
 * 否则会覆盖掉用户自己添加的内容
 */
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface Remark {
    String value();
}
