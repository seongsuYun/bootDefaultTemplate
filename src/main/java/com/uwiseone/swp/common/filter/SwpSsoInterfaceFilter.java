package com.uwiseone.swp.common.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.DefaultApi20;
import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.JsonTokenExtractor;
import org.scribe.model.OAuthConfig;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;
import org.scribe.utils.OAuthEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.uwiseone.swp.common.model.UserInfoVO;
import com.uwiseone.swp.common.util.SessionUtil;

@Component
@Order(1)
public class SwpSsoInterfaceFilter implements Filter {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());

	private String authorizeurl;
	@Value("${sso.protocol}")
	private String oAuthSSOProtocol;
	@Value("${sso.url}")
	private String oAuthSSOServer;
	@Value("${sso.port}")
	private String oAuthSSOServerPort;
	@Value("${sso.api-secret}")
	private String apiSecret;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		this.authorizeurl = oAuthSSOProtocol + "://" + oAuthSSOServer + ":" + oAuthSSOServerPort + "/wiseone-sso-server/"; 
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;
        
		if(request.getRequestURI().indexOf("/resources/") > 0) {
			chain.doFilter(request, response);
        	return;
		}
		
		if(request.getRequestURI().endsWith("logout")) {
			log.info("Session has been deleted.");
			SessionUtil.clearSession(request);
			return;
		}
        
		log.info("[SESSION CHECK] Start...");
		
		UserInfoVO userInfo = (UserInfoVO)SessionUtil.getSession(request);		
		if(userInfo != null) {
			log.info("[SESSION CHECK] Already exist session info.");
			chain.doFilter(request, response);
			return;
		} 
		
		userInfo = doOAuthAuthentication(request, response);

		if(userInfo != null) {
			SessionUtil.setSession(request, userInfo);
			log.info("Session creation complete.");
			chain.doFilter(request, response);
			return;
		}
	}
	
	private UserInfoVO doOAuthAuthentication(HttpServletRequest request, HttpServletResponse response) {
		UserInfoVO userInfo = null;
		
		//요청값에 이미 code 가 있는지 확인
        String authCode = request.getParameter("code");
		log.info("authCode(application-code) ===> " + authCode);

        try {
    		if(authCode == null) {
                //임시 발번 코드가 아직 없다면, OAuth2 Provider 에게 임시 코드를 요청하게 되고,
                //OAuth2 인증을 통해, redirect url 로 redirect 됩니다.
                //그룹웨어에 이미 로그인이 되어 있다면, 임시 코드를 가진 상태로 다시 해당 필터를 탑니다.
                this.processNoRequestToken(request, response);
                return null;
    		} else {
                //임시 코드가 있을 경우, 해당 임시 코드를 가지고 토큰을 요청합니다.
    			userInfo = this.processRequestToken(request, response, authCode);    			
    		}
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Authentication failed: " + e.getMessage());
        }
		
        return userInfo;
	}
	
    private void processNoRequestToken(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        StringBuffer requestURL = req.getRequestURL();
        String queryString = req.getQueryString();
        String callbackUrlStr = "";

        if (queryString == null || StringUtils.isEmpty(queryString)) {
            callbackUrlStr = requestURL.toString();
        } else {
            callbackUrlStr = requestURL.append('?').append(queryString).toString();
        }

        log.info("debug processNoRequestToken : " + callbackUrlStr);

        OAuthService oauthService = this.getOAuthService(callbackUrlStr);

        String redirectURL = oauthService.getAuthorizationUrl(null);
        log.info("processNoRequestToken : " + redirectURL);
        resp.sendRedirect(redirectURL);
    }
    
    private OAuthService getOAuthService(String callbackURL) {
        String API_SCOPE = "read+write+trust";        

        Api api = new SWPApi20();
        ServiceBuilder sb = new ServiceBuilder().provider(api).apiKey(this.apiSecret).apiSecret(this.apiSecret).scope(API_SCOPE);
        if (StringUtils.isNotEmpty(callbackURL)) {
            sb.callback(callbackURL);
        }

        return sb.build();
    }
    
    private class SWPApi20 extends DefaultApi20 {

        private final String AUTHORIZE_URL = authorizeurl + "oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code";
        private final String SCOPED_AUTHORIZE_URL = AUTHORIZE_URL + "&scope=%s";

        @Override
        public String getAccessTokenEndpoint() {
            return authorizeurl + "oauth/token?grant_type=authorization_code";
        }

        @Override
        public String getAuthorizationUrl(OAuthConfig config) {
            if (config.hasScope()) {
                return String.format(SCOPED_AUTHORIZE_URL, config.getApiKey(), OAuthEncoder.encode(config.getCallback()), OAuthEncoder.encode(config.getScope()));
            } else {
                return String.format(AUTHORIZE_URL, config.getApiKey(), OAuthEncoder.encode(config.getCallback()));
            }
        }

        @Override
        public Verb getAccessTokenVerb() {
            return Verb.POST;
        }

        @Override
        public AccessTokenExtractor getAccessTokenExtractor() {
            return new JsonTokenExtractor();
        }
    }
    
    private UserInfoVO processRequestToken(HttpServletRequest request, HttpServletResponse response, String authCode) throws IOException, ServletException {
    	UserInfoVO userInfo = this.getUserProfile(request, response, authCode);
        if (userInfo == null) {
            return null;
        }

        return userInfo;
    }
    
    @SuppressWarnings("unchecked")
	private UserInfoVO getUserProfile(HttpServletRequest req, HttpServletResponse resp, String authcode) throws IOException {

        OAuthService oauthService = this.getOAuthService(req.getRequestURL().toString());

        Verifier verifier = new Verifier(authcode);
        Token accessToken = oauthService.getAccessToken(null, verifier);
        String API_URI = authorizeurl + "userInfo?format=json";
        
        log.info("getUserProfile.API_URI:{}", API_URI);

        OAuthRequest request = new OAuthRequest(Verb.GET, API_URI);
        oauthService.signRequest(accessToken, request);
        Response oauthResponse = request.send();

        String resBody = oauthResponse.getBody();

        log.info("resBody : " + resBody);

        Map<String, String> tmpMap = new HashMap<String, String>();
        tmpMap = new Gson().fromJson(resBody, tmpMap.getClass());

        String userindex = tmpMap.get("userindex");
        String userName = tmpMap.get("user_name");
        String userId = tmpMap.get("userid");
        String email = tmpMap.get("email");
        String locale = tmpMap.get("locale");
        String timezone = tmpMap.get("timezone");
        String companyCode = tmpMap.get("companyCode");
        String companyName = tmpMap.get("companyName");
        String deptCode = tmpMap.get("deptCode");
        String deptName = tmpMap.get("deptName");
        String dutyCode = tmpMap.get("dutyCode");
        String dutyName = tmpMap.get("dutyName");
        String posCode = tmpMap.get("posCode");
        String posName = tmpMap.get("posName");
        String empNo = tmpMap.get("empNo");
        String mobileNumber = nvl(tmpMap.get("mobileNumber"));
        String companyNumber = nvl(tmpMap.get("companyNumber"));
		String nConsumerKey = nvl(tmpMap.get("nConsumerKey"));
		String nGwKey = nvl(tmpMap.get("nGwKey"));
		String nMacKey = nvl(tmpMap.get("nMacKey"));
		String schema = tmpMap.get("schema");
		String serviceSeq = nvl(tmpMap.get("serviceSeq"));
		String serviceUrl = nvl(tmpMap.get("serviceUrl"));
		String tanentDomain = nvl(tmpMap.get("tanentDomain"));
		String serviceHttpUrl = nvl(tmpMap.get("serviceHttpUrl"));
		String userAuth = nvl(tmpMap.get("userAuth"));
		String nToken = nvl(tmpMap.get("nToken"));
		boolean accessGNBOfficeYN = Boolean.valueOf(tmpMap.get("accessGNBOfficeYN"));
		
		UserInfoVO userInfo = new UserInfoVO();
        userInfo.setUserindex(userindex);
        userInfo.setUserName(userName);
        userInfo.setUserid(userId);
        userInfo.setEmail(email);
        userInfo.setLocale(locale);;
        userInfo.setTimezone(timezone);
        userInfo.setSchema(schema);
        userInfo.setCompanyCode(companyCode);
        userInfo.setCompanyName(companyName);
        userInfo.setDeptCode(deptCode);
        userInfo.setDeptName(deptName);
        userInfo.setDutyCode(dutyCode);
        userInfo.setDutyName(dutyName);
        userInfo.setPosCode(posCode);
        userInfo.setPosName(posName);
        userInfo.setEmpNo(empNo);
        userInfo.setMobileNumber(mobileNumber);
        userInfo.setCompanyNumber(companyNumber);
		userInfo.setAccessGNBOfficeYN(accessGNBOfficeYN);
		userInfo.setServiceSeq(serviceSeq);
		userInfo.setServiceUrl(serviceUrl);
		userInfo.setTanentDomain(tanentDomain);
		userInfo.setServiceHttpUrl(serviceHttpUrl);
		userInfo.setUserAuth(userAuth);
		userInfo.setnToken(nToken);
		userInfo.setnConsumerKey(nConsumerKey);
		userInfo.setnGwKey(nGwKey);
		userInfo.setnMacKey(nMacKey);
		
        return userInfo;
    }
    
    private String nvl(String value) {
        return value == null ? "" : value;
    }
}
