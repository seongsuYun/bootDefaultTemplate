/**
 * edms common post ajax call
 */
function callAjaxPostURL(url, postData, successCallBack){
	callAjaxMethodURL(url, postData, successCallBack, "post");
}

/**
 * edms common post ajax call
 */
function callAjaxDeleteURL(url, postData, successCallBack){
	callAjaxMethodURL(url, postData, successCallBack, "delete");
}

/**
 * edms common post ajax call
 */
function callAjaxPutURL(url, postData, successCallBack){
	callAjaxMethodURL(url, postData, successCallBack, "put");
}

/**
 * simple ajax popup open
 */
function callAjaxPopOpen(url){
	callAjaxGetURL(url, function(html){
		var $wrap = $('#wrap, #winpop_wrap');
		var $popWrap = $('<div class="popWrap"></div>');
		$("body").append($popWrap);
		//popWrap 이 2개 이상 뜰경우에 대한 처리 (dw_ui.js 참고)
		//$popWrap.css({zIndex:Class.popZIndex++}).html(data);
		$popWrap.html(html);
		var $popCont = $popWrap.find('.popCont');
		var $popInner = $popCont.find('.popInner');

		$popCont.show();
		$popInner.dwUI();
		$popInner.environmentSetupArea();
		//$popInner.showHide();
		$popInner.ellipsis();
		$popWrap.show();
		$popCont.trigger('reposition');
		//repositionPopup($popCont);
		//Class.repositionPopup.call($popCont);
		//$popCont.repositionPopup();

		$('html').addClass('hidden');
		//popup trigger opend!
		$(document).trigger('popupEdmsAjaxOpen', $popWrap);
	});	
}

function repositionPopup($popCont){
	//var $popCont = $(this);
	var winWidth = $(window).width();
	var winHeight = $(window).height();

	if($popCont.length>0) {
		var $popInner = $popCont.find('.popInner');

		var popContWidth = $popInner.outerWidth()+60;
		var popContHeight = $popInner.outerHeight()+55;
		if(popContHeight > winHeight-50) {
			popContHeight = winHeight-50;
			$popCont.css({height:popContHeight-55, overflowY:'scroll', paddingRight: '13px'});
		} else {
			$popCont.css({height:popContHeight-55, overflowY:'hidden', paddingRight: 30});
		}

		var left = (winWidth-popContWidth)/2;
		var top = (winHeight-popContHeight)/2;

		$popCont.css({left:left, top:top});
	}
}

// popup 창 닫음.
function closePopup(popupId) {
	//ajaxPopClose(); --> api 가 사라졌음. (dw_ui.js)
	//$("#popWrap").remove();
	//$("#fade").hide();
	//팝업내 어떤 아무 요소에서 트리거 
	if(!popupId){
		//default close 
		popupId = 'btnPopCancel';
	}
	$('#'+popupId).trigger('closePopup');
	//return false;
}

/**
 * edms common get ajax call
 */
function callAjaxGetURL(url, successCallBack){
	//idicator(true);
	$.ajax({
		url : url,
		type : "GET",
		data : {},
		cache : false,
		success : function(html) {
			successCallBack(html);
			idicator(false);
		},
		error: function(jqXHR, textStatus, errorThrown) 
		{
			console.log('error status : '+ jqXHR.status);
			console.log('error thrown  : '+ errorThrown);
			checkSessionStatus(jqXHR);
		}
	});
}

/**
 * 로딩 바 
 * 일반 팝업시엔 아직 delay 가 없어 필요치 않아 사용하고 있지 않음.
 */
function idicator(isShow){
	if(isShow){
		var $wrap = $('#wrap, #winpop_wrap');
		$wrap.append('<div id="ajaxIndicator"><p class="loading"><img src="{0}res/images/swp/common/loading.gif"/></p></div>'.format(Alfresco.constants.URL_CONTEXT));
		if($wrap.find('#fade')<1) {
				$wrap.append('<div id="fade"></div>');
		}
		$('#ajaxIndicator').show();
	}else{
		$('#ajaxIndicator').remove();
	}
}

/**
 * edms common method ajax call
 */
function callAjaxMethodURL(url, postData, successCallBack, method){
	var pUrl = url;
	if($.isEmptyObject(postData) || postData==null){
		postData = new Object();
	}
	if(pUrl.indexOf('?')<0){
		pUrl += "?alf_method="+method;
	}else{
		pUrl += "&alf_method="+method;
	}
	
	var pData = '';
	if(postData){
		//객체 직렬화 공통
		var pData = JSON.stringify(postData);
	}
	$.ajax({
		url : pUrl, 
		type: "POST",
		contentType: 'application/json',
		data : pData,  
		dataType: 'json',
		cache: false,
		processData:false,
		success:function(data, textStatus, jqXHR) 
		{
			successCallBack(data);
		}, 
		error: function(jqXHR, textStatus, errorThrown) 
		{
			console.log('error status : '+ jqXHR.status);
			console.log('error thrown  : '+ errorThrown);
			checkSessionStatus(jqXHR);
		}
	});
}

/**
 * file download dumy layer 
 */
function callDownloadURL(url){
	 if (!this.downloadFrame) {
		this.downloadFrame = document.createElement('iframe');
		// append 하지 않으면, iframe 을 타켓으로 변경할 수 없습니다.
		document.body.appendChild(this.downloadFrame);
		this.downloadFrame.id = '_id_attach_postframe';
		this.downloadFrame.width = '0px';
		this.downloadFrame.height = '0px';
		this.downloadFrame.frameborder = 0;
	}
	this.downloadFrame.src = url;
}