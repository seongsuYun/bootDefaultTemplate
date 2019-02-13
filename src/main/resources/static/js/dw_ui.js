(function() {

	// 임시로 dw_ui 에 추가, 추후 jquery.swp 에 이관될 부분
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

	// 임시로 dw_ui 에 추가, 추후 jquery.swp 에 이관될 부분
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

	/*
	 * on-key event fix for FF on Korean input
	 * fires 'keyup' event when contents of input form change
	 * requires jQuery 1.2.x
	 * example: var watchInput = keyFix(inputId);
	 * author: Hoya, hoya@betastudios.net http://hoya.tistory.com
	 */
	if (typeof (beta) == "undefined")
		_beta = beta = {};

	if (typeof (_beta.fix) == "undefined")
		_beta.fix = {};
	else
		alert("keyfix is already set!");

	if (typeof (window.beta.instances) == "undefined")
		window.beta.instances = new Array();

	_beta.fix = function (target) {
		// this fix is only for mozilla browsers
		// fixed,, firefox or opera
		if (!$.browser.firefox && !$.browser.opera) {
			return false;
		}

		var $target = target;

		var thisClass = this;
		this.keyEventCheck = null;
		this.db = null;
		this.target = $target;
		window.beta.instances[this.target.attr('id')] = this;

		var focusFunc = function () {
			if (!thisClass.keyEventCheck) thisClass.watchInput();
		};

		var blurFunc = function () {
			if (thisClass.keyEventCheck) {
				window.clearInterval(thisClass.keyEventCheck);
				thisClass.keyEventCheck = null;
			}
		};

		$target.bind("focus", focusFunc);
		$target.bind("blur", blurFunc);
	};

	_beta.fix.prototype.watchInput = function () {

		var $target = this.target;

		if (this.db != $target.val()) {
			// trigger event
			$target.trigger('keyup');
		}
		this.db = $target.val();

		if (this.keyEventCheck) window.clearInterval(this.keyEventCheck);
		this.keyEventCheck = window.setInterval("window.beta.instances['" + this.target.attr('id') + "'].watchInput()", 100);
	};
	//-- _beta.fix

	var Class = {
		winHeight:0
		, winWidth:0
		, popZIndex:5000
		/* 디버그 */							, debug: function debug(str) {
			var $debugArea = $('#debug');
			if($debugArea.length<1) {
				$debugArea = $('<div id="debug"></div>').appendTo($('body'));
			}
			$debugArea.append('<span>'+str+'</span>').scrollTop(10000);
		}
		/* 브라우저 체크 */					, initBrowserOnce: function initBrowserOnce(a, z) {
			a=navigator.userAgent;
			var u = 'unknown'
				, x = 'X'
				, m = function (r, h) {
					for (var i = 0; i < h.length; i = i + 1) {
						r = r.replace(h[i][0], h[i][1]);
					}
					return r;
				}
				, c = function (i, a, b, c) {
					var r = {name: m((a.exec(i) || [u, u])[1], b)};
					r[r.name] = true;
					r.version = (c.exec(i) || [x, x, x, x])[3];
					if (r.name.match(/safari/) && r.version > 400) {
						r.version = '2.0';
					}
					if (r.name === 'presto') {
						r.version = ($.browser.version > 9.27) ? 'futhark' : 'linear_b';
					}
					r.versionNumber = parseFloat(r.version) || 0;
					r.versionX = (r.version !== x) ? (r.version + '').substr(0, 1) : x; r.className = r.name + r.versionX;
					return r;
				};
			a = (a.match(/Opera|Navigator|Minefield|KHTML|Chrome/) ? m(a, [[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''], ['Chrome Safari', 'Chrome'], ['KHTML', 'Konqueror'], ['Minefield', 'Firefox'], ['Navigator', 'Netscape']]) : a).toLowerCase();
			$.browser = $.extend((!z) ? $.browser : {}, c(a, /(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/, [], /(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(;|dev|rel|\s|$)/));
			$.layout = c(a, /(gecko|konqueror|msie|opera|webkit)/, [['konqueror', 'khtml'], ['msie', 'trident'], ['opera', 'presto']], /(applewebkit|rv|konqueror|msie)(:|\/|\s)([a-z0-9\.]*?)(;|\)|\s)/);
			$.os = { name: (/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris') };
			if (!z) {
				$('html').addClass([$.os.name, $.browser.name, $.browser.className, $.layout.name, $.layout.className].join(' '));
			}

		}
		/* alfresco webscript 세팅 */		
		, initWebScript: function initWebScript() {
			// 2014-04-13 추가

			var $initWebScripts = $(this).find('div[data-wscomponent-init]');
			$initWebScripts.each(function() {
				var $initWebScript = $(this);
				var _initWebScript = $initWebScript.data('wscomponentInitFinish');
				if (!_initWebScript) {
					$initWebScript.data('wscomponentInitFinish', true);
					var _wsUrl = $initWebScript.data('wscomponentInit');

					$initWebScript.appendDynamicWebScript({
						url: _wsUrl,
						afterAppend: function (params) {
							$initWebScript.dwUI();
						}
					});
				}
			});
		}
		/* placeholder 세팅 */				, initPlaceholder: function initPlaceholder() {
			$(this).find('input[placeholder], textarea[placeholder]').placeholder();
		}
		/* body에 브라우저 CSS 추가 */		, initBodyCssOnce: function initBodyCssOnce() {
			if ($.browser.name == 'msie') {
				//$('body').addClass($.browser.name);
			} else {
				$('body').addClass($.browser.name);
			}
		}
		/* 왼쪽 메뉴 fold 세팅 */				, initSnbFoldOnce: function initSnbFoldOnce() {
			var $wrap = $('#wrap');
			if (!$wrap.hasClass('relative')) {
				$('a.btn_fold').click(function () {
					if ($(".btn_fold").hasClass("on")) {
						$('#snb').css('display', 'block');
						$('#container').css('background', 'url(/share/images/swp/common/bg_container.gif) repeat-y 247px top');
						$('#contentArea').css('left', '247px');
						$('.mailList').css('padding-left', '1px');
						$('.mailListItem').css('background', '#f7f8f9 url(/share/images/swp/common/bg_mailListItem.gif) repeat-y left top');
						$('.utilArea .utilNotice').css('margin-left', '249px');
						$('#cont_fixed_area').css('background', 'url(/share/images/swp/common/bg_container.gif) repeat-y 0 0 #fff');
						$("#snb.ap").next("#contentArea").find("#content").removeClass("apContentOn"); // 전자결제 기안 신청
						$(this).removeClass("on");
						$(document).ellipsis();
					} else {
						$('#snb').css('display', 'none');
						$('#container').css('background', 'none');
						$('#contentArea').css('left', '0');
						$('.mailList').css('padding', '0');
						$('.mailListItem').css('background-image', 'none');
						$('.utilArea .utilNotice').css('margin-left', '0');
						$('#cont_fixed_area').css('background','#fff');
						$("#snb.ap").next("#contentArea").find("#content").addClass("apContentOn"); // 전자결제 기안 신청
						$(this).addClass("on");
						$(document).ellipsis();
					}
					$(window).trigger('resize');
					if($('#scheduler_here').length>0 && !$('#scheduler_here').hasClass('agenda')) {
						scheduler.setCurrentView(scheduler._date);
					}
					return false;
				});
			} else if ($wrap.hasClass('relative')) {
				$('a.btn_fold').click(function () {
					if ($(".btn_fold").hasClass("on")) {
						$('#snb').css('display', 'block');
						$('#container').css('background', 'url(/share/images/swp/common/bg_container.gif) repeat-y 247px top');

						if ($('.safari #contentArea')) {
							$('#contentArea').css('margin-left', '0');
						} else {
							$('#contentArea').css('margin-left', '247px');
						}
						$('.utilArea .utilNotice').css('margin-left', '249px');
						$('#cont_fixed_area').css('background', 'url(/share/images/swp/common/bg_container.gif) repeat-y 0 0 #fff');
						$(this).removeClass("on");
						$(document).ellipsis();
					} else {
						$('#snb').css('display', 'none');
						$('#container').css('background', 'none');
						$('#contentArea').css('margin-left', '0');
						$('.utilArea .utilNotice').css('margin-left', '0');
						$('.mailList').css('padding', '0');
						$('#cont_fixed_area').css('background','#fff');
						$(this).addClass("on");
						$(document).ellipsis();
					}
					$(window).trigger('resize');
					if($('#scheduler_here').length>0 && !$('#scheduler_here').hasClass('agenda')) {
						scheduler.setCurrentView(scheduler._date);
					}
					return false;
				});
			}
		}
		/* 레이어 팝업 버튼 세팅 */			, initLayerPopupOnce: function initLayerPopupOnce() {
			$(document)
				.on('click', 'a.poplink[href^=#], .poplink a[href^=#]', function(e) {
					//var pop_base = $(".pop_base");
					var $anchor = $(this);
					var popID = $(this).attr('rel');
					var popURL = $(this).attr('href');
					var width = popURL.match(/w=([0-9]+)/);

					if ($anchor.hasClass('disabledLink') || $anchor.parent().hasClass('disabledLink')) {
						return;
					}

					var _wscomponentref = $anchor.data('wscomponentref');
					var _wsalwaysreload = $anchor.data('wsalwaysreload');
					var $popTarget = $('#' + popID);
					if (_wsalwaysreload) {
						$anchor.trigger('loadDynamicLayer');
					} else if (_wscomponentref && $popTarget.length == 0) {
						$anchor.trigger('loadDynamicLayer');
					} else {
						if(width != null && width.length>1) {
							var popWidth = width[1];
							if ($popTarget.length == 0) {
								$(document).trigger('beforeLayerPopupOpen', { target: popID, source: $anchor });
							} else {
								$popTarget.trigger('beforeLayerPopupOpen', { anchor: $anchor });
								Class.layerPopupOpen(popID, popWidth);
							}
						}
					}

					e.preventDefault();
					e.stopPropagation();
				})
				.on('loadDynamicLayer', 'a.poplink[href^=#], .poplink a[href^=#][data-wscomponentref]', function(e) {
					var $anchor = $(this);
					var popID = $(this).attr('rel');
					var popURL = $(this).attr('href');
					var width = popURL.match(/w=([0-9]+)/);
					var popWidth = width[1];

					var _wscomponentref = $anchor.data('wscomponentref');
					var $content = $('#content, #winpop_wrap');
					$content.appendDynamicWebScript({
						url: _wscomponentref,
						beforeAppend: function (params) {
							var $caLayer = $content.find('#' + popID);
							$caLayer.remove();
						},
						afterAppend: function (params) {
							var $caLayer = $content.find('#' + popID);
							$caLayer.dwUI();

							Class.layerPopupOpen(popID, popWidth);
						}
					});
				})
				.on('click', '.popup_block .btn_close, .popup_block .jsPopClose', function(e) {
					$(this).parents('.popup_block').trigger('closePopup');

					e.preventDefault();
				})
				.on('closePopup', '.popup_block', function(e) {
					$(this).hide();
					$('.sharingAdd_box .adrsAdd_box').hide();
					$.fadeHide();
					if($('.popWrap').length<1)
						$('html').removeClass('hidden');

					// reuse webscript layer popup
					var $popup = $(this);
					if ($popup.prop('swp_beforeParent')) {
						var _befoerParentsSelector = $popup.prop('swp_beforeParent');
						var $beforeParents = $(_befoerParentsSelector);
						if ($beforeParents.length != 1) {
							console.log('warnning... ' + _befoerParentsSelector + ', length: ' + $beforeParents.length);
						}
						if ($beforeParents.length > 0) {
							$beforeParent = $beforeParents.first();
							$beforeParent.append($popup);
						}
						$popup.removeProp('swp_beforeParent');
					}

					e.stopPropagation();
				});

		}
		/* 윈도우 팝업 버튼 세팅 */			, initWinPopCloseOnce: function initWinPopCloseOnce() {
			$('#winpop_wrap')
				.on('click', 'a.jsPopClose', function(e) {
					if($(this).parents('.popup_block').length<1)
						window.close();
					e.preventDefault();
				});
		}
		/* Layer Popup 열기 */				, layerPopupOpen: function layerPopOpen(id, width) {

			//SWPTEMP-1098[스팸신고>스팸설정] 스팸등록 이후 스팸설정 레이어 팝업이 닫히지 않는 현상이 발생함
			var $popObj = $('#' + id);
			if($popObj.length == 0) {
				$('#content').append($popObj);
			}

			$popObj.trigger('beforeLayerShow');

			$popObj.show().css({ 'width': Number(width) });
			$popObj.find('.doWriterInfo').trigger('resize');

			var popMargTop = ($popObj.height() + 57) / 2;
			var popMargLeft = ($popObj.width() + 62) / 2;

			if (!$popObj.hasClass('ca_wrap')) {
				$popObj.css({
					'margin-top': -popMargTop,
					'margin-left': -popMargLeft
				});
			} else {
				$popObj.trigger('reposition');
			}

			$.fadeShow();
			$('html').addClass('hidden');

		}
		/* Ajax Popup 버튼 세팅 */			, initAjaxPopupOnce: function initAjaxPopupOnce() {
			$(document)
				.on('click', '.btn_jsPop', function(e) {
					var $anchor = $(this);
					if($anchor.prop('tagName')!='A')
						$anchor = $anchor.find('a');
					var url = $anchor.attr('href');
					if(url.indexOf('#')>-1) {
						url = url.split('#')[1];
					}

					Class.ajaxPopupOpen(url);

					e.preventDefault();
				})
				.on('closePopup', '.popWrap', function() {
					$(this).remove();
					//$("#fade").hide();
					if($('.popWrap').length<1)
						$('html').removeClass('hidden');
				})
				.on('click', '.popWrap .btn_close, .popWrap .jsPopClose', function(e) {
					$(this).trigger('closePopup');

					e.preventDefault();
				})
				.on('reposition', '.popCont', function(e) {
					Class.repositionPopup.call($(this));

					e.stopPropagation();
				});
		}
		/* ajax Popup 열기 */				, ajaxPopupOpen: function ajaxPopOpen(url) {
			$.ajax({
				type: "GET",
				dataType: "html",
				async: false,
				url: url,
				data: {
					"url": url
				},
				beforeSend: function () {
					var $wrap = $('#wrap, #winpop_wrap');
					$wrap.append('<div id="ajaxIndicator"><p class="loading"><img src="{0}images/swp/common/loading.gif" alt="{1}" /></p></div>'.format(Alfresco.constants.URL_CONTEXT, Alfresco.util.message('swp.com.label.loding')));
					if($wrap.find('#fade').length < 1) {
						$wrap.append('<div id="fade"></div>');
					}

					$('#ajaxIndicator').show();
				},
				success: function (data) {
					var $popWrap = $('<div class="popWrap"></div>');
					$("body").append($popWrap);
					$popWrap.css({zIndex:Class.popZIndex++}).html(data);
					var $popCont = $popWrap.find('.popCont');
					var $popInner = $popCont.find('.popInner');

					$popCont.trigger('beforeLayerShow');

					/* 팝업 내 세팅 */
					$popCont.show();
					$popInner.dwUI();
					$popInner.find('.doWriterInfo').trigger('resize');
					$popInner.environmentSetupArea();
					$popInner.ellipsis();
					$popWrap.show();

					$popCont.trigger('reposition');
					//Class.repositionPopup.call($popCont);

					$('html').addClass('hidden');
				}, complete: function () {
					$('#ajaxIndicator').remove();
				}, error: function (jqXHR, textStatus, errorThrown) {
					checkSessionStatus(jqXHR);

					/*if (jqXHR.status == 401) {
						$("body").append(jqXHR.responseText);
					} else {
						alert("REVIEW FORM ERROR!!");
					}*/
				}
			});

			return false;
		}
		/* 팝업 위치 조정 */					, repositionPopup: function repositionPopup() {
			var $popCont = $(this);

			if($popCont.length>0) {
				var $popInner = $popCont.find('.popInner');

				var popContWidth = $popInner.outerWidth()+60;
				var popContHeight = $popInner.outerHeight()+55;
				//console.log(popContHeight, Class.winHeight);
				if(popContHeight>Class.winHeight-50) {
					popContHeight = Class.winHeight-50;
					$popCont.css({height:popContHeight-55, overflowY:'scroll', paddingRight: '16px'});
				} else {
					$popCont.css({height:popContHeight-55, overflowY:'hidden', paddingRight: 30});
				}

				var left = (Class.winWidth-popContWidth)/2;
				var top = (Class.winHeight-popContHeight)/2;

				$popCont.css({left:left, top:top});
			}
		}
		/* 버튼 세팅 */						, initBtnSet: function initBtnSet() {
			var $wrapper = $(this);
			if (!$wrapper.find(".btnSet").length) { return; }

			$wrapper.find("a.btnSet, input.btnSet, button.btnSet, span.btnSet").each(function () {
				var strClasses = $(this).attr("class");
				var iconsplit = strClasses.split('icon');
				var iconclass = "icon";
				var iconST = iconsplit[1];
				var fclass = iconsplit[0];

				if($(this).prop('tagName')!='SPAN' || $(this).find('a').length<1) {
					var $strHTML = $('<span class="' + fclass + '"></span>');
					var $striconHTML = $('<span class="' + fclass + iconclass + '"></span>');
					var $iconSTHTML = $('<span class="' + iconST + '"></span>');


					if (typeof iconST === 'undefined') {
						$(this).removeAttr("class").wrap($strHTML);
						$strHTML = $(this).parent();
					} else {
						$(this).removeAttr("class").wrap($striconHTML);
						$($iconSTHTML).insertBefore(this);
					}

					if($strHTML.hasClass('jsLayer')) {
						$strHTML.removeClass('jsLayer');
						$(this).addClass('jsLayer');
					}

					if($striconHTML.hasClass('jsLayer')) {
						$striconHTML.removeClass('jsLayer');
						$(this).addClass('jsLayer');
					}

					if($iconSTHTML.hasClass('jsLayer')) {
						$iconSTHTML.removeClass('jsLayer');
						$(this).addClass('jsLayer');
					}

					if($strHTML.hasClass('jsPopClose')) {
						$strHTML.removeClass('jsPopClose');
						$(this).addClass('jsPopClose');
					}

					if($striconHTML.hasClass('jsPopClose')) {
						$striconHTML.removeClass('jsPopClose');
						$(this).addClass('jsPopClose');
					}

					if($iconSTHTML.hasClass('jsPopClose')) {
						$iconSTHTML.removeClass('jsPopClose');
						$(this).addClass('jsPopClose');
					}

					//var t = $(".btnSet button[type=button]");
					//if ($.browser.msie && $.browser.version == 8) {
					//    $(t).parent(".btnSet").css('margin-right', '5px');
					//}
				}


			});
		}
		/* 폴더 트리 세팅 Once */				, initFolderMenuOnce: function initFolderMenuOnce() {
			var resetFolderAppr = function($ul, level, ell) {
				var $li = $ul.find('>li');
				$ul.data('level', level);
				$ul.data('ell', ell);
				$li.each(function() {
					var $item = $(this).data('level', level);
					var $menuDepth = $item.find('>div.menuDepth').css({paddingLeft:10+12*level}).data('padding', 10+12*level);
					var $ul = $item.find('>ul');
					var $handle =$menuDepth.find('a.handle');

					if(ell) {
						$handle.addClass('txt_eps').css({maxWidth:ell-(10+12*level)});
					}

					if($ul.length>0) {
						resetFolderAppr($ul, level+1);
					}
				});
			};

			var setLiLast = function($ul) {
				var $li = $ul.find('>li');
				$li.removeClass('last');
				$li.filter(':last').addClass('last');

				$li.find('>ul').each(function() {
					setLiLast($(this));
				});
			};

			var sortFolder = function($ul) {
				var $li = $ul.find('>li:not(.menuAdd)');
				if($li.length>1) {
					var data = [];
					for(var i=0; i<$li.length; i++) {
						if($($li[i]).data('order'))
							data.push({'name':$($li[i]).data('order'), 'obj':$li[i]});
						else
							data.push({'name':$('>.menuDepth .handle', $li[i]).text(), 'obj':$li[i]});
					}

					for(i=0; i<data.length-1; i++) {
						for(var j=i+1; j<data.length; j++) {
							if(data[i].name > data[j].name) {
								var temp = data[i];
								data[i]=data[j];
								data[j]=temp;
							}
						}
					}

					for(i=0; i<data.length; i++) {
						$ul.append(data[i].obj);
					}
				}

				$li.each(function() {
					var $ul = $(this).find('>ul');
					if($ul.length>0)
						sortFolder($ul);
				});
			};

			var folderAdd = function($ul, placeholder) {
				var level = $ul.data('level');
				var padding = 10+12*(level);

				if(typeof placeholder === 'undefined')
					placeholder = Alfresco.util.message('swp.com.label.inputFolderName');
				if($ul.find('.menuAdd').length<1) {
					$ul.append('<li class="menuAdd"><div class="menuDepth"><input type="text" placeholder="'+placeholder+'" /></div></li>');
				}

				var $menuAdd= $ul.find('.menuAdd');
				var $input = $menuAdd.find('input');

				var $hasInputMaxLength = $input.parents('ul[data-input-max-length]');
				if ($hasInputMaxLength.length > 0) {
					$input.attr('maxlength', $hasInputMaxLength.data('inputMaxLength'));
				}

				$menuAdd.find('.menuDepth').css({paddingLeft:padding});
				$input.css({width:$ul.width()-padding-30});

				$menuAdd.find('input').focus();
			};

			var menuAdd = function($ul, name) {
				var $folderMenu = $ul;
				if(!$folderMenu.hasClass('folderMenu'))
					$folderMenu = $ul.parents('.folderMenu');
				var $item = $folderMenu.find('.template').clone().removeClass('template');
				var $menuDepth = $item.find('.menuDepth');
				var $handle = $item.find('a.handle');
				var level = $ul.data('level')+1;
				var ell = $ul.data('ell');
				$item.data('level', level).data('ell', ell);
				$handle.text(name);
				$menuDepth.css({paddingLeft:10+12*level}).data('padding', 10+12*level);
				if(ell) {
					$handle.addClass('txt_eps').css({maxWidth:ell-(10+12*level)});
				}

				$ul.append($item);
				sortFolder($ul);
				setLiLast($ul);

				$(document).trigger('folderJustAdded', {obj:$item, name:name});
			};

			var setFolderBasic = function($ul, level, ell) {
				var $li = $ul.find('>li');
				$ul.data('level', level);
				$ul.data('ell', ell);
				$li.each(function() {
					var $item = $(this).data('level', level).data('ell', ell);
					var $menuDepth = $item.find('>div').addClass('menuDepth').css({paddingLeft:10+12*level}).data('padding', 10+12*level);
					var $ul = $item.find('>ul');
					var $handle =$menuDepth.find('a:first').addClass('handle');
					if(ell) {
						$handle.addClass('txt_eps').css({maxWidth:ell-(10+12*level)});
					}
					if($ul.length>0) {
						$item.addClass('has-child');
						$handle.before($('<a href="#none" class="item_menu">{0}</a>'.format(Alfresco.util.message('swp.com.label.folderOpenClose'))));

						if(!$ul.hasClass('show')) {
							$menuDepth.find('.item_menu').addClass('menuOpen');
							$ul.hide();
						} else {
							$menuDepth.find('.item_menu').addClass('menuClose')
						}

						setFolderBasic($ul, level+1, ell);
					} else {
						$handle.before($('<span class="item_menu">{0}</span>'.format(Alfresco.util.message('swp.com.label.noChildFoler'))));
					}
				});
			};


			$(document)
				.on('remove', '.folderMenu li', function(e) {
					var $li = $(this);
					var $ul = $li.parent();
					//var $folderMenu = $li.parents('.folderMenu');

					$li.remove();

					if($ul.find('>li').length<1) {
						if(!$ul.hasClass('.folderMenu')) {
							var $menuDepth = $ul.siblings('.menuDepth');
							var $itemMenu = $menuDepth.find('.item_menu');
							$itemMenu.after('<span class="item_menu">{0}</span>'.format(Alfresco.util.message('swp.com.label.noChildFoler'))).remove();
							$ul.remove();
							$menuDepth.parent().removeClass('has-child');
						}
					} else {
						setLiLast($ul);
					}

					e.stopPropagation();

				})
				.on('expand', '.folderMenu li', function(e) {		//펼치기
					$(this).find('>ul').slideDown(200);
					$(this).find('>.menuDepth a.item_menu').removeClass('menuOpen').addClass('menuClose');
					$($(this).parents('li')[0]).trigger('expand');
					e.stopPropagation();
				})
				.on('collapse', '.folderMenu li', function(e) {		//접기
					$(this).find('>ul').slideUp(200);
					$(this).find('>.menuDepth a.item_menu').removeClass('menuClose').addClass('menuOpen');
					e.stopPropagation();
				})
				.on('folderAdd', '.folderMenu', function() {
					folderAdd($(this), $(this).data('folderAddPlaceholder'));
				})
				.on('folderAdd', '.folderMenu ul', function(e) {
					var $folderMenu = $(this).parents('.folderMenu')
					$(this).parent().trigger('expand');
					folderAdd($(this), $folderMenu.data('folderAddPlaceholder'));
					e.stopPropagation();
				})
				.on('folderAdd', '.folderMenu li', function(e) {
					var $li = $(this);
					var $ul = $li.find('>ul');
					var level = $li.data('level');

					if($ul.length<1) {
						$ul=$('<ul class="dynamicAppend"></ul>').appendTo($li).data('level', level+1);
					}

					$ul.trigger('folderAdd');

					e.stopPropagation();
				})
				.on('menuAdd', '.folderMenu li', function(e, name) {
					var $li = $(this);
					var $ul = $li.find('>ul');
					//var $folderMenu = $(this).parents('.folderMenu');

					if($ul.length<1) {
						$ul=$('<ul></ul>').appendTo($li);
						$li.addClass('has-child').find('.item_menu').after('<a href="#openclose" class="item_menu menuClose">{0}</a>'.format(Alfresco.util.message('swp.com.label.folderOpenClose'))).remove();
					}

					menuAdd($ul, name);
					resetFolderAppr($ul, $li.data('level')+1, $li.data('ell'));

					e.stopPropagation();
				})
				.on('menuAdd', '.folderMenu', function(e, name) {
					var $ul = $(this);

					menuAdd($ul, name);
					resetFolderAppr($ul, $ul.data('level'), $ul.data('ell'));

					e.stopPropagation();
				})
				.on('click', '.folderMenu a.item_menu', function(e) {
					if($(this).hasClass('menuClose')) {
						$($(this).parents('li')[0]).trigger('collapse')
					} else {
						$($(this).parents('li')[0]).trigger('expand')
					}
					e.stopPropagation();
					e.preventDefault();
				})
				.on('click', '.folderMenu a.handle', function(e) {
					$($(this).parents('li')[0]).trigger('expand');

					e.stopPropagation();
				})
				.on('click', '.folderMenu .folderChk input', function() {
					if($(this).is(':checked')) {
						$(this).parents('.menuDepth').addClass('checked')
					} else {
						$(this).parents('.menuDepth').removeClass('checked')
					}
				})
				.on('click', '.folderMenu a.itemModify', function(e) {
					var $menuDepth = $(this).parents('.menuDepth');
					var $menuModify = $menuDepth.find('.menuModify');
					var $groupSetList = $menuDepth.find('.groupSetList'); // 조직도 (OR) 레이어 닫기
					var menuDepthWidth = $menuDepth.outerWidth();
					var padding = $menuDepth.data('padding');
					var $handle = $menuDepth.find('.handle');
					if(padding+164 > menuDepthWidth)
						padding = menuDepthWidth-164;

					if($menuModify.length<1) {
						$menuModify = $('<p class="menuModify"><input type="text" /><a href="#none">X</a></p>');
						//$menuModify = $('<p class="menuModify"><input type="text" /></p>');
						$menuDepth.append($menuModify);

						var $input = $menuModify.find('input');
						var $hasInputMaxLength = $input.parents('ul[data-input-max-length]');
						if ($hasInputMaxLength.length > 0) {
							$input.attr('maxlength', $hasInputMaxLength.data('inputMaxLength'));
						}
					}

					//SWPTEMP-856
					//$menuModify.css({paddingLeft:padding}).show().find('input').val($handle.text()).focus();
					$menuModify.css({paddingLeft:padding}).show().find('input').focus().val("").val($handle.text());
					$groupSetList.hide();

					e.stopPropagation();
					e.preventDefault();
				})
				.on('blur', '.folderMenu .menuAdd input', function(e) {

					var $input = $(this);
					var $parentLi = $input.parents('li').parents('li');

					$input.parents('li').first().remove();

					var $boxUl = $parentLi.find('ul.dynamicAppend');
					if ($boxUl.length > 0) {
						if ($boxUl.find('li').length == 0) {
							$boxUl.remove();
						}
					}
					e.stopPropagation();
				})
				.on('keyup', '.folderMenu .menuAdd input', function(e) {
					var $input = $(this);
					if(e.keyCode == 13) {	//Enter
						if($input.val().length > 0) {
							var $li=$($input.parents('li')[1]);
							if($li.length>0) {
								$li.trigger('menuAdd', $input.val());
							} else {
								$input.parents('.folderMenu').trigger('menuAdd', $input.val());
							}

							$input.trigger('afterMenuAdd', [ $input.val() ]);
							$input.trigger('blur');
						} else {
							e.preventDefault();
						}
					} else if(e.keyCode==27) {	//ESC
						$input.trigger('blur');
					}
				})
				.on('click', '.folderMenu .menuModify a', function(e) {
					$(this).parents('.menuModify').hide();

					e.stopPropagation();
					e.preventDefault();
				})
				.on('blur', '.folderMenu .menuModify input', function(e) {
					$(this).parents('.menuModify').hide();

					e.stopPropagation();
				})
				.on('mouseenter', '.folderMenu .menuDepth', function(e) {
					$(this).addClass('on');

					if(folderMove) {
						if($(this).parent().hasClass('folder_droppable') && $(this).parents('li.move').length<1) {
							$folderMoveIcon.removeClass('impossible');
							$(this).addClass('move_over');
						} else {
							$folderMoveIcon.addClass('impossible');
						}
					}
					e.stopPropagation();
				})
				.on('mouseleave', '.folderMenu .menuDepth', function(e) {
					$(this).removeClass('on move_over');
					e.stopPropagation();
				})
				.on('mousedown', '.folderMenu .folder_moveable .menuDepth', function(e) {
					var $menuDepth = $(this);
					folderMoveTimer = setTimeout(function() {
						folderMove=true;
						$folderMoveIcon = $('<div class="folderMove"></div>').text($menuDepth.find('.handle').text()).prepend('<span class="icon"></span><span class="impossible"></span>');
						$folderMoveIcon.appendTo($('body')).css({left: e.pageX+2, top: e.pageY+2});
						$folderMoveMenu = $menuDepth.parent().addClass('move');
						$(document).trigger('folderMoveStart', $folderMoveMenu);

					}, 200);
					e.preventDefault();
					e.stopPropagation();
				})
				.on('mouseup', '.folderMenu .menuDepth', function() {
					clearTimeout(folderMoveTimer);
					var $menuDepth = $(this);
					if(folderMove) {
						var $li = $(this).parent();
						if($menuDepth.hasClass('move_over')) {
							$(document).trigger('folderMoveEnd', $li);
							//TO 개발팀 folderMoveEnd 이벤트 catch 하여 개발 처리 한 후 반드시 folderMoveConfirm 을 fire 헤주세요 전달인자는 다음과 같습니다.
							//$(document).trigger('folderMoveConfirm', {result:false, obj:$li});
						} else {
							$(document).trigger('folderMoveCancel');
						}
					}
				})
				.on('folderMoveEnd', function(e, $li) {
					$(this).trigger('folderMoveCancel');
					if(typeof isNotPub === 'undefined')
						$(this).trigger('folderMoveConfirm', {result:true, obj:$li});
				})
				.on('folderMoveConfirmExternal', function(e, param) {
					var $liTarget = $(param.target);
					var $liFolder = $(param.source);
					$liFolder.removeClass(param.sourceRemoveClass).addClass(param.sourceAddClass);

					$folderMoveMenu = $liFolder;
					$(document).trigger('folderMoveConfirm', {
						result: true,
						obj: $liTarget
					});
				})
				.on('folderMoveConfirm', function(e, param) {
					if(param.result) {
						var $li = $(param.obj);
						var $ul = $li.find('>ul');
						var $oriUl = $folderMoveMenu.parent();
						if($ul.length<1) {		//ul이 없을 때
							$ul = $('<ul></ul>').appendTo($li);
							$li.addClass('has-child').find('.item_menu').after('<a href="#none" class="item_menu menuClose">{0}</a>'.format(Alfresco.util.message('swp.com.label.folderOpenClose'))).remove();
						}
						$ul.append($folderMoveMenu);

						if($oriUl.find('>li').length<1) {
							$oriUl.parent().removeClass('has-child').find('.item_menu').after('<span class="item_menu">{0}</span>'.format(Alfresco.util.message('swp.com.label.noChildFoler'))).remove();
							$oriUl.remove();
						}

						resetFolderAppr($ul, $li.data('level')+1, $li.data('ell'));
						sortFolder($ul);
						setLiLast($ul);
						setLiLast($oriUl);
					}
				})
				.on('setFolderBasic', 'ul.folderMenu, ul.folderMenu ul', function(e) {
					var $folderMenu = $(this);

					var ellipsis = $folderMenu.attr('class').match(/text-ellipsis([0-9]*)/);
					var level = 1;
					if(!$folderMenu.hasClass('folderMenu')) {
						level = $($folderMenu.parents('li')[0]).data('level');
						if(typeof level !== 'undefined')
							level = level+1;
						else
							level = 1;
					}
					if(ellipsis) {
						setFolderBasic($folderMenu, level, ellipsis[1]);
					} else {
						setFolderBasic($folderMenu, level, null);
					}

					setLiLast($folderMenu);

					e.stopPropagation();
				})
				.on('setFolderMenu', 'ul.folderMenu', function(e) {
					var $folderMenu = $(this);
					if(!$folderMenu.data('init')) {
						$folderMenu.data('init', true).trigger('setFolderBasic');
					}

					e.stopPropagation();
				})
				.on('showMenu', 'ul.folderMenu', function(e, id) {
					var $menu = $(this).find('#'+id).parents('li.has-child');
					while($menu.length>0) {
						$menu.trigger('expand');
						$menu = $menu.parents('li.has-child');
					}

					e.stopPropagation();
				})
				.on('mousemove', function(e) {
					clearTimeout(folderMoveTimer);
					if(folderMove) {
						$folderMoveIcon.css({left: e.pageX+2, top: e.pageY+2});
					}
				})
				.on('mouseup', function() {
					$(this).trigger('folderMoveCancel');
				})
				.on('folderMoveCancel', function() {
					clearTimeout(folderMoveTimer);
					if(folderMove) {
						$folderMoveMenu.removeClass('move');
						$folderMoveIcon.remove();
						folderMove=false;
					}
				})
				.on('click', '.folderMenu .folderChk input[type="checkbox"]', function() {
					$(this).trigger('changed');
				})
				.on('changed', '.folderMenu .folderChk input[type="checkbox"]', function(e) {
					var $input = $(this);
					var li = $input.parents('li')[0];
					if($input.is(':checked')) {
						$('>ul>li>.menuDepth input[type="checkbox"]:not(:checked)', li).each(function() {
							this.checked=true;
						}).trigger('changed');
					} else {
						$('>ul>li>.menuDepth input[type="checkbox"]:checked', li).each(function() {
							this.checked=false;
						}).trigger('changed');
					}
					e.stopPropagation();
				})
				.on('changed', '.folderMenu .folderChk a._icoCalCate input[type="checkbox"]', function(e) {
					var $input = $(this);
					if($input.is(':checked')) {
						$input.parents('.icoCalCate').addClass('on');
					} else {
						$input.parents('.icoCalCate').removeClass('on');
					}

					e.stopPropagation();
				})
				.on('click', '.folderMenu .folderChk a._icoCalCate', function(e) {
					var $link = $(this);
					var $input = $link.find('input[type="checkbox"]');

					$input.each(function() {
						this.checked= !this.checked
					})

					$input.trigger('changed');

					e.preventDefault();
				})
				.on('sortFolder', '.folderMenu ul', function(e) {

					var $ul = $(this);
					console.log($ul);

					sortFolder($ul);
				});

				var folderMove = false;
				var folderMoveTimer = null;
				var $folderMoveIcon = null;
				var $folderMoveMenu = null;

		}
		/* 폴더 트리 세팅 */					, initFolderMenu: function initFolderMenu() {
			$(this).find('.folderMenu').trigger('setFolderMenu');
		}
		/* 메일, 문서 리스트 세팅 */			, initMailListOnce: function initMailListOnce() {
			var mailListMove = false;
			var $mailIcon = null;
			//var $mailList = $('.mailList, .docList, .boardList');
			var mailMoveTimer = null;
			$(document)
				.on('mousedown', 'ol.mailList>li', function(e) {
					var $obj = $(this);

					if(e.which==1) {
						clearTimeout(mailMoveTimer);
						mailMoveTimer = setTimeout(function() {
							$mailIcon = $('<span id="mailMoveIcon"></span>').css({left: e.pageX+1, top: e.pageY+1});
							$('body').append($mailIcon);
							mailListMove = true;
							$(document).trigger('itemMoveStart', $obj);

						}, 200);
						e.preventDefault();
						e.stopPropagation();
					}
				})
				.on('mousedown', 'ol.mailList .ov_layer a', function(e) {
					e.stopPropagation();
				})
				.on('mousemove', function(e) {
					if(mailListMove) {
						$mailIcon.css({left: e.pageX+1, top: e.pageY+1});
					} else {
						// SWPTEMP-461
						// 아래주석은 클릭후 바로 드래그시에도 드래그가 적용될 수 있도록 주석처리 합니다. by ykkim
						//clearTimeout(mailMoveTimer);
					}
				})
				.on('mouseup', function() {
					if(mailListMove) {
						$mailIcon.remove();
						$mailIcon=null;
						mailListMove = false;
					} else {
						clearTimeout(mailMoveTimer);
					}
				})
				.on('setItemCount', '#mailMoveIcon', function(e, count) {
					$(this).text(count);
				})
				.on('mousemove', 'ul.folderMenu li', function(e) {
					if(mailListMove) {
						var $li = $(e.originalEvent.target);
						if($li.prop('tagName')!=='LI')
							$li = $($li.parents('li')[0]);
						if($li.hasClass('item_droppable')) {
							$mailIcon.addClass('item_droppable');
						} else {
							$mailIcon.removeClass('item_droppable');
						}
					}
				})
				.on('mouseup', 'ul.folderMenu li', function(e) {
					var $obj = $(this);
					if(mailListMove) {
						$mailIcon.remove();
						$mailIcon=null;
						mailListMove = false;

						if($obj.hasClass('item_droppable')) {
							$(document).trigger('itemMoveEnd', $obj);
						}

					} else {
						clearTimeout(mailMoveTimer);
					}

					e.stopPropagation();
				})
				.on('mouseout', 'ul.folderMenu li', function() {
					if(mailListMove) {
						$mailIcon.removeClass('item_droppable');
					}
				});
		}
		/* 파일 업로드 세팅 */				, initFileUploadOnce: function initFileUploadOnce() {
			var getFileSize = function getFileSize(size) {
				if(size>=1000) {
					size = (size/1024).toFixed(2)+' MB';
				} else
					size = size.toFixed(2) + ' KB';

				return size;
			}

			$(document)

				.on('change', '.fileUploadBtn input[type="file"]', function(e) {
					var $file = $(this);
					var $btn = $file.parents('.fileUploadBtn');
					var $fileList = $('#'+$btn.data('target'));

					if(!$btn.data('noAuto')) {
						var getFileType = function(filename) {
							var extensions = {
								'hwp':'.hwp'
								, 'xls':'.xls|.xlsx'
								, 'ppt':'.ppt|.pptx'
								, 'doc':'.doc|.docx'
								, 'pdf':'.pdf'
								, 'img':'.png|.gif|.bmp|.jpg|.jpeg'
								, 'movie':'.mpg|.mpeg|.mp4|.avi|.wmv|.mkv'
								, 'psd':'.psd'
								, 'ai':'.ai'
							};
							var fileExt = filename.match(/\.[^.]+$/);

							if(fileExt) {
								for(var ext in extensions) {
									if(extensions.hasOwnProperty(ext) && extensions[ext].match(fileExt[0])) {
										return ext;
									}
								}
							}

							return 'etc';
						};

						if($btn.data('link'))
							$('#'+$btn.data('link')).trigger('show');

						if($fileList.length>0) {
							var time=new Date().getTime();
							var $template = $fileList.find('.template');
							var $item = $template.clone().appendTo($fileList).removeClass('template');
							var $pr = $item.find('.pr');
							var $size = $item.find('.size');
							var $fileName = $item.find('.filename');
							var size = $file[0].files[0].size/1024;
							if(size>1024) {
								size = (size/1024).toFixed(2)+' MB';
							} else
								size = size.toFixed(2) + ' KB';

							$pr.html('<input type="checkbox" name="checkFile" id="checkFile'+time+'" /><label for="checkFile'+time+'"><span class="icoDoc '+getFileType($file[0].files[0].name)+'">' + Alfresco.util.message('swp.com.label.excelDocument') + '</span>'+$file[0].files[0].name+'</label>');
							$size.html(size);
							$fileName.text($file[0].files[0].name);

							var $newFile=$file.appendTo($size).clone();
							$file.hide().attr('name', 'attachFile');
							$item.on('click', '.btn_del', function(e) {
								$(this).parents('.file').remove();
								$btn.trigger('decreaseFileCount');
								e.stopPropagation();
								e.preventDefault();
							});
							$newFile.appendTo($btn.trigger('increaseFileCount'));

							if($btn.parents('.lyBaseSet').length>0)
								$btn.parents('.lyBaseSet').hide();
						}
					}

					e.stopPropagation();
				})
				.on('addFile', '.fileUploadBtn', function(e, param) {
					var $btn = $(this);
					var $fileList = $('#'+$btn.data('target'));

					var $template = $fileList.find('.template');
					var $item = $template.clone().appendTo($fileList).removeClass('template');

					var $size = $item.find('.size');
					var $fileName = $item.find('.filename');

					var size=param['size'];

					$size.html(getFileSize(size));
					$fileName.text(param['fileName']);

					$item.on('click', '.btn_del', function(e) {
						$(this).parents('.file').remove();
						$btn.trigger('decreaseFileCount');
						e.stopPropagation();
						e.preventDefault();
					});


					e.stopPropagation();
				})
				.on('increaseFileCount', function() {
					var $btn = $(this);

					var $countHtml = $btn.data('countHtml');
					var count = $btn.data('count');

					if($countHtml && typeof count !== 'undefined') {
						$countHtml = $('#'+$countHtml);
						count = count+1;
						$countHtml.text(count);
						$btn.data('count', count);
					}
				})
				.on('decreaseFileCount', function() {
					var $btn = $(this);

					var $countHtml = $btn.data('countHtml');
					var count = $btn.data('count');

					if($countHtml && typeof count !== 'undefined') {
						$countHtml = $('#'+$countHtml);
						count = count-1;
						$countHtml.text(count);
						$btn.data('count', count);
					}
				})

				.on('change', '.btn-file input', function() {
					$(this).parents('.calUploadFile').find('.caFilename').val(this.value.replace(/^.*[\\\/]/, ''));
				});
		}
		/* 탭 세팅 */						, initTabOnce: function initTabOnce() {
			$(document)
				.on('click', 'ul.tabs>li, ul.pTabs>li', function(e) {
					var $current = $(this);
					var index = $current.index();
					var $panels = $current.parent().siblings('.panels');

					var cls = $current.attr('class').match(/tc[0-9]*/)[0];

					$current.addClass(cls+'-selected').siblings().removeClass(cls+'-selected');
					var $target = $panels.find('>.'+cls+'-panel:eq('+index+')');
					$target.addClass(cls+'-selected').siblings().removeClass(cls+'-selected');
					$target.find('.titleWrap').trigger('ellipsis', true);

					var $popCont = $current.parents('.popCont');
					if($popCont.length>0) {
						$popCont.trigger('reposition');
					}

					e.stopPropagation();
					//e.preventDefault();
				})
				.on('click', 'ul.tabs>li>a', function(e) {
					e.preventDefault();
				})
		}
		/* ScrollTop */						, initToTopOnce: function initToTopOnce() {
			$(document)
				.on('click', 'a.toTop, .toTop a', function(e) {
					var $link = $(this);
					$link.parents('.viewWrap').scrollTop(0);
					$(window).scrollTop(0);
					e.preventDefault();
				})
		}
		/* 이메일 주소, 태그 세팅 */			, initListEddressOnce: function initListEddressOnce() {
			var listEddressMove = false;
			var $listEddressMoveObj = null;
			var listEddressTimer = null;
			var $listEddressMoveIcon = null;
			var $listEddressEditing = null;

			var validateEmail = function(email) {
				var rx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if (rx.test(email)) return true;

				rx = /^[^<]*<(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))>$/;

				if (rx.test(email)) return true;

				rx = /^[^<]+<#[^>]+>$/

				return rx.test(email);
			}
			$.validateEmail = validateEmail;

			/*var autoCompleteFormat = {
				'email': {
					'person': '<li data-email-address="#organizationMember.person.displayName#<#organizationMember.person.email#>"><a href="#none"><strong>#organizationMember.person.displayName#</strong> #organizationMember.appellation.0.displayName#/#organizationMember.organization.displayName#/#organizationMember.organization.company.displayName#&lt;#organizationMember.person.email#&gt;</a></li>',
					'contact': '<li data-email-address="#displayName#<#email.0.email#>"><a href="#none"><strong>#displayName#</strong> #appellation.0#/#departmentName.0#/#companyName.0#&lt;#email.0.email#&gt;</a></li>',
					'history': '<li data-email-address="#displayName#<#address#>"><a href="#none"><strong>#displayName#</strong>&lt;#address#&gt;</a></li>'
				},
				'member': {
					'person': '<li data-email-address="#organizationMember.person.displayName#<#organizationMember.person.email#>" data-auth-name="#organizationMember.person.userId#" data-display-name="#organizationMember.person.displayName#"><a href="#none"><strong>#organizationMember.person.displayName#</strong> #organizationMember.appellation.0.displayName#/#organizationMember.organization.displayName#/#organizationMember.organization.company.displayName#&lt;#organizationMember.person.email#&gt;</a></li>'
				},
				'default': '<li data-email-address="#organizationMember.person.displayName#<#organizationMember.person.email#>"><a href="#none"><strong>#organizationMember.person.displayName#</strong> #organizationMember.appellation.0.displayName#/#organizationMember.organization.displayName#/#organizationMember.organization.company.displayName#</a></li>'
			}*/
			var autoCompleteFormat = {
				// 메일작성color: #999;

				'default': '<li data-email-address="#userName#<#email#>"><a href="#"><span class="jsAutoSearchText">#userName#</span> <span style="color: #0459c1 !important;">#jobTitle#</span> <span style=\"color: #999; !important;\">#companyName#</span> #deptName# <span class="jsAutoSearchText">#email#</span> <span class="jsAutoSearchText">#companyTelNum#</span></a></li>'
				, 'email': '<li data-email-address="#userName#<#email#>"><a href="#"><span class="jsAutoSearchText">#userName#</span> <span style="color: #0459c1 !important;">#jobTitle#</span> <span style=\"color: #999; !important;\">#companyName#</span> #deptName# <span class="jsAutoSearchText">#email#</span> <span class="jsAutoSearchText">#companyTelNum#</span></a></li>'
				, 'history': '<li data-email-address="#userName#<#email#>"><a href="#"><span class="jsAutoSearchText">#userName# </span><span class="jsAutoSearchText">#email#</span></li>'
			}

			var getAutoCompleteFormat = function(type) {
				type = type.toLowerCase();
				if(autoCompleteFormat[type]) {
					return autoCompleteFormat[type];
				} else {
					return autoCompleteFormat['default'];
				}
			}

			/**
			 * 속성이 넘어오지 않은 포멧을 기본 값으로 치환합니다.
			 */
			var _fillDefaultValue = function(str) {

				var _defaultObj = {
					displayName: ' - ',
					email: [{ email: ' - ' }],
					appellation: [ ' - ' ],
					departmentName: [ ' - ' ],
					companyName: [ ' - ' ],
					organizationMember: {
						person: {
							displayName: ' - ',
							email: ' - '
						},
						appellation: [{
							displayName: ' - '
						}],
						organization: {
							displayName: ' - '
						}
					}
				};

				return str.formatX(_defaultObj);
			};

			/*
			 $listEddress.each(function(idx) {
			 $(this).data('idx', idx).parent().attr('tabindex', 0);
			 var autoComplete = $listEddress.data('autoComplete');
			 if(autoComplete)
			 $('#'+autoComplete).on('click', '*', function(e) {
			 e.stopPropagation();
			 });

			 });
			 $listEddress.parent().on('focus', function() {
			 $(this).find('.list_eddress').trigger('addItem');
			 });
			 */


			function parseEmailAddress(email) {

				var rx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if (rx.test(email)) {
					return {
						inputValue: email,
						displayName: email,
						email: email
					};
				}

				rx = /^([^<]*)<(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))>$/;

				var emailToken = email.match(rx)
				if (emailToken) {
					var inputValue = email;
					var emailAddr = emailToken[2] + '@' + emailToken[6];
					var displayName = emailToken[1].trim();
					if (displayName.length == 0) {
						inputValue = emailAddr;
						displayName = emailAddr;
					}

					return {
						inputValue: inputValue,
						displayName: displayName,
						email: emailAddr
					};
				}

				rx = /^([^<]+)<(#[^>]+)>$/;
				var orgToken = email.match(rx);
				if (orgToken) {
					console.log(emailToken);
					var inputValue = email;
					var emailAddr = orgToken[2];
					var displayName= orgToken[1];

					return {
						inputValue: inputValue,
						displayName: displayName,
						email: emailAddr
					};
				}

				return null;
			}
			$.parseEmailAddress = parseEmailAddress;

			$(document)
				.on('click', '.list_eddress', function() {
					var $this = $(this);
					if($this.hasClass("jsStopInput") == true) {
						return;
					} else {
						$(this).trigger('addItem');
						$(this).parent().addClass('itemExist');
					}
				})
				.on('blur', '.list_eddress input', function() {
					var $input = $(this);
					var $listEddress = $input.parents('.list_eddress');
					var autoComplete = $listEddress.data('autoComplete');
					var $autoComplete = $('#' + autoComplete);

					var _blurTimer = setTimeout(function() {
						_blurTimer = null;
						$autoComplete.find('ul').unbind('scroll');
						$input.parents('li.editing').trigger('editEnd');
					}, 500);

					$autoComplete.find('ul').bind('scroll', function(e) {
						if (_blurTimer) {
							clearTimeout(_blurTimer);
							$input.focus();
						}
					});
				})
				.on('keydown', '.list_eddress input', function(e) {
					var $listEddress = $(this).parents('.list_eddress');

					if(e.keyCode==8) {			//Backspace
						if($(this).val().length==0) {
							$(this).parents('li').prev(':not(.template)').remove();
						}
					} else if(e.keyCode == 9 ) {	//Tab
						// SWPTEMP-480
						var $listEddress = $(this).parents('.list_eddress');
						var $listEddressAll = $('.list_eddress:visible');
						var _index = $listEddressAll.index($listEddress);

						if (_index > -1 && _index != $listEddressAll.length - 1) {
							var $nextListEddress = $listEddressAll.eq(_index + 1);
							setTimeout(function() {
								$nextListEddress.trigger('click');
							}, 200);
						} else {
							var $tr = $(this).parents('tr');
							var $next = $tr.next();

							while ($next.length > 0) {
								if ($next.find('input:text:visible').length > 0) {
									var $nextInput = $next.find('input:text:visible').first();
									setTimeout(function() {
										$nextInput.focus();
									}, 200);
									break;
								}
								$next = $next.next();
							}
						}
						$(this).parents('li').trigger('editEnd');
					} else if( e.keyCode==186 || (!e.shiftKey && e.keyCode==188) || e.keyCode==9 || (e.keyCode==13 && !$listEddress.data('autoCompleteShow')) ) {	//Space, ;, Tab
						// , semicolon(186), comma(188), tab(9), enter(13)
						if($(this).val().length != 0) {
							$(this).parents('li').trigger('editEnd').parents('.list_eddress').trigger('addItem');
						}
						e.preventDefault();
					}
				})
				.on('keyup', '.list_eddress input', function(e) {
					var $listEddress = $(this).parents('.list_eddress');
					var autoComplete = $listEddress.data('autoComplete');
					var $autoComplete = null;
					var $over = null;
					var $ul = null;
					var index = 0;

					if(autoComplete && e.keyCode != 38 && e.keyCode !=40 && e.keyCode!=13) {
						if($(this).val().length > 0) {
							$listEddress.trigger('beforeShowAutoComplete', { text: $(this).val() });
						} else {
							$listEddress.trigger('hideAutoComplete');
						}
					}

					if(e.keyCode == 13 || e.keyCode==32) { //Enter, space bar(32)
						if($listEddress.data('autoCompleteShow')) {
							$autoComplete = $('#' + autoComplete);
							$over = $autoComplete.find('li.over');
							var email = $over.data('emailAddress');
							var text = email;
							if(typeof email==='undefined')
								email = '';

							var _authName = $over.data('authName');
							var _dpName = $over.data('displayName');

							$(this).parents('li').trigger('editEnd', {
								email:email,
								text:text,
								authName: _authName,
								dpName: _dpName
							});
							$listEddress.trigger('addItem');
						}
					} else if(e.keyCode == 37) {	//left

					} else if(e.keyCode == 38) {	//up
						if($listEddress.data('autoCompleteShow')) {
							$autoComplete = $('#' + autoComplete);
							$over = $autoComplete.find('li.over');
							$ul = $over.parent();
							if($over.length > 0) {
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
					} else if(e.keyCode == 39) {	//right

					} else if(e.keyCode == 40) {	//down
						if($listEddress.data('autoCompleteShow')) {
							$autoComplete = $('#' + autoComplete);
							$over = $autoComplete.find('li.over');
							$ul = $over.parent();
							if($over.length < 1) {
								$autoComplete.find('li:first').addClass('over');
							} else {
								var _liHeight = $over.height();
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
					}
				})
				.on('beforeShowAutoComplete', '.list_eddress', function(e, o) {

					var $listEddress = $(this);

					var _text = o.text;
					if (_text.length == 0 || _text === $listEddress.data('autoCompleteText')) {
						return;
					}
					$listEddress.data('autoCompleteText', _text);

					var _autoCompleteJqXHR = $listEddress.data('autoCompleteJqXHR');
					if (_autoCompleteJqXHR) {
						_autoCompleteJqXHR.abort();
					}

					$listEddress.trigger('loadShowAutoComplete', o);

				})
				.on('loadShowAutoComplete', '.list_eddress', function(e, o) {

					var $listEddress = $(this);
					var _text = o.text;

					var _url = $listEddress.data('autoCompleteUrl') || "/share/proxy/alfresco/org/v1/autoComplete/mailLiveSearchList";
					var _jqXHR = $.getJSON(_url, {
						companyCode : SmartRunner.constants.SR_COMPCODE
						, sr_schema : SmartRunner.constants.SR_SCHEMA
						, keyword : _text
					}, function(data) {
						$listEddress.removeData('autoCompleteJqXHR');
						var _contentList = data;
						if (_contentList.length == 0) {
							$listEddress.trigger('hideAutoComplete');
							return;
						}

						var _autoComplete = $listEddress.data('autoComplete');
						if(_autoComplete) {
							var $autoComplete = $('#' + _autoComplete);
							var $ul = $autoComplete.find('ul');

							$ul.empty();

							var _autoCompleteType = $listEddress.data('autoCompleteType');
							for (i = 0; i < _contentList.length; i++) {
								var _contact = _contentList[i];
								if(_autoCompleteType == "email") {
									if(_contact.dataType) {
										_autoCompleteType = _contact.dataType;
									}
								}
								console.log(_autoCompleteType);

								var _autoCompleteFormat = getAutoCompleteFormat(_autoCompleteType);
								var appendableHTML = _autoCompleteFormat.formatX(_contact);

								appendableHTML = _fillDefaultValue(appendableHTML);
								var $item = $(appendableHTML);
								$item.find(".jsAutoSearchText").each(function() {
									if(this.innerHTML.indexOf(_text) > -1) {
										var html = this.innerHTML.replace(_text, "<span style=\"text-decoration: underline;\">" + _text + "</span>");
										this.innerHTML = html
									}
								});
								$ul.append($item);
							}
							$listEddress.trigger('showAutoComplete');
						}
					});
					$listEddress.data('autoCompleteJqXHR', _jqXHR);

				})
				.on('showAutoComplete', '.list_eddress', function() {
					var $listEddress = $(this);
					var autoComplete = $(this).data('autoComplete');
					if(autoComplete) {
						var $autoComplete = $('#' + autoComplete);
						var height = $listEddress.outerHeight();
						$autoComplete.css({top:height}).show();
						$listEddress.data('autoCompleteShow', true);

						var $ul = $autoComplete.find('ul');
						$ul.each(function() {
							$(this).find('li:first').addClass('over').siblings().removeClass('over');
						});
						$ul.scrollTop(0);
						if(!$autoComplete.data('init')) {
							$autoComplete.data('init', true);
							$autoComplete.on('click', 'ul a', function(e) {
								var $li = $(this).parents('li');
								var email = $li.data('emailAddress');
								var text = email;

								var _authName = $li.data('authName');
								var _dpName = $li.data('displayName');

								$listEddress.find('.current').trigger('editEnd', {
									email: email,
									text: text,
									authName: _authName,
									dpName: _dpName,
									object:$li
								});
								$listEddress.trigger('addItem');

								e.preventDefault();
							});
						}
					}

				})
				.on('hideAutoComplete', '.list_eddress', function() {
					var $listEddress = $(this);
					var autoComplete = $(this).data('autoComplete');
					if(autoComplete) {
						$('#'+autoComplete).hide();
						$listEddress.data('autoCompleteShow', false);
					}

					var _autoCompleteJqXHR = $listEddress.data('autoCompleteJqXHR');
					if (_autoCompleteJqXHR) {
						_autoCompleteJqXHR.abort();
						$listEddress.removeData('autoCompleteJqXHR');
					}
				})
				.on('editStart', '.list_eddress>li', function() {
					if ($(this).find('input[name=email][data-no-edit=true]').length == 0) {
						$(this)
							.addClass('editing current')
							.siblings().removeClass('current')
							.filter('.editing:not(.template)').trigger('editEnd');

						new beta.fix($(this).find('input'));
						$(this).find('input')
							.attr('autocomplete', 'off')
							.focus();
					}
				})
				.on('editEnd', '.list_eddress>li', function(e, param) {
					var $li = $(this);
					if($li.hasClass('editing')) {
						var $listEddress = $li.parents('.list_eddress');
						var $input = $li.find('input');

						var _autoCompleteType = $listEddress.data('autoCompleteType');

						if (_autoCompleteType == 'member') {

							if ($input.val().length == 0)
								$li.remove();

							$li.removeClass('editing');
							if (typeof param === 'undefined' || typeof param.authName == 'undefined' || typeof param.dpName == 'undefined') {
								$li.find('.eddrView').text($input.val()).attr('title', '올바르지 않은 사용자');
								$li.addClass('invalid');
							} else {
								var $before = $listEddress.find('li[data-person-id="{0}"]'.format(param.authName));
								if ($before.length > 0) {
									$li.find('.eddrView').text(param.dpName + '(중복)').attr('title', '중복된 사용자');
									$li.addClass('invalid');
								} else {
									$li.attr('data-person-id', param.authName);
									$li.find('.eddrView').text(param.dpName).attr('title', param.dpName);
									$(this).find('input').attr('value', param.authName).val(param.authName);
								}

							}

							$listEddress.trigger('listChanged', param);

						} else {
							// 자동완성 타입이 member 가 아닌 경우 or email 의 경우
							if (param) {
								$input.val(param.email);
							}
							var val = $input.val().replace(/\s/g, "");
							var _splitDatas = val.split(',').join(';').split(';');
							if (_splitDatas.length > 1) {
								val = _splitDatas[0];
							}

							if (val.length != 0 || typeof param !== 'undefined') {
								var email = !param ? val : param.text;
								var emailToken = parseEmailAddress(email);

								if (!$input.data('noEdit')) {
									$li.find('.eddrView').text(emailToken != null ? emailToken.displayName : email);
								}

								$li.removeClass('editing');
								if ($li.parent().data('email') && !validateEmail(val)) {
									$li.addClass('invalid')
								} else {
									$li.removeClass('invalid');
								}

								$listEddress.trigger('listChanged', param);	//변경 이벤트 발생

								$(this).find('input')
									.attr('value', emailToken != null ? emailToken.inputValue : email)
									.val(emailToken != null ? emailToken.inputValue : email);
							} else {
								$li.remove();
							}

							if($listEddress.find('li:not(.template)').length > 0)
								$listEddress.parent().addClass('itemExist');
							else
								$listEddress.parent().removeClass('itemExist');

							if (_splitDatas.length > 1) {
								for (var i = 1; i < _splitDatas.length; i++) {
									var _data = _splitDatas[i];
									$listEddress.trigger('addItemCustom', [_data]);
								}
							}
						}

						$listEddress.trigger('hideAutoComplete');
					}
				})
				.on('click', '.list_eddress .btn_edit', function(e) {
					$(this).parents('li').trigger('editStart');
					e.stopPropagation();
					e.preventDefault();
				})
				.on('click', '.list_eddress .btn_del', function(e) {
					var $listEddress = $(this).parents('.list_eddress');
					$(this).parents('li').remove();

					if($listEddress.find('li:not(.template)').length>0)
						$listEddress.parent().addClass('itemExist');
					else
						$listEddress.parent().removeClass('itemExist');

					$listEddress.trigger('hideAutoComplete');

					$listEddress.trigger('listChanged');	//변경 이벤트 발생

					e.stopPropagation();
					e.preventDefault();
				})
				.on('click', '.list_eddress>li', function(e) {
					e.stopPropagation();
				})
				.on('focus', '.list_eddress input, a', function(e) {
					e.stopPropagation();
				})
				.on('addItem', '.list_eddress', function() {
					var $list = $(this);
					if($list.find('li.editing').length < 1) {
						var inputName = $(this).data('inputName');
						var inputMax = $(this).data('inputMax');
						inputName = inputName ? inputName : 'item';
						if (typeof inputMax === 'undefined' || inputMax > $(this).find('li:not(.template)').length) {
							var $item = $list.find('.template').clone().removeClass('template').appendTo($list);
							$item.find("input").attr('name', inputName);
							$item.trigger('editStart');
						}
					} else {
						$list.find('li.editing input').focus();
					}

				})
				.on('addItemCustom', '.list_eddress', function(e, data) {

					if (data.trim().length == 0) return;

					var _emailToken = parseEmailAddress(data);

					//var _name = _emailToken ? _emailToken.inputValue : data;
					var _name = _emailToken ? _emailToken.displayName : data;
					//var _email = _emailToken ? _emailToken.displayName || _emailToken.email : data;
					var _email = "";
					if(_emailToken) {
						if(_emailToken.inputValue) {
							_email = _emailToken.inputValue;
						} else {
							_email = _emailToken.email;
						}
					} else {
						_email = data;
					}

					var $listEddress = $(this);

					var inputName = $(this).data('inputName');
					var inputMax = $(this).data('inputMax');
					inputName = inputName ? inputName : 'item';
					if (typeof inputMax === 'undefined' || inputMax > $(this).find('li:not(.template)').length) {
						var $item = $listEddress.find('.template').clone().removeClass('template').appendTo($listEddress);
						$item.find("input").attr('name', inputName);

						if (!_emailToken) {
							$item.addClass('invalid')
						}

						$item.find('.eddrView').text(_name);
						$item.find('.eddrInput > :text').val(_email);
					}

				})
				.on('mousedown', '.list_eddress>li:not(.editing)', function(e) {
					var $li = $(this);
					if($li.hasClass("jsDontMove") == true) {
						return;
					}

					var $selected = $li.siblings('.selected');
					$li.addClass('selected');

					if(!e.shiftKey && $selected.length>0) {
						$selected.removeClass('selected');
					}

					if($li.parent().data('email')) {
						listEddressTimer=setTimeout(function() {
							$selected.addClass('selected');
							var iconText = $li.find('.eddrView').text();
							$listEddressMoveObj= $li;
							if($selected.length>0) {
								$listEddressMoveObj= $li.parent().find('li.selected');
								iconText = $listEddressMoveObj.length;
							}
							$listEddressMoveObj.addClass('free');
							$listEddressMoveIcon = $('<span id="addressMoveIcon"><span class="icon"></span>'+iconText+'</span>').appendTo('body').css({left:e.pageX+1, top: e.pageY+1});
							listEddressMove=true;
						}, 200);
					}

					e.preventDefault();
				})
				.on('dblclick', '.list_eddress>li:not(.editing)', function() {
					var $li = $(this);
					$li.find('.btn_edit').trigger('click');
				})
				.on('mouseup', '.list_eddress', function(e) {
					if(listEddressMove && $(this).data('email')) {
						listEddressMove=false;
						$listEddressMoveIcon.remove();
						$(this).append($listEddressMoveObj.removeClass('free').removeClass('selected')).find('.editing').remove();
						var inputName = $(this).data('inputName');
						inputName = inputName ? inputName : 'item';
						$listEddressMoveObj.find('input').attr('name', inputName);

						e.stopPropagation();
					} else {
						clearTimeout(listEddressTimer);
					}
				})
				.on('mousemove', function(e) {
					if(listEddressMove) {
						$listEddressMoveIcon.css({left:e.pageX+1, top: e.pageY+1});
						e.preventDefault();
					} else {
						clearTimeout(listEddressTimer);
					}
				})
				.on('mouseup', function() {
					if(listEddressMove) {
						listEddressMove=false;
						$listEddressMoveIcon.remove();
						$listEddressMoveObj.removeClass('free');
					}
				});
				/*
				.on('keydown', function(e) {
					if(e.keyCode==46) {

					}
				});
				*/
		}
		/* 조직도 자동완성 필드 */				, initOrgAutoCompleteOnce: function initOrgAutoCompleteOnce() {

			$(document)
				.on('blur', '.org_autocomplete input', function() {

					var $input = $(this);
					var $orgAutoComplete = $input.parents('.org_autocomplete');

					var _autoComplete = $orgAutoComplete.data('autoComplete');
					var $autoComplete = $('#' + _autoComplete);

					var _blurTimer = setTimeout(function() {
						_blurTimer = null;
						$autoComplete.find('ul').unbind('scroll');
						$input.parents('li.editing').trigger('editEnd');
					}, 500);

					$autoComplete.find('ul').bind('scroll', function(e) {
						if (_blurTimer) {
							clearTimeout(_blurTimer);
							$input.focus();
						}
					});
				})
				.on('keyup', '.org_autocomplete input', function(e) {

					var $input = $(this);
					var $orgAutoComplete = $input.parents('.org_autocomplete');
					var $over = null;

					var _autoComplete = $orgAutoComplete.data('autoComplete');

					if(_autoComplete && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
						if($input.val().length > 0) {
							$input.trigger('beforeShowAutoComplete', { text: $input.val() });
						} else {
							$input.trigger('hideAutoComplete');
						}
					}

					if (e.keyCode == 13) { //Enter
						if ($orgAutoComplete.data('autoCompleteShow')) {
							$autoComplete = $('#' + _autoComplete);
							$over = $autoComplete.find('ul:not(.template) li.over:visible');
							if ($over.length > 0) {
								var _uuid = $over.data('uuid');
								var _userId = $over.data('userId');
								var _name = $over.data('displayName');
								$orgAutoComplete.trigger('addItem', [ _uuid, _userId, _name ]);
							}
						}
					} else if (e.keyCode == 38) {	//up
						if ($orgAutoComplete.data('autoCompleteShow')) {
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
						if($orgAutoComplete.data('autoCompleteShow')) {
							$autoComplete = $('#' + _autoComplete);
							$over = $autoComplete.find('li.over');
							$ul = $over.parent();
							if ($over.length < 1) {
								$autoComplete.find('li:first').addClass('over');
							} else {
								var _liHeight = $over.height();
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
					}
				})
				.on('beforeShowAutoComplete', '.org_autocomplete', function(e, o) {

					var $orgAutoComplete = $(this);

					var _text = o.text;
					if (_text.length == 0 || _text === $orgAutoComplete.data('autoCompleteText')) {
						return;
					}
					$orgAutoComplete.data('autoCompleteText', _text);

					var _autoCompleteJqXHR = $orgAutoComplete.data('autoCompleteJqXHR');
					if (_autoCompleteJqXHR) {
						_autoCompleteJqXHR.abort();
					}

					$orgAutoComplete.trigger('loadShowAutoComplete', o);

				})
				.on('loadShowAutoComplete', '.org_autocomplete', function(e, o) {

					var $orgAutoComplete = $(this);
					var _text = o.text;

					var _jqXHR = $.getJSON('/share/proxy/alfresco/org/v1/autoComplete/org', {
						page : 1
						, pagePerCount : 10
						, sortField : 'name'
						, sortOrder : 'ASC'
						, searchField : 'all'
						, keyword : _text
					}, function(data) {
						$orgAutoComplete.removeData('autoCompleteJqXHR');

						var _contentList = data.search.contentList;
						if (_contentList.length == 0) {
							$orgAutoComplete.trigger('hideAutoComplete');
							return;
						}

						var _autoComplete = $orgAutoComplete.data('autoComplete');
						if(_autoComplete) {
							var $autoComplete = $('#' + _autoComplete);
							var $ul = $autoComplete.find('ul:not(.template)');

							$ul.empty();

							var $newUl = $autoComplete.find('ul.template li.template').clone().removeClass('template');
							var _templateHTML = $newUl[0].outerHTML;

							var _autoCompleteType = $orgAutoComplete.data('autoCompleteType');
							for (i = 0; i < _contentList.length; i++) {
								var _contact = _contentList[i];
								$ul.append(_templateHTML.formatX(_contact));
							}
							$orgAutoComplete.trigger('showAutoComplete');
						}
					});
					$orgAutoComplete.data('autoCompleteJqXHR', _jqXHR);
				})
				.on('showAutoComplete', '.org_autocomplete', function() {

					var $orgAutoComplete = $(this);
					var _autoComplete = $orgAutoComplete.data('autoComplete');

					if(_autoComplete) {
						var $autoComplete = $('#' + _autoComplete);
						var _height = $orgAutoComplete.outerHeight();
						$autoComplete.css({ top:_height }).show();
						$orgAutoComplete.data('autoCompleteShow', true);

						var $ul = $autoComplete.find('ul:not(.template)');
						$ul.find('li:first').addClass('over').siblings().removeClass('over');

						$ul.scrollTop(0);
						if(!$autoComplete.data('init')) {
							$autoComplete.data('init', true);
							$autoComplete.on('click', 'ul a', function(e) {
								var $li = $(this).parents('li');
								var _uuid = $li.data('uuid');
								var _userId = $li.data('userId');
								var _name = $li.data('displayName');
								$orgAutoComplete.trigger('addItem', [ _uuid, _userId, _name ]);
								e.preventDefault();
							});
						}
					}
				})
				.on('hideAutoComplete', '.org_autocomplete', function() {

					var $orgAutoComplete = $(this);
					var _autoComplete = $orgAutoComplete.data('autoComplete');

					if (_autoComplete) {
						$('#' + _autoComplete).hide();
						$orgAutoComplete.data('autoCompleteShow', false);
					}

					var _autoCompleteJqXHR = $orgAutoComplete.data('autoCompleteJqXHR');
					if (_autoCompleteJqXHR) {
						_autoCompleteJqXHR.abort();
						$orgAutoComplete.removeData('autoCompleteJqXHR');
					}
				})
				.on('addItem', '.org_autocomplete', function() {

					var $orgAutoComplete = $(this);
					var $input = $orgAutoComplete.find('input');
					$input.val('');

					$orgAutoComplete.trigger('hideAutoComplete');

				});
		}
		/* 설문 세팅 */						, initJsSurveyOnce: function initJsSurveyOnce() {
			var surveyCount = 1;

			$(document)
				.on('click', 'div.jsSurvey .addSurvey', function(e) {
					var $jsSurvey = $(this).parents('div.jsSurvey');
					var $addSurveySel = $jsSurvey.find('select.addSurveySel');
					var $template = $jsSurvey.find('div.template');
					var $itemTemplate = $template.find('>.type'+$addSurveySel.val());
					var $list = $jsSurvey.find('ul.surveyList');
					var $item = $('<li></li>').html($itemTemplate.html());
					$item.find('textarea[placeholder]').val('');

					$list.append($item);

					$item.find('.jsTextCount').each(function() {
						var $target= $item.find($(this).data('count'));
						$target.attr('id', 'surveyCount'+surveyCount);
						$(this).data('count', '#surveyCount'+(surveyCount++));
					});

					e.preventDefault();
				})
				.on('change', 'div.jsSurvey select.suItemMeasureNum', function() {
					var num = $(this).val();
					var $tr = $(this).parents('tr');

					$tr.find('.scaleType > div').hide().filter('.scaleType'+num).show();;
				})
				.on('change', 'div.jsSurvey select.suItemNum', function () {
					var num = $(this).val();
					var $tr = $(this).parents('tr');
					var $suItemList = $tr.find('ul.suItemList');
					var $li = $suItemList.find('>li');
					var $suItemEtc = $tr.find('input.suItemEtc');

					$li.hide();
					$li.filter(':lt('+num+')').show().find('input').each(function() {
						$(this).attr('disabled', false);
						if($(this).val() == Alfresco.util.message('swp.com.label.etc'))
							$(this).val('');
					});
					if($suItemEtc.is(':checked')) {
						$li.filter(':lt('+num+'):last').find('input:text').val(Alfresco.util.message('swp.com.label.etc')).attr('disabled', true);
					}
				})
				.on('click', 'div.jsSurvey .suItemEtc', function() {
					var $input = $(this);
					var $tr = $(this).parents('tr');
					var $suItemList = $tr.find('ul.suItemList');
					var $li = $suItemList.find('>li');
					var $lastInput = $li.filter(':visible:last').find('input:text');
					if($input.is(':checked')) {
						$lastInput.val(Alfresco.util.message('swp.com.label.etc')).attr('disabled', true);
					} else if($lastInput.val() == Alfresco.util.message('swp.com.label.etc')) {
						$lastInput.val('').attr('disabled', false);
					}
				})
				.on('click', 'div.jsSurvey .surveyList .btnCls', function(e) {
					var $item = $(this).parents('li');
					$($item).remove();
					e.preventDefault();
				})
				.on('click', 'div.jsSurvey .surveyList .btnTop', function(e) {
					var $item = $(this).parents('li');
					var $prev = $item.prev();
					if($prev.length>0) {
						$prev.before($item);
					}
					e.preventDefault();
				})
				.on('click', 'div.jsSurvey .surveyList .btnBtm', function(e) {
					var $item = $(this).parents('li');
					var $next = $item.next();
					if($next.length>0) {
						$next.after($item);
					}
					e.preventDefault();
				})
				.on('click', 'div.jsSurvey .grpSuList .icoDelete', function(e) {
					var $item = $(this).parents('li');
					$item.remove();
					e.preventDefault();
				})
				.on('click', 'div.jsSurvey input.isPublic', function() {
					var val=$(this).val();
					var $target= $('.isPublicItem');
					if(val==1) {
						$target.find('input, select, textarea').attr('disabled', false);
					} else {
						$target.find('input, select, textarea').attr('disabled', true);
					}
				})
		}
		/* layer 세팅 */						, initLayerOnce: function initLayerOnce() {
			$(document)
				.on('click', 'a.jsLayer', function(e) {
					var $link = $(this);
					var show = $link.data('show');

					if(typeof show === 'undefined') {
						$link.data('show', show=false);
					}

					if(!$link.data('hover')) {
						if(show) {
							$link.trigger('hide');
						} else {
							if(!$link.hasClass('jsLayerNoHide'))
								$('a.jsLayer').trigger('hide');
							$link.trigger('show');
						}

						e.preventDefault();
						e.stopPropagation();
					}
				})
				.on('mouseenter', 'a.jsLayer', function(e) {
					var $link = $(this);
					var show = $link.data('show');

					if(typeof show === 'undefined') {
						$link.data('show', show=false);
					}

					if($link.data('hover')) {
						$link.trigger('show', {mouse:e});

						if($link.data('hoverWrap')) {
							var $hoverWrap = $($link.data('hoverWrap'));
							if(!$hoverWrap.data('initHoverWrap')) {
								$hoverWrap.data('initHoverWrap', true);
								$hoverWrap.on('mouseleave', function() {
									$link.trigger('hide');
								})
							}
						}
					} else if($link.data('tooltip')) {
						$('a.jsLayer').trigger('hide');
						$link.trigger('show', {mouse:e});
					}
				})
				.on('mouseleave', 'a.jsLayer', function() {
					var $link = $(this);

					if($link.data('tooltip')) {
						$link.trigger('hide');
					}
				})
				.on('show', 'a.jsLayer', function(e, param) {
					var $link = $(this);
					var $target = $($link.data('target'));

					$link.removeClass('Down').addClass('Up');
					if($target.length>0) {
						$target.trigger('beforeLayerShow', {link:$link});
						$target.show();
						if($link.data('position')) {
							var $parent = $target.parent();
							while($parent.css('position') !== 'absolute' && $parent.css('position') !== 'relative' && $parent.css('position') !=='fixed') {
								$parent = $parent.parent();
							}
							var linkOffset = $link.offset();
							var parentOffset = $parent.offset();
							var currentOffset = {top:0, left:0};
							currentOffset.top = $link.data('offsetTop');
							if(!currentOffset.top) currentOffset.top=0;
							currentOffset.left = $link.data('offsetLeft');
							if(!currentOffset.left) currentOffset.left=0;

							var top = linkOffset.top-parentOffset.top+currentOffset.top;
							var left = linkOffset.left-parentOffset.left+currentOffset.left;

							if($link.data('tooltip')) {
								var height = $target.outerHeight();
								var parentHeight = $parent.outerHeight();
								if(height+top > parentHeight) {
									top = parentHeight-height;
									left = param.mouse.pageX;
								}
							}

							$target.css({top:top, left:left});
						}

					}

					$link.data('show', true);

				})
				.on('beforeLayerShow', 'div[data-wscomponent]', function(e, o) {

					var $layer = $(this);
					var _wscomponent = $layer.data('wscomponent');

					$layer.appendDynamicWebScript({
						url: _wscomponent,
						beforeAppend: function (params) {
							$layer.empty();
						},
						afterAppend: function (params) {
							$layer.dwUI();
						}
					});
				})
				.on('hide', 'a.jsLayer', function() {
					var $link = $(this);
					var $target = $($link.data('target'));

					$link.removeClass('Up').addClass('Down');
					if($target.length>0) {
						$target.hide();
					}

					$link.data('show', false);
				})
				.on('click', function(e) {
					if((e.originalEvent && !$(e.originalEvent.target).hasClass('jsLayerNoHide')) || !$(e.target).hasClass('jsLayerNoHide')) {
						$('a.jsLayer').trigger('hide');
					}
				})
				.on('click', '#dcSrchPosition02', function(e) {
					$('#docSrchPosSelectLayer').show();

					//e.preventDefault();
				})
				.on('mouseenter', '.tooltip .ov_menu', function() {
					$(this).next().show();
				})
				.on('mouseleave', '.tooltip, .tooltip .ov_layer', function() {		// Presence layer (공통)
					$('.tooltip .ov_layer').hide();
				})
				.on('click', '#boardViewMenu a', function(e) {
					var $link = $(this);
					var $boardViewBtn = $('#boardViewBtn');
					$boardViewBtn.text($link.text());

					e.preventDefault();
				})
				/*
				.on('click', '.btnAdres a', function(e) {
					if($(this).parents('.btnAdres').next().css("display") == "block"){
						$(this).parents('.btnAdres').next().hide();
					}else{
						$(".adrsAdd_box").hide();
						$(this).parents('.btnAdres').next().show();
					}

					e.preventDefault();
				})
				*/
				.on('click', '.adrsAdd_box .btn_gClose a', function(e) {
					$(this).parent().parent().parent().hide();

					e.preventDefault();
				})

				.on('mouseover', '.lyBaseSet li .file', function() { // jhk 추가 file layer
					$(this).parent('li').addClass('on');
				})
				.on('mouseout', '.lyBaseSet li .file', function() { // jhk 추가 file layer
					$(this).parent('li').removeClass('on');
				})

				/* 위치값 설정 삭제
				.on('click', '.buttonSet a', function(e) {
					var $link = $(this);
					var thisposx = $link.offset();
					var winW = Class.winWidth;
					var wrapW = 0;
					var wwmargin = 0;
					if($("#wrap").length == 1){
						var $target = $($link.data('target'));
						if($target.length<1)
							$target= $link.parent().next()
						var offset = $target.offset();
						var left = parseInt($target.css('left'), 10);
						$target.css({left:thisposx.left-offset.left+left - 3});
					}else{ // 추가 jhk
						wrapW = $('#winpop_wrap').width();
						wwmargin = (winW - wrapW) / 2;
						$(this).next('.lyBaseSet').css('left', thisposx.left - wwmargin - 26);
						$(this).parent().siblings('.lyBaseSet').css('left', thisposx.left - wwmargin - 34);
					}

					e.preventDefault();
				})
				.on('click', '.layoutSelect a, .layoutSelect input, .layoutSelect button', function (e) {
					var thisposx = $(this).offset();
					var winW = $(window).width();
					var wrapW = $('#wrap').width();
					var wwmargin = (winW - wrapW) / 2;

					$(this).next('.lyBaseSet').css({
						left: thisposx.left - 243 - wwmargin,
						top: thisposx.top - 142
					});
					$(this).parent().siblings('.lyBaseSet').css({
						left: thisposx.left - 243 - wwmargin,
						top: thisposx.top - 142
					});

					e.preventDefault
				});
				위치값 설정 삭제 */
		}
		/* showHide 세팅 */					, initJsShowHideOnce: function initJsShowHideOnce() {
			$(document)
				.on('click', '.jsShowHide', function(e) {
					var $anchor = $(this);
					var target = $anchor.attr('href').split('#')[1];
					var $target= $('#'+target);

					if($anchor.data('show')) {
						$anchor.data('show', false).removeClass('Up on').addClass('Down');
						$target.hide();
					} else {
						$anchor.data('show', true).removeClass('Down').addClass('Up on');
						$target.show();
					}

					var $popCont = $target.parents('.popCont');
					if($popCont.length>0) {
						$popCont.trigger('reposition');
					}

					e.preventDefault();
				})
				.on('click', '.btnShow, .btnShowHide', function(e) {
					var $anchor = $(this);
					var target = '#'+$anchor.attr("href").split('#')[1];
					var $target = $(target);

					if ($anchor.hasClass('on')) {
						$anchor.removeClass('on').addClass('off').text(Alfresco.util.message('swp.com.label.hide'));
						$anchor.parent('.popTabcontrol').removeClass('on');
						$target.show();
					} else {
						$anchor.removeClass('off').addClass('on').text(Alfresco.util.message('swp.com.label.view'));
						$anchor.parent('.popTabcontrol').addClass('on');
						$target.hide();
					}

					var $popCont = $target.parents('.popCont');
					if($popCont.length>0) {
						$popCont.trigger('reposition');
					}

					e.preventDefault();
				})
				.on('mouseover', '.icoHelp', function() {
					//by ykkim at 2015-06-11
					//$(this).siblings('.helpWrap').show();
					//show 로 할 경우, help block 이 inline 으로 형성되어 UI 가 기획과 달리 위치가 변경되고 있음.
					$(this).siblings('.helpWrap').css('display','block');
				})
				.on('mouseout', '.icoHelp', function() {
					$(this).siblings('.helpWrap').hide();
				})
				.on('click', '.calInpage a', function(e) {
					$('.calInpage a').removeClass('select');
					$(this).addClass('select');

					e.preventDefault();
				})
				/*
				 * 추후 삭제 예정 jhk
				.on('click', '.calInpageMove .view', function(e) {
					var $t = $(this);
					if ($t.hasClass('on')) {
						$t.removeClass('on');
						$('.calArea .calInpage').hide();
					} else {
						$t.addClass('on');
						$('.calArea .calInpage').show();
					}

					e.preventDefault();
				});*/
		}
		/* input, textarea 글자수 세팅 */		, initJsTextCountOnce: function initJsTextCountOnce() {
			$(document).on('keyup', 'input.jsTextCount, textarea.jsTextCount', function() {
				var $input = $(this);
				var $target = $($input.data('count'));

				$target.text($input.val().length);
			});
		}
		/* 포틀릿 드래그 세팅 dw_ui.po.js 로 이관 initPortletDragOnce*/
		/* 작성자 리스트 carousel 세팅 */		, initDoWriterInfo: function initDoWriterInfo() {
			$(this).find('.doWriterInfo').each(function() {
				var $doWriterInfo = $(this);
				var $doShareList = $doWriterInfo.find('.doShareList');
				var $doShareListUl = $doShareList.find('ul');

				if(!$doWriterInfo.hasClass('set')) {
					$doWriterInfo.data('pos', 0);
					$doWriterInfo
						.on('click', 'a.nextV', function(e) {
							var pos = $doWriterInfo.data('pos');
							if($doWriterInfo.data('wrapWidth')+pos*54 < $doWriterInfo.data('ulWidth')) {
								pos = pos+1;
								$doWriterInfo.data('pos', pos).trigger('reposition');
							}
							e.stopPropagation();
							e.preventDefault();
						})
						.on('click', 'a.preV', function(e) {
							var pos = $doWriterInfo.data('pos');
							if(pos>0) {
								pos=pos-1;
								$doWriterInfo.data('pos', pos).trigger('reposition');
							}
							e.stopPropagation();
							e.preventDefault();
						})
						.on('reposition', function() {
							var wrapWidth = $doWriterInfo.data('wrapWidth');
							var width = $doWriterInfo.data('ulWidth');
							if(width<wrapWidth) {
								$doShareListUl.css({marginLeft:wrapWidth-width});
							} else {
								$doShareListUl.css({marginLeft:-54*$doWriterInfo.data('pos')});
							}
						})
						.on('resize', function(e) {
							var width = $doShareListUl.find('li').length*54;
							var wrapWidth = $doShareList.width();
							$doShareListUl.css({width:width});
							$doWriterInfo
								.data('ulWidth', width)
								.data('wrapWidth', wrapWidth)
								.trigger('reposition');


							e.stopPropagation();
						})
						.on('addItem', function(e, $item) {
							$doShareListUl.append($item);
							$doWriterInfo.data('pos', 0);
							$(this).trigger('resize');
						})
						.on('removeItem', function(e, idx) {
							$doShareListUl.find('>li:eq('+idx+')').remove();
							$(this).trigger('resize');
						});
					$doWriterInfo.addClass('set');
				}

				if($doWriterInfo.data('ulWidth') < $doWriterInfo.data('wrapWidth')) {
					$doWriterInfo.data('pos', 0);
				}
			})
		}
		/* 마우스 오버 toggle */				, initToggle: function initToggle() {
			$(document)
				.on('mouseenter', '.jsToggle', function() {
					$(this).addClass('on');
				})
				.on('mouseleave', '.jsToggle', function() {
					$(this).removeClass('on');
				})
		}
		/* init Select Direct Input */		, initSelectDirectInput: function initSelectDirectInput() {
			$(document)
				.on('change', 'select.jsDirectInput', function() {
					var $select = $(this);
					var $sel = $select.find('option:selected');
					var $option = $select.find('option:not(:selected)');

					$option.each(function() {
						if($(this).data('target')) {
							$($(this).data('target')).hide();
						}
					});

					if($sel.data('target'))
						$($sel.data('target')).show().focus();
				})
		}
		/* radio, checkbox 세팅 */			, initCheckboxRadioOnce: function initCheckboxRadioOnce() {
			//선택된 label 칼라 변경
			$(document)
				.on('click', 'input:radio, input:checkbox', function() {
					var $input = $(this);
					var name = $input.attr('name');
					var id = $input.attr('id');
					var type = $input.attr('type');

					if(type=='radio') {
						$('input[name="'+name+'"]')
							.each(function() {
								var id=$(this).attr('id');
								$('label[for="'+id+'"]').css({color:'#666'});
							})
							.parents('label').each(function() {
								$(this).css({color:'#666'});
							});
						$('label[for="'+id+'"]').css({color:'#333'});
					} else {
						if($input.is(':checked')) {
							$('label[for="'+id+'"]').css({color:'#333'});
						} else {
							$('label[for="'+id+'"]').css({color:'#666'});
						}
					}
				})
				.on('click', 'input:radio[name="layout"]', function() {
					var $input = $(this);
					var $label = $input.next('label');

					$label.siblings().find('span').removeClass('on');
					$input.next().find('span').addClass('on');
				})
		}
		/* 결재선 */							, initApprovalLineOnce: function initApprovalLineOnce() {
			var appLineMove = false;
			var appLineTimer = null;
			var $appLineItem = null;
			var $appLineItemWrap = null;
			var appLineItemIndex = 0;
			var appLineItemLastIndex = 0;
			var $appLineDrag = null;
			var appLineDragOffset = null;

			$(document)
				.on('mousedown', '.approvalLineWrap .lineWrap>li.lineList div.photo', function(e) {
					var $lineList = $(this).parents('li.lineList');
					var $lineWrap = $lineList.parent();
					$appLineItemWrap = $lineWrap;
					if(!$lineList.hasClass('sangsin') && !$lineList.hasClass('add') && !$lineList.hasClass('disabled') && $lineWrap.find('.lineList.on').length<1) {
						appLineTimer = setTimeout(function() {
							e.stopPropagation();
							appLineMove = true;
							$appLineItem = $lineList;
							$appLineDrag = $appLineItem.clone();
							appLineItemIndex=$appLineItem.index();
							appLineItemLastIndex = $lineWrap.find('>li.lineList.add').index();

							var $appLineDragWrap = $lineList;
							var position='static';
							do{
								$appLineDragWrap = $appLineDragWrap.parent();
								position = $appLineDragWrap.css('position');
							} while(position!=='relative' && position!=='absolute' && position !== 'fixed');
							appLineDragOffset = $appLineDragWrap.offset();

							$lineList.addClass('move');
							$appLineDrag.addClass('drag');
							$lineWrap.append($appLineDrag);
							$appLineDrag.css({left: e.pageX-appLineDragOffset.left-10, top: e.pageY-appLineDragOffset.top-10});
						}, 200);
					}

					e.preventDefault();
				})
				.on('mousemove', '.approvalLineWrap ul.lineWrap', function(e) {
					clearTimeout(appLineTimer);
					if(appLineMove) {
						var left = e.pageX-appLineDragOffset.left-10;
						var top = e.pageY-appLineDragOffset.top-10;
						$appLineDrag.css({left: left, top: top});
						var width = $appLineItem.outerWidth();
						var height = $appLineItem.outerHeight();

						var index = Math.floor(top/height)*6+Math.floor((left)/width);
						//console.log(index, appLineItemIndex);
						if(index!=0 && index < appLineItemLastIndex && appLineItemIndex != index) {
							//console.log(index, $appLineItemWrap.find('>li:eq('+index+')').length);

							if(index>appLineItemIndex) {
								$appLineItemWrap.find('>li:eq('+index+')').after($appLineItem);
							} else {
								$appLineItemWrap.find('>li:eq('+index+')').before($appLineItem);
							}

							appLineItemIndex = index;
						}
					}
				})
				.on('mouseup', function() {
					clearTimeout(appLineTimer);
					if(appLineMove) {
						$appLineDrag.remove();
						$appLineItem.removeClass('move');
						appLineMove = false;
					}
				})
				.on('change', '.approvalLineWrap .lineList select', function() {
					var $option=$(this).find(':selected');
					var text = $option.text();

					if(text=='병렬합의') {
						$option.parents('li.lineList').addClass('parallel');
					} else {
						$option.parents('li.lineList').removeClass('parallel');
					}
				})
				.on('click', '.approvalLineWrap a.btnLineLay', function(e) {
					var $lineList = $(this).parents('li.lineList');
					var $sublineList = $lineList.find('div.subLineList');

					$lineList.addClass('on').siblings().removeClass('on');
					$sublineList.trigger('reposition');

					e.preventDefault();
				})
				.on('reposition', '.approvalLineWrap div.subLineList', function() {
					var $subLineList = $(this);
					var $lineList = $subLineList.parents('.lineList');
					var $sublineListItem = $subLineList.find('.lineList');
					var itemWidth = 96;
					var itemLength = $sublineListItem.length;
					var space = 6-($lineList.index()%6);
					if(itemLength<=space) {
						$subLineList.css({width:itemLength*itemWidth+6, left:-6});
					} else {
						if(itemLength<=space*2) {
							$subLineList.css({width:Math.ceil(itemLength/2)*itemWidth+6, left:-6});
						} else {
							$subLineList.css({width:Math.ceil(itemLength/2)*itemWidth+6, left: -itemWidth * (Math.ceil(itemLength/2)-space) - 6 });
						}
					}
				})
				.on('click', '.btnLineClose', function(e) {
					var $lineList = $(this).parents('li.lineList');
					$lineList.removeClass('on');
					e.preventDefault();
				})
		}
		/* 미니 캘린더 */						, initJsCalOnce: function initJsCalOnce() {

			if(typeof scheduler !== 'undefined') {
				if ($('#scheduler_global').length > 0) {
					scheduler.config.start_on_monday = false;
					scheduler.init('scheduler_global',new Date(),'day');
				}
				$(document)
					.on('click', '.jsCal', function(e) {
						var $obj = $(this);
						var objTagName = $obj.prop('tagName');
						if(objTagName=='A') {
							e.preventDefault();
						}
						var $target = typeof $obj.data('target') === 'undefined' ? $obj : $($obj.data('target'));
						var calDate= '';

						if($target.prop('tagName') == 'INPUT'){
							calDate=$target.val();
						} else {
							calDate=$target.text();
						}
						var dt = new Date();
						if (calDate !='' && calDate.match(/[0-9][0-9][0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]/)) {
							calDate = calDate.split('.')
							dt.setYear(calDate[0]);
							dt.setMonth(parseInt(calDate[1], 10)-1);
							dt.setDate(calDate[2]);
						}

						if (scheduler.isCalendarVisible()) {
							scheduler.destroyCalendar();
						} else {
							// .jsCal 클릭 시 달력 변경이 발생하여 임시로 주석 처리
							scheduler.setCurrentView(dt);
							var mCalendar = scheduler.renderCalendar({
								isIgnoreBeforeDate: $obj.hasClass('dhx_ignore_this_month_before_date'),
								position:$obj[0],
								date:scheduler._date,
								navigation:true,
								handler:function(date){

									scheduler.destroyCalendar();

									var yy = date.getFullYear().toString();
									var mm = (date.getMonth() + 1).toString();
									var dd = date.getDate().toString();
									calDate = [ yy, mm.lpad(2), dd.lpad(2) ].join('.');

									if($target.prop('tagName') == 'INPUT') {
										$target.val(calDate);
									} else {
										$target.text(calDate);
									}

									$target.trigger('dateChanged');
								}
							});
							var left = parseInt($(scheduler._def_count).css('left'), 10)-parseInt($(scheduler._def_count).outerWidth(), 10)+$obj.outerWidth();
							if(left<0) left=0;
							$(scheduler._def_count).css({left:left});

							if ($obj.hasClass('dhx_ignore_this_month_before_date')) {
								var $allDayTds = $('.dhx_mini_calendar .dhx_year_body td');
								var $nowTd = $('.dhx_mini_calendar .dhx_year_body td.dhx_now');
								var _index = $allDayTds.index($nowTd);

								var $beforeDayTds = $('.dhx_mini_calendar .dhx_year_body td:lt(' + _index + ')');
								$beforeDayTds.addClass('dhx_this_month_before');
							}
						}
					});
			}

		}
		/* 미니캘린더 */						, initJsCal: function initJsCal() {
			$(this).find('.jsCal').each(function() {
				if(!$(this).data('manual')) {
					var val= $.trim($(this).val());
					if(val.length==0) {
						var dt=new Date();
						var year = dt.getFullYear();
						var month = dt.getMonth()+1;
						var day = dt.getDate();

						var text = year
							+ '.'+(month<10? '0'+month: month)
							+ '.'+(day<10? '0'+day: day);
						$(this).val(text);
					}
				}

			})
		}
		/* validation */					, initValidationOnce: function initValidationOnce() {
			// validation 기본설정
			// 이메일 검증
			var _f_validateEmail = function(email) {
				var rx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return rx.test(email);
			}

			$.fn.validateEmail = function() {

				return _f_validateEmail($(this).val());
			};

			// 전화번호, 팩스번호
			$(document).on('keyup', '.validate_phonenumber, .validate_faxnumber', function(e) {
				if (this.value.match(/[^0-9\-]/g)) {
					this.value = this.value.replace(/[^0-9\-]/g, '');
				}
			});

			//숫자 입력 필드
			$(document).on('keydown', '.number', function(event) {
		        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
		            (event.keyCode == 65 && event.ctrlKey === true) ||
		            (event.keyCode >= 35 && event.keyCode <= 40)) {
		             return;
		        }
		        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
		        	event.preventDefault();
		        }
			});
			$(document).on('keyup', '.lowAlpha', function(event) {
				if (this.value.match(/[^a-z]/g)) {
					this.value = this.value.replace(/[^a-z]/g, '');
				}
			});
			$(document).on('keyup', '.lowAlphaDot', function(event) {
				if (this.value.match(/[^a-z\.]/g)) {
					this.value = this.value.replace(/[^a-z\.]/g, '');
				}
			});
			$(document).on('keyup', '.domain', function(event) {
				if (this.value.match(/[^a-z0-9\.\-\_]/g)) {
					this.value = this.value.replace(/[^a-z0-9\.\-\_]/g, '');
				}
			});
			$(document).on('blur', '.validate_name', function(event) {
				/*if (this.value.match(/[^a-zA-Z0-9가-힣\(\)\.\-\_\&]/g)) {
					this.value = this.value.replace(/[^a-zA-Z0-9가-힣\(\)\.\-\_\&]/g, '');
				}*/
				if (this.value.match(/[^a-zA-Z0-9가-힣\(\)\.\-\_\/\&\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u2E80-\u2EFF\u31C0-\u31EF\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FBF\uF900-\uFAFF\u20000-\u2A6DF\u2F800-\u2FA1F]/g)) {
					this.value = this.value.replace(/[^a-zA-Z0-9가-힣\(\)\.\-\_\/\&\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u2E80-\u2EFF\u31C0-\u31EF\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FBF\uF900-\uFAFF\u20000-\u2A6DF\u2F800-\u2FA1F]/g, '');
				}
			});
		}
		/* xbar */
		, initXBarOnce: function initXBarOnce() {

			$(document).on('click', 'a#layoutType2, a#layoutType3', function(e) {

				$(document).trigger('loadXBar');
			})
			.on('loadXBar', function(e) {

				var $xBar = $('.xBar');
				if($xBar.length > 0) {
					var $listAllWrap = $('.listAllWrap');
					var $divContent = $('.divContent');

					var $contFlexibleArea = $('#cont_flexible_area');
					if ($contFlexibleArea.hasClass('horizontal')) {
						var _xBarGapX = getCookie('SWP_MA_XBAR_GAP_X');
						if (_xBarGapX != null) {
							var _nXBarGapX = parseInt(_xBarGapX);
							if (_nXBarGapX < 300 || $contFlexibleArea.outerWidth() - _nXBarGapX < 120) {
								// 최소 사이즈 유지
								return;
							}
							$listAllWrap.css({width:_nXBarGapX});
							$divContent.css({left:_nXBarGapX});
						}
					} else if ($contFlexibleArea.hasClass('vertical')) {
						var _xBarGapY = getCookie('SWP_MA_XBAR_GAP_Y');
						if (_xBarGapY != null) {
							var _nXBarGapY = parseInt(_xBarGapY);
							if (_nXBarGapY < 300 || $contFlexibleArea.outerHeight() - _nXBarGapY < 120) {
								// 최소 사이즈 유지
								return;
							}
							$('.listAllWrap').css({height:_nXBarGapY});
							$('.divContent').css({top:_nXBarGapY});
						}
					}
				}

				//레이아웃 변경후 ellipsis 호출
				$('.titleWrap').trigger('ellipsis');
				$('.doWriterInfo').trigger('resize');
			});
		}
		/* xbar */							, initXBar: function initXBar() {

			if($('.xBar').length > 0) {
				$(document).trigger('loadXBar');
			}
		}
		/* beta.fix */						, initBetaFixOnce: function initBetaFixOnce() {

			$('.betaFixWatchTarget').each(function() {
				new _beta.fix($(this));
			});
		}
		/* table hide */					, initTblHideViewOnce: function initTblHideViewOnce() {

			$(document)
				.on('click', '.tbl_menu', function() {
					var $tblMenu = $(this);
					if ($tblMenu.data('show')) {
						$tblMenu.trigger('hide');
					} else {
						$tblMenu.trigger('show');
					}
				})
				.on('show', '.tbl_menu', function() {
					var $tblMenu = $(this);
					$tblMenu.css('background-position', 'right -522px');
					$tblMenu.parent().parent().parent().next().show();
					$tblMenu.children(".blind").text(Alfresco.util.message('swp.com.label.close'));
					$tblMenu.data('show', true);
				})
				.on('hide', '.tbl_menu', function() {
					var $tblMenu = $(this);
					$tblMenu.css('background-position', 'right -483px');
					$tblMenu.parent().parent().parent().next().hide();
					$tblMenu.children(".blind").text(Alfresco.util.message('swp.com.label.open'));
					$tblMenu.data('show', false)
				})
				.on('click', '.srchResultBtn', function() {
					if ($(this).parent().siblings('.srchResult').css("display") == "none") {
						$(this).css('background-position', 'right -522px');
						$(this).parent().siblings('.srchResult').show();
						$(this).children(".blind").text(Alfresco.util.message('swp.com.label.close'));
					} else {
						$(this).css('background-position', 'right -483px');
						$(this).parent().siblings('.srchResult').hide();
						$(this).children(".blind").text(Alfresco.util.message('swp.com.label.open'));
					}
				})
				.on('click', '.linkArrow.btnNumber, .btnViewComment.btnNumber, ._icoDoImportant, ._icoDoState', function(e) {
					var n = $(this);
					if (n.hasClass('Down')) {
						$(n).removeClass('Down');
						$(n).addClass('Up');
					} else if (n.hasClass('Up')) {
						$(n).removeClass('Up');
						$(n).addClass('Down');
					} else if (n.hasClass('LDown')) {
						$(n).removeClass('LDown');
						$(n).addClass('LUp');
					} else if (n.hasClass('LUp')) {
						$(n).removeClass('LUp');
						$(n).addClass('LDown');
					}

					e.preventDefault();
				});

			$(document)
				.on('click', '.btnAttachfolder', function(e) {
					var $this = $(this);
					var id = $this.attr('href').split('#')[1];
					if ($this.hasClass('on')) {
						$this.removeClass('on');
						$this.find(".blind").text("첨부목록 펴기");
						$('#' + id).hide().prev('.attachNotice').hide();
						$this.parent().parent().find('>.attachPviewArea').css('margin-top', '21px');
					} else {
						$this.addClass('on');
						$this.find(".blind").text("첨부목록 접기");
						$('#' + id).show().prev('.attachNotice').show();
						$this.parent().parent().find('>.attachPviewArea').css('margin-top', '16px');
					}

					e.preventDefault();
				});
		}
		/* 첨부영역 */						, initAttachArea: function initAttachArea() {

			$('.attachfileArea label a').each(function() {
				var $target = $(this);

				var _text = $target.text();
				$target.text('-');

				$target.parents('label').css('max-width', ($target.parents('td').innerWidth() - 70) + 'px');
				$target.attr('title', _text);
				$target.text(_text);
			});
		}
		/* layout 세팅 */					, initLayoutOnce: function initLayoutOnce() {
			$(document)
				.on('showDetailSrchArea', function() {

				})
				.on('resize', '#cont_flexible_area', function(e) {
					var $contFlexibleArea = $(this);
					var $contFixedArea = $contFlexibleArea.siblings('#cont_fixed_area');


					$contFlexibleArea.css('top', $contFixedArea.outerHeight());

					e.stopPropagation();
				})
				.on('click', '.cHeadersrch .btnDtailSrch a', function(e) {
					var $btn = $(this);

					var $detailSrchArea = null;
					if($btn.parents('#cont_fixed_area').length>0) {
						var $contFixedArea = $btn.parents('#cont_fixed_area');
						var $contFlexibleArea = $contFixedArea.siblings('#cont_flexible_area');
						$detailSrchArea = $contFixedArea.find('.detailSrchArea');

						$detailSrchArea.toggleClass('on');
						if (!$detailSrchArea.hasClass('on')) {
							$detailSrchArea.hide();
							$btn.find('span').removeClass('upArrow').addClass('downArrow');
						} else {
							$detailSrchArea.show();
							$btn.find('span').removeClass('downArrow').addClass('upArrow');
						}

						$contFlexibleArea.trigger('resize');
					} else {
						$detailSrchArea = $btn.parents('.content_footer').find('.detailSrchArea')

						$detailSrchArea.toggleClass('on');
						if (!$detailSrchArea.hasClass('on')) {
							$detailSrchArea.hide();
							$btn.find('span').removeClass('upArrow').addClass('downArrow');
						} else {
							$detailSrchArea.show();
							$btn.find('span').removeClass('downArrow').addClass('upArrow');
						}

					}

					e.preventDefault();
				})
				.on('click', '.btnDetailSrchCancel a', function(e) {

					$(this).parents('#cont_fixed_area, .content_footer').find('.btnDtailSrch a').click();

					e.preventDefault();
				})

		}

		//항상 마지막에
		/* window 세팅 */					, initWindowResizeOnce: function initWindowResizeOnce() {
			var resizeTimer = null;
			$(window)
				.on('resize', function() {
					Class.winWidth = $(window).width();
					Class.winHeight = $(window).height();

					//ajaxPop
					$('.popCont').trigger('reposition');
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function() {
						$('.doWriterInfo').trigger('resize');
						$('.effectOnWindowResize').trigger('resize');
					}, 200);
				});
		}
		/* dwUI 초기화 */					, init: function() {
			var wrapper = this;
			function init(obj, prefix) {
				prefix = typeof prefix === 'undefined' ? '' : prefix;

				for(var func in obj) {
					if(obj.hasOwnProperty(func)) {
						if(func.indexOf('_')==0) {
							init(obj[func], prefix+func);
						} else {
							if(func !== 'init' && func.indexOf('init')==0) {
								var $document = $(document);
								if(func.lastIndexOf('Once')+4 == func.length && !$document.data(prefix+func)) {
									$document.data(prefix+func, true);
									obj[func].call(wrapper);
								} else if ( func.lastIndexOf('Once')+4 != func.length) {
									obj[func].call(wrapper);
								}

							}
						}
					}
				}
			}

			init(Class);
		}
	};

	if(typeof this['dwUI'] === 'undefined') {
		this['dwUI'] = Class;
	}
})();


$.fn.btnSet = dwUI.btnSet;
$.fn.dwUI = dwUI.init;
$(function() {
	$(document).dwUI();
});


$(function ($) {
    //snbclick();
    TypeView();
    tabType();
    //tabType2();
    iconSet();
    eventHover();
    //atcmEvent();
    tblHideView();

    clseEvent();
    writeFunc();
	$(document).environmentSetupArea();
    windowClose();
    $(document).ellipsis();
    loader();

   // aprSnbTab();
    aprEvent();
    textEvent();

	srchListGrp();
	//comSrchTitle();
	etcSectionHeight();
	directDate();

	smsEvent();

	numberEvent();

	//항상 마지막에
	$(window).on('resize', windowResize);
	setDynamicList();
	$(window).trigger('resize');

	if ($.browser.msie) {
		// for console debugging msie
		if (window['console'] === undefined || console.log === undefined ) {
		  console = {log: function() {}, info: function() {}, warn: function () {}, error: function() {}};
		} else if (!location.href.match( '192.168' )) {
		  console.log = console.info = console.warn = console.error = function () {};
		}
	}

	// 파일 첨부영역 외에 드랍 시 이벤트 무시
//	$(document).on('dragover', function(e) {
//		e.preventDefault();
//	}).on('drop', function(e) {
//		e.preventDefault();
//	});
});


// 15개씩 보기 layer (공통)
function numberEvent() {
	/* btnReset */
	//$(".number_list").hide();
	$(document)
		.on('click', '.btnNumber', function(e) {
			var $btnNumber = $(this); // SWPTEMP-758
			if ($btnNumber.siblings(".number_list").css("display") == "none") {
				//alert("ddd");
				$btnNumber.next().show();
			} else {
				$btnNumber.next().hide();
			}

			e.preventDefault();
			e.stopPropagation();
		})
		.on('click', '.number_list a', function(e) {
			var $anchor = $(this);
			var num = $anchor.data('count') || $anchor.attr('pagepercount');
			var _text = Alfresco.util.message("swp.com.label.showViewCount").format(num);
			$anchor.parents('.number_list').siblings('.btnNumber').html(_text).removeClass('Up').addClass('Down'); // SWPTEMP-78, SWPTEMP-758

			$anchor.addClass('selected'); // SWPTEMP-230
			$anchor.parents(".number_list").find('ul li a').not($(this)).removeClass('selected');
			$anchor.parents(".number_list").hide();

			e.preventDefault();
			e.stopPropagation(); // jhk 추가
		})
		.on('click', function(e) {
			$('.btnNumber.Up').click();
		})
}


//window pop
var win = null;
function NewWindow(mypage, myname, w, h, scroll) {
    var winl = (screen.width - w) / 2;
    //var wint = (screen.height - h) / 2;
    var wint = 0;
    var settings = 'height=' + h + ',';
    settings += 'width=' + w + ',';
    settings += 'top=' + wint + ',';
    settings += 'left=' + winl + ',';
    settings += 'scrollbars=' + scroll + ',';
    settings += 'resizable=yes';
    win = window.open(mypage, myname, settings);
    if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}

function windowClose() {
    $('#winpop_wrap').find('.btn_orgClose a').click(function () {
        // self.opener = self;
        window.close();
    });
}

//snb
//function snbclick() {
//
//    $('.svc_menu_area li,.maTree .tree-node div, .boTree .tree-node div, .dcTree .tree-node div').mouseover(function () {
//        $('.svc_menu_area li, .maTree .tree-node div, .boTree .tree-node div, .dcTree .tree-node div').removeClass("over");
//        $(this).addClass("over");
//    });
//    $('.svc_menu_area li, .svc_menu_area li input, .maTree .tree-node div, .boTree .tree-node div, .dcTree .tree-node div').click(function () {
//        $('.svc_menu_area li, .maTree .tree-node div, .boTree .tree-node div, .dcTree .tree-node div').removeClass("click");
//        $(this).addClass("click");
//    });
//    $('.svc_menu_area li, .maTree .tree-node div, .boTree .tree-node div, .dcTree .tree-node div').mouseout(function () {
//        $('.svc_menu_area li, .maTree	 .tree-node div, .boTree .tree-node div, .dcTree .tree-node div').removeClass("over");
//    });
//}



//iconSet
function iconSet() {

	$(document)
		.on('click', '._icoImportant', function(e) {
			var n = $(this).children('.icoImportant');
			if (n.hasClass('on')) {
				$(n).removeClass('on');
				//$(n).find(".blind").text("중요 표시하기");
				$('.listAllWrap').trigger('dw.sortByImportant', true);
			} else {
				$(n).addClass('on');
				//$(n).find(".blind").text("중요 표시됨, 중요 해제");
				$('.listAllWrap').trigger('dw.sortByImportant', false);
			}

			e.preventDefault();
		})
		.on('click', '.answerNum', function(e) {
			var n = $(this).children('a');
			var f = n.attr('id');

			if (n.hasClass('on')) {
				$(n).removeClass('on');
				$('.boardList li.' + f).hide();

			} else {
				$(n).addClass('on');
				$('.boardList li.' + f).show().find('.titleWrap').trigger('ellipsis', true);
			}

			e.preventDefault();
		})
		.on('click', '._btnSwitch', function(e) {
			var $this = $(this);
			if ($this.hasClass('manual')) {
				// 직접 onoff 를 처리한다.
				e.preventDefault();
				return;
			}

			var $btnSwitch = $(this).children('.btnSwitch');
			$this.trigger('set', $btnSwitch.hasClass('on') ? 'off' : 'on');

			e.preventDefault();
		})
		.on('set', '._btnSwitch', function(e, mode) {
			if (typeof mode == 'undefined') {
				// do not something...
				return;
			}

			var $btnOnOff = $(this).children('.btnSwitch');
			$btnOnOff.removeClass('on');
			if (mode == 'off') {
				$btnOnOff.text("OFF");
			} else if (mode == 'on') {
				$btnOnOff.addClass('on');
				$btnOnOff.text("ON");
			}
		});
}

//typeview
function TypeView() {
    $('.typeView a').click(function () {
        var nc = $(this).attr('class');
        $('.typeView a').removeClass("on");
        $(this).addClass("on");
        if (nc == 'first') {
            $('#cont_flexible_area').removeClass('horizontal vertical').addClass('normal');
            $('.listAllWrap').removeAttr('style');
            $('.divContent').removeAttr('style');
			$(document).ellipsis();

        } else if (nc == 'second') {
            $('#cont_flexible_area').removeClass('normal horizontal').addClass('vertical');
            $('.listAllWrap').removeAttr('style');
            $('.divContent').removeAttr('style');
			$(document).ellipsis();

        } else if (nc == 'third') {
            $('#cont_flexible_area').removeClass('normal vertical').addClass('horizontal');
            $('.listAllWrap').removeAttr('style');
            $('.divContent').removeAttr('style');
			$(document).ellipsis();

        } else if (nc == 'listView') {
            $('#cont_flexible_area').removeClass('normal vertical horizontal folderType').addClass('listType');
			$(document).ellipsis();
            $('.docInfo .material span').each(function () {
                var nclass = $(this).attr('class');
                var iconsplit = nclass.split('B');
                $(this).removeClass();
                $(this).addClass(iconsplit[0]);
            });

        } else if (nc == 'folderView') {
            $('#cont_flexible_area').removeClass('normal vertical horizontal listType').addClass('folderType');
			$(document).ellipsis();
            $('.docInfo .material span').each(function () {
                var nclass = $(this).attr('class');
                $(this).attr('class', nclass + 'B');
            });
        } else if (nc == 'variableType') {
            $('#cont_extend_area, #cont_flexible_area').removeClass('listType').addClass('variableType'); // cont_flexible_area 추가
        } else if (nc == 'listType') {
            $('#cont_extend_area, #cont_flexible_area').removeClass('variableType').addClass('listType');  // cont_flexible_area 추가
        }
		dwUI.initDoWriterInfo.call(window);
    });

}

//글자수제한
$.fn.ellipsis = function() {
	var $wrapper = $(this);

	$wrapper.find('.titleWrap').trigger('ellipsis');

	$wrapper.find('.srchResult .addFile').each(function () {
		if ($(this).text().length > 35)
			$(this).html($(this).text().substr(0, 35) + "...");
	});
	$wrapper.find('.srchResult .addText').each(function () {
		if ($(this).text().length > 75)
			$(this).html($(this).text().substr(0, 75) + "...");
	});
};
$(document).on('ellipsis', '.titleWrap', function(e, reset) {
	var $titleWrap = $(this);
	var $subject = $(this).find('.subject');
	var $contentW = $("#content").width();

	$subject.css('max-width', 10);
	var w = $titleWrap.width();
	var total = $titleWrap.data('total');
	if(typeof total === 'undefined' || reset) {
		var padding = [
			'.origin'
			, '._icoOpenWin'
			, '.teamp' // teamp:visible 떄문에 말줄임이 안됨
			, '.noticeTxt'
			, '.noticeTxt2'	//  팀플 메인 게시물 라벨
			, '.pDate'
			, '.icoEm'
			, '.stateTxt'
			, '.replyNum'
			, '.icoFile'
			, '.icoNew'
			, '.answerNum'
			, '.sbtn'
			, '.icoAnswer'
			, '.srchResultBtn' // mail 부분
			, '.icoImportant' // 통합검색,
			, '.icoCheckout'	// 공지사항포틀릿 (보안)
			, '.icoReply'		// 공지사항포틀릿 (답글)
			, '.writer'		// 팀플포틀릿-작성자 (신규)
		];
		 total = 10;
		for(var i=0; i<padding.length; i++) {
			var $item = $titleWrap.find(padding[i]);
			if($item.length>0)	total+=4+$item.outerWidth(true);
		}

		$titleWrap.data('total', total);
	}

	var sum = (total >= w) ? w : total;
	$subject.css('max-width', w - sum);//20 RE :

	var $teNewList = $titleWrap.parent('.teNewList');
	if ($teNewList.length > 0) {
	    $subject.css('max-width', w - sum - 290);//237
	    //$titleWrap.find('.stateTxt').css('width', $(".stateTxt").outerWidth());
	}
	if ($titleWrap.parents().is('#myKnowledge')) {
	    $titleWrap.children('.subject').css('max-width', $contentW - 61 - 476 - total); //$('.knowledge').width() - 476
	}
	if ($titleWrap.parents().is('#favorKnowledge')) {
	    $titleWrap.children('.subject').css('max-width', $contentW - 61 - 290 - total); //$('.knowledge').width() - 476
	}
	if ($titleWrap.parents().is('#receiveKnowledge')) {
	    $titleWrap.children('.subject').css('max-width', $contentW - 61 - 403 - total); //$('.knowledge').width() - 476
	}

	e.stopPropagation();
});



function tblHideView() {
    //$('.tbl_menu, .srchResultBtn').append("<span class='blind'>열기</span>");

	$('.mailListItem a,.boardListItem a,.docListItem a, .doListItem a, table th a, .scrollTblWrap a, a').click(function () {

        /* Title : 본사_휴게실_Capsule룸 자원 선택시 팝업생성
         * Date : 17.11.28 기능추가
         * Author : 윤성수
         * Description : branchCode를 이용하여 분기처리함.
         */
        var branchCode = $(this).parents("li").attr("data-branch-code");
        if(branchCode == "23") {
			var menuStatus = $(this).parents(".menuDepth").children(".item_menu").attr("class");
			var matchTitle = "item_menu menuOpen";

			if(menuStatus.indexOf(matchTitle)> -1 && branchCode == "23") {
				NewWindow(Alfresco.constants.URL_CONTEXT + "help/capsule_room_notice.html?v=180115", "", 500, 600, "no");
			}
        }
        
        /* Title : 건강지킴이(67), 베어홀(66), 콘도(68)를 선택할 경우 해당
         * Date : 18.05.30 기능추가
         * Author : 윤성수
         * Description : branchCode를 이용하여 분기처리함.
         */
        var specialBranchCodes = ["66", "67", "68"];
        if($.inArray(branchCode, specialBranchCodes) != -1) {
        	var branchType = "";
        	if(branchCode == "66") {
        		branchType = "HA";
        	} else if(branchCode == "67") {
        		// 2018.08.10 : 기존 HC에서 WX로 전송하도록 함.
                //branchType = "HC";
                branchType = "WX";
        	} else if(branchCode == "68") {
        		branchType = "CD";
        	}
        	
        	openCenterInstance('/share/jsp/reserveSsoLogin.jsp?type='+branchType,'1024','768','_blank','resizable=yes, scrollbars=yes, status=yes, toolbar=no, menubar=no, location=no, directories=no');
        }

        //$(this).removeClass('down');
        //$(this).addClass('up');
        var n = $(this).children('.down, .up');
        if (n.hasClass('down')) {
            $(n).removeClass('down');
            $(n).addClass('up');

        } else if (n.hasClass('up')) {
            $(n).removeClass('up');
            $(n).addClass('down');
        }
    });

    //$('.tblType1 th a').click(function () {
    //    var n = $(this);
    //    if (n.hasClass('on')) {
    //        $(n).removeClass('on');
    //
    //    } else {
    //        $(n).addClass('on');
    //    }
    //});

    if ($('.viewMore').length > 0) {

        $('.viewWrap .viewTitle dl dt:first-child .viewMore').click(function () {
            var n = $(this);
            if (n.hasClass('on')) {
                $(n).removeClass('on');
                $('.viewWrap .viewTitle dl .toDt, .viewWrap .viewTitle dl .toDd').hide();
                $(n).find(".blind").text("받는사람/참조 펴기");
            } else {
                $(n).addClass('on');
                $('.viewWrap .viewTitle dl .toDt, .viewWrap .viewTitle dl .toDd').show();
                $(n).find(".blind").text("받는사람/참조 접기");
            }
        });

        $('.teListSet dt .viewMore').on('click', function () {
            $('.teListSet dt .viewMore').removeClass('on');
            $('.teListSet dd').hide();
            $(".teListSet dt").removeClass('click');
            $(this).addClass('on');
            $(this).parent().addClass('click');
            $(this).parent().siblings('.teListSet dd').show();
            $(document).ellipsis();
        });

    }

    if ($(".tblType3.list").length == 1) {

        $('.tblType3.list .position').each(function () {

            if ($(this).text().length > 6) {
                $(this).html($(this).text().substr(0, 12) + "...");

                $(this).mouseover(function () {
                    $(this).siblings('.helpWrap').css('display', 'block');
                });
                $(this).mouseout(function () {
                    $(this).siblings('.helpWrap').css('display', 'none');
                });
            }

        });

    }

    if ($(".signSet").length == 1) {
        $("input[name=lbaccountsWrithe]").change(function () {
            var radioValue = $(this).val();
            if (radioValue == "use") {
                $('#lbaccountsInfo01, #lbaccountsInfo02, #lbaccountsInfo03, #lbaccountsInfo04').removeAttr("disabled");
                $(this).parent().parent().parent().parent().removeClass('disable');
            } else {
                $('#lbaccountsInfo01, #lbaccountsInfo02, #lbaccountsInfo03, #lbaccountsInfo04').attr("disabled", "disabled");
                $(this).parent().parent().parent().parent().addClass('disable');
            }
        });
    }
    if ($(".noticeSet").length == 1) { // 서명 설정
    	$("input[id=smsTime3]").change(function () {
    		var chkValue = $(this);
    		if(chkValue.is(':checked')) {
    			$('.smsSelect').removeAttr("disabled");
    		} else {
    			$('.smsSelect').attr("disabled", "disabled");

    		}
    	});
    }

    if ($("#noticeStop").length == 1) {

        $('#noticeStop').click(function () {
            var n = $(this);
            if (n.hasClass('on')) {
                $(n).removeClass('on');
                $('.noticeSet input, .noticeSet select').removeAttr("disabled");
                $('.noticeSet').removeClass('disable');
                $(this).text('일시정지');
                $(this).attr('id', 'noticeStop');

            } else {
                $(n).addClass('on');
                $('.noticeSet input, .noticeSet select').attr("disabled", "disabled");
                $('.noticeSet').addClass('disable');
                $(this).text('일시정지 해제');
                $(this).attr('id', 'noticeStopRelease');
            }
        });
    }
}

function tabType() {
    $(".fullTab3 li:first").css('width', '34%'); // full tab 3
    $(".fullTab6 li:first").css('width', '16%'); // full tab 6
    $(".fullTab6 li:last").css('width', '16%'); // full tab 6
    $(".fullTab7 li:first").css('width', '15%'); // full tab 7
    $(".fullTab7 li:last").css('width', '15%'); // full tab 7
    $(".fullTab8 li:odd").css('width', '13%'); // full tab 8

    $(".tabs").each(function () {
        $(this).find("li:first").addClass("first");
        $(this).find("li:last").addClass("last");
        $(this).find(".tc-tab .tc-selected").prev().addClass("list_pre");
    });


    $(".tabType1 ul.tabs li a").click(function () {
        $(this).parent().prev().addClass("list_pre");
    });

    $(".onlyTab ul.tabs li.tc-selected").prev().addClass("list_pre");
    $(".onlyTab ul.tabs li a").click(function () {
    	 $(".onlyTab ul.tabs li").removeClass('tc-selected list_pre');
    	$(this).parent().addClass("tc-selected");
    	$(this).parent().prev().addClass("list_pre");
    });
}

//메일목록
function eventHover() {
	$(document)
		.on('mouseover', '.mailList > li, .boardList > li, .docList > li, .doList > li', function() {
			$(this).addClass("over").siblings(':not(.click)').removeClass("over");
		})
		.on('mouseout', '.mailList > li, .boardList > li, .docList > li, .doList > li', function() {
			$(this).removeClass("over");
		})
		.on('mouseover', '#selectMailopt li', function() {
			$(this).addClass("over").siblings().removeClass('over');
		})
		.on('mouseover', '.atcm_gnb_wrap .srchList li', function() {
			$(this).addClass("over").siblings().removeClass('over');
		})
		.on('mouseover', 'table tbody tr', function() {
			$(this).addClass('over').siblings().removeClass('over');
		})
		.on('mouseover', '.atcm_eddrselectType1 li', function() {
			$(this).addClass('over').siblings().removeClass('over');
		})
		.on('mouseover', '.atcm_orgselectType1 li', function() {
			$(this).addClass('over').siblings().removeClass('over');
		})

		.on('click', '.mailType .listWrap .check input:checkbox', function() {	//조직도 체크 event 활성화
			if($(this).is(':checked')) {
				$(this).parents('.mailInfo').parent('li').addClass('checked')
			} else {
				$(this).parents('.mailInfo').parent('li').removeClass('checked')
			}
		});
}

//자동완성 관련
function atcmEvent() {
/*
    $('input[name=gnbSrchField]').keyup(function () {
		$('.atcm_gnb_wrap').css('display', 'block');
	}).blur(function () {
		var _atcm_gnb_wrap = $('.gnbSrch .atcm_gnb_wrap').css('display');
		if( _atcm_gnb_wrap == 'none' ) {
			setTimeout(function() {
				$('.atcm_gnb_wrap').css('display', 'none');
			}, 200);
		}
	});

    $('textarea[name=eddrTextInput]').keyup(function () {
			$('.atcm_eddrselectType2').css('display', 'block');
		}).blur(function () {
			setTimeout(function() {
				$('.atcm_eddrselectType2').css('display', 'none');
			}, 200);
		});
    $('input[name=eddrTextInput]').keyup(function () {
			$('.atcm_eddrselectType1').css('display', 'block');
		}).blur(function () {
			setTimeout(function() {
				$('.atcm_eddrselectType1').css('display', 'none');
			}, 200);
		});
*/
}


//utilArea
function clseEvent() {
    $('.utilArea a.clse').click(function () {
        $(this).parent().hide();
    });
    $('.noticeWrap a.clse').click(function () {
        $(this).parent().hide();
        $('.viewWrap', '#cont_flexible_area').css('top', '0');
    });
	$(document)
		.on('click', '.btn_promise a', function(e) {
			$('.promise_cont').show();
			e.preventDefault();
		})
		.on('click', '.promise_cont a.clse', function(e) {
			$(this).parent().hide();
			e.preventDefault();
		});
}

//mailSendFunc
function writeFunc() {
    if ($('#cont_flexible_area').children().is('.noticeWrap')) {
        $('.viewWrap').css('top', '32px');
    } else {
        $('.viewWrap').css('top', '0');
    }

	var $tr =$('.templateTblScroll tr, .receiptConfTblScroll tr');
    $tr.mouseover(function () {
		$tr.removeClass("over");
        $(this).addClass("over");
    });
	$tr.click(function () {
		$tr.removeClass("click");
        $(this).addClass("click");
    });

	$(document)
		.on('change', 'input[name="mailSecuritylevel"]', function() {
			var id= $(this).attr('id');
			if (id == 'mailSecuritylevel1') {
				$(".validityPeriod, ._mailResend").show();
			} else {
				$(".validityPeriod, ._mailResend").hide();
			}
		})
		.on('click', '.scrollTblScroll .templateDelete', function(e) {
			var $tr = $(this).parents('tr');
			var templateId = $tr.data('templateId');
			//$tr.remove();

			$(document).trigger('templateDelete', templateId);

			e.preventDefault();
		})
		.on('click', '.scrollTblScroll input', function() {
			var $input = $(this);
			var $tr = $input.parents('tr');
			var $siblingInput = $tr.addClass('click').siblings().find('input');
			$siblingInput.each(function() {
				if(!$(this).is(':checked')) {
					$(this).parents('tr').removeClass('click');
				}
			});
		});

    $('.deleteTimeSet').click(function () {
        $(this).parent().hide();
    });

    $("input[name=boardRegisterReserve]").change(function () {
        var radioValue = $(this).val();
        if (radioValue == "use") {
            $(".boardRegisterReserve .dl_base").show();
        } else {
            $(".boardRegisterReserve .dl_base").hide();
        }
    });

    if ($('#lbBoardRegisterOpt03, #lbBoardRegisterOpt04, #lbBoardRegisterOpt05, #lbBoardRegisterOpt06').length > 0) {
        $('.useOpt').hide();
        $("#lbBoardRegisterOpt03, #lbBoardRegisterOpt04, #lbBoardRegisterOpt05, #lbBoardRegisterOpt06").change(function () {
            //var opt3Val = $("#lbBoardRegisterOpt03 option:selected").val();
            var opt3Val = $(this).find('option:selected').val();
            if (opt3Val == "nouse") {
                $(this).siblings('.guideTxt').show();
                $(this).siblings('.useOpt').hide();
            } else if (opt3Val == "use") {
                $(this).siblings('.guideTxt').hide();
                $(this).siblings('.useOpt').show();
            }
        });
    }
    $('.mail_Input_holder .icoDelete, .inputHolder .icoDelete').click(function () {
        $(this).parent('.unit').hide();
    });

    if ($('.doModifyType').length > 0) {
        $('.doOpt').hide();
        $('input:radio[id=lbSortBName02], input:radio[id=lbEndDate02], input:radio[id=lbNotice02]').change(function () {
            if ($(this).is(":checked")) {
                $(this).parent().children('.doOpt').show();
            }
        });
        $('input:radio[id=lbSortBName01], input:radio[id=lbEndDate01], input:radio[id=lbNotice01]').change(function () {
            if ($(this).is(":checked")) {
                $(this).parent().children('.doOpt').hide();
            }
        });
    }

	$(document)
		.on('click', '.boCommentAction a.btnViewComment', function(e) {
			var $link = $(this);
			var target = $link.attr('href').split('#')[1];
			var $target = $('#'+target);

			if($link.hasClass('Down')) {
				$link.removeClass('Down').addClass('Up');
				$target.show();
				$('#'+target+'ListArea').show();
				$link.parents('.boCommentAction').addClass('on');
			} else {
				$link.removeClass('Up').addClass('Down');
				$target.hide();
				$('#'+target+'ListArea').hide();
				$link.parents('.boCommentAction').removeClass('on');
			}

			e.preventDefault();
		})
		.on('click', '.boCommentAction a.btnWriteComment', function(e) {
			var $link = $(this);
			var $btnViewComment = $link.siblings('.btnViewComment');

			if($btnViewComment.hasClass('Down')) {
				$btnViewComment.click();
			}

			var $target = $('#'+$btnViewComment.attr('href').split('#')[1]);
			$target.find('textarea:first').focus();

			e.preventDefault();
		})

}


//환경설정
$.fn.environmentSetupArea = function() {
	var $wrapper = $(this);

	$wrapper.find('.disable table').children(':checkbox,:radio').attr("disabled", "disabled");
	$wrapper.find('.disable table').children('select').attr("disabled", "disabled");
};


var winW, winH, docH, docW;
function windowResize() {
	winW = $(window).width();
	winH = $(window).height();
	docH = document.body.scrollHeight;
	docW = document.body.scrollWidth;

	//content resize
	var $wrap = $('#wrap');

	//if(!$wrap.hasClass('main') && !$wrap.hasClass('relative') && !$wrap.hasClass('login')) {
	//	var $utilArea = $('.utilArea');
	//	var $container = $('#container');
	//	var $footer = $('#footer');
	//	if(winW > 1640) {
	//		$utilArea.css({width:1600/*, left:40+(winW-1680)/2*/});
	//		$container.css({width:1598/*, left:40+(winW-1680)/2*/});
	//		$footer.css({width:1600, margin:'10px auto 0'});
	//	} else {
	//		$utilArea.css({width:'auto'/*, left:20*/});
	//		$container.css({width:'auto'/*, left:20*/});
	//		$footer.css({width:'auto', margin:'10px 20px 4px'});
	//	}
	//}

	//로그인 화면
	var $login = $('#cont_login_area');
	if ($login.length > 0) {
	    $login.each(function () {
	        $login.css('top', (winH - $login.outerHeight()) / 2);
	    });
	}

    //글자수 제한
    $('.titleWrap').trigger('ellipsis');

	//var aptblW= $(".apTbl_srw .listWrap").width();
	//$(".apTbl_srw .listWrap .apList").css("width",aptblW);

	//comSrchTitle();
	etcSectionHeight();
}


//loader
function loader() {

	$(document)
		.on('showUploadLoader', function(e, o) {

			var options = o || {};
			var msg = options.msg || '파일을 업로드 하는 중입니다.<br />잠시만 기다려 주세요';

			var $wrap = $('#wrap, #winpop_wrap');
			// #uploadLayer 레이어가 있으면 추가 하지 않음 20140715  hanjool  추가
			if($('#uploadLayer').length<1) {
				$wrap.append('<div id="uploadLayer" class="popup_block layer_type1"><p class="progressGuide">{0}</p><div class="progress"><p><span style="width: 0%"><span class="blind">0% {0}</span></span></p></div></div>'.format(msg, Alfresco.util.message('swp.com.label.ing')));
			}
			if($('#fade').length<1) {
				$wrap.append('<div id="fade"></div>');
			}

			$('#fade, #uploadLayer.popup_block').show();

			e.preventDefault();
		})
		.on('updateUploadLoader', '#uploadLayer', function(e, p, msg) {

			var percent = p.match(/[0-9]+%/);
			if (percent == null) {
				console && console.log('변수 p가 퍼센테이지 값이 아닙니다. >>> p=' + p);
				return;
			}
			$(this).find('.progress span').first().css('width', p);
			$(this).find('.progress span.blind').text(p + ' ' + Alfresco.util.message('swp.com.label.ing'));

			if (msg) {
				$(this).find('.progressGuide').text(msg);
			}
		})
		.on('hideUploadLoader', '#uploadLayer', function() {
			$('#uploadLayer').remove();
			$.fadeHide();
		})

		.on('showAjaxIndicator', function(e, o) {
			var options = o || {};

			var html = '<div id="ajaxIndicator">'
			if (options.msg) {
				html += '<p class="progressGuide">' + options.msg + '</p>';
			}
			html += '<p class="loading"><img src="{0}images/swp/common/loading.gif" alt="{1}" /></p></div>'.format(Alfresco.constants.URL_CONTEXT, Alfresco.util.message('swp.com.label.loding'));

			var $wrap = $('#wrap, #winpop_wrap');
			// #ajaxIndicator 레이어가 있으면 추가 하지 않음 20140715  hanjool  추가
			if($('#ajaxIndicator').length<1) {
				$wrap.append(html);
			}
			if($('#fade').length<1) {
				$wrap.append('<div id="fade"></div>');
			}

			$('#fade, #ajaxIndicator').show();
			$('#ajaxIndicator').trigger('resizeAjaxIndicator');
		})
		.on('updateAjaxIndicator', function(e, o) {
			var options = o || {};

			if (options.msg) {
				var $ajaxIndicator = $('#ajaxIndicator');
				$ajaxIndicator.find('p.progressGuide').html(o.msg);
				$ajaxIndicator.trigger('resizeAjaxIndicator');
			}
		})
		.on('resizeAjaxIndicator', '#ajaxIndicator', function(e) {
			var $ajaxIndicator = $(this);
			var $progressGuide = $ajaxIndicator.find('p.progressGuide');
			if ($progressGuide.length > 0) {
				var _msgHeight = parseInt($progressGuide.css('height'));
				var _boxHeight = 90 + _msgHeight;
				$ajaxIndicator.css('height', _boxHeight + 'px');
			}
		})
		.on('hideAjaxIndicator', function(e) {
			$('#ajaxIndicator').remove();
			$.fadeHide();
		});
}

function aprEvent() {
	//$(".formTree_section").parents("#content").addClass("formOn");
	//var aptblW= $(".apTbl_srw .listWrap").width();

//	$(".apTbl_srw .listWrap .apList")
//		.css("width",aptblW)
//		.each(function(){ // ap_002(테이블 자동 scroll)
//			//alert($(this).find(">li").size() >= 4);
//			if($(this).find(">li").size() > 4){
//				//$(this).addClass("mb14");
//				$(this).parent().addClass("srwAuto");
//			}else{
//				//$(this).removeClass("mb14");
//				$(this).parent().removeClass("srwAuto");
//			}
//		});


	 $('.ahr_grpList li')
		// .on('click', function () {
		//	$('.ahr_grpList li').removeClass("click");
		//	$(this).addClass("click");
		//})
		.on('mouseenter', function () {
			$(this).addClass('on');
		})
		 .on('mouseleave', function () {
			$(this).removeClass('on');
		});

}

function textEvent() {
    /* btnReset */
    $(".txt_listLayer").hide();
	$(".txt_menu")
		.on('click', function () {
			if ($(this).next().css("display") == "none") {
				//alert("ddd");
				$(".txt_menu").next().hide();
				$(this).next().show();
			} else {
				//$(".txt_menu").next().show();
				$(this).next().hide();
			}
		})
		.next().find("a").click(function () {
			var txt_menu = $(this).text();
			$(this).parents(".txt_listLayer").prev(".txt_menu").find("span").html(txt_menu);
			$(this).parents(".txt_listLayer").hide();
		});
}

function etcSectionHeight(){ // 통합검색 메인 etcSection height
	var etcSection = $(".tit_menu").parents(".etcSection");  // etcSectionGrp show/hide 이벤트 발생할때만
	var etcSectionL = etcSection.find(".etcSectionL").outerHeight();
	var etcSectionR = etcSection.find(".etcSectionR").outerHeight();
	if(etcSectionL > etcSectionR){
		etcSection.css("height",etcSectionL);
	}else{
		etcSection.css("height",etcSectionR);
	}
	//alert(etcSectionL);
}

function srchListGrp() { // 통합검색 메인 section
	var srchListMenu = $(".etcSectionGrp .tit_menu");
	srchListMenu.click(function () {
		etcSectionHeight();
		if($(this).parent().next().hasClass('hide')){
			$(this).parent().next().removeClass('hide');
			$(this).find('.iconArDown').addClass('iconArUp').removeClass('iconArDown');
			etcSectionHeight();
			$(document).ellipsis();
		}else{
			$(this).parent().next().addClass('hide');
			$(this).find('.iconArUp').addClass('iconArDown').removeClass('iconArUp');
			etcSectionHeight();
			$(document).ellipsis();
		}
    });
}

function directDate() { // 통합검색 snb (검색 설정:직접입력)
//	alert($('.test').text().length);
	$('.directInput input:radio').click(function () {
		//$(this).parent().next(".direct").hide();
		//var f = n.attr('id');
		if($(this).attr('id') == "srchDate6"){
			$(".direct_box").show();
		}else{
			$(".direct_box").hide();
		}
	});
}

function smsEvent() {
	// 예약 전송
    var smsReserve = $(".smsChkBox li input[name=smsReserve]");
    smsReserve.parent().next().addClass("disabled").find("select,input").attr("disabled","disabled");
    smsReserve.click(function () {
    	var reserveThis = $(this).parent().next();
    	if ($(this).attr('id') == "smsReserve2") { // 비활성화
    		reserveThis.addClass("disabled");
    		reserveThis.find("select,input").attr("disabled","disabled");
         } else {										    // 활성화
        	 reserveThis.removeClass("disabled");
        	 reserveThis.find("select,input").removeAttr("disabled","disabled");
         }
    });

    // 보내는 사람
    var smsFrom = $(".smsChkBox li input[name=smsFrom]");
    smsFrom.parent().next().addClass("on").find("input").attr("disabled","disabled");
    smsFrom.click(function () {
		var fromThis = $(this).parent().next();
    	if ($(this).attr('id') == "smsFrom3") { // 비활성화
    		fromThis.removeClass("on");
    		fromThis.find("input").removeAttr("disabled","disabled");
    		fromThis.find("input").focus();
    	} else {										    // 활성화
    		fromThis.addClass("on");
    		fromThis.find("input").attr("disabled","disabled");
    	}
    });

}

function setDynamicList() {
	var $knType =$('.knType, .boType');


	var column = 0;
	var columnHeight = null;
	var $listAllWrap = $knType.find('.listAllWrap');
	var listAllWrapWidth = 0;

	var findMinCol = function() {
		var min=1000000;
		var minPos = -1;
		for(var i=0; i<columnHeight.length; i++) {
			if(columnHeight[i] < min) {
				minPos = i;
				min= columnHeight[i];
			}
		}

		return minPos;
	};
	var findMaxCol = function() {
		var max = 0;
		var maxPos = -1;
		for(var i=0; i<columnHeight.length; i++) {
			if(columnHeight[i]>max) {
				maxPos = i;
				max=columnHeight[i];
			}
		}

		return maxPos;
	};
	var getLeft = function(index) {
		if(index==0) {
			return 0;
		} else if(index!=column-1) {
			return 218*index + Math.floor((listAllWrapWidth-218*column)/(column-1))*index;
		} else {
			return listAllWrapWidth-219;
		}
	};

	$knType
		.on('crear', function(e) {  // 지식 목록화면 초기화 추가 (Added by Sangdon.Kim, 2014-07-08)
	      	column           = 0;
	      	columnHeight     = null;
	      	listAllWrapWidth = 0;
		    dynamicListResize();
		})
		.on('loadList', function(e, addr, param) {
			var $knType = $(this);
			if(!$knType.data('loading')) {
				$knType.data('loading', true);
				$.get(addr, param, function(data, result) {
					if(result==='success') {
						var $list = $('<ul></ul>').html(data).find('>li').css({top:columnHeight[findMaxCol()]+100, left:'50%', marginLeft:-116}).appendTo($listAllWrap);
						setTimeout(function() {
							$knType.trigger('alignList', {list:$list, all:false});
						}, 100);
					} else {
						alert(Alfresco.util.message('swp.com.warring.noLoadData'));
					}

					$knType.data('loading', false);
				});
			}

		})
		.on('alignList', function(e, param) {
			if($knType.hasClass('variableType')) {
				listAllWrapWidth = $listAllWrap.width();
				param && param.list.each(function() {
					var left = findMinCol();
					var leftPos = getLeft(left);
					$(this).removeClass('col0 col1 col2 col3 col4 col5').addClass('load').addClass('col'+left)
						.css({left:leftPos, right:'auto', top:columnHeight[left], marginLeft:0});
					columnHeight[left]=columnHeight[left]+$(this).height()+15;
				});

				$listAllWrap.css({height:columnHeight[findMaxCol()]});
			} else {
				$listAllWrap.find('>li').css({marginLeft:0, left:0}).addClass('load');
			}
		})
		.on('click', '.typeView a', function(e) {
			var target = $(this).attr('href').split('#')[1];
			if(target==='list') {
				$listAllWrap.css({height:$listAllWrap.find('>li').length*95});
				$listAllWrap.find('>li').css({left:0, right:'auto'})
			} else {
				for(var i=0; i<columnHeight.length; i++) {
					columnHeight[i]=0;
				}
				$knType.trigger('alignList', {list:$listAllWrap.find('>li'), all:true})
			}
			e.preventDefault();
		})
		.on('click', '.thumImg .btnPre, .thumImg .btnNext', function(e) {
			var $thumImg = $(this).parent(0);
			var pos = parseInt($thumImg.attr('class').match(/pos([0-9][0-9])/)[1], 10);
			var length=$thumImg.find('img').length;

			if($(this).hasClass('btnPre')) {
				if(pos>1) {
					$thumImg.removeClass('pos01 pos02 pos03 pos04 pos05 pos06 pos07 pos08 pos09');
					$thumImg.addClass('pos0'+(--pos));
				}

			} else {
				if(pos<length) {
					$thumImg.removeClass('pos01 pos02 pos03 pos04 pos05 pos06 pos07 pos08 pos09');
					$thumImg.addClass('pos0'+(++pos));
				}

			}
			e.stopPropagation();
			e.preventDefault();
		});

	var repositionColTimer = null;
	var dynamicListResize = function() {
		var col=Math.floor(($knType.outerWidth()-46)/232);

		clearTimeout(repositionColTimer);
		if(col!=column) {
			column=col;
			columnHeight = [];
			for(var i=0; i<column; i++) {
				columnHeight.push(0);
			}

			$knType.trigger('alignList', {list:$listAllWrap.find('>li'), all:true});
		} else {
			repositionColTimer = setTimeout(function() {
				listAllWrapWidth = $listAllWrap.width();
				for(var i=0; i<column; i++) {
					$listAllWrap.find('>li.col'+i).css({left:getLeft(i)});
				}
			}, 100);
		}
	};
	$(window).on('resize', dynamicListResize);
}
