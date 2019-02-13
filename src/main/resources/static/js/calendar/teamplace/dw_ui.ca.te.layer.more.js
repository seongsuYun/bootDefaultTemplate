/**
 * SmartRunner UI Library - Calendar layer more
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

	var Class = {
		/**
		 * 컴포넌트 초기화
		 */
		initComponentOnce: function initComponentOnce() {

			$(document)
			/**
			 * 상세보기 버튼 클릭
			 */
			.on('click', '#layerMore .btnViewDetail', function(e) {

				var $layerMore = $(this).closest('#layerMore');

				var _calendarId = $layerMore.data('calendarId');
				var _eventId = $layerMore.data('eventId');

				$layerMore.trigger('closePopup');
				$(document).trigger('ca.te.viewDetailResource', {
					calendarId: _calendarId,
					eventId: _eventId
				});
			});
		},

		/**
		 * 이벤트 초기화
		 */
		initEventOnce: function initEventOnce() {

			$(document)
			/**
			 * 더보기 레이어를 연다.
			 */
			.on('ca.te.layer.more.open', function(e, o) {

				var _calendarId = o.calendarId;
				var _eventId = o.eventId;

				if (o.id) {
					var _event = scheduler.getEvent(o.id);
					_calendarId = _event.original.calendarId;
					_eventId = _event.original.eventId;
					_selectedDate = _event.original.xStartDate
				}

				dwUI.ajaxPopupOpen('{0}components/calendar/teamplace/layer/more?calendarId={1}&eventId={2}&selectedDate={3}'.format(Alfresco.constants.URL_PAGECONTEXT, _calendarId, _eventId, _selectedDate));
			});
		},

		/**
		 * 컴포넌트 인스턴스 초기화
		 */
		initialize: function initialize() {

			var $layerMore = $('#layerMore');

			$layerMore.each(function() {
				var $thisLayerMore = $(this);
				if ($thisLayerMore.data('initialized'))
					return;

				$thisLayerMore.data('initialized', true);

				var $hasRrules = $thisLayerMore.find('[data-rrule]');
				$hasRrules.each(function() {
					var $thisHasRrules = $(this);
					var _rrule = $thisHasRrules.data('rrule');
					var _rruleObj = RRule.fromString(_rrule);

					var _dtstart = $thisHasRrules.data('dtstart');
					_rruleObj['dtstart'] = moment(_dtstart, 'YYYY-MM-DD HH:mm:SS').toDate();

					var _recurrenceStartDateTime = $thisHasRrules.data('recurrenceStartDateTime');
					// TODO _recurrenceStartDateTime 로 반복시작 일시를 조회합니다.

					var _rruleText = dwUI['_ca.te.content.write']['convertRruleToText'](_rruleObj, _dtstart);

					$thisHasRrules.html(_rruleText.replace('|', '<br />'));
				});
			});
		}
	};

	if (typeof this['dwUI'] == 'undefined') {
		this['dwUI'] = {};
	}
	this['dwUI']['_ca.te.layer.more'] = Class;

})(jQuery);