<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
	
</head>
<body>
	<h2>여기는 다국어 타이틀 : <spring:message code="common.title.message" /></h2>
	
	<h1>${message}</h1>
	<h2>오늘날짜는 몇일 일까요1 : ${today}</h2>
	<table border="1">
		<thead>
			<tr>
				<th>userindex</th>
				<th>userid</th>
				<th>userName</th>
				<th>email</th>
				<th>avatar</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>${sampleVo.userindex}</td>
				<td>${sampleVo.userid}</td>
				<td>${sampleVo.userName}</td>
				<td>${sampleVo.email}</td>
				<td>${sampleVo.avatar}</td>
			</tr>
		</tbody>
	</table>
</body>
</html>