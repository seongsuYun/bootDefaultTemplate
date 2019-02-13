 /*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
scheduler.config.icons_select = ["icon_details", "icon_delete"];
scheduler.config.details_on_create = !0;
scheduler.xy.menu_width = 0;
scheduler.attachEvent("onClick", function(b) {
	scheduler.showQuickInfo(b);
	return !0
});
(function() {
	for (var b = ["onEmptyClick", "onViewChange", "onLightbox", "onBeforeEventDelete", "onBeforeDrag"], a = function() {
		scheduler._hideQuickInfo();
		return !0
	}, c = 0; c < b.length; c++)
		scheduler.attachEvent(b[c], a)
})();
scheduler.templates.quick_info_title = function(b, a, c) {
	return c.text.substr(0, 50)
};
scheduler.templates.quick_info_content = function(b, a, c) {
	return c.details || c.text
};
scheduler.templates.quick_info_date = function(b, a, c) {
	return scheduler.isOneDayEvent(c) ? scheduler.templates.day_date(b, a, c) + " " + scheduler.templates.event_header(b, a, c) : scheduler.templates.week_date(b, a, c)
};
scheduler.showQuickInfo = function(b) {
	if (b != this._quick_info_box_id) {
		this.hideQuickInfo(!0);
		var a = this._get_event_counter_part(b);
		if (a)
			this._quick_info_box = this._init_quick_info(a), this._fill_quick_data(b), this._show_quick_info(a)
	}
};
scheduler._hideQuickInfo = function() {
	scheduler.hideQuickInfo()
};
scheduler.hideQuickInfo = function(b) {
	var a = this._quick_info_box;
	this._quick_info_box_id = 0;
	if (a && a.parentNode) {
		if (scheduler.config.quick_info_detached)
			return a.parentNode.removeChild(a);
		a.style.right == "auto" ? a.style.left = "-350px" : a.style.right = "-350px";
		b && a.parentNode.removeChild(a)
	}
};
dhtmlxEvent(window, "keydown", function(b) {
	b.keyCode == 27 && scheduler.hideQuickInfo()
});
scheduler._show_quick_info = function(b) {
	var a = scheduler._quick_info_box;
	if (scheduler.config.quick_info_detached) {
		scheduler._obj.appendChild(a);
		var c = a.offsetWidth, e = a.offsetHeight;
		a.style.left = b.left - b.dx * (c - b.width) + "px";
		a.style.top = b.top - (b.dy ? e : -b.height) + "px"
	} else
		a.style.top = this.xy.scale_height + this.xy.nav_height + 20 + "px", b.dx == 1 ? (a.style.right = "auto", a.style.left = "-300px", setTimeout(function() {
			a.style.left = "-10px"
		}, 1)) : (a.style.left = "auto", a.style.right = "-300px", setTimeout(function() {
			a.style.right = 
			"-10px"
		}, 1)), a.className = a.className.replace("dhx_qi_left", "").replace("dhx_qi_left", "") + " dhx_qi_" + (b == 1 ? "left" : "right"), scheduler._obj.appendChild(a)
};
scheduler._init_quick_info = function() {
	if (!this._quick_info_box) {
		var b = scheduler.xy, a = this._quick_info_box = document.createElement("div");
		a.className = "dhx_cal_quick_info";
		scheduler.$testmode && (a.className += " dhx_no_animate");
		var c = '<div class="dhx_cal_qi_title" style="height:' + b.quick_info_title + 'px"><div class="dhx_cal_qi_tcontent"></div><div  class="dhx_cal_qi_tdate"></div></div><div class="dhx_cal_qi_content"></div>';
		c += '<div class="dhx_cal_qi_controls" style="height:' + b.quick_info_buttons + 'px">';
		for (var e = scheduler.config.icons_select, d = 0; d < e.length; d++)
			c += '<div class="dhx_qi_big_icon ' + e[d] + '" title="' + scheduler.locale.labels[e[d]] + "\"><div class='dhx_menu_icon " + e[d] + "'></div><div>" + scheduler.locale.labels[e[d]] + "</div></div>";
		c += "</div>";
		a.innerHTML = c;
		dhtmlxEvent(a, "click", function(a) {
			a = a || event;
			scheduler._qi_button_click(a.target || a.srcElement)
		});
		scheduler.config.quick_info_detached && dhtmlxEvent(scheduler._els.dhx_cal_data[0], "scroll", function() {
			scheduler.hideQuickInfo()
		})
	}
	return this._quick_info_box
};
scheduler._qi_button_click = function(b) {
	var a = scheduler._quick_info_box;
	if (b && b != a) {
		var c = b.className;
		if (c.indexOf("_icon") != -1) {
			var e = scheduler._quick_info_box_id;
			scheduler._click.buttons[c.split(" ")[1].replace("icon_", "")](e)
		} else
			scheduler._qi_button_click(b.parentNode)
	}
};
scheduler._get_event_counter_part = function(b) {
	for (var a = scheduler.getRenderedEvent(b), c = 0, e = 0, d = a; d && d != scheduler._obj; )
		c += d.offsetLeft, e += d.offsetTop - d.scrollTop, d = d.offsetParent;
	if (d) {
		var f = c + a.offsetWidth / 2 > scheduler._x / 2 ? 1 : 0, g = e + a.offsetHeight / 2 > scheduler._y / 2 ? 1 : 0;
		return {left: c,top: e,dx: f,dy: g,width: a.offsetWidth,height: a.offsetHeight}
	}
	return 0
};
scheduler._fill_quick_data = function(b) {
	var a = scheduler.getEvent(b), c = scheduler._quick_info_box;
	scheduler._quick_info_box_id = b;
	var e = c.firstChild.firstChild;
	e.innerHTML = scheduler.templates.quick_info_title(a.start_date, a.end_date, a);
	var d = e.nextSibling;
	d.innerHTML = scheduler.templates.quick_info_date(a.start_date, a.end_date, a);
	var f = c.firstChild.nextSibling;
	f.innerHTML = scheduler.templates.quick_info_content(a.start_date, a.end_date, a)
};
