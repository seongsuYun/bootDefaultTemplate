/*
 * jQuery wiseOne SWP Plugin 0.1
 * http://www.uwiseone.com
 * 
 * Copyright 2014, Vince Yi
 * 
 * Licensed under the UWO license
 */

(function($) {

	/**
	 * post ajax call 을 수행한다.
	 * 
	 * @param url
	 *            {String} REST API url
	 * @param data
	 *            {Object|String} 요청 데이터
	 */
	$['postJson'] = function(url, data) {

		if (typeof data == 'object') {
			data = JSON.stringify(data);
		}

		return jQuery.ajax({
			url: url,
			type: 'post',
			contentType: 'application/json',
			data: data
		});
	};

	/**
	 * #fade 를 show 한다.
	 */
	$.fadeShow = function() {

		var $wrap = $('#wrap, #winpop_wrap');

		if ($wrap.find('#fade').length < 1) {
			$wrap.append('<div id="fade"></div>')
		} else {
			var $fade = $wrap.find('#fade');
			var _count = $fade.data('showCount');
			if (_count) {
				$fade.data('showCount', parseInt(_count) + 1);
			} else {
				$fade.data('showCount', '2');
			}
		}
		$('#fade').show();
	}

	/**
	 * #fade 를 hide 한다.
	 */
	$.fadeHide = function() {

		var $fade = $('#fade');
		/*
		 * var _count = $fade.data('showCount'); if (_count) { var _nCount =
		 * parseInt(_count); if (_nCount == 1) { $fade.removeData('showCount'); }
		 * else { $fade.data('showCount', _nCount - 1); return; } }
		 */

		$('#fade').hide();
	}

	/**
	 * fade 를 보여준다.
	 */
	function showFade(id) {

		var _idSelector = '#' + id;
		var $wrap = $('#wrap, #winpop_wrap');

		if ($wrap.find(_idSelector).length < 1) {
			$wrap.append('<div class="fadeIndicator"><p class="loading"><img src="{0}/images/swp/common/loading.gif" /></p></div>'.format(Alfresco.constants.URL_CONTEXT));
			$wrap.append('<div id="{0}"></div>'.format(id));
		}
		$('.fadeIndicator').show();
		$(_idSelector).show();
	}

	/**
	 * fade 를 숨긴다.
	 */
	function hideFade(id) {

		var _idSelector = '#' + id;

		var $fade = $(_idSelector);
		$fade.hide();

		$('.fadeIndicator').hide();
	}

	/**
	 * #fade 를 show 한다.
	 */
	$.fadeShowForAjax = function() {

		showFade('fadeAjax');
	}

	/**
	 * #fade 를 hide 한다.
	 */
	$.fadeHideForAjax = function() {

		hideFade('fadeAjax');
	}

	/**
	 * #fade 를 show 한다.
	 */
	$.fadeShowForDynamicWebScript = function() {

		showFade('fadeDws');
	}

	/**
	 * #fade 를 hide 한다.
	 */
	$.fadeHideForDynamicWebScript = function() {

		hideFade('fadeDws');
	}

	/**
	 * 동적으로 스크립트를 로드한다. 중복 로드는 배제한다.
	 */
	$.dynamicLoadSciprt = function(url) {

		var _dynamicLoadingList = $(document).data('dynamicLoadingList');
		if (!_dynamicLoadingList) {
			$(document).data('dynamicLoadingList', []);
			_dynamicLoadingList = $(document).data('dynamicLoadingList');
		}

		if (_dynamicLoadingList.indexOf(url) == -1) {
			$.getScript(url);
			_dynamicLoadingList.push(url);
		}
	};

	/**
	 * 쿼리스트링을 생성한다.
	 * 
	 * @param params
	 *            {Object} key-value 쌍의 객체
	 * @returns {String} 쿼리스트링
	 */
	$.generateQueryString = function(params) {

		var _queryString = '';

		for ( var key in params) {
			if (_queryString.length > 0)
				_queryString += '&';
			_queryString += key + '=' + encodeURI(params[key]);
		}

		return _queryString;
	}

	/**
	 * 옵션의 파라미터를 검증한다.
	 * 
	 * @param options
	 *            {Object} 옵션
	 * @param parameterNames
	 *            {String} ;
	 */
	var assertOptions = ($['assertOptions'] = function(options, parameterNames) {

		var _parameterNameList = parameterNames.split(',');
		for (i = 0; i < _parameterNameList.length; i++) {
			if (typeof options[_parameterNameList[i]] == 'undefined') {
				return false;
			}
		}

		return true;
	})

	/**
	 * 기본 ajax 에서 사용하는 beforeSend 핸들러 함수
	 */
	function defaultAjaxBeforeSend(xhr) {

		var $wrap = $('#wrap, #winpop_wrap');
		$wrap.append('<div id="ajaxIndicator"><p class="loading"><img src="{0}images/swp/common/loading.gif" alt="{1}" /></p></div>'.format(Alfresco.constants.URL_CONTEXT, Alfresco.util.message('swp.com.label.loding')));
		$('#ajaxIndicator').show();

		$.fadeShowForDynamicWebScript();
	}

	/**
	 * 기본 ajax 에서 사용하는 complete 핸들러 함수
	 */
	function defaultAjaxComplete() {

		$('#ajaxIndicator').remove();

		$.fadeHideForDynamicWebScript();
	}

	/**
	 * (private) 동적으로 웹스크립트를 append 한다.
	 * 
	 * @param $target
	 *            {Elements} append 할 대상 엘리먼트
	 * @param options
	 *            {Object} 옵션
	 */
	function appendDynamicWebScript($target, options) {

		// assert options
		if (assertOptions(options, 'url') == false) {
			console.log('Some mandatory options [url] are empty.');
			return false;
		}

		// 옵션 초기값 설정
		options = $.extend({
			beforeSend: defaultAjaxBeforeSend,
			beforeAppendData: function(data) {
				return data;
			},
			complete: defaultAjaxComplete
		}, options);

		return $target.each(function() {

			var $this = $(this);
			$.ajax({
				type: "GET",
				dataType: "html",
				async: false,
				url: options.url,
				beforeSend: options.beforeSend,
				complete: options.complete
			}).done(function(data, textStatus, jqXHR) {
				var params = $.extend({
					data: data
				}, options);
				options.beforeAppend && options.beforeAppend.call($this, params);
				var appendData = options.beforeAppendData.call($this, data);
				$this.append(appendData);
				options.afterAppend && options.afterAppend.call($this, params);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				// 401 에러일 경우 로그인 페이지로...
				if (jqXHR.status == '401') {
					if (confirm(Alfresco.util.message('swp.com.warring.closeSessionWillLogin'))) {
						if (opener) {
							opener.top.parent.document.location = '/share/page/dologin';
							window.close();
						} else {
							top.parent.document.location = '/share/page/dologin';
						}
					}
				} else {
					alert(Alfresco.util.message("swp.com.error.msg.systemError"));
					console.log("appendDynamicWebScript ERROR!!");
					console.log("textStatus : " + textStatus);
				}
			});

			return $this;
		});
	}

	$.fn.extend({
		/**
		 * simpleSelector 를 반환한다. {tagName}.{class} 형식
		 */
		simpleSelector: function() {

			var $elem = $(this);
			var _node = $elem[0];
			var _localName = _node.localName;
			var _classNames = $(this).attr('class');

			return _localName + (_classNames ? '.' + _classNames.split(' ').join('.') : '');
		},

		/**
		 * 동적으로 webscript 를 append 한다.
		 * 
		 * @param options
		 *            {Object} 옵션
		 */
		appendDynamicWebScript: function(options) {

			return this.each(function() {
				var $this = $(this);
				return appendDynamicWebScript($this, options);
			});
		},
		/**
		 * 동적으로 inner content webscript 를 append 한다.
		 * 
		 * @param options
		 *            {Object} 옵션
		 */
		appendDynamicWebScriptContentInner: function(options) {

			// assert options
			if (assertOptions(options, 'innerContentSelector') == false) {
				console.log('Some mandatory options [innerContentSelector] are empty.');
				return false;
			}

			var optionsAfterAppend = options.afterAppend;
			if (optionsAfterAppend) {
				delete options.afterAppend;
			}
			options = $.extend({
				beforeAppend: function(params) {
					var $innerContent = $(options.innerContentSelector);
					$innerContent.remove();
				},
				afterAppend: function(params) {
					var $innerContent = $(options.innerContentSelector);
					$innerContent.dwUI();
					optionsAfterAppend && optionsAfterAppend.call($(this), params);
				}
			}, options);

			return $(this).appendDynamicWebScript(options);
		},
		/**
		 * 동적으로 layer webscript 를 append 한다.
		 * 
		 * @param options
		 *            {Object} 옵션
		 */
		appendDynamicWebScriptLayer: function(options) {

			// assert options
			if (assertOptions(options, 'id') == false) {
				console.log('Some mandatory options [id] are empty.');
				return false;
			}

			var $this = $(this);
			var $layer = $this.find('#' + options.id);
			if ($layer.length > 0 && $layer.hasClass('swp_popOnce')) {
				// 기존 레이어 활용
				$layer.popupDynamicWebScriptLayer(options);
				console.log('reuse');
				return $layer;
			}

			$this.appendDynamicWebScript({
				url: options.url,
				beforeAppend: function(params) {
					var $layer = $this.find('#' + options.id);
					$layer.remove();
				},
				afterAppend: function(params) {
					var $layer = $this.find('#' + options.id);
					$layer.dwUI();
					$layer.popupDynamicWebScriptLayer(options);
					$layer.trigger('afterLayerShow');
				}
			});
			return $layer;
		},
		/**
		 * 동적 웹스크립트 레이어를 팝업한다.
		 * 
		 * @param options
		 *            {Object} 옵션
		 */
		popupDynamicWebScriptLayer: function(options) {

			var $layer = $(this);
			if ($layer.hasClass('swp_popOnce')) {
				var $beforeParent = $layer.parent();
				$layer.prop('swp_beforeParent', $beforeParent.simpleSelector());
				console.log($layer.prop('swp_beforeParent'));
			}
			if (options.initValue) {
				$layer.data('initValue', options.initValue);
			}
			$('#content').append($layer);

			$layer.show().css({
				'width': Number(options.width)
			});
			$layer.find('.doWriterInfo').trigger('resize');

			var popMargTop = ($layer.height() + 57) / 2;
			var popMargLeft = ($layer.width() + 62) / 2;

			$layer.css({
				'margin-top': -popMargTop,
				'margin-left': -popMargLeft
			});

			$.fadeShow();
			$('html').addClass('hidden');

			$layer.trigger('afterPopupDynamicWebScriptLayer', options);
		},

		/**
		 * 팝업윈도우 여부를 확인한다.
		 * 
		 * @returns {Boolean} 팝업윈도우 여부
		 */
		isPopupWindow: function() {

			return $('#winpop_wrap').length > 0;
		}
	});
})(jQuery);
