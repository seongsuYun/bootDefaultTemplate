package com.uwiseone.swp.common.interceptor;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.uwiseone.swp.common.model.UserInfoVO;
import com.uwiseone.swp.common.util.SessionUtil;

@Component
public class LocaleIntercepterAdapter extends HandlerInterceptorAdapter {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		UserInfoVO userInfo = (UserInfoVO)SessionUtil.getSession(request);
		
		LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);		
		localeResolver.setLocale(request, response, new Locale(userInfo.getLocale()));

		logger.info("session locale value : {}", localeResolver.resolveLocale(request));
		
		return true;
	}
}
