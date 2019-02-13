/**
 * SmartRunner UI Library - Calendar content write
 *
 * http://www.uwiseone.com
 *
 * Copyright 2015, Vince Yi
 *
 * Licensed under the UWO license
 */
(function($) {

	// private fields
	var _p_nls = {
		ordinal: Alfresco.util.message('swp.cal.common.common.ordinal').split(','),
		simpleDayNames: Alfresco.util.message('swp.cal.common.common.simpleDayNames').split(','),
		dayNames: Alfresco.util.message('swp.cal.common.common.dayNames').split(','),
		monthNames: Alfresco.util.message('swp.cal.common.common.monthNames').split(','),
		sentences: {
			range: {
				until: Alfresco.util.message('swp.cal.common.common.sentences.range.until'),
				count: Alfresco.util.message('swp.cal.common.common.sentences.range.count'),
				infinite: Alfresco.util.message('swp.cal.common.common.sentences.range.infinite')
			},
			period: {
				main: Alfresco.util.message('swp.cal.common.common.sentences.period.main'),
				day: Alfresco.util.message('swp.cal.common.common.sentences.period.day'),
				days: Alfresco.util.message('swp.cal.common.common.sentences.period.days'),
				week: Alfresco.util.message('swp.cal.common.common.sentences.period.week'),
				weeks: Alfresco.util.message('swp.cal.common.common.sentences.period.weeks'),
				monthdate: Alfresco.util.message('swp.cal.common.common.sentences.period.monthdate'),
				monthdates: Alfresco.util.message('swp.cal.common.common.sentences.period.monthdates'),
				monthday: Alfresco.util.message('swp.cal.common.common.sentences.period.monthday'),
				monthdays: Alfresco.util.message('swp.cal.common.common.sentences.period.monthdays'),
				year: Alfresco.util.message('swp.cal.common.common.sentences.period.year'),
				years: Alfresco.util.message('swp.cal.common.common.sentences.period.years')
			},
			time: {
				minutes: Alfresco.util.message('swp.cal.common.common.sentences.time.minutes'),
				hours: Alfresco.util.message('swp.cal.common.common.sentences.time.hours'),
				hoursminutes: Alfresco.util.message('swp.cal.common.common.sentences.time.hoursminutes')
			}
		}
	};

	// private functions
	/**
	 * RRule 을 텍스트로 변환한다.
	 */
	var _f_rruleToText = function _f_rruleToText(rrule, dtstart) {

		var _options = rrule.options;

		var _dsstart = dtstart || new Date();
		var _substitutionObj = $.extend({}, {
			xdtstart: moment(_dsstart).format('YYYY.MM.DD')
		}, _options);

		var _rangeType = 'infinite';
		if (_options.until) {
			_rangeType = 'until';
			_substitutionObj['until'] = moment(_options['until']).format('YYYY.MM.DD');
		} else if (_options.count) {
			_rangeType = 'count';
		}

		var _freqType = null;
		if (_options.freq == RRule.DAILY) {
			_freqType = 'day';

		} else if (_options.freq == RRule.WEEKLY) {
			_freqType = 'week';

		} else if (_options.freq == RRule.MONTHLY) {
			if (_options.bymonthday && _options.bymonthday.length > 0) {
				_freqType = 'monthdate';
				// works 에서 bymonthday 가 누락되어 넘어옴. 별도 처리. SWPSEC-615
				if (typeof rrule.origOptions.bymonthday == 'undefined') {
					_options.bymonthday[0] = rrule.origOptions.until.getDate();
				}
			} else if (_options.bysetpos) {
				_freqType = 'monthday';

			}
		} else if (_options.freq == RRule.YEARLY) {
			_freqType = 'year';

		}
		if (_options.interval > 1) {
			_freqType += 's';
		}

		if (_options.byweekday && _options.byweekday.length > 0) {
			_substitutionObj['byweekday'] = $(_options.byweekday).map(function() {
				return _p_nls['simpleDayNames'][this];
			}).get().join(',');
		}
		if (_options.bymonthday && _options.bymonthday.length == 1) {
			_substitutionObj['bymonthday'] = _options.bymonthday[0];
		}
		if (_options.bysetpos) {
			_substitutionObj['bysetpos'] = _p_nls['ordinal'][_options.bysetpos];
		}

		var _rangeSentence = _p_nls['sentences']['range'][_rangeType];
		var _periodMainSentence = _p_nls['sentences']['period']['main'];
		var _periodSentence = _periodMainSentence.format(_p_nls['sentences']['period'][_freqType]);

		_rangeSentence += ' | ' + _periodSentence;

		return _rangeSentence.formatX(_substitutionObj);
	}

	/**
	 * 시간정보를 텍스트로 변환한다.
	 */
	var _f_timeToText = function _f_timeToText(startTime, endTime, bAllday) {

		if (bAllday)
			return '';

		var _m_startTime = moment(startTime, 'HH:mm');
		var _m_endTime = moment(endTime, 'HH:mm');
		var _m_duration = _m_endTime.subtract(_m_startTime);

		var _durationHours = _m_duration.hours();
		var _durationMinutes = _m_duration.minutes();

		// hours, minutes, hoursminutes
		var _timeSentenceType = '';
		if (_durationHours > 0)
			_timeSentenceType = 'hours';
		if (_durationMinutes > 0)
			_timeSentenceType += 'minutes';

		var _timeSentence = _p_nls['sentences']['time'][_timeSentenceType];

		return _timeSentence.formatX({
			startTime: startTime,
			endTime: endTime,
			durationHours: _durationHours,
			durationMinutes: _durationMinutes
		});

	}
	/**
	 * 시작/종료 일시를 조정한다.
	 *
	 * @params $inputDate {jQuery} 시작/종료 일시를 감싸고 있는 엘리먼트 jQuery 객체
	 * @params bChangeEnd {boolean} 종료일시 변경여부
	 */
	var _f_mediateDateTime = function($inputDate, bChangeEnd) {

		var $sDate = $inputDate.find('[name="sDate"]');
		var $eDate = $inputDate.find('[name="eDate"]');
		var $sTime = $inputDate.find('[name="sTime"]');
		var $eTime = $inputDate.find('[name="eTime"]');

		var _mStartDateTime = moment($sDate.val() + ' ' + $sTime.val(), 'YYYY.MM.DD HH:mm');
		var _mEndDateTime = moment($eDate.val() + ' ' + $eTime.val(), 'YYYY.MM.DD HH:mm');

		if (_mStartDateTime.diff(_mEndDateTime) < 0) {
			// do not something...
		} else {
			if (bChangeEnd) {
				var _mNewEndDateTime = _mStartDateTime.add(SmartRunner.constants.calendar.TIME_INTERVAL, 'm');
				$eDate.val(_mNewEndDateTime.format('YYYY.MM.DD'));
				$eTime.val(_mNewEndDateTime.format('HH:mm'));
			} else {
				var _mNewStartDateTime = _mEndDateTime.subtract(SmartRunner.constants.calendar.TIME_INTERVAL, 'm');
				$sDate.val(_mNewStartDateTime.format('YYYY.MM.DD'));
				$sTime.val(_mNewStartDateTime.format('HH:mm'));
			}
		}
	}

	/**
	 * 값을 취합한다.
	 */
	var _f_gatheringData = function($calWrite, skipValidation) {

		var _calendarId = $calWrite.data('calendarId');
		var _eventId = $calWrite.data('eventId');
		var _subEventId = $calWrite.data('subEventId');

		var _properties = $calWrite.gatheringProperties({
			ignoreChildSelector: '#layerRepeat'
		});

		var _data = $.extend({}, _properties, {
			calendarId: _calendarId,
			priority: _properties.important ? '1' : '0',    // 중요일정
		});

		if (_eventId)
			_data['eventID'] = _eventId;
		if (_subEventId)
			_data['subEventID'] = _subEventId;

		if (_properties.allday) {
			_data['startDate'] += ' 00:00:00';
			var _mEndDate = moment(_data['endDate'] + ' 00:00:00', 'YYYY.MM.DD HH:mm:SS');
			//var _mEndDate = moment(_data['endDate'] + ' 23:59:59', 'YYYY.MM.DD HH:mm:SS');
			_mEndDate.add(1, 'd');

			//_data['endDate'] = _mEndDate.format('YYYY.MM.DD HH:mm:SS');
			_data['endDate'] = _mEndDate.format('YYYY.MM.DD');
		} else {
			_data['startDate'] += ' ' + _properties.startTime + ':00';
			_data['endDate'] += ' ' + _properties.endTime + ':00';
		}
		if(_properties.allday) {
            // 18.04.16 수정
			//_data['startDate'] = moment(_data['startDate'], 'YYYY.MM.DD HH:mm:SS').format('YYYY-MM-DD');
			//_data['endDate'] = moment(_data['endDate'], 'YYYY.MM.DD HH:mm:SS').format('YYYY-MM-DD');

			_data['startDate'] = moment(_data['startDate'], 'YYYY.MM.DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
			_data['endDate'] = moment(_data['endDate'], 'YYYY.MM.DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
		}else{
			_data['startDate'] = moment(_data['startDate'], 'YYYY.MM.DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
			_data['endDate'] = moment(_data['endDate'], 'YYYY.MM.DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
		}

		if (typeof skipValidation === 'undefined' || skipValidation == false) {

			var $validationFieldsWrap = $calWrite.find('[data-property-name][swp-validation]:visible');
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
						return null;
					}
				}

				if ($fieldWrap.is('[swp-min-length]')) {
					var _minLength = $fieldWrap.attr('swp-min-length');
					if ((_validationCheckVariable == null || _validationCheckVariable === true) && _fieldValue.trim().length < _minLength) {
						window.alert(Alfresco.util.message('swp.cal.common.warning.minimumLengthField').format(_fieldName, _minLength));
						$field.focus();
						return null;
					}
				}
			}
		}

		return _data;
	}

	var Class = {
		/**
		 * 컴포넌트 초기화
		 */
		initComponentOnce: function initComponentOnce() {

			// 일시 변경 시 - 시작일시/종료일시 자동 변경로직 추가
			$(document)
			/**
			 * 일시- 시작/종료 시간 변경 시
			 */
			.on('dateChanged', '.mailWrite.calWrite .inputDate .jsCalByRC', function(e) {

				var $jsCalByRC = $(this);
				var $calWrite = $jsCalByRC.closest('.calWrite');
				var $inputDate = $jsCalByRC.closest('.inputDate');
				var $sDate = $inputDate.find('[name="sDate"]');

				_f_mediateDateTime($inputDate, $jsCalByRC.is($sDate));
			})

			/**
			 * 일시- 시작/종료 시간 변경 시
			 */
			.on('change', '.mailWrite.calWrite .inputDate select', function(e) {

				var $select = $(this);
				var $calWrite = $select.closest('.calWrite');
				var $inputDate = $select.closest('.inputDate');
				var $sTime = $inputDate.find('[name="sTime"]');

				_f_mediateDateTime($inputDate, $select.is($sTime));
			})

			/**
			 * 체크박스 - 종일 클릭 시
			 */
			.on('click', '.mailWrite.calWrite [name="checkAllday"]', function(e) {

				var $checkAllday = $(this);
				var $calWrite = $checkAllday.closest('.calWrite');
				var _checked = $checkAllday.is(':checked');

				$calWrite.trigger('ca.te.content.write.toggleAllday', _checked);
			})

			/**
			 * 체크박스 - 반복 클릭 시
			 */
			.on('click', '.mailWrite.calWrite #checkRepeat', function(e) {

				var $checkRepeat = $(this);
				var $calWrite = $checkRepeat.closest('.calWrite');

				if ($checkRepeat.is(':checked')) {
					$calWrite.trigger('ca.te.content.write.openRepeatLayer');
				} else {
					$calWrite.trigger('ca.te.content.write.toggleRecurrenceInfo', false);
				}
			})

			/**
			 * 반복수정 클릭 시
			 */
			.on('click', '.mailWrite.calWrite .btnModifyRepeat', function(e) {

				var $calWrite = $(this).closest('.calWrite');

				$calWrite.trigger('ca.te.content.write.openRepeatLayer', {
					rrule: $calWrite.find('#rruleText').val()
				});

			})

			/**
			 * 반복삭제 버튼 클릭 시
			 */
			.on('click', '.mailWrite.calWrite .inputRepeatDel', function(e) {

				var $calWrite = $(this).closest('.calWrite');
				$calWrite.trigger('ca.te.content.write.toggleRecurrenceInfo', false);
			})

			/**
			 * 반복 레이어 설정 클릭
			 */
			.on('ca.te.layer.repeat.onConfirm', '#layerRepeat', function(e, o) {

				var $calWrite = $('.mailWrite.calWrite');
				$calWrite.trigger('ca.te.content.write.setRecurrence', o);

			})

			/**
			 * 반복 취소/닫기
			 */
			.on('ca.te.layer.repeat.onCancel', '#layerRepeat', function(e, o) {
				// 기존에 설정되어 있는 경우에는 아무동작 하지 않음
				// 설정이 안되어 있는 경우에는 반복체크 해제
				var $calWrite = $('.mailWrite.calWrite');
				var $inputRepeatInfo = $calWrite.find('.inputRepeatInfo');

				if (!$inputRepeatInfo.is(':visible')) {
					$calWrite.trigger('ca.te.content.write.toggleRecurrenceInfo', false);
				}

				$calWrite.find('[name="checkAllday"]').prop('disabled', false);

				e.preventDefault();
			})

			/**
			 * 등록버튼 클릭 시
			 */
			.on('click', '.mailWrite.calWrite .btnCreate', function(e) {

				var $calWrite = $(this).closest('.calWrite');
				$calWrite.trigger('ca.te.content.write.onCreate');

				e.preventDefault();
			})

			/**
			 * 수정버튼 클릭 시
			 */
			.on('click', '.mailWrite.calWrite .btnModify', function(e) {

				var $calWrite = $(this).closest('.calWrite');
				$calWrite.trigger('ca.te.content.write.onModify');

				e.preventDefault();
			})

			/**
			 * 삭제버튼 클릭 시
			 */
			.on('click', '.mailWrite.calWrite .btnRemove', function(e) {

				var $calWrite = $(this).closest('.calWrite');
				$calWrite.trigger('ca.te.content.write.onDelete');

				e.preventDefault();
			})

			/**
			 * 취소버튼 클릭 시
			 */
			.on('click', '.mailWrite.calWrite .btnWriteCancel', function(e) {

				// 캘린더 리로드 & 창 닫기
				if ($('.pop_content').length > 0) { // 팝업모드
					window.close();
				} else { // 메인모드
					$('#content').trigger('toCalendar');
				}
			});

		},

		/**
		 * 이벤트 초기화
		 */
		initEventOnce: function initEventOnce() {

			$(document)
			/**
			 * 종일 체크/언체크
			 */
			.on('ca.te.content.write.toggleAllday', '.mailWrite.calWrite', function(e, b) {

				var $calWrite = $(this);
				var $checkAllday = $calWrite.find('[name="checkAllday"]');
				var $inputDate = $calWrite.find('.inputDate');
				var $inputDateChildSelect = $inputDate.find('select');

				// 종일 체크/언체크
				$checkAllday.prop('checked', b);
				// 시간 select 보임/숨김
				$inputDateChildSelect.toggle(!b);

				e.preventDefault();
			})
			/**
			 * 반복 취소/닫기
			 */
			.on('ca.te.content.write.toggleRecurrenceInfo', '.mailWrite.calWrite', function(e, b) {

				var $calWrite = $(this);

				$calWrite.find('#checkRepeat').prop('checked', b);
				$calWrite.find('.inputRepeatInfo').toggle(b);

				$calWrite.find('.inputDate :text, .inputDate select').prop('disabled', b);

				if (!b)
					$calWrite.find('[name="checkAllday"]').prop('disabled', false);

				e.preventDefault();
			})
			/**
			 * 반복레이어 열기
			 */
			.on('ca.te.content.write.openRepeatLayer', '.mailWrite.calWrite', function(e, o) {

				var $calWrite = $(this);
				var _options = o || {};

				$calWrite.appendDynamicWebScriptLayer({
					id: 'layerRepeat',
					url: $.generatePageContextUrl('components/calendar/teamplace/layer/repeat'),
					width: 465,
					initValue: {
						startDate: $calWrite.find('[name="sDate"]').val(),
						startTime: $calWrite.find('[name="sTime"]').val(),
						endTime: $calWrite.find('[name="eTime"]').val(),
						bAllday: $calWrite.find('[name="checkAllday"]').is(':checked'),
						rrule: _options.rrule
					}
				});
			})
			/**
			 * 반복 설정
			 */
			.on('ca.te.content.write.setRecurrence', '.mailWrite.calWrite', function(e, o) {

				var $calWrite = $(this);

				var _startDate = $calWrite.find('[name="sDate"]').val();
				var _dtstartDate = moment(o.startDateObj).format('YYYY.MM.DD');
				if (_startDate != _dtstartDate) {
					// 반복 시작일과 일정시작일이 다른경우 일정시작일을 반복 시작일로 변경
					var _endDate = $calWrite.find('[name="eDate"]').val();
					var _m_startDate = moment(_startDate, 'YYYY.MM.DD');
					var _m_endDate = moment(_endDate, 'YYYY.MM.DD');
					var _durationTime = _m_endDate.toDate().getTime() - _m_startDate.toDate().getTime();

					_endDate = moment(new Date(o.startDateObj.getTime() + _durationTime)).format('YYYY.MM.DD');

					$calWrite.find('[name="sDate"]').val(_dtstartDate);
					$calWrite.find('[name="eDate"]').val(_endDate);
				}

				$calWrite.find('[name="sTime"]').val(o.startTime);
				$calWrite.find('[name="eTime"]').val(o.endTime)

				var $recurrenceMsg1 = $calWrite.find('#recurrenceMsg1');

				var _rruleMessage = _f_rruleToText(o.recurrenceRule, o.startDateObj);
				var _timeMessage = _f_timeToText(o.startTime, o.endTime, o.bAllday);

				var _recurrenceMsg = _rruleMessage;
				if (_timeMessage.length > 0)
					_recurrenceMsg += '<br />' + _timeMessage;
				$recurrenceMsg1.html(_recurrenceMsg);

				var $inputRepeatInfo = $calWrite.find('.inputRepeatInfo');
				$calWrite.trigger('ca.te.content.write.toggleRecurrenceInfo', true);

				var $checkAllday = $calWrite.find('[name="checkAllday"]');

				$calWrite.trigger('ca.te.content.write.toggleAllday', o.bAllday);
				$calWrite.find('[name="checkAllday"]').prop('disabled', true);

				var $rruleText = $calWrite.find('#rruleText');
				$rruleText.val(o.rruleString);

				e.preventDefault();
			})

			/**
			 * 갱신 & 닫기
			 */
			.on('ca.te.content.write.reloadAndClose', '.mailWrite.calWrite', function(e, o) {

				// 캘린더 리로드 & 창 닫기
				if ($('.pop_content').length > 0) { // 팝업모드
					try { // opener issue
						if (opener && opener['dwUI']['_ca_content_calendar']) {
							opener['dwUI']['_ca_content_calendar']['reloadCalendar'] && opener['dwUI']['_ca_content_calendar']['reloadCalendar']();
						}
					} catch (e) {
					}
					window.close();
				} else { // 메인모드
					$('#content').trigger('toCalendar');
					$(document).trigger('ca.te.content.calendar.reloadCalenar');
				}
			})

			/**
			 * 일정 등록
			 */
			.on('ca.te.content.write.onCreate', '.mailWrite.calWrite', function(e, o) {

				var $calWrite = $(this);
				var _data = _f_gatheringData($calWrite);
				if (_data == null)
					return;

				$(document).trigger('ajaxPostEvent', {
					data: _data,
					success: function(data) {
						$calWrite.trigger('ca.te.content.write.reloadAndClose');
					}
				});
			})

			/**
			 * 일정 수정
			 */
			.on('ca.te.content.write.onModify', '.mailWrite.calWrite', function(e, o) {

				var $calWrite = $(this);
				var _data = _f_gatheringData($calWrite);
				if (_data == null)
					return;

				$(document).trigger('ajaxPutEvent', {
					data: _data,
					success: function(data) {
						$calWrite.trigger('ca.te.content.write.reloadAndClose');
					}
				});
			})

			/**
			 * 일정 삭제
			 */
			.on('ca.te.content.write.onDelete', '.mailWrite.calWrite', function(e, o) {

				if (!window.confirm(Alfresco.util.message('swp.cal.common.confirm.deleteEvent')))
					return;

				var $calWrite = $(this);
				var _data = _f_gatheringData($calWrite, true);
				if (_data == null)
					return;

				var _paramData = {
					calendarId: _data.calendarId,
					eventId: _data.eventId,
				};

				$(document).trigger('ajaxDeleteEvent', {
					data: _paramData,
					success: function(data) {
						$calWrite.trigger('ca.te.content.write.reloadAndClose');
					}
				});
			});

		},

		/**
		 * 컴포넌트 인스턴스 초기화
		 */
		initialize: function initialize() {

			var $calWrite = $('.mailWrite.calWrite');

			$calWrite.each(function() {
				var $thisCalWrite = $(this);
				if ($thisCalWrite.data('initialized'))
					return;

				$thisCalWrite.data('initialized', true);

				// 일시 컴포넌트 초기화
				var $sDate = $thisCalWrite.find('[name="sDate"]');
				var $eDate = $thisCalWrite.find('[name="eDate"]');
				var $sTime = $thisCalWrite.find('[name="sTime"]');
				var $eTime = $thisCalWrite.find('[name="eTime"]');

				for (var i = 0; i < 24; i++) {
					for (var j = 0; j < 60; j += SmartRunner.constants.calendar.TIME_INTERVAL) {
						var _time = String(i).lpad(2) + ':' + String(j).lpad(2);
						$sTime.append('<option>{0}</option>'.format(_time));
						$eTime.append('<option>{0}</option>'.format(_time));
					}
				}

				// 쓰기 시
				var $parentsWrite = $thisCalWrite.parents('.caContent.caWrite, .pop_content');
				if ($parentsWrite.length > 0) {
					// 기본 일시 설정
					var _basisDate = new Date();
					var _startDate = $thisCalWrite.data('startDate')
					if (_startDate) {
						_basisDate = moment(_startDate, 'YYYY-MM-DD HH:mm');
					}
					var _mBasisDate = moment(_basisDate);

					var _mStartDate = _mBasisDate.clone().minute(_mBasisDate.minute() - _mBasisDate.minute() % SmartRunner.constants.calendar.TIME_INTERVAL);
					var _mEndDate = _mStartDate.clone().add(SmartRunner.constants.calendar.TIME_INTERVAL, 'm');

					$sDate.val(_mStartDate.format('YYYY.MM.DD'));
					$sTime.val(_mStartDate.format('HH:mm'));
					$eDate.val(_mEndDate.format('YYYY.MM.DD'));
					$eTime.val(_mEndDate.format('HH:mm'));
				}

				// 보기 시
				var $parentsView = $thisCalWrite.parents('.caContent.caView');
				if ($parentsView.length > 0) {

					// lazyloading value
					$thisCalWrite.find('[data-lazyloading-value]').each(function() {
						var $hasLazyloadingValue = $(this);
						var _lazyloadingValue = $hasLazyloadingValue.data('lazyloadingValue');

						$hasLazyloadingValue.val(_lazyloadingValue);
					});
					// lazyloading click
					$thisCalWrite.find('[data-lazyloading-click]').each(function() {
						var $hasLazyloadingClick = $(this);
						var _lazyloadingClick = $hasLazyloadingClick.data('lazyloadingClick');

						if (_lazyloadingClick.toString() == 'true')
							$hasLazyloadingClick.click();
					});

					// 반복설정
					var $rruleText = $thisCalWrite.find('#rruleText');
					var _rruleText = $rruleText.val();

					if (_rruleText != '' && _rruleText.trim().length > 0) {
						$thisCalWrite.trigger('ca.te.content.write.toggleRecurrenceInfo', true);
						$thisCalWrite.find('[name="checkAllday"]').prop('disabled', true);

						var $recurrenceMsg1 = $calWrite.find('#recurrenceMsg1');

						var _dtstart = $calWrite.data('dtstart');
						var _mDtstart = moment(_dtstart, 'YYYY-MM-DD HH:mm:SS');

						var _rruleObj = RRule.fromString(_rruleText);
						var _rruleMessage = _f_rruleToText(_rruleObj, _mDtstart.toDate());

						var _startTime = $sTime.val();
						var _endTime = $eTime.val();
						var _bAllyday = $thisCalWrite.find('#checkAllday').is(':checked');
						var _timeMessage = _f_timeToText(_startTime, _endTime, _bAllyday);

						var _recurrenceMsg = _rruleMessage;
						if (_timeMessage.length > 0)
							_recurrenceMsg += '<br />' + _timeMessage;
						$recurrenceMsg1.html(_recurrenceMsg);
					}

					// 권한체크
					var _authority = $thisCalWrite.data('authority');
					if (_authority != 'OWNER') {
						$thisCalWrite.find('.authorityDisabled').prop('disabled', true);
						$thisCalWrite.find('.authorityReadonly').addClass('on').prop('readonly', true);
					}
				}
			});

		},

		/**
		 * rrule 을 텍스트로 변환한다.
		 */
		convertRruleToText: function(rrule, dtstart) {

			return _f_rruleToText(rrule, dtstart);
		}
	};

	if (typeof this['dwUI'] == 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_ca.te.content.write'] = Class;

})(jQuery);