
//상위 메뉴의 카운터 갱신 로직 
//전역 펑션으로 타 모듈에서도 로드할 수 있음. 
function updateMailCount(count) {
	var unreadCount;
	if(count){
		//수동으로 카운팅을 갱신할 경우 
		updateMailCountPrivate(count);
	}else{
		//일반 모듈의 경우, 메일 카운트를 검색합니다.
		callAjaxGetURL("/share/proxy/alfresco/mail/v1/search-mail-unread", function(data){
			//alert(printObj(data));
			if(data.unreadCount){
				updateMailCountPrivate(data.unreadCount);
			}
		});	
	}
}

function updateMailCountPrivate(unreadCount){
	if(unreadCount > 999){
		unreadCount = '999+';
	}
	$('.msvc .count').html('<a href="#">'+unreadCount+'</a>');
}


function openOrgSearch(searchValue){
//	var url = "http://admin." + SmartRunner.constants.SR_TANENT;
//	NewWindow(url + "/org/view?searchText="+encodeURIComponent(searchValue), 'orgsearchmain', 961,702, true);
		
	var orgChartWindow = new wiseneOrgChartWindow({
		showViewMode : true, 			//조직도 조회화면
		searchWord   : searchValue 		//GNB 사원 검색용
	});
	orgChartWindow.open();  // 주소록 팝업창 open
}

function openProfile(userindex) {
//	var popupOption = "width=462, height=520, resizable=no, scrollbars=no, status=no, toolbar=no, menubar=no, location=no, directories=no;";
//	window.open("/share/page/popup/personProfile?type=personInfoId&person="+userId, "userProfile", popupOption);

	var url = "/share/page/user-profile?userindex="+ userindex + "&sr_schema="+ SmartRunner.constants.SR_SCHEMA;
	NewWindow(url, 'profilePopup', 350,470, true);
}

//updateMailCount();

var opendPop = false;
var keyBoarddown = false;

$(document).ready(function() {
	
	//검색버튼 이벤트 초기화
	$('#btnSearchPerson').click(function(e){
		var searchVal = $('#gnbSrchField').val();
		openOrgSearch(searchVal);
	});
	
	// livesearch
	new beta.fix($('.gnbSrchBox input#gnbSrchField'));
	$(document).on('keydown', '.gnbSrchBox input#gnbSrchField', function(e) {

			var $input = $(this);
			if(e.keyCode==32 || e.keyCode==186 || e.keyCode==9 || (e.keyCode==13 && !$input.data('autoCompleteShow')) ) {
				e.preventDefault();
			}

	}).on('keyup', '.gnbSrchBox input#gnbSrchField', function(e) {
		
			var $input = $(this);
			var _autoComplete = $input.data('autoComplete');
			
			var $autoComplete = null;
			var $over = null;

			if(_autoComplete && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
				if($input.val().length > 0) {
					$input.trigger('beforeShowAutoComplete', { text: $input.val() });
				} else {
					$input.trigger('hideAutoComplete');
				}
			}
			if(e.keyCode == 13) { //Enter
				if(!opendPop){
					opendPop = true;
					var _name =  "";
					var _id = "";
					if($input.data('autoCompleteShow')) {
						$autoComplete = $('#' + _autoComplete); 
						$over = $autoComplete.find('li.over');
						if($over && $over.length > 0) {
							_name = $over.data('displayName');
							openOrgSearch(_name);
							//라이브결과 선택시엔 프로필보기 팝업 
						}else{
							_name = $('#gnbSrchField').val();
							openOrgSearch(_name);
						}
					}else{
						_name = $('#gnbSrchField').val();
						openOrgSearch(_name);
					}
					setTimeout(function(){ 
						opendPop = false;
					}, 3000); 
					
				}
				e.preventDefault();
				return false;
			} else if(e.keyCode == 38) {	//up
				if($input.data('autoCompleteShow')) {
					$autoComplete = $('#' + _autoComplete);
					$over = $autoComplete.find('li.over');
					$ul = $over.parent();
					if ($over.length > 0) {
						var _liHeight = $over.height();
						
						index = $over.index();
						if($over.prev().length > 0) {
							index = $over.removeClass('over').prev().addClass('over').index();
						}
						if(_liHeight * (index-1) < $ul.scrollTop()) {
							$ul.scrollTop(_liHeight * index);
						}
					}
				}
			} else if(e.keyCode == 40) {	//down
				if(!keyBoarddown) {
					keyBoarddown = true;
					if($input.data('autoCompleteShow')) {
						//console.log('autoCompleteShow >>>> '+ $input.data('autoCompleteShow'));
						$autoComplete = $('#' + _autoComplete);
						$over = $autoComplete.find('li.over');
						$ul = $over.parent();
						if ($over.length < 1) {
							$autoComplete.find('li:first').addClass('over');
						} else {
							var _liHeight = $over.outerHeight();
							var _liViewCnt = 4;
							
							index = $over.index();
							if($over.next().length > 0) {
								index = $over.removeClass('over').next().addClass('over').index();
							}
							if(_liHeight * (index + 1) > $ul.scrollTop() + (_liHeight * _liViewCnt)) {
								$ul.scrollTop(_liHeight * (index - _liViewCnt + 1));
							}
						}
					}
					setTimeout(function(){ 
						keyBoarddown = false;
					}, 300);
				}
			}
			//keyUp event
		}).on('beforeShowAutoComplete', '.gnbSrchBox input#gnbSrchField', function(e, o) {
		
			var $input = $(this);
			
			var _text = o.text;
			if (_text.length == 0 || _text === $input.data('autoCompleteText')) {
				$('.atcm_gnb_wrap').css('display', 'block');
				return;
			}
			$input.data('autoCompleteText', _text);

			var _autoCompleteJqXHR = $input.data('autoCompleteJqXHR');
			if (_autoCompleteJqXHR) {
				_autoCompleteJqXHR.abort();
			}
			
			$input.trigger('loadShowAutoComplete', o);
			
		}).on('loadShowAutoComplete', '.gnbSrchBox input#gnbSrchField', function(e, o) {
		
			var $input = $(this);
			var _text = o.text;

			var _jqXHR = $.getJSON('/share/proxy/alfresco/org/v1/autoComplete/liveSearchList', {
				companyCode : SmartRunner.constants.SR_COMPCODE,
				sr_schema : SmartRunner.constants.SR_SCHEMA,
				keyword : _text
			}, function(data) {
				
				//console.log(printObj(data));
				
				$input.removeData('autoCompleteJqXHR');
				
				var _contentList = data;
				if (_contentList.length == 0) {
					$input.trigger('hideAutoComplete');
					return;
				}
			
				var _autoComplete = $input.data('autoComplete');
				if(_autoComplete) {
					var $autoComplete = $('#' + _autoComplete);
					var $ul = $autoComplete.find('ul');
					
					$ul.empty();
					 
					var _autoCompleteType = $input.data('inputName');
					var _autoCompleteFormat = '<li data-userindex="#userindex#" data-userid="#userid#" data-display-name="#userName#" data-phone-number="#mainPhoneNumber#"><a href="#" title="#mainPhoneNumber#"><strong>#userName#</strong> #jobTitle# | #deptName# | #companyName# | #mainPhoneNumber#</a></li>';
					for (i = 0; i < _contentList.length; i++) {
						var _organizationMember = _contentList[i];
						var _default = {
							person: {
								mainPhoneNumber: '-'
							},
							appellation: [{
								displayName: ' - '
							}],
							organization: {
								displayName: ' - '
							}
						};
						$ul.append(_autoCompleteFormat.formatX(_organizationMember).formatX(_default));
					}
					$input.trigger('showAutoComplete');
				}
			});
			$input.data('autoCompleteJqXHR', _jqXHR);			
			
		}).on('showAutoComplete', '.gnbSrchBox input#gnbSrchField', function() {
		
			var $input = $(this);
			var _autoComplete = $(this).data('autoComplete');
			
			if (_autoComplete) {
				var $autoComplete = $('#' + _autoComplete);
				var height = $input.outerHeight();
				$autoComplete.css({
					top: $input.offset().top + height,
					left: 0//$input.offset().left
				}).show();
				$input.data('autoCompleteShow', true);
				
				var $ul = $autoComplete.find('ul');
				/*
				$ul.each(function() {
					$(this).find('li:first').addClass('over').siblings().removeClass('over');
				});
				*/
				$ul.scrollTop(0);
				if(!$autoComplete.data('init')) {
					$autoComplete.data('init', true);
					$autoComplete.on('click', 'ul a', function(e) {
						var $li = $(this).parents('li');
						var _name = $li.data('displayName');
						var _id = $li.data('userid');
						var _idx = $li.data('userindex');
//						openOrgSearch(_name);
						openProfile(_idx);
						e.preventDefault();
					});
				}
			}

		}).on('blur', '.gnbSrchBox input#gnbSrchField', function() {
			var $input = $(this);
			var $gnbSrch = $input.parents('.gnbSrch'); 
			
			var _blurTimer = setTimeout(function() {
				$gnbSrch.removeData('blurTimer');
				$input.trigger('hideAutoComplete');
				//blur 이벤트 전에 검색결과를 클릭시엔 blur 에 우선하여 적용되어야 한다. 
			}, 400);
			
			$gnbSrch.data('blurTimer', _blurTimer);
		}).on('hideAutoComplete', '.gnbSrchBox input#gnbSrchField', function() {
		
			var $input = $(this);
			var _autoComplete = $(this).data('autoComplete');
			if(_autoComplete) {
				$('#' + _autoComplete).hide();
				$input.data('autoCompleteShow', false);
			}
			
			var _autoCompleteJqXHR = $input.data('autoCompleteJqXHR');
			if (_autoCompleteJqXHR) {
				_autoCompleteJqXHR.abort();
				$listEddress.removeData('autoCompleteJqXHR');
			}
		});

		$('.gnbSrch .atcm_gnb_wrap ul#toLiveSearchWrapper').scroll(function() {
			var $gnbSrch = $(this).parents('.gnbSrch');
			
			if ($gnbSrch.data('blurTimer')) {
				clearTimeout($gnbSrch.data('blurTimer'));
				$gnbSrch.removeData('blurTimer');
				$('.gnbSrchBox input#gnbSrchField').focus();
			}
		});
	//-- livesearch	
});