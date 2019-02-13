/**
 * SmartRunner UI Library - Calendar content calendar
 * 
 * http://www.uwiseone.com
 * 
 * Copyright 2015, Vince Yi
 * 
 * Licensed under the UWO license
 */
(function($) {

	// private fields

	// private functions
	/**
	 * dhtmlx 스케줄러를 초기화한다.
	 */
	var _f_initScheduler = function _f_initScheduler() {

		/* scheduler.config */
		scheduler.config.start_on_monday = false; // 일요일 부터 출력
		scheduler.config.hour_size_px = 56; // 1시간당 높이
		scheduler.config.xml_date = "%Y-%m-%j %H:%i";
		scheduler.config.hour_date = "%H:%i"; // week 시간 표시방법
		scheduler.config.details_on_create = true;
		scheduler.config.time_step = 30; // 이벤트 발생 단위 - 60분단위로
		scheduler.config.multi_day = true; // 종일
		scheduler.config.max_month_events = 3; // month 3개까지만 보이기 [외3건]
		scheduler.config.mark_now = true; // 현재시간 선으로 알려주기.
		scheduler.config.readonly = true;
		scheduler.config.readonly_form = true; // 읽기만 가능한 캘린더
		scheduler.config.details_on_dblclick = false;
		scheduler.config.dblclick_create = false;
		// scheduler.config.quick_info_detached = false; //클릭시 빠른보기
		scheduler.config.drag_create = true;// month에서 드래그해서 이벤트 생성
		scheduler.config.drag_lightbox = false;
		scheduler.config.buttons_right = [ "dhx_custom_btn_info" ];
		scheduler.config.full_day = true;
		scheduler.config.minicalendar.mark_events = true;
		scheduler.config.default_date = '%Y.%M.%d';
		scheduler.config.first_hour = 0;

		/* scheduler.xy */
		scheduler.xy.nav_height = 93; // 캘린더 탭,해당년,월,일 출력 부분
		scheduler.xy.menu_width = 0;

		/* scheduler.locale */
		scheduler.locale.labels["dhx_custom_btn_info"] = Alfresco.util.message('swp.cal.common.label.moveDetail');
		scheduler.locale.labels.section_subject = Alfresco.util.message('swp.cal.common.label.calendar')/* 캘린더 */;
		scheduler.locale.labels.section_description = Alfresco.util.message('swp.cal.common.label.title')/* 제목 */;
		scheduler.locale.labels.section_time = Alfresco.util.message('swp.cal.common.label.dateTime')/* 일시 */;
		scheduler.locale.labels.full_day = Alfresco.util.message('swp.cal.common.label.allday')/* 종일 */;

		/* scheduler.templates */
		scheduler.templates.day_scale_date = scheduler.date.date_to_str('%j(%D)');
		scheduler.templates.week_date_class = function(date, today) {
			if (date.getDay() == 0 || date.getDay() == 6)
				return "weekday";
			return "";
		};
		scheduler.templates.calendar_time = scheduler.date.date_to_str("%Y.%m.%d");
		scheduler.templates.calendar_date = scheduler.date.date_to_str("%j");
		scheduler.templates.event_class = function(start, end, ev) {
			// year 이벤트 클래스
			return "";
		};
		scheduler.templates.hour_scale = function(date) {
			// week, day 시간 출력
			var hour = date.getHours();
			var top = '00';
			var bottom = '30';
			if (hour == 8) {
				top = Alfresco.util.message('swp.cal.common.label.amHour')/* 오전 */;
			} else if (hour == 13) {
				top = Alfresco.util.message('swp.cal.common.label.pmHour')/* 오후 */;
			} else {
				top = '';
			}
			hour = ((date.getHours() + 11) % 12) + 1;
			var html = '';
			var section_width = Math.floor(scheduler.xy.scale_width / 2);
			var minute_height = Math.floor(scheduler.config.hour_size_px / 2);
			html = "<div style='text-align:right;padding-right:5px'> " + top + hour + Alfresco.util.message('swp.cal.common.label.timeLabel') + "</div>";
			return html;
		};
		/* week, Day 일정 hearder */
		scheduler.templates.event_header = function(start, end, ev) {

			var _start = scheduler.templates.event_date(start);
			var _end = scheduler.templates.event_date(end);
			var _bThirtyMinites = (end.getTime() - start.getTime()) == 30 * 60 * 1000;
			var _title = ev.text.html2();

			var _span = '<span title="{0}~{1}">{0}~{1}</span>'.format(_start, _end);
			if (_bThirtyMinites) {
				_span = '<span title="{0}~{1} {2}">{0}~{1} {2}</span>'.format(_start, _end, _title);
			}

			if (ev.original.recurring == 'Y')
				_span = '<span class="iconCalall" title="반복">반복</span> ' + _span;

			return _span;
		};
		scheduler.templates.event_text = function(start, end, ev) {

			var _text = '<span title="{0}">{0}<span>'.format(ev.text.html2());
			if (ev.original.priority == '1')
				_text = '★' + _text;
			return _text;
		};
		/* Month 날짜 */
		scheduler.templates.event_bar_date = function(start, end, ev) {
			// 정상적으로 template 가 적용되지 않음
			var _start = scheduler.templates.event_date(start);
			var _end = scheduler.templates.event_date(end);
			var _span = '<span title="{0}~{1}"><b>{0}</b><span> '.format(_start, _end);

			return _span;
		};
		scheduler.templates.event_bar_text = function(start, end, ev) {

			var _text = '<span title="{0} - {1}">{1}<span>'.format(ev.text.html2(), ev.text.html2());
			if (ev.original.priority == '1')
				_text = '★' + _text;
			if (ev.original.recurring == 'Y')
				_text = '<span class="iconCalall" title="{0}">{0}</span> {1}'.format(Alfresco.util.message('swp.cal.common.label.recurring'), _text);
			return _text;
		};
		// scheduler.templates.lightbox_header = function(start, end, ev) {
		// return "일정간략등록";
		// };
		scheduler.templates.event_class = function(start, end, event) {
			if (event.original && event.original.allow == '0')
				return "event_type26";
			if (event.subject)
				return "event_" + event.subject;
			return "event_type02";
		};

		scheduler.templates.month_events_link = function(date, count) {

			var _remainCount = count - scheduler.config.max_month_events;
			if (_remainCount < 1)
				return '';

			var _date = moment(date).format('YYYY.MM.DD');
			var _moreEvents = Alfresco.util.message('swp.cal.common.label.otherCount').format(_remainCount);

			var _format = '<a href="#?w=271" rel="layerMoreR" data-select-date="{0}" class="poplink typeB dpth4 txtG6 mr7">{1}</a>';

			return _format.format(_date, _moreEvents);
		}

		scheduler.attachEvent('onClick', function(id, e) {

			$(document).trigger('ca.te.layer.more.open', {
				id: id
			});

			e.preventDefault();
		});

		scheduler.attachEvent("onEmptyClick", function(date, e) {

			try {
				if (e.srcElement && $(e.srcElement).attr('rel') == 'layerMoreR')
					return;
				if (e.target && $(e.target).attr('rel') == 'layerMoreR')
					return;
			} catch (e) {
			}

			var _startDate = moment(date).format('YYYY-MM-DD HH:mm');
			if (scheduler.getState().mode == 'month') {
				var _currentDate = new Date();
				_startDate = moment(date).format('YYYY-MM-DD ') + moment(_currentDate).format('HH:mm');
			}

			$(document).trigger('ca.te.reservationResource', {
				startDate: _startDate
			});
		});

		scheduler.attachEvent("onViewChange", function(new_mode, new_date) {

			$(document).trigger('ca.te.content.calendar.reloadCalenar');
		});

		scheduler._render_v_bar = function(a, b, c, d, e, f, g, h, k) {
			var i = document.createElement("DIV"), j = this.getEvent(a), l = k ? "dhx_cal_event dhx_cal_select_menu" : "dhx_cal_event", n = scheduler.templates.event_class(j.start_date, j.end_date, j);
			n && (l = l + " " + n);
			var m = j.color ? "background:" + j.color + ";" : "", o = j.textColor ? "color:" + j.textColor + ";" : "", p = '<div event_id="' + a + '" class="' + l + '" style="position:absolute; top:' + c + "px; left:" + b + "px; width:" + (d - 4)
					+ "px; height:" + e + "px;" + (f || "") + '"></div>';
			i.innerHTML = p;
			var q = i.cloneNode(!0).firstChild;
			if (k || !scheduler.renderEvent(q, j)) {
				var _bodyHeight = (e - (this._quirks ? 20 : 30) + 1 - 12);
				var q = i.firstChild, r = '<div class="dhx_event_move dhx_header" style=" width:' + (d - 6) + "px;" + m + '" >&nbsp;</div>';
				r += '<div class="dhx_event_move dhx_title" style="' + m + "" + o + ' height:26px">' + g + "</div>";
				if (_bodyHeight > -1)
					r += '<div class="dhx_body" style=" width:' + (d - (this._quirks ? 4 : 14)) + "px; height:" + _bodyHeight + "px;" + m + "" + o + '">' + h + "</div>";
				var s = "dhx_event_resize dhx_footer";
				k && (s = "dhx_resize_denied " + s);
				r += '<div class="' + s + '" style=" width:' + (d - 8) + "px;" + (k ? " margin-top:-1px;" : "") + "" + m + "" + o + '" ></div>';
				q.innerHTML = r
			}
			return q
		};

		var _day_full = Alfresco.util.message('swp.cal.common.common.simpleDayNames').split(",");
		_day_full = [ _day_full[6] ].concat(_day_full.splice(0, 6));

		scheduler.locale = {
			date: {
				month_full: "01,02,03,04,05,06,07,08,09,10,11,12".split(","),
				month_short: "01,02,03,04,05,06,07,08,09,10,11,12".split(","),
				day_full: _day_full,
				day_short: _day_full
			},
			labels: {
				dhx_cal_today_button: Alfresco.util.message('swp.cal.common.label.today'),
				day_tab: Alfresco.util.message('swp.cal.common.label.dateTab'),
				week_tab: Alfresco.util.message('swp.cal.common.label.weekTab'),
				month_tab: Alfresco.util.message('swp.cal.common.label.monthTab'),
				new_event: Alfresco.util.message('swp.cal.common.label.title'),
				icon_save: Alfresco.util.message('swp.cal.common.label.create'),
				icon_cancel: Alfresco.util.message('swp.cal.common.label.cancel'),
				icon_details: "Details",
				icon_edit: "Edit",
				icon_delete: "Delete",
				confirm_closing: "",
				confirm_deleting: "Event will be deleted permanently, are you sure?",
				section_description: "Description",
				section_time: "Time period",
				full_day: "Full day",
				confirm_recurring: "Do you want to edit the whole set of repeated events?",
				section_recurring: "Repeat event",
				button_recurring: "Disabled",
				button_recurring_open: "Enabled",
				button_edit_series: "Edit series",
				button_edit_occurrence: "Edit occurrence",
				agenda_tab: "Agenda",
				date: "Date",
				description: "Description",
				year_tab: "1년보기",
				week_agenda_tab: "Agenda",
				grid_tab: "Grid",
				drag_to_create: "Drag to create",
				drag_to_move: "Drag to move"
			}
		};

		/* 초기화 */
		var _defaultView = 'month';
		scheduler.init('scheduler_here', new Date(), _defaultView);

		scheduler.data_attributes = function() {
			var empty = function(a) {
				return a || "";
			}
			return [ [ "id" ], [ "text" ], [ "start_date", scheduler.templates.xml_format ], [ "end_date", scheduler.templates.xml_format ], [ "rec_type", empty ], [ "event_length", empty ], [ "event_pid", empty ] ];
		};

	}

	/**
	 * 스케줄러를 리사이징한다.
	 */
	var _f_resizeScheduler = function _f_resizeScheduler() {
		if (typeof scheduler === 'undefined')
			return;

		var $schedulerHere = $('#scheduler_here');
		var $contFlexibleArea = $schedulerHere.parents('#cont_flexible_area');

		$schedulerHere.css({
			height: $contFlexibleArea.outerHeight()
		});
	}

	/**
	 * 이벤트 리스트를 렌더링한다.
	 */
	var _f_renderEventList = function _f_renderEventList(eventList) {

		var _xEventList = [];
		var _recurringMap = {};

		for (var i = 0; i < eventList.length; i++) {
			var _event = eventList[i];

			var _eventId = _event.eventId;
			if (_event.subEventId.trim().length > 0)
				_eventId += '_' + _event.subEventId;

			_xEventList.push({
				id: _eventId,
				event_id: _event.eventId,
				start_date: _event.startDate,
				end_date: _event.endDate,
				text: _event.summary,
				details: _event.description,
				subject: 'type03',
				original: _event
			});
		}

		scheduler.clearAll();
		scheduler.parse(_xEventList, 'json');
	}

	var Class = {
		/**
		 * 컴포넌트 초기화
		 */
		initComponentOnce: function initComponentOnce() {

			$(document)
			/**
			 * 리프레쉬 버튼 클릭
			 */
			.on('click', '.caListHead .icoRefresh', function() {

				$(document).trigger('ca.te.content.calendar.reloadCalenar');
			})
			/**
			 * 탭클릭 시 클래스 변경
			 */
			.on('click', 'div.dhx_cal_tab', function() {
				var cls = $(this).attr('name').replace('_tab', '');
				$('div.caCalendarBox', '#snb').removeClass('year month week day').addClass(cls);
			})
			/**
			 * 인쇄 레이어
			 */
			.on('beforeLayerPopupOpen', '#layerPrint', function(e, o) {

				var $layerPrint = $(this);

				var $printDayStart = $layerPrint.find('[name="printDayStart"]');
				var $printDayEnd = $layerPrint.find('[name="printDayEnd"]');

				var _state = scheduler.getState();

				$printDayStart.val(moment(_state.min_date).format('YYYY.MM.DD'));
				$printDayEnd.val(moment(_state.max_date).subtract(1, 'd').format('YYYY.MM.DD'));

				var _teamplaceId = o.anchor.parents('.caContent.caCalendar').data('teamplaceId');
				$layerPrint.data('teamplaceId', _teamplaceId);

			})
			/**
			 * 인쇄버튼 클릭
			 */
			.on('click', '#layerPrint .btnPopupPrint', function(e) {

				var $layerPrint = $(this).closest('#layerPrint');

				var $printDayStart = $layerPrint.find('[name="printDayStart"]');
				var $printDayEnd = $layerPrint.find('[name="printDayEnd"]');

				var _startDate = $printDayStart.val();
				var _endDate = $printDayEnd.val();
				var _teamplaceId = $layerPrint.data('teamplaceId');

				var _url = Alfresco.constants.URL_PAGECONTEXT + 'calendar-teamplace-print?startDate={0}&endDate={1}&teamplaceId={2}'.format(_startDate, _endDate, _teamplaceId);
				NewWindow(_url, 'name', '792', '795', 'yes');

				$layerPrint.trigger('closePopup');
			})
			/**
			 * 일정 더보기
			 */
			.on('beforeLayerPopupOpen', '#layerMoreR', function(e, o) {

				var $layerMoreR = $(this);
				var $anchor = o.anchor;
				var _selectDate = $anchor.data('selectDate');

				$layerMoreR.find('#dateSection').text(_selectDate);

				var _mStartDate = moment(_selectDate, 'YYYY.MM.DD');
				var _mEndDate = _mStartDate.clone().add(1, 'd');

				var _eventList = scheduler.getEvents(_mStartDate.toDate(), _mEndDate.toDate());

				var _xEventList = [];
				for (var i = 0; i < _eventList.length; i++) {
					var _event = $.extend({
						xEventId: _eventList[i].id
					}, _eventList[i].original);
					_event.summary = _event.summary.html();
					_xEventList.push(_event);
				}
				_xEventList.sort(function(a, b) {
					if (a.xDayType != b.xDayType)
						return a.xDayType > b.xDayType ? 1 : -1;

					if (a.xStartTime != b.xStartTime)
						return a.xStartTime > b.xStartTime ? 1 : -1;

					return a.summary > b.summary ? 1 : -1;
				});

				var $moreList = $layerMoreR.find('.moreList');
				$moreList.trigger('appendChildByTemplate', {
					data: _xEventList,
					classifyPropertyName: 'xDayType',
					bAppendBeforeClear: true
				});
			})
			/**
			 * 일정 더보기 - 간략보기
			 */
			.on('click', '#layerMoreR [data-xevent-id]', function(e, o) {

				var $hasXeventId = $(this);
				var $layerMoreR = $hasXeventId.closest('#layerMoreR');
				var _xEventId = $hasXeventId.data('xeventId');

				$(document).trigger('ca.te.layer.more.open', {
					id: _xEventId
				});

				$layerMoreR.trigger('closePopup');
				e.preventDefault();
			});
		},

		/**
		 * 이벤트 초기화
		 */
		initEventOnce: function initEventOnce() {

			$(document)
			/**
			 * 리사이즈 이벤트
			 */
			.on('ca.te.content.calendar.resize', function(e) {

				_f_resizeScheduler();

			})
			/**
			 * 이벤트 목록 처리
			 */
			.on('ca.te.content.calendar.reloadCalenar', function(e, o) {

				var $content = $('#content');
				if ($content.find('.caContent:visible').length == 0)
					return;

				if ($content.find('.caContent.caWrite, .caContent.caView, .caContent.caApproval').length > 0) {
					$content.trigger('toCalendar');
				}
				var $caCalendar = $content.find('.caContent.caCalendar');

				// 캘린더 아이디 조회
				var _calendarId = $caCalendar.data('calendarId');
				var _schedulerState = scheduler.getState();
				var _startDate = moment(_schedulerState.min_date).format('YYYY-MM-DD HH:mm:SS');
				var _endDate = moment(_schedulerState.max_date).format('YYYY-MM-DD HH:mm:SS');

				$(document).trigger('ajaxGetEventList', {
					query: {
						calendarId: _calendarId,
						startDate: _startDate,
						endDate: _endDate
					},
					success: function(data) {
						// TODO data.result 객체에서 오류 처리
						_f_renderEventList(data.eventList);
					}
				});

			});

			$(window).on('resize', function() {

				$(document).trigger('ca.te.content.calendar.resize');

			});
		},

		/**
		 * 캘린더를 리로드한다.
		 */
		reloadCalendar: function() {

			$(document).trigger('ca.te.content.calendar.reloadCalenar');
		},

		/**
		 * 컴포넌트 인스턴스 초기화
		 */
		initialize: function initialize() {

			var $caCalendar = $('.caContent.caCalendar');
			$caCalendar.each(function() {
				var $thisCalWrite = $(this);
				if ($thisCalWrite.data('initialized'))
					return;
				$thisCalWrite.data('initialized', true);

				_f_resizeScheduler();
				_f_initScheduler();

				// 최초 로드 시 캘린더 리로딩
				Class.reloadCalendar();
			});
		}
	};

	if (typeof this['dwUI'] == 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_ca.te.content.calendar'] = Class;

})(jQuery);