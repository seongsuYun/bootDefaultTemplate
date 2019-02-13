/**
 * SmartRunner UI Library - Calendar layer repeat
 * 
 * http://www.uwiseone.com
 * 
 * Copyright 2015, Vince Yi
 * 
 * Licensed under the UWO license
 * 
 * @dependency rrule.js
 */
(function($) {

	// private fields
	var _m_byweekdayList = [ 'RRule.MO', 'RRule.TU', 'RRule.WE', 'RRule.TH', 'RRule.FR', 'RRule.SA', 'RRule.SU' ];

	// private functions
	/**
	 * 시작/종료 시간을 조정한다.
	 * 
	 * @params $inputDate {jQuery} 시작/종료 일시를 감싸고 있는 엘리먼트 jQuery 객체
	 * @params bChangeEnd {boolean} 종료일시 변경여부
	 */
	var _f_mediateDateTime = function _f_mediateDateTime($inputDate, bChangeEnd) {

		var $sTime = $inputDate.find('[name="rpsTime"]');
		var $eTime = $inputDate.find('[name="rpeTime"]');

		var _mStartDateTime = moment($sTime.val(), 'HH:mm');
		var _mEndDateTime = moment($eTime.val(), 'HH:mm');

		if (_mStartDateTime.diff(_mEndDateTime) < 0) {
			// do not something...
		} else {
			if (bChangeEnd) {
				var _mNewEndDateTime = _mStartDateTime.add(SmartRunner.constants.calendar.TIME_INTERVAL, 'm');
				$eTime.val(_mNewEndDateTime.format('HH:mm'));
			} else {
				var _mNewStartDateTime = _mEndDateTime.subtract(SmartRunner.constants.calendar.TIME_INTERVAL, 'm');
				$sTime.val(_mNewStartDateTime.format('HH:mm'));
			}
		}
	}

	/**
	 * RRule 을 검증한다.
	 */
	var _f_validateRRule = function _f_validateRRule($layerRepeat, rruleOptions) {

		if (typeof rruleOptions.interval !== 'undefined' && rruleOptions.interval == 0) {
			window.alert(Alfresco.util.message('swp.cal.common.warning.minimumRepeatCycle'));
			$layerRepeat.find('[name="day"]:visible').focus();
			return false;
		}

		if (rruleOptions.freq == RRule.DAILY && rruleOptions.interval > 60) {
			window.alert(Alfresco.util.message('swp.cal.common.warning.maximumRepeatCycle').format(60));
			$layerRepeat.find('.everyD [name="day"]').focus();
			return false;
		}

		if (rruleOptions.freq == RRule.WEEKLY) {
			if (rruleOptions.byweekday.length == 0) {
				window.alert(Alfresco.util.message('swp.cal.common.warning.selectRecurringDayOfWeek'));
				return false;
			}
			if (rruleOptions.interval > 8) {
				window.alert(Alfresco.util.message('swp.cal.common.warning.maximumRepeatCycle').format(8));
				$layerRepeat.find('.everyW [name="day"]').focus();
				return false;
			}
		}

		if (rruleOptions.freq == RRule.MONTHLY && rruleOptions.interval > 2) {
			window.alert(Alfresco.util.message('swp.cal.common.warning.maximumRepeatCycle').format(2));
			$layerRepeat.find('.everyM [name="day"]').focus();
			return false;
		}

		if (typeof rruleOptions.count !== 'undefined') {
			if (rruleOptions.count == 0) {
				window.alert(Alfresco.util.message('swp.cal.common.warning.minimumRepeatCount'));
				$layerRepeat.find('#term_count').focus();
				return false;
			}
			if (rruleOptions.count > 720) {
				window.alert(Alfresco.util.message('swp.cal.common.warning.maximumRepeatCount').format(720));
				$layerRepeat.find('#term_count').focus();
				return false;
			}
		}

		return true;
	}

	var Class = {
		/**
		 * 컴포넌트 초기화
		 */
		initComponentOnce: function initComponentOnce() {

			$(document)
			/**
			 * 반복설정 설정버튼 클릭
			 */
			.on('click', '#layerRepeat .btnConfirm', function(e) {

				var $btnConfirm = $(this);
				var $layerRepeat = $btnConfirm.closest('#layerRepeat');

				var _properties = $('#layerRepeat').gatheringProperties({
					checkEnabled: true
				});
				var _rruleOptions = {
					'freq': eval(_properties['freq'])
				};

				if (_rruleOptions['freq'] == RRule.DAILY) {
					_rruleOptions['interval'] = _properties['daily_interval'] || 1;

				} else if (_rruleOptions['freq'] == RRule.WEEKLY) {
					_rruleOptions['interval'] = _properties['weekly_interval'] || 1;
					_rruleOptions['byweekday'] = $(_properties['weekly_byweekday']).map(function() {
						return eval(this.toString());
					}).get();

				} else if (_rruleOptions['freq'] == RRule.MONTHLY) {
					_rruleOptions['interval'] = _properties['monthly_interval'] || 1;
					_rruleOptions['bymonthday'] = _properties['monthly_bymonthday'];
					_rruleOptions['bysetpos'] = _properties['monthly_bysetpos'];
					_rruleOptions['byweekday'] = eval(_properties['monthly_byweekday']);

				} else {

				}

				var _startTime = $layerRepeat.find('[name="rpsTime"]').val();
				var _endTime = $layerRepeat.find('[name="rpeTime"]').val();
				
				var $checkAllday = $layerRepeat.find('[name="rpCheckAllday"]');
				var _checkedAllday = $checkAllday.is(':checked');
				
				
				if (typeof _properties['count'] !== 'undefined')
					_rruleOptions['count'] = _properties['count'] || 1;
				if (typeof _properties['until'] !== 'undefined') {
//					_rruleOptions['until'] = moment(_properties['until'] + ' ' + _endTime , 'YYYY.MM.DD HH:mm').toDate();
					// Seoyoon 2018.07.20
					// (팀플 > 일정)
					// 종일-반복-매일 종일일정 설정시 종일 LW일정에는 하루 전 종료일자까지 표기됨
					var _untilDate = _properties['until'];
					var _endDateStr = _untilDate.format('YYYYMMDD');
					var _endDateTimeStr = "000000";
					
					if(_checkedAllday) {
						_rruleOptions['until'] = moment(_endDateStr + 'T' + _endDateTimeStr + 'Z',"YYYYMMDD'T'HHmmss'Z'").toDate();
					} else {
						var _endTimeHHmmss = _endTime.replace(':','') + '00';
						_rruleOptions['until'] = moment(_endDateStr + _endTimeHHmmss ,'YYYYMMDDHHmmss').toDate();
					}
					
				}

				var _startDate = $layerRepeat.data('startDate');
				//var _startDateTime = _startDate + ' ' + (_checkedAllday ? '00:00' : _startTime);
				var _startDateTime = _startDate + ' ' + _startTime;
				
				var _m_startDate = moment(_startDateTime , 'YYYY.MM.DD HH:mm');
				var _startDateObj = _m_startDate.toDate();   
				_rruleOptions['dtstart'] = _startDateObj;
				
				for ( var p in _rruleOptions) {
					if (typeof _rruleOptions[p] === 'undefined')
						delete _rruleOptions[p];
				}

				if (!_f_validateRRule($layerRepeat, _rruleOptions))
					return;

				var _recurrenceRule = new RRule(_rruleOptions);
				if (_rruleOptions['freq'] == RRule.WEEKLY) {
					var _allRecurrenceDateObj = _recurrenceRule.all();
					if (_allRecurrenceDateObj.length > 0) {
						var _firstRecurrenceDateObj = _allRecurrenceDateObj[0];
						if (_startDateObj.getTime() != _firstRecurrenceDateObj.getTime()) {
							_startDateObj = _firstRecurrenceDateObj;
							_rruleOptions['dtstart'] = _firstRecurrenceDateObj;
							_recurrenceRule = new RRule(_rruleOptions);
						}
					}
				}

				$layerRepeat.trigger('ca.te.layer.repeat.onConfirm', {
					recurrenceRule: _recurrenceRule,
					rruleString: _recurrenceRule.toString(),
					startDateObj: _startDateObj,
					startTime: _startTime,
					endTime: _endTime,
					bAllday: _checkedAllday
				});
				$layerRepeat.data('haveBeenSetting', true);
				$layerRepeat.trigger('closePopup');
				$layerRepeat.remove();
			})

			/**
			 * 반복설정 취소버튼 클릭
			 */
			.on('click', '#layerRepeat .btnCancel, #layerRepeat .btn_close', function(e) {

				var $layerRepeat = $(this).closest('#layerRepeat');

				$layerRepeat.trigger('ca.te.layer.repeat.onCancel', {});
				$layerRepeat.remove();
			})

			/**
			 * 종료일 설정 변경 시
			 */
			.on('dateChanged', '#layerRepeat #term_until', function(e, o) {

				var $termUntil = $(this);
				var $layerRepeat = $termUntil.closest('#layerRepeat');

				var _startDate = $layerRepeat.data('startDate');
				if (_startDate >= o.newValue) {
					window.alert(Alfresco.util.message('swp.cal.common.warning.endDateError'));
					$termUntil.val(o.oldValue);
				}

			})

			/**
			 * 일시- 시작/종료 시간 변경 시
			 */
			.on('change', '#layerRepeat .cal_Input_select select', function(e) {

				var $select = $(this);
				var $inputDate = $select.closest('.cal_Input_select');
				var $sTime = $inputDate.find('[name="rpsTime"]');

				_f_mediateDateTime($inputDate, $select.is($sTime));

			})
			/**
			 * 일시- 종일 체크
			 */
			.on('click', '#layerRepeat .cal_Input_select [name="rpCheckAllday"]', function(e) {

				var $rpCheckAllday = $(this);
				var $inputDate = $rpCheckAllday.closest('.cal_Input_select');
				var $selectTimes = $inputDate.find('select');

				var _checked = $rpCheckAllday.is(':checked');

				$selectTimes.prop('disabled', _checked);

			});

		},

		/**
		 * 이벤트 초기화
		 */
		initEventOnce: function initEventOnce() {

			$(document)
			/**
			 * 레이어 초기 loading/show 후 호출되는 이벤트
			 */
			.on('afterPopupDynamicWebScriptLayer', '#layerRepeat', function(e, o) {

				var $layerRepeat = $(this);
				var $sTime = $layerRepeat.find('[name="rpsTime"]');
				var $eTime = $layerRepeat.find('[name="rpeTime"]');

				var _initValue = $layerRepeat.data('initValue');

				$sTime.val(_initValue.startTime);
				$eTime.val(_initValue.endTime);

				$sTime.prop('disabled', _initValue.bAllday);
				$eTime.prop('disabled', _initValue.bAllday);
				$layerRepeat.find('[name="rpCheckAllday"]').prop('checked', _initValue.bAllday);

				$layerRepeat.data('startDate', _initValue.startDate);

				// 데이터 초기화가 되어있지 않으면...
				if (!$layerRepeat.data('initializedData')) {
					if ($layerRepeat.data('startDate')) {

						$layerRepeat.data('bAllday', _initValue.bAllday);
						$layerRepeat.trigger('ca.te.layer.repeat.initByStartDate');

						if (_initValue.rrule) {
							// 기존 반복데이터가 있는 경우
							var _rruleObj = RRule.fromString(_initValue.rrule);

							var _freq = _rruleObj.options.freq;
							var $freq = $layerRepeat.find('[name="every"][data-freq="{0}"]'.format(_freq));
							$freq.click();
							$freq.click();

							var _interval = _rruleObj.options.interval;
							var $viewTarget = $layerRepeat.find($freq.attr('view-target'));
							var $day = $viewTarget.find('[name="day"]');
							$day.val(_interval);

							var _until = _rruleObj.options.until;
							if (_until) {
								var $termType1 = $layerRepeat.find('[name="term"][value="type1"]');
								var $termUntil = $layerRepeat.find('#term_until');
								$termType1.click();
								$termType1.click();
								$termUntil.val(moment(_until).format('YYYY.MM.DD'));
							}

							var _count = _rruleObj.options.count;
							if (_count) {
								var $termType2 = $layerRepeat.find('[name="term"][value="type2"]');
								var $termCount = $layerRepeat.find('#term_count');
								$termType2.click();
								$termType2.click();
								$termCount.val(_count);
							}

							if (_freq == RRule.WEEKLY) {
								var _byweekday = _rruleObj.options.byweekday;
								for ( var _index in _byweekday) {
									$viewTarget.find('[name="daytype"][value="{0}"]'.format(_m_byweekdayList[_byweekday[_index]])).prop('checked', true);
								}
							} else if (_freq == RRule.MONTHLY) {
								var _bymonthday = _rruleObj.options.bymonthday;
								if (_bymonthday && _bymonthday.length > 0) {
									$viewTarget.find('#monthly_bymonthday').val(_bymonthday[0]);
								}

								var _bysetpos = _rruleObj.options.bysetpos;
								var _byweekday = _rruleObj.options.byweekday;
								if (_bysetpos && _bysetpos.length > 0 && _byweekday && _byweekday.length > 0) {
									var $everyMtypeYoil = $layerRepeat.find('[name="everyMtype"][value="yoil"]');
									$everyMtypeYoil.click();
									$everyMtypeYoil.click();
									$viewTarget.find('#monthly_bysetpos').val(_bysetpos[0]);
									$viewTarget.find('#monthly_byweekday').val(_m_byweekdayList[_byweekday[0]]);
								}
							}

						}

					}

					$layerRepeat.data('initializedData', true);
				}
			})

			.on('ca.te.layer.repeat.initByStartDate', '#layerRepeat', function(e, o) {

				var $layerRepeat = $(this);
				var _startDate = $layerRepeat.data('startDate');
				var _options = o || {};

				if (!_startDate)
					return;

				var _m_startDate = moment(_startDate, 'YYYY.MM.DD');

				// 주간 - 요일
				var _dayIndex = (_m_startDate.day() + 6) % 7;
				$layerRepeat.find('[name="daytype"]').prop('checked', false);
				$layerRepeat.find('[name="daytype"]').eq(_dayIndex).prop('checked', true);

				// 월간 - 날짜
				$layerRepeat.find('#monthly_bymonthday').val(_m_startDate.date());

				// 월간 - 요일
				var _nthOfMoth = Math.ceil(_m_startDate.date() / 7);
				$layerRepeat.find('#monthly_bysetpos').val(_nthOfMoth);
				$layerRepeat.find('#monthly_byweekday').prop('selectedIndex', _dayIndex);

				// 종료일
				var _m_untilDate = _m_startDate.clone().add('1', 'M');
				$layerRepeat.find('.term_type1').val(_m_untilDate.format('YYYY.MM.DD'));

				if (_options.init) {
					// 초기 라디오버튼 설정
					$layerRepeat.find('[data-default-checked]:radio').click().click();
					// 초기 필드값 설정
					$layerRepeat.find('[data-default-empty="empty"]').val('');
				}
			})
		},

		/**
		 * 컴포넌트 인스턴스 초기화
		 */
		initialize: function initialize() {

			var $layerRepeat = $('#layerRepeat');
			if ($layerRepeat.length == 0 || $layerRepeat.data('initialized'))
				return;
			$layerRepeat.data('initialized', true);

			$layerRepeat.find('.numeric_non_negative').numeric({
				negative: false,
				decimal: false
			});

			// 일시 컴포넌트 초기화
			var $sTime = $layerRepeat.find('[name="rpsTime"]');
			var $eTime = $layerRepeat.find('[name="rpeTime"]');

			for (var i = 0; i < 24; i++) {
				for (var j = 0; j < 60; j += SmartRunner.constants.calendar.TIME_INTERVAL) {
					var _time = String(i).lpad(2) + ':' + String(j).lpad(2);
					$sTime.append('<option>{0}</option>'.format(_time));
					$eTime.append('<option>{0}</option>'.format(_time));
				}
			}

			$sTime.find('option:last').remove();
			$eTime.find('option:first').remove();
		}
	};

	if (typeof this['dwUI'] == 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_ca.te.layer.repeat'] = Class;

})(jQuery);