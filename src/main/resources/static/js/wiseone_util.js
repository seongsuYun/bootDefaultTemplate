
function loadPresence(obj, option, schemaName) {
	if (option == null) option = "NONE";
	var oRoot = obj.parentNode;
	var userId = $(oRoot).find("span[id='userId']").text();
	
	var blackList = ["EAI", "dwshop", "Administrator", "itsm", "sindoh", "ezhelp", "IDS01", "IDS02", "sspark", "kwani0812", "SRM_RFC_USER", "22202"];
	var isBlackListUser = false;
	for(var i = 0; i < blackList.length;i++ ) {
		if(blackList[i] == userId) {
			isBlackListUser = true;
			break;
		}
	}
	if(isBlackListUser == false) {
		
		var locale = getCookie("SWP_LOCALE");
		var url = "/share/proxy/alfresco/global/v1/uc/presence/" + userId + "?sr_schema=" + schemaName +"&option=" + option + "&lang=" + locale;
		$.ajax({
			type : "GET",
			url : url,
			success : function(response) {
				// alert(response);
				var outerHTML = response;
				var oParent = oRoot.parentNode;
				$(oRoot).remove();
				var temp = $(oParent).html();
				$(oParent).html(outerHTML + temp);
			},
			error : function(e) {
				// alert("에러발생: " + e.responseText);
			}
		});
	}
}

function makeCall(receiver) {
	var url = "/share/proxy/alfresco/ipt/{version}/makecall?sr_schema=" + SmartRunner.constants.SR_SCHEMA + "&alf_method=put";
	url += "&receiveNumber=" + receiver;
	$.ajax({
		type : "POST",
		url : url,
		//data : body,
		success : function(response) {
			//alert(response);
		},
		error : function(e) {
			// alert("에러발생: " + e.responseText);
		}
	});
}

//객체 확인을 위한 출력 함수.
var printObj = typeof JSON != "undefined" ? JSON.stringify : function(obj) {
	  var arr = [];
	  $.each(obj, function(key, val) {
	    var next = key + ": ";
	    next += $.isPlainObject(val) ? printObj(val) : val;
	    arr.push( next );
	  });
	  return "{ " +  arr.join(", ") + " }";
};

function removeCookie(key) {
	document.cookie = key + '=;expires=-1';
}

function setCookie(key, value) {
	var expires = new Date();
	expires.setTime(expires.getTime() + 31536000000); // 1 year
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

// 전모듈 공통 세션아웃 처리 펑션
// Opener 가 있는지 확인하여, Opener 가 있을 경우, 자신을 닫습니다.
function checkSessionStatus(jqXHR) {
	if (jqXHR.status == 401) {
		if (confirm(Alfresco.util.message('swp.com.warring.closeSessionWillLogin'))) {
			if (opener) {
				opener.top.parent.document.location = '/share/page';
				window.close();
			} else {
				top.parent.document.location = '/share/page';
			}
		}else{
			//nothing...
		}
		return false;
	}
	return true;
}

//중앙정렬되는 팝업창을 오픈하고, 인스턴스를 돌려줍니다.
function openCenterInstance(url, w, h, target, addOptions){
	var str = "";
	var popup;
	try {
		str = createFeatures(w, h, addOptions);
		popup = window.open(url, target, str);
		//popup.focus();
		//return false;
	} catch (e) {
		alert(e);
		//return null;
	} finally {
		str = null;
		popup = null;
	}	
}

/**
 * 윈도우 창의 상세 옵션을 설정합니다.
 * 
 * 추가하는 형식이 아닌 변경가능하게 개선해야함.
 * 
 * @param w
 * @param h
 * @param scroll
 * @param changeOptions array open함수에서 추가할 옵션
 * @returns {String}
 */
function createFeatures(w, h, addOptions) {
	var str = "";
	if (window.screen) {
		var ah = screen.availHeight;
		var aw = screen.availWidth;
		var px = (aw - w) / 2;
		var py = (ah - h) / 2;
		str += "screenX=" + px;
		str += ",screenY=" + py;
		str += ",left=" + px;
		str += ",top=" + py;
		str += ",height=" + h;
		str += ",innerHeight=" + h;
		str += ",width=" + w;
		str += ",innerWidth=" + w; 
		
		/*
		str += ",menubar=no";
		str += ",direction=no";
		str += ",location=no";
		str += ",resizable=yes";
		str = str + ",scrollbars=" + ((scroll) ? "yes" : "no");
		
		//option으로 검색하여 value만 변경한다.
		if(addOptions != null && addOptions.length > 0) {
			for (var i = 0; i < addOptions.length; i++) {
				var options = addOptions[i].split("=");
				var option = options[0];
				var value = options[1];
				
				if(option == null || option == "" || value == null || value == "") continue;
				
				if(str.indexOf(option) != -1) {
					var optStartIdx = str.indexOf(option);
					var optEndIdx = optEndIdx = str.indexOf("=", optStartIdx);
					if(optEndIdx == -1) continue;
					
					var valStartIdx = optEndIdx + 1;
					var valStartEnd = str.indexOf(",", valStartIdx);
					if(valStartEnd == -1) continue;
					
					var forward = str.substring(0, valStartIdx);
					var backward = str.substring(valStartEnd, str.length);
					
					str = forward + value + backward;
				} else {
					str = addOptions[i] + "," + str;
				}
			} 
		}
		*/
		if(addOptions){
			str += ","+addOptions;
		}
	}
	return str;
}
