package com.uwiseone.swp.common.util;

import javax.servlet.http.HttpServletRequest;

public class SessionUtil {

	public static final String SESSION_SR_USERINFO = "_Session_SmartRunner_UserInfo";
	
	public static void setSession(HttpServletRequest request, Object userInfo) {
		request.getSession().setAttribute(SESSION_SR_USERINFO, userInfo);
	}
	
	public static Object getSession(HttpServletRequest request) {		
		return request.getSession().getAttribute(SESSION_SR_USERINFO);
	}
	
	public static void clearSession(HttpServletRequest request) {
		request.getSession().invalidate();
	}
}
