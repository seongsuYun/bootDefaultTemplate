package com.uwiseone.swp.common.util;

import java.util.Locale;

import org.springframework.context.support.MessageSourceAccessor;

public class I18nUtil {
	private static MessageSourceAccessor msAcc = null;
    
    public void setMessageSourceAccessor(MessageSourceAccessor msAcc) {
    	I18nUtil.msAcc = msAcc;
    }
    
    public static String getMessage(String code) {
        return msAcc.getMessage(code, Locale.getDefault());
    }
     
    public static String getMessage(String code, Object[] objs) {
        return msAcc.getMessage(code, objs, Locale.getDefault());
    }
}
