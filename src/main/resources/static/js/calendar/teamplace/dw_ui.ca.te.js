/**
 * SmartRunner UI Library - Calendar
 * 
 * http://www.uwiseone.com
 * 
 * Copyright 2015, Vince Yi
 * 
 * Licensed under the UWO license
 */
(function() {

	String.prototype.html = function() {
		return this.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
	};

	String.prototype.html2 = function() {
		return this/* .replace(/\&/g, '&amp;') */.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, '&quot;');
	};

	function _f_format(str, prefix, obj) {
		for ( var _name in obj) {
			var _prop = obj[_name];
			var _propType = typeof _prop;
			var _propName = prefix && prefix.length > 0 ? prefix + '\\.' + _name : _name;
			if (_propType === 'object') {
				str = _f_format(str, _propName, _prop);
			} else if (_propType === 'string' || _propType === 'number') {
				str = str.replace(new RegExp('\\#' + _propName + '\\#', 'gm'), ('' + _prop).html2());
			}
		}
		return str;
	}

	// 임시로 dw_ui 에 추가, 추후 jquery.swp 에 이관될 부분
	String.prototype.formatHtml = function() {
		var s = this, p = arguments[0] || {};

		s = _f_format(s, null, p);

		return s;
	};

	// jquery functions
	/**
	 * proxy uri 를 생성한다.
	 */
	$.generateProxyUriRelativeUrl = function(url) {
		return '{0}{1}'.format(Alfresco.constants.PROXY_URI_RELATIVE, url);
	}
	/**
	 * 컨텍스트 url 을 생성한다.
	 */
	$.generateContextUrl = function(url) {
		return '{0}{1}'.format(Alfresco.constants.URL_CONTEXT, url);
	}
	/**
	 * 페이지 컨텍스트 url 을 생성한다.
	 */
	$.generatePageContextUrl = function(url) {
		return '{0}{1}'.format(Alfresco.constants.URL_PAGECONTEXT, url);
	}
	/**
	 * guid 를 생성한다.
	 */
	$.makeguid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	// jquery extend functions
	$.fn.extend({
		/**
		 * 프로퍼티 필드의 값을 취합한다.
		 */
		gatheringProperties: function(options) {

			var $this = $(this);

			var _options = options || {};
			var _propertyNameAttrName = _options.propertyNameAttrName || 'data-property-name';
			var _targetIdAttrName = _options.targetIdAttrName || 'data-target-id';
			var _targetNameAttrName = _options.targetNameAttrName || 'data-target-name';
			var _targetClassAttrName = _options.targetClassAttrName || 'data-target-class';
			var _ignoreChildSelector = _options.ignoreChildSelector;
			var _checkVisible = _options.checkVisible;
			var _checkEnabled = _options.checkEnabled;
			var _fieldValueGetter = _options.fieldValueGetter || function($fields) {
				var _returnValue = null;
				if ($fields.is(':checkbox')) {
					if ($fields.is('.hasValue')) {
						_returnValue = $fields.map(function() {
							if ($(this).is(':checked')) {
								return $(this).val();
							}
						}).get();
					} else {
						_returnValue = $fields.is(':checked');
					}
				} else if ($fields.is(':radio')) {
					_returnValue = $fields.filter(':checked').val();
				} else {
					_returnValue = $fields.val();
				}

				return _returnValue;
			};

			/**
			 * data or 속성을 반환한다.
			 */
			function _f_inner_getDataOrAttr($jqObj, attrName) {

				return attrName.indexOf('data-') == 0 ? $jqObj.data(attrName.substring(5)) : $jqObj.attr(attrName);
			}

			var _propertyFieldSelector = '[{0}]'.format(_propertyNameAttrName);
			if (_ignoreChildSelector) {
				_propertyFieldSelector += ':not(' + _ignoreChildSelector + ' ' + _propertyFieldSelector + ')';
			}
			var $propertyFields = $this.find(_propertyFieldSelector);

			// step 1. 필드 취합
			var _propertyFields = {};
			$propertyFields.each(function() {
				var $propertyField = $(this);
				var _propertyName = _f_inner_getDataOrAttr($propertyField, _propertyNameAttrName);
				var _targetId = _f_inner_getDataOrAttr($propertyField, _targetIdAttrName);
				var _targetName = _f_inner_getDataOrAttr($propertyField, _targetNameAttrName);
				var _targetClass = _f_inner_getDataOrAttr($propertyField, _targetClassAttrName);

				var _fieldSelector = '';

				if (_targetId) {
					_fieldSelector += '#' + _targetId;
				} else if (_targetName) {
					_fieldSelector += '[name="' + _targetName + '"]';
				} else if (_targetClass) {
					_fieldSelector += '.' + _targetClass;
				}

				if (_fieldSelector != null) {
					_propertyFields[_propertyName] = $propertyField.find(_fieldSelector);
				}
			});

			// step 2. 필드에서 값 취합
			var _properties = {};
			for ( var _propertyName in _propertyFields) {
				var $fields = _propertyFields[_propertyName];

				if (_checkVisible && !$fields.is(':visible'))
					continue;

				if (_checkEnabled && !$fields.is(':enabled'))
					continue;

				_properties[_propertyName] = _fieldValueGetter($fields);
			}
			if (typeof _properties[_propertyName] === 'undefined')
				delete _properties[_propertyName];

			return _properties;
		},

		/**
		 * 프로퍼티 필드의 값을 검증한다.
		 */
		validateProperties: function(options) {

			var $thisComposite = $(this);

			var $validationFieldsWrap = $thisComposite.find('[data-property-name][swp-validation]:visible');
			for (var i = 0; i < $validationFieldsWrap.length; i++) {
				var $fieldWrap = $validationFieldsWrap.eq(i);

				var _propertyName = $fieldWrap.data('propertyName');
				var _targetId = $fieldWrap.data('targetId');
				var _validationType = $fieldWrap.attr('swp-validation');
				var _fieldName = $fieldWrap.attr('swp-field-name');

				var _validationCheckVariable = null;
				var _validationCheckVariableName = $fieldWrap.attr('swp-validation-check-variable');
				if (_validationCheckVariableName) {
					_validationCheckVariable = eval(_validationCheckVariableName);
				}

				var $field = $fieldWrap.find('#' + _targetId);
				var _fieldValue = $field.val();

				if (_validationType == 'empty') {
					// 체크할 변수가 true 이거나 없는 경우에만 체크합니다.
					if ((_validationCheckVariable == null || _validationCheckVariable === true) && _fieldValue.trim().length == 0) {
						window.alert(Alfresco.util.message('swp.cal.common.warning.noInputField').format(_fieldName));
						$field.focus();
						return false;
					}
				}
			}

			return true;
		}
	});

	// smart runner constants
	SmartRunner.constants = SmartRunner.constants || {};
	SmartRunner.constants.calendar = {
		TIME_INTERVAL: 30
	// 시간 간격
	};

	// private fields

	// private functions

	var Class = {
		/**
		 * 컴포넌트 초기화
		 */
		initComponentOnce: function initComponentOnce() {

			$(document)
			/**
			 * select box readonly...
			 */
			.on('change', 'select[readonly="readonly"]', function(e) {
				if ($(this).data('initialSelect'))
					$(this).val($(this).data('initialSelect'));
			}).on('focus', 'select[readonly="readonly"]', function(e) {
				$(this).data('initialSelect', $(this).val());
			});

			$(document)
			/**
			 * 자원예약 전용 미니캘린더 필드
			 */
			.on('click', '.jsCalByRC', function(e) {
				var $obj = $(this);
				var objTagName = $obj.prop('tagName');
				if (objTagName == 'A') {
					e.preventDefault();
				}
				var $target = typeof $obj.data('target') === 'undefined' ? $obj : $($obj.data('target'));
				var _calDate = '';

				if ($target.prop('tagName') == 'INPUT') {
					_calDate = $target.val();
				} else {
					_calDate = $target.text();
				}
				var _dt = new Date();
				if (_calDate != '' && _calDate.match(/[0-9][0-9][0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]/)) {
					var _mCalDate = moment(_calDate, 'YYYY.MM.DD');
					_dt = _mCalDate.toDate();
				}

				if (scheduler.isCalendarVisible()) {
					scheduler.destroyCalendar();
				} else {
					var mCalendar = scheduler.renderCalendar({
						position: $obj[0],
						date: _dt,
						navigation: true,
						handler: function(date) {
							scheduler.destroyCalendar();

							var _mDate = moment(date);
							_calDate = _mDate.format('YYYY.MM.DD');

							var _oldValue = '';
							if ($target.prop('tagName') == 'INPUT') {
								_oldValue = $target.val();
								$target.val(_calDate);
							} else {
								_oldValue = $target.text();
								$target.text(_calDate);
							}

							$target.trigger('dateChanged', {
								oldValue: _oldValue,
								newValue: _calDate
							});
							scheduler.destroyCalendar();
						}
					});
					var _mCalDate = moment(_calDate, 'YYYY.MM.DD');
					scheduler.markCalendar(mCalendar, _mCalDate.toDate(), "selected_date");

					var left = parseInt($(scheduler._def_count).css('left'), 10) - parseInt($(scheduler._def_count).outerWidth(), 10) + $obj.outerWidth();
					if (left < 0)
						left = 0;
					$(scheduler._def_count).css({
						left: left
					});

					if ($obj.hasClass('dhx_ignore_this_month_before_date')) {
						var $allDayTds = $('.dhx_mini_calendar .dhx_year_body td');
						var $nowTd = $('.dhx_mini_calendar .dhx_year_body td.dhx_now');
						var _index = $allDayTds.index($nowTd);

						var $beforeDayTds = $('.dhx_mini_calendar .dhx_year_body td:lt(' + _index + ')');
						$beforeDayTds.addClass('dhx_this_month_before');
					}
				}
			})

			/**
			 * 팝업레이어 오픈
			 */
			.on('click', '.popup_layer a[rel]', function(e) {

				var $hasRel = $(this);
				var _rel = $hasRel.attr('rel');

				$(_rel).popupDynamicWebScriptLayer({});
			})

			/**
			 * 라디오버튼 영역 enabled/disabled, show/hide 제어
			 */
			.on('click', '[view-scope][view-target]:radio', function(e) {

				var $hasViewTarget = $(this);
				var _hasViewTargetName = $hasViewTarget.attr('name');
				var _viewScope = $hasViewTarget.attr('view-scope');
				var _viewAction = $hasViewTarget.attr('view-action');

				var $siblings = $('{0} [name="{1}"]'.format(_viewScope, _hasViewTargetName));

				$siblings.each(function() {
					var $radio = $(this);
					var _checked = $radio.is(':checked');
					var _viewScope = $radio.attr('view-scope');
					var _viewTarget = $radio.attr('view-target');
					var $viewTarget = $('{0} {1}'.format(_viewScope, _viewTarget));

					if (_viewAction === 'ENABLED') {
						$viewTarget.prop('disabled', !_checked);
					} else if (_viewAction === 'SHOW') {
						$viewTarget.toggle(_checked)
					}
				});
			})

			/**
			 * 템플릿 데이터 추가
			 * 
			 * @param data
			 *            {Array} 데이터
			 * @param classifyPropertyName
			 *            {String} 템플릿을 분류할 수 있는 프로퍼티 이름 (Optional)
			 * @param identityAttributeName
			 *            {String} 구분할 수 있는 속성 이름 (Optional)
			 * @param identityPropertyName
			 *            {String} 구분할 수 있는 속성 이름 (Optional)
			 * @param bAppendBeforeClear
			 *            {boolean} 추가 전에 초기화 여부 (Optional)
			 * @param fnValidation
			 *            {Function} 데이터 추가여부를 확인하는 함수 (Optional)
			 */
			.on('appendChildByTemplate', '.hasTemplate:has(.template)', function(e, o) {

				var $hasTemplate = $(this);
				var $template = $hasTemplate.find('.template');
				var $templateParent = $template.parent();

				if (o.bAppendBeforeClear)
					$templateParent.find('> :not(.template)').remove();

				var _data = o.data;
				var _classifyPropertyName = o.classifyPropertyName;

				for (var i = 0; i < _data.length; i++) {
					var _each = _data[i];

					if (o.fnValidation && !o.fnValidation(_each, $templateParent))
						continue;

					if (o.identityAttributeName && o.identityPropertyName) {
						if ($templateParent.find('[{0}="{1}"]'.format(o.identityAttributeName, _each[o.identityPropertyName])).length > 0)
							continue;
					}

					if (_classifyPropertyName) {
						$template = $hasTemplate.find('.template[{0}="{1}"]'.format(_classifyPropertyName, _each[_classifyPropertyName]));
						if ($template.length == 0) {
							console.log(Alfresco.util.message('swp.cal.common.warning.invalidateClassifyPropertyName').format(_classifyPropertyName));
							return;
						}
					}
					var _templateHTML = $template.clone().removeClass('template')[0].outerHTML;
					$templateParent.append(_templateHTML.formatHtml(_each));

				}
			})

			/**
			 * 동적으로 웹스크립트컴포넌트를 추가한다.
			 */
			.on('appendDynamicWebScript', '[alf-dynamic-wc]', function(e, o) {
				var $target = $(this);
				var url = Alfresco.constants.URL_PAGECONTEXT + $target.attr('alf-dynamic-wc');
				if (o && o.urlPostfix) {
					url += o.urlPostfix;
				}
				$target.appendDynamicWebScript({
					url: url,
					beforeAppend: function(params) {
						$(this).empty();
					},
					afterAppend: function(params) {
						$(this).dwUI();
						$target.trigger('afterAppendDynamicWebScript', o);
					}
				});
			})

			/**
			 * 탭 선택
			 */
			.on('click', '.alf-dynamic-tab .tabs > li', function(e) {
				var $current = $(this);
				var index = $current.index();
				var $panels = $current.parent().siblings('.panels');

				var cls = $current.attr('class').match(/tc[0-9]*/)[0];

				var $target = $panels.find('> .' + cls + '-panel:eq(' + index + ')[alf-dynamic-wc]');
				if ($target.length > 0) {
					$target.trigger('appendDynamicWebScript');
				}
				e.stopPropagation();

			})
			/**
			 * 기간 필드
			 */
			.on('change', '.hasPeriodFields #periodOptions', function(e) {

				var $periodOptions = $(this);
				var $hasPeriodFields = $periodOptions.closest('.hasPeriodFields');
				var $periodStartDate = $hasPeriodFields.find('[name="periodStartDate"]');
				var $periodEndDate = $hasPeriodFields.find('[name="periodEndDate"]');

				var _optionValue = $periodOptions.val();
				var _bDirect = _optionValue == 'direct'
				$periodStartDate.prop('disabled', !_bDirect);
				$periodEndDate.prop('disabled', !_bDirect);
				if (_bDirect)
					return;

				var _today = $hasPeriodFields.data('today');
				var _mBasisDate = moment(_today, 'YYYY.MM.DD');
				if (_optionValue == 'tw') {
					_mBasisDate.subtract(_mBasisDate.toDate().getDay() - 1, 'd');
					_optionValue = 'd4';
				} else if (_optionValue == 'pw') {
					_mBasisDate.subtract(_mBasisDate.toDate().getDay() - 1, 'd').subtract(1, 'w');
					_optionValue = 'd4';
				} else if (_optionValue == 'tm') {
					_mBasisDate.subtract(_mBasisDate.toDate().getDate() - 1, 'd');
					_optionValue = 'd' + (_mBasisDate.clone().add(1, 'M').subtract(1, 'd').toDate().getDate() - 1);
				}

				var _mBeforeDate = _mBasisDate.clone().subtract(_optionValue.substring(1), _optionValue.substring(0, 1));
				var _mAfterDate = _mBasisDate.clone().add(_optionValue.substring(1), _optionValue.substring(0, 1));

				var _dateDirection = $hasPeriodFields.data('dateDirection');

				if (_dateDirection == 'forward') {
					$periodStartDate.val(_mBasisDate.format('YYYY.MM.DD'));
					$periodEndDate.val(_mAfterDate.format('YYYY.MM.DD'));
				} else {
					$periodStartDate.val(_mBeforeDate.format('YYYY.MM.DD'));
					$periodEndDate.val(_mBasisDate.format('YYYY.MM.DD'));
				}

				$periodStartDate.trigger('dateAdjustChanged');
				e.preventDefault();
			})

			/**
			 * 날짜필드 데이터 변경
			 */
			.on('dateChanged', '.hasPeriodFields .jsCalByRC', function(e) {

				var $jsCalByRC = $(this);
				var $hasPeriodFields = $jsCalByRC.closest('.hasPeriodFields');
				var $periodStartDate = $hasPeriodFields.find('[name="periodStartDate"], .periodStartDate');
				var $periodEndDate = $hasPeriodFields.find('[name="periodEndDate"], .periodEndDate');

				var _periodStartDate = $periodStartDate.val();
				var _periodEndDate = $periodEndDate.val();

				if (_periodStartDate >= _periodEndDate) {
					var _changedValue = $jsCalByRC.val();
					var _mChangedValue = moment(_changedValue, 'YYYY.MM.DD');

					if ($jsCalByRC.is($periodStartDate)) {
						var _otherValue = _mChangedValue.clone().add(1, 'd');
						$periodEndDate.val(_otherValue.format('YYYY.MM.DD'));
					} else if ($jsCalByRC.is($periodEndDate)) {
						var _otherValue = _mChangedValue.clone().subtract(1, 'd');
						$periodStartDate.val(_otherValue.format('YYYY.MM.DD'));
					}
				}

				$jsCalByRC.trigger('dateAdjustChanged');
			})

			/**
			 * 전체체크
			 */
			.on('click', '.hasCheckAll #checkAll', function(e) {

				var $checkAll = $(this);
				var $hasCheckAll = $checkAll.closest('.hasCheckAll');
				var $eachCheckboxes = $hasCheckAll.find('.eachCheckbox:checkbox');

				var _checked = $checkAll.is(':checked');
				$eachCheckboxes.prop('checked', _checked);

				$checkAll.trigger('afterChecked');

			})

			/**
			 * 각 row 체크박스
			 */
			.on('click', '.hasCheckAll .eachCheckbox', function(e) {

				var $eachCheckbox = $(this);
				var $hasCheckAll = $eachCheckbox.closest('.hasCheckAll');
				var $checkAll = $hasCheckAll.find('#checkAll');
				var $eachCheckboxes = $hasCheckAll.find('.eachCheckbox');
				var $uncheckedCheckboxes = $eachCheckboxes.filter(':not(:checked)');

				var _allChecked = $uncheckedCheckboxes.length == 0;
				$checkAll.prop('checked', _allChecked);

				$eachCheckbox.trigger('afterChecked');
			})

			/**
			 * 범주
			 */
			.on('click', '.chkCalCate ._icoCalCate input', function() {
				var $input = $(this);
				if ($input.parents('.folderMenu').length < 1) {
					var $chkCalCate = $input.parents('.chkCalCate');
					var $icoCalCate = $input.parents('.icoCalCate');
					var _onlyone = $chkCalCate.hasClass('onlyone');
					var _mandatory = $chkCalCate.hasClass('mandatory');

					if (!$input.is(':checked')) {
						if (_mandatory)
							$input.prop('checked', true);
						else
							$icoCalCate.removeClass('on');
					} else {
						$icoCalCate.addClass('on');
					}

					if (_onlyone) {
						$input.parents('label').siblings().find('.icoCalCate.on').removeClass('on');
						$input.parents('label').siblings().find('input:checked').prop('checked', false);
					}
				}
			})

			/**
			 * 삭제버튼
			 */
			.on('click', '.hasChildBoxes .btn_del', function(e) {

				var $hasChildBoxes = $(this).closest('.hasChildBoxes');
				$(this).closest('li').remove();
			})

			/**
			 * LNB 접기 펼치기 버튼
			 */
			.on('click', '.caContent #cont_fixed_area .btn_fold2', function(e) {

				if (window.Board) {
					window.Board.lnbShowHideCtl();
				}
				scheduler.update_view();
			});

		},

		/**
		 * 이벤트 초기화
		 */
		initEventOnce: function initEventOnce() {

			/**
			 * view를 변경한다.
			 */
			$(document).on('changeView', '#content', function(e, o) {

				var $content = $(this);

				var _viewName = o.viewName;
				var _contentClassName = o.contentClassName;
				var _innerContentSelector = '.caContent.' + _contentClassName;

				var _contentComponentUrl = '{0}components/calendar/teamplace/content/{1}'.format(Alfresco.constants.URL_PAGECONTEXT, _viewName);

				$content.find('.caContent.caWrite, .caContent.caView').remove();

				$content.appendDynamicWebScriptContentInner({
					url: _contentComponentUrl,
					innerContentSelector: _innerContentSelector,
					afterAppend: function(params) {
						$content.trigger('doChangeView', _contentClassName);
						// _params.afterChangeView 가 있으면 호출
						// _params.afterChangeView && _params.afterChangeView();
					}
				});
			})

			/**
			 * 컨텐츠 영역에 view를 변경한다.
			 */
			.on('doChangeView', '#content', function(e, view) {
				var $content = $(this);
				$content.removeClass('caSetup caWrite caView caAsk caSearch caResource caOpenCal caInvite caApproval').addClass(view);
				$('.caContent.' + view).find('.titleWrap').trigger('ellipsis', true);
			})

			/**
			 * @delegate toCalendar
			 */
			.on('click', '.changeView', function(e, view) {
				var $changeView = $(this);
				if ($changeView.parents('#winpop_wrap').length > 0) {
					window.close();
					return;
				}
				$('#content').trigger('toCalendar');
			})

			/**
			 * 컨텐츠 영역을 캘린더로 변경한다.
			 */
			.on('toCalendar', '#content', function(e) {
				var $content = $(this);
				if ($content.find('.caContent.caView, .caContent.caWrite, .caContent.caApproval').length > 0) {
					$content.find('.caContent.caView, .caContent.caWrite, .caContent.caApproval').remove();
				}
				$(this).removeClass('caSetup caWrite caView caAsk caSearch caResource caOpenCal caInvite caApproval');
			});

			$(document)
			/**
			 * 새로운 이벤트 작성페이지를 노출
			 */
			.on('ca.te.reservationResource', function(e, o) {

				var _options = o || {};
				var _teamplaceId = _options.teamplaceId || $('#content').find('.caContent.caCalendar[data-calendar-id]').data('teamplaceId');
				var _viewName = 'write?teamplaceId=' + _teamplaceId;
				if (_options.startDate)
					_viewName += '&startDate=' + _options.startDate;

				$('#content').trigger('changeView', {
					viewName: _viewName,
					contentClassName: 'caWrite'
				});
			})

			/**
			 * 이벤트 상세보기 페이지를 노출
			 */
			.on('ca.te.viewDetailResource', function(e, o) {

				var _options = o || {};
				var _teamplaceId = o.teamplaceId || $('#content').find('.caContent.caCalendar[data-calendar-id]').data('teamplaceId');
				var _viewName = 'view?teamplaceId={0}&calendarId={1}&eventId={2}'.format(_teamplaceId, o.calendarId, o.eventId);

				$('#content').trigger('changeView', {
					viewName: _viewName,
					contentClassName: 'caView'
				});
			});

			$(document)
			/**
			 * 팀플레이스 일정 모듈 보이기 (외부호출)
			 */
			.on('ca.te.external.showCalendarModule', function(e, o) {

				var $content = $('#content');
				var $caCalendar = $content.find('.caContent.caCalendar');
				$caCalendar.show();

				$(document).trigger('ca.te.content.calendar.resize');
				$(document).trigger('ca.te.content.calendar.reloadCalenar');
				scheduler.updateView();
			})
			/**
			 * 팀플레이스 일정 모듈 보이기 (외부호출)
			 */
			.on('ca.te.external.showCalendarModuleAndWrite', function(e, o) {

				$(document).trigger('ca.te.external.showCalendarModule');
				$(document).trigger('ca.te.reservationResource');
			})
			/**
			 * 팀플레이스 일정 모듈 보이기 (외부호출)
			 */
			.on('ca.te.external.showCalendarModuleAndView', function(e, o) {

				$(document).trigger('ca.te.external.showCalendarModule');
				$(document).trigger('ca.te.viewDetailResource', {
					teamplaceId: o.teamplaceId,
					calendarId: o.calendarId,
					eventId: o.eventId
				});
			})
			/**
			 * 팀플레이스 일정 모듈 숨기기 (외부호출)
			 */
			.on('ca.te.external.hideCalendarModule', function(e, o) {

				var $content = $('#content');
				$content.trigger('toCalendar');

				var $caCalendar = $content.find('.caContent.caCalendar');
				$caCalendar.hide();
			});
		},

		/**
		 * 컴포넌트 인스턴스 초기화
		 */
		initialize: function initialize() {

			$('body').addClass(SmartRunner.constants.SR_LOCALE);
		},

		/**
		 * ajax 팝업 페이지를 오픈한다.
		 */
		ajaxPopupOpen: function ajaxPopOpen(options) {
			$.ajax({
				type: "GET",
				dataType: "html",
				async: false,
				url: options.url,
				data: {
					"url": options.url
				},
				beforeSend: function() {
					var $wrap = $('#wrap, #winpop_wrap');
					$wrap.append('<div id="ajaxIndicator"><p class="loading"><img src="{0}res/images/swp/common/loading.gif" alt="{1}" /></p></div>'.format(Alfresco.constants.URL_CONTEXT, Alfresco.util.message('swp.com.label.loding')));
					if ($wrap.find('#fade').length < 1) {
						$wrap.append('<div id="fade"></div>');
					}

					$('#ajaxIndicator').show();
				},
				success: function(data) {
					var $popWrap = $('<div class="popWrap"></div>');
					$("body").append($popWrap);
					$popWrap.css({
						zIndex: Class.popZIndex++
					}).html(data);
					var $popCont = $popWrap.find('.popCont');
					var $popInner = $popCont.find('.popInner');

					$popCont.trigger('beforeLayerShow');
					$popCont.trigger('afterPopupDynamicWebScriptLayer', options);

					/* 팝업 내 세팅 */
					$popCont.show();
					$popInner.dwUI();
					$popInner.find('.doWriterInfo').trigger('resize');
					$popInner.environmentSetupArea();
					$popInner.ellipsis();
					$popWrap.show();

					$popCont.trigger('reposition');

					$('html').addClass('hidden');
				},
				complete: function() {
					$('#ajaxIndicator').remove();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					checkSessionStatus(jqXHR);
				}
			});
		}
	};

	if (typeof this['dwUI'] === 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_ca.te'] = Class;

})();
