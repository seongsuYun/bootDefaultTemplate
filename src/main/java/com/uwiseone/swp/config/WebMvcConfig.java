package com.uwiseone.swp.config;

import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.CacheControl;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.resource.VersionResourceResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.uwiseone.swp.common.interceptor.AccessLogIntercepterAdapter;
import com.uwiseone.swp.common.interceptor.LocaleIntercepterAdapter;
import com.uwiseone.swp.common.resolver.CustomMapArgumentResolver;
import com.uwiseone.swp.common.util.I18nUtil;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer  {
	
	@Autowired
	@Qualifier(value = "accessLogIntercepterAdapter")
	private AccessLogIntercepterAdapter accessLogInterceptor;
	
	@Autowired
	@Qualifier(value = "localeIntercepterAdapter")
	private LocaleIntercepterAdapter localeIntercepterAdapter;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(accessLogInterceptor).addPathPatterns("/**").excludePathPatterns("/resources/**");
		
		// 국제화 메세지는 세션의 locale 이후 파라미터 locale을 처리함. 
		registry.addInterceptor(localeIntercepterAdapter).addPathPatterns("/**").excludePathPatterns("/resources/**");
		registry.addInterceptor(localeChangeInterceptor()).addPathPatterns("/**").excludePathPatterns("/resources/**");
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(new CustomMapArgumentResolver());
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**")
				.addResourceLocations("classpath:/static/")
				.setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
				.resourceChain(true)
				.addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"));
	}

	@Bean
	public ViewResolver internalResourceViewResolver() {
	    InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
	    viewResolver.setViewClass(JstlView.class);
	    viewResolver.setPrefix("/WEB-INF/views/jsp/");
	    viewResolver.setSuffix(".jsp");
	    viewResolver.setOrder(2);
	    return viewResolver;
	}
	
	@Bean
	public LocaleChangeInterceptor localeChangeInterceptor() {
		LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
		localeChangeInterceptor.setParamName("locale");
		return localeChangeInterceptor;
	}
	
	@Bean(name = "localeResolver")
	public LocaleResolver localeResolver() {
		SessionLocaleResolver sessionLocaleResolver = new SessionLocaleResolver();
		sessionLocaleResolver.setDefaultLocale(Locale.KOREA);
		return sessionLocaleResolver;
	}
	
	@Bean
	public ReloadableResourceBundleMessageSource messageSource(){
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasenames(
				"classpath:/i18n/common/common"
				, "classpath:/i18n/global/wo-global"
		);
		messageSource.setDefaultEncoding("UTF-8");
		messageSource.setCacheSeconds(-1);
		return messageSource;
	}
	
	@Bean
	public MessageSourceAccessor messageSourceAccessor() {
		return new MessageSourceAccessor(messageSource());
	}
	
	@Bean
	public I18nUtil i18nUtil() {
		I18nUtil i18Util = new I18nUtil();
		i18Util.setMessageSourceAccessor(messageSourceAccessor());
		return i18Util; 
	}
}
