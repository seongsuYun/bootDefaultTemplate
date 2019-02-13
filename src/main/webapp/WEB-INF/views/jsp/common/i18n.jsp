<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/jsp/include/taglib.jsp" %>
var i18nMessages = new Array();
<c:forEach var="key" items="${keys}">
i18nMessages["<spring:message text='${key}' javaScriptEscape='true'/>"] = "<spring:message code='${key}' javaScriptEscape='true' />";
</c:forEach>