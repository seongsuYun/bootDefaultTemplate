package com.uwiseone.swp.common.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.support.RequestContextUtils;

@Service
public class CommonService {
	@Autowired
	private ReloadableResourceBundleMessageSource resourceBundleMessageSource;
	
	private String replaceBaseName(String baseName) {
		return baseName.replaceAll("classpath:/", "").replaceAll("/", "."); 
	}
	
	/**
	 * 각 모듈에 해당하는 message key 목록을 조회
	 * TODO 각 모듈별로 필요한 메세지만 가져올 수 있도록 변경필요
	 * @return
	 */
	public List<String> getResourceBundleKeys() {
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		Locale locale = RequestContextUtils.getLocale(request);
		
		Iterator<String> baseNames = resourceBundleMessageSource.getBasenameSet().iterator();
		
		ResourceBundle bundle = null;
		List<String> bundleKeyList = new ArrayList<String>();
		while(baseNames.hasNext()) {
			bundle = ResourceBundle.getBundle(replaceBaseName(baseNames.next()), locale);
			for(Iterator<String> i = bundle.keySet().iterator(); i.hasNext();) {
				bundleKeyList.add(i.next());
			}
		}

		return bundleKeyList;
	}
}
