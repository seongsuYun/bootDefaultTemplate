package com.uwiseone.swp.common.resolver;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.uwiseone.swp.common.model.CommandMap;
import com.uwiseone.swp.common.model.UserInfoVO;
import com.uwiseone.swp.common.util.SessionUtil;

public class CustomMapArgumentResolver implements HandlerMethodArgumentResolver {

	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return CommandMap.class.isAssignableFrom(parameter.getParameterType());
	}
	
	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		CommandMap commandMap = new CommandMap();
        
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        Enumeration<?> enumeration = request.getParameterNames();

        UserInfoVO userInfo = (UserInfoVO)SessionUtil.getSession(request);
        commandMap.put("userindex", userInfo.getUserindex());
        commandMap.put("schema", userInfo.getSchema());
        commandMap.put("locale", userInfo.getLocale());
        
        String key = null;
        String[] values = null;
        while(enumeration.hasMoreElements()){
            key = (String) enumeration.nextElement();
            values = request.getParameterValues(key);
            if(values != null){
                commandMap.put(key, (values.length > 1) ? values:values[0] );
            }
        }
        log.info(commandMap.getMap().toString());
        return commandMap;
	}
}
