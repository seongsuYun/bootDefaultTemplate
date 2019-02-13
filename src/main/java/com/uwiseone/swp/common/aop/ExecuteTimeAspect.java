package com.uwiseone.swp.common.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Component
@Aspect
@Order(Ordered.LOWEST_PRECEDENCE)
public class ExecuteTimeAspect {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Around("execution(* com.uwiseone.swp.*.controller.*Controller.*(..))")
	public Object onAroundExecuteTimeLog(final ProceedingJoinPoint joinPoint) throws Throwable {
	    StopWatch sw = new StopWatch();
	    sw.start();

	    Object result = joinPoint.proceed();

	    sw.stop();
	    Long total = sw.getTotalTimeMillis();

	    String className = joinPoint.getTarget().getClass().getName();
	    String methodName = joinPoint.getSignature().getName();
	    String taskName = className + "." + methodName;
	     
	    log.info("[ExecutionTime] {}, {}(ms)", taskName, total);

	    return result;
	}
	
}
