package com.uwiseone.swp.common.interceptor;

import java.sql.Statement;
import java.util.Properties;

import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Intercepts({
	@Signature(type = StatementHandler.class, method = "update", args = { Statement.class }),
	@Signature(type = StatementHandler.class, method = "query", args = { Statement.class, ResultHandler.class })
})
@SuppressWarnings("unused")
public class MybatisInterceptor implements Interceptor {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		StatementHandler handler = (StatementHandler)invocation.getTarget();
		
		// Mybatis 호출 Trace와 Query 파라미터 바인딩 기록을 위해 인터셉터를 사용함.
		// 하지만, Hikari CP 사용으로 인해, 호출Trace를 확인할 수 없음.
		// Logback 레벨을 Debug처리하고, DriverSpy를 이용하여 대체할 수 있음.
		// 이 인터셉터는 실질적으로 미사용함.
		
		return invocation.proceed();
	}

	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties properties) {
	}
}
