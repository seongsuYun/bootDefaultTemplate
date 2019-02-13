package com.uwiseone.swp.common.model;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public class UserInfoVO implements Serializable {
	
	private static final long serialVersionUID = -7275687774132528733L;
	
	private String userindex;
	private String userid;
	private String userName;
	private String companyCode;
	private String companyName;
	private String deptCode;
	private String deptName;
	private String dutyCode;
	private String dutyName;
	private String posCode;
	private String posName;
	private String email;
	private String locale;
	private String timezone;
	private String schema;
	private String empNo;
	private String userNodeUUID;
	private String mobileNumber;
	private String companyNumber;
	private boolean accessGNBOfficeYN;
	private String nToken;
	private String nConsumerKey;
	private String nGwKey;
	private String nMacKey;
	private String serviceSeq;
	private	String serviceUrl;
	private String serviceHttpUrl;
	private String userAuth;
	private String tanentDomain;
	private boolean newUser;
	private String adminTiket;
	public String getUserindex() {
		return userindex;
	}
	public void setUserindex(String userindex) {
		this.userindex = userindex;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getCompanyCode() {
		return companyCode;
	}
	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getDeptCode() {
		return deptCode;
	}
	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getDutyCode() {
		return dutyCode;
	}
	public void setDutyCode(String dutyCode) {
		this.dutyCode = dutyCode;
	}
	public String getDutyName() {
		return dutyName;
	}
	public void setDutyName(String dutyName) {
		this.dutyName = dutyName;
	}
	public String getPosCode() {
		return posCode;
	}
	public void setPosCode(String posCode) {
		this.posCode = posCode;
	}
	public String getPosName() {
		return posName;
	}
	public void setPosName(String posName) {
		this.posName = posName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLocale() {
		return locale;
	}
	public void setLocale(String locale) {
		this.locale = locale;
	}
	public String getTimezone() {
		return timezone;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public String getSchema() {
		return schema;
	}
	public void setSchema(String schema) {
		this.schema = schema;
	}
	public String getEmpNo() {
		return empNo;
	}
	public void setEmpNo(String empNo) {
		this.empNo = empNo;
	}
	public String getUserNodeUUID() {
		return userNodeUUID;
	}
	public void setUserNodeUUID(String userNodeUUID) {
		this.userNodeUUID = userNodeUUID;
	}
	public String getMobileNumber() {
		return mobileNumber;
	}
	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}
	public String getCompanyNumber() {
		return companyNumber;
	}
	public void setCompanyNumber(String companyNumber) {
		this.companyNumber = companyNumber;
	}
	public boolean isAccessGNBOfficeYN() {
		return accessGNBOfficeYN;
	}
	public void setAccessGNBOfficeYN(boolean accessGNBOfficeYN) {
		this.accessGNBOfficeYN = accessGNBOfficeYN;
	}
	public String getnToken() {
		return nToken;
	}
	public void setnToken(String nToken) {
		this.nToken = nToken;
	}
	public String getnConsumerKey() {
		return nConsumerKey;
	}
	public void setnConsumerKey(String nConsumerKey) {
		this.nConsumerKey = nConsumerKey;
	}
	public String getnGwKey() {
		return nGwKey;
	}
	public void setnGwKey(String nGwKey) {
		this.nGwKey = nGwKey;
	}
	public String getnMacKey() {
		return nMacKey;
	}
	public void setnMacKey(String nMacKey) {
		this.nMacKey = nMacKey;
	}
	public String getServiceSeq() {
		return serviceSeq;
	}
	public void setServiceSeq(String serviceSeq) {
		this.serviceSeq = serviceSeq;
	}
	public String getServiceUrl() {
		return serviceUrl;
	}
	public void setServiceUrl(String serviceUrl) {
		this.serviceUrl = serviceUrl;
	}
	public String getServiceHttpUrl() {
		return serviceHttpUrl;
	}
	public void setServiceHttpUrl(String serviceHttpUrl) {
		this.serviceHttpUrl = serviceHttpUrl;
	}
	public String getUserAuth() {
		return userAuth;
	}
	public void setUserAuth(String userAuth) {
		this.userAuth = userAuth;
	}
	public String getTanentDomain() {
		return tanentDomain;
	}
	public void setTanentDomain(String tanentDomain) {
		this.tanentDomain = tanentDomain;
	}
	public boolean isNewUser() {
		return newUser;
	}
	public void setNewUser(boolean newUser) {
		this.newUser = newUser;
	}
	public String getAdminTiket() {
		return adminTiket;
	}
	public void setAdminTiket(String adminTiket) {
		this.adminTiket = adminTiket;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	public String toString() {
		return ToStringBuilder.reflectionToString(this, ToStringStyle.JSON_STYLE);
	}
}
