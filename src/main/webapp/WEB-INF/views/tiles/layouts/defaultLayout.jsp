<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/jsp/include/taglib.jsp" %>
<html>
<head>
<title><tiles:getAsString name="title" /></title>
<link rel="shortcut icon" href="${myContextPath}/resources/images/favicon.ico">
<link rel="stylesheet" type="text/css" href="${myContextPath}${urls.getForLookupPath('/resources/css/sample.css')}" media="screen" />
<script type="text/javascript" src="${myContextPath}${urls.getForLookupPath('/resources/js/jquery.min.js')}"></script>
</head>
 
<body>
    <table width="100%">
        <tr>
            <td colspan="2">
                <tiles:insertAttribute name="header" />
            </td>
        </tr>
        <tr>
            <td width="20%" nowrap="nowrap">
                 <tiles:insertAttribute name="menu" />
             </td>
            <td width="80%">
                 <tiles:insertAttribute name="body" />
             </td>
        </tr>
        <tr>
            <td colspan="2">
                 <tiles:insertAttribute name="footer" />
            </td>
        </tr>
    </table>
</body>
</html>