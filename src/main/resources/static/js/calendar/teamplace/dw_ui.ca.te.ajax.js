/**
 * SmartRunner UI Library - Calendar Ajax
 * 
 * http://www.uwiseone.com
 * 
 * Copyright 2015, Vince Yi
 * 
 * Licensed under the UWO license
 */
(function($) {

	/**
	 * Query String 을 생성한다.
	 * 
	 * @param params
	 *            {Object} Query String 을 생성할 객체
	 * @return Query String
	 */
	function createQueryString(params) {

		var queryString = '';

		for ( var p in params) {
			var propertyValue = params[p];
			if (typeof propertyValue !== 'undefined' || propertyValue != null) {
				if (queryString.length > 0) {
					queryString += '&';
				}
				queryString += p + '=' + propertyValue;
			}
		}

		return queryString;
	}

	/**
	 * page context URL 을 생성한다.
	 * 
	 * @param url
	 *            {String} REST API URL
	 * @return prefix 가 추가된 URL
	 */
	function generatePageContextUrl(url) {

		return Alfresco.constants.URL_PAGECONTEXT + url;
	}

	/**
	 * Proxy URL 을 생성한다.
	 * 
	 * @param url
	 *            {String} REST API URL
	 * @return prefix 가 추가된 URL
	 */
	function generateProxyUrl(url) {

		return Alfresco.constants.PROXY_URI_RELATIVE + url;
	}

	/**
	 * HTTP AJAX request.
	 * 
	 * @return jqXHR the XMLHTTPRequest object
	 */
	function _ajax(url, settings) {

		$(document).trigger('showAjaxIndicator');

		url = _f_appendParameterProxyUrl(url);

		return $.ajax(url, settings).fail(function(jqXHR, textStatus, errorThrown) {

			console.error(errorThrown);
			checkSessionStatus(jqXHR);
		}).always(function(data, textStatus, jqXHR) {

			$(document).trigger('hideAjaxIndicator');
		});
	}

	/**
	 * get ajax call
	 */
	function _ajaxGet(url, settings) {

		settings = $.extend({
			type: 'get'
		}, settings);

		return _ajax(url, settings);
	}

	/**
	 * post ajax call
	 */
	function _ajaxPost(url, settings) {

		if (typeof settings.data == 'undefined')
			settings.data = {};

		if (typeof settings.data == 'object' && !settings.excludeDefaultParams && Array.isArray(settings.data) == false) {
			settings.data = $.extend({
				sr_schema: SmartRunner.constants.SR_SCHEMA,
				sr_locale: SmartRunner.constants.SR_LOCALE
			}, settings.data);
		}

		if (settings.isFormData) {

		} else {
			settings.data = JSON.stringify(settings.data);
			settings.contentType = 'application/json';
		}

		settings = $.extend({
			type: 'POST',
			data: {}
		}, settings);

		return _ajax(url, settings);
	}

	/**
	 * put ajax call
	 */
	function _ajaxPut(url, settings) {

		url += ((url.indexOf('?') > -1) ? '&' : '?') + 'alf_method=put';

		return _ajaxPost(url, settings);
	}

	/**
	 * delete ajax call
	 */
	function _ajaxDelete(url, settings) {

		url += ((url.indexOf('?') > -1) ? '&' : '?') + 'alf_method=delete';

		return _ajaxPost(url, settings);
	}

	/**
	 * proxy url 에 파라미터를 붙인다.
	 */
	function _f_appendParameterProxyUrl(url) {

		var _url = url + ((url.indexOf('?') > -1) ? '&' : '?') + 'sr_schema={0}&sr_locale={1}'.format(SmartRunner.constants.SR_SCHEMA, SmartRunner.constants.SR_LOCALE);
		return _url;
	}

	/**
	 * url을 생성한다.
	 */
	function _f_generateUrlBase(url, query) {

		var _queryString = '';

		if (query) {
			for ( var p in query) {
				if (_queryString.length > 0)
					_queryString += '&';
				_queryString += p + '=' + escape(query[p]);
			}
		}

		var _url = url;
		if (_queryString.length > 0)
			_url += ((url.indexOf('?') > -1) ? '&' : '?') + _queryString;

		return _url;
	}

	/**
	 * url을 생성한다.
	 */
	function _f_generateUrl(url, query) {

		var _url = Alfresco.constants.PROXY_URI_RELATIVE + url;
		return _f_generateUrlBase(_url, query);
	}

	/**
	 * url을 생성한다.
	 */
	function _f_generatePageUrl(url, query) {

		var _url = Alfresco.constants.URL_PAGECONTEXT + url;
		return _f_generateUrlBase(_url, query);
	}

	/**
	 * 타임존 변환
	 */
	function _f_convertDateTimeByTimezone(target, propertyName, timezone, dateFormat) {

		var _SEOULTIMENUM = 9;
		var _dateFormat = dateFormat || 'YYYY-MM-DD HH:mm:SS';
		var _timezone = timezone || SmartRunner.constants.SR_TIMEZONE;
		if (!_timezone || _timezone == 'GMT+9:00') {
			return;
		}

		var _dateTime = target[propertyName];
		var _defaultMinutes = _SEOULTIMENUM * 60;
		var _piece = _timezone.match(/GMT([+-])([0-9]{1,2}):([0-9]{2})/);
		var _tzMinutes = (parseInt(_piece[2]) * 60 + parseInt(_piece[3])) * (_piece[1] == '+' ? 1 : -1);

		var _diffMinutes = _tzMinutes - _defaultMinutes;
		try {
			var _mdateTimeObj = moment(_dateTime, _dateFormat);

			target['xOriginal' + propertyName] = _dateTime;
			target[propertyName] = _mdateTimeObj.clone().subtract(_diffMinutes, 'm').format('YYYY-MM-DD HH:mm:SS');
		} catch (e) {

		}
	}

	/**
	 * 타임존 변환
	 */
	function _f_convertDateTimeByTimezoneForArray(target, properties, timezone, dateFormat) {

		for (var i = 0; i < properties.length; i++) {
			_f_convertDateTimeByTimezone(target, properties[i], timezone, dateFormat);
		}

	}

	/**
	 * 자원 모듈 AJAX 처리
	 */
	var Class = {
		initAjaxEventOnce: function initAjaxEventOnce() {

			$(document)
			/**
			 * 이벤트 리스트 조회
			 */
			.on('ajaxGetEventList', function(e, o) {

				var _url = _f_generatePageUrl('components/calendar/teamplace/ajax/event-list');
				_url = _f_generateUrlBase(_url, o.query);

				_ajaxGet(_url, {

				}).done(function(data, textStatus, jqXHR) {

					o.success && o.success(data);
				});
			})

			/**
			 * 이벤트 등록
			 */
			.on('ajaxPostEvent', function(e, o) {

				var _url = _f_generatePageUrl('components/calendar/teamplace/ajax/event');
				_url = _f_generateUrlBase(_url, o.query);

				if (o.data.recurring == false)
					delete o.data.rrule;

				_ajaxPost(_url, {
					data: o.data,
					isFormData: true
				}).done(function(data, textStatus, jqXHR) {

					o.success && o.success(data);
				});
			})

			/**
			 * 이벤트 수정
			 */
			.on('ajaxPutEvent', function(e, o) {

				var _url = _f_generatePageUrl('components/calendar/teamplace/ajax/event');
				_url = _f_generateUrlBase(_url, o.query);

				if (o.data.recurring == false)
					delete o.data.rrule;

				_ajaxPut(_url, {
					data: o.data,
					isFormData: true
				}).done(function(data, textStatus, jqXHR) {

					o.success && o.success(data);
				});
			})

			/**
			 * 이벤트 삭제
			 */
			.on('ajaxDeleteEvent', function(e, o) {

				var _url = _f_generatePageUrl('components/calendar/teamplace/ajax/event');
				_url = _f_generateUrlBase(_url, o.query);

				_ajaxDelete(_url, {
					data: o.data,
					isFormData: true
				}).done(function(data, textStatus, jqXHR) {

					o.success && o.success(data);
				});
			});
		}
	};

	if (typeof this['dwUI'] == 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_ca.te.ajax'] = Class;

})(jQuery);