/**
 * SWP UI Library - Global
 *
 * http://www.uwiseone.com
 *
 * Copyright 2014, Vince Yi
 *
 * Licensed under the UWO license
 */
(function($) {

	String.prototype.format = String.prototype.f = function() {
	    var s = this,
	        i = arguments.length;

	    while (i--) {
	        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	    }
	    return s;
	};

	function re(str, prefix, obj) {
		for (var _name in obj) {
			var _prop = obj[_name];
			var _propType = typeof _prop;
			var _propName = prefix && prefix.length > 0 ? prefix + '\\.' + _name : _name;
			if (_propType === 'object') {
				str = re(str, _propName, _prop);
			} else if (_propType === 'string' || _propType === 'number') {
				str = str.replace(new RegExp('\\#' + _propName + '\\#', 'gm'), _prop);
			}
		}
		return str;
	}

	String.prototype.formatX = function() {
	    var s = this,
	        p = arguments[0] || {};

		s = re(s, null, p);

	    return s;
	};

	String.prototype.lpad = function(n, str) {

		return Array(n - String(this).length + 1).join(str || '0') + this;
	}

	Number.prototype.lpad = function(n, str) {

		return Array(n - String(this).length + 1).join(str || '0') + this;
	}

	/**
	 * 쿠키를 제거한다.
	 */
	function _f_removeCookie(key) {

		$.removeCookie(key, { path: '/share' });
	}

	/**
	 * 쿠키를 설정한다.
	 */
	function _f_setCookie(key, value, raw) {

		if (raw) $.cookie.raw = true;
		$.cookie(key, value, { expires: 365, path: '/share' });
		if (raw) delete $.cookie.raw;
	}

	/**
	 * 쿠키를 가져온다.
	 */
	function _f_getCookie(key, raw) {

		if (raw) $.cookie.raw = true;
		var _value = $.cookie(key);
		if (raw) delete $.cookie.raw;
		return _value;
	}

	/**
	 * 타임존을 Date 객체로 변환한다.
	 */
	function _f_calcDate(tz) {
		var _oDateTime = new Date();
		var _timestamp = _oDateTime.getTime();
		var _offset = _oDateTime.getTimezoneOffset();
		var _utcTimestamp = _timestamp + (_offset * 60 * 1000);
		var _timezone = tz.replace('GMT', '').replace(':','.');
		var _localeTimestamp = _utcTimestamp + (_timezone * 60 * 60 * 1000);
		_oDateTime.setTime(_localeTimestamp);
		return _oDateTime;
	}

	function _f_formatDate(oDateTime) {
		var _dateString = [ oDateTime.getFullYear(), (oDateTime.getMonth() + 1).lpad(2), oDateTime.getDate().lpad(2) ].join('-');
		var _timeString = [ oDateTime.getHours().lpad(2), oDateTime.getMinutes().lpad(2), oDateTime.getSeconds().lpad(2) ].join(':');
		return [ _dateString, _timeString ].join(' ');
	}

	/**
	 * window['dwUI']['_global']
	 */
	var Class = {

		isMobile: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? true : false,

		/**
		 * Login page
		 */
		initLoginPageOnce: function initLoginPageOnce() {

			// 로그인 페이지
			var $loginContent = $('#cont_login_area, .mobile_login_area');
			if ($loginContent.length == 0) {
				return;
			}

			if (document.location.pathname.indexOf('swp-mobile-login') == -1 && Class.isMobile) {
				// 모바일로 로그인 페이지 접근 시 처리
				document.location.href = Alfresco.constants.URL_PAGECONTEXT + 'swp-mobile-login';
				return;
			}

			var $loginForm = $loginContent.find('#loginForm');
			var $username = $loginForm.find('#username:text');
			var $password = $loginForm.find('#password:password');
			var $idSave = $loginForm.find('#idSave:checkbox');
			var $pwSave = $loginForm.find('#pwSave:checkbox');
			var $lang = $loginForm.find('select#lang');
			var $timezone = $loginForm.find('select#timezone');

			$password.focus();

			var _idCheck = _f_getCookie('idCheck');
			var _idSave = _f_getCookie('idSave');

			if (_idCheck != null && _idSave != null && _idCheck == 'true') {
				$username.val(_idSave);
				$idSave.prop('checked', true);
			} else {
				$username.focus();
			}

			var _pwCheck = _f_getCookie('pwCheck');
			var _pwSave = _f_getCookie('pwSave');

			if (_idCheck != null && _idSave != null && _pwCheck == 'true') {
				$password.val(_pwSave);
				$pwSave.prop('checked', true);
			}

			var _lang = _f_getCookie('SWP_LOCALE');
			if (_lang == null || _lang == '') {
				_lang = 'ko';
				_f_setCookie('SWP_LOCALE', _lang);
			}
			$lang.val(_lang);
			$lang.bind('change', function(e) {
				// 언어셋 변경
				var $this = $(this);
				var _lang = $(this).children("option:selected").val();
				_f_setCookie("SWP_LOCALE", _lang);
			});

			var _timezone = _f_getCookie('SWP_TIMEZONE', true);
			if (_timezone == null || _timezone == '') {
				_timezone = 'GMT+9:00';
				_f_setCookie('SWP_TIMEZONE', _timezone, true);
			} else {
				var _oDateTime = _f_calcDate(_timezone);
				var _formattedDate = _f_formatDate(_oDateTime);
				$("#dateformat").text(_formattedDate);
			}
			$timezone.val(_timezone);
			$timezone.bind('change', function(e) {
				// 언어셋 변경
				var $this = $(this);
				var _timezone = $(this).children("option:selected").val();
				_f_setCookie("SWP_TIMEZONE", _timezone, true);

				var _oDateTime = _f_calcDate(_timezone);
				var _formattedDate = _f_formatDate(_oDateTime);
				$("#dateformat").text(_formattedDate);
			});

			$loginForm.bind('submit', function(e) {
				// 로그인 수행
				var $loginForm = $(this);
				var $username = $loginForm.find('#username:text');
				var $password = $loginForm.find('#password:password');
				var $idSave = $loginForm.find('#idSave:checkbox');
				var $pwSave = $loginForm.find('#pwSave:checkbox');

				var _isCheckId = $idSave.is(':checked');
				if (_isCheckId) {
					var _value = $username.val();
					_f_setCookie('idCheck', 'true');
					_f_setCookie('idSave', _value);
				} else {
					_f_removeCookie('idCheck');
					_f_removeCookie('idSave');
				}
				var isCheckPw = $pwSave.is(':checked');
				if (isCheckPw) {
					var _value = $password.val();
					_f_setCookie('pwCheck', 'true');
					_f_setCookie('pwSave', _value);
				} else {
					_f_removeCookie('pwCheck');
					_f_removeCookie('pwSave');
				}
			});
		}

		/**
		 * GNB
		 */
		, initGNBOnce: function initGNBOnce() {

			/*
			if ($('header').length == 0  && Class.isMobile) {
				// 모바일로 로그인 페이지 접근 시 처리
				document.location.href = Alfresco.constants.URL_PAGECONTEXT + '/mobile-portal-main';
				return;
			}
			*/

			// 바로가기 메뉴 클릭
			$(document).on('click', '.cl_menu', function() {
				var $btn = $(this);
				if (!$btn.data('show')) {
					$btn.data('show', true);

					var $layer = $(this).next();
					var _wsUrl = $btn.data('wscomponenturl');
					$layer.appendDynamicWebScript({
						url: _wsUrl,
						beforeAppend: function(params) {
							$layer.empty();
						},
						afterAppend: function(params) {
							$layer.show();
						}
					});
				} else {
					$btn.data('show', false);
					$(this).next().hide();
				}
			}).on('click', '.cl_layer a', function(e) {
				// 바로가기 메뉴에서 링크를 클릭하면 메뉴 창을 닫는다.
				$('.cl_menu').trigger('click');
			}).on('click', '.cl_layer>ul>li>a', function(e) {
				// 바로가기 메뉴 클릭 이벤트
				var $anchor = $(this);
				console.log($anchor);
			}).on('click', '#shortcutLink', function() {
                // 바로가기 설정 클릭 !!
                //alert('######################################');
                 openCenterInstance('/share/page/components/global/v1/config/personal/shortcut','600','798','shortcutPop','resizable=no, scrollbars=yes, status=yes, toolbar=no, menubar=no, location=no, directories=no');
            });

		}

		/**
		 * Footer
		 */
		, initFooterOnce: function initFooterOnce() {

			var $lang = $('.footer_global select#lang');

			var _lang = _f_getCookie('SWP_LOCALE');
			if (_lang == null || _lang == '') {
				_lang = 'ko';
			}
			$lang.val(_lang);
			$lang.bind('change', function(e) {
				// 언어셋 변경
				var $this = $(this);
				var _lang = $(this).children("option:selected").val();
				_f_setCookie("SWP_LOCALE", _lang);
				location.reload();
			});
		}

		/**
		 * 미리보기
		 */
		, initPreviewOnce: function initPreviewOnce() {

			// 바로가기 메뉴 클릭
			$(document).on('resize', '.pop_preview', function() {

				var _width = $(window).width();
				var _height = $(window).height();
				var _top = $(this).offset().top;

				$(this).css('height', (_height - _top - 2) + 'px');
				$(this).find('.web-preview .WebPreviewer').height((_height - _top - 5) + 'px');
			});
		}

		/**
		 * 미리보기
		 */
		, initChatOnce: function initChatOnce() {

			// 바로가기 메뉴 클릭
			$(document).on('resize', '.pop_chat', function() {

				var _width = $(window).width();
				var _height = $(window).height();
				var _top = $(this).offset().top;

				$(this).css('height', (_height - _top - 2) + 'px');
			});
		}

	};

	if (typeof this['dwUI'] == 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_global'] = Class;

	if (typeof this['dwUI']['mobile'] != 'undefined') {
		this['dwUI']['mobile']['_global'] = Class;
	}
})(jQuery);
