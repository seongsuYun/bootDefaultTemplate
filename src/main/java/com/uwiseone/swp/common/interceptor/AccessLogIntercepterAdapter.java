package com.uwiseone.swp.common.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

@Component
public class AccessLogIntercepterAdapter extends HandlerInterceptorAdapter {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		StringBuilder requestInfo = new StringBuilder();
		requestInfo.append("\n〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓").append("\n");
		requestInfo.append("RemoteAddr\t\t: ").append(request.getRemoteAddr()).append("\n");
		requestInfo.append("ContextPath\t\t: ").append(request.getContextPath()).append("\n");
		requestInfo.append("RequestURL\t\t: ").append(request.getRequestURL()).append("\n");
		requestInfo.append("RequestMethod\t\t: ").append(request.getMethod()).append("\n");
		requestInfo.append("QueryString\t\t: ").append(request.getQueryString()).append("\n");
		requestInfo.append("〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓").append("\n");
		
		log.info(requestInfo.toString());
		
		return true;
	}
	
	@Override
	public void postHandle( HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
		if (modelAndView != null) {
			log.info("MVC-ViewName\t\t: {}", modelAndView.getViewName());
		}
	}
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
	}
}
