 /*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
scheduler.config.limit_start = null;
scheduler.config.limit_end = null;
scheduler.config.limit_view = !1;
scheduler.config.check_limits = !0;
scheduler.config.mark_now = !0;
scheduler.config.display_marked_timespans = !0;
(scheduler._temp_limit_scope = function() {
    function A(b, a, c, d, e) {
        function g(a, b, c, d) {
            var e = [];
            if (a && a[b])
                for (var g = a[b], i = h(c, d, g), k = 0; k < i.length; k++)
                    e = f._add_timespan_zones(e, i[k].zones);
            return e
        }
        function h(a, b, c) {
            var d = c[b] && c[b][e] ? c[b][e] : c[a] && c[a][e] ? c[a][e] : [];
            return d
        }
        var f = scheduler, i = [], l = {_props: "map_to",matrix: "y_property"}, m;
        for (m in l) {
            var n = l[m];
            if (f[m])
                for (var k in f[m]) {
                    var o = f[m][k], j = o[n];
                    b[j] && (i = f._add_timespan_zones(i, g(a[k], b[j], c, d)))
                }
        }
        return i = f._add_timespan_zones(i, g(a, "global", 
        c, d))
    }
    var u = null, t = "dhx_time_block", v = "default", B = function(b, a, c) {
        a instanceof Date && c instanceof Date ? (b.start_date = a, b.end_date = c) : (b.days = a, b.zones = c);
        return b
    }, x = function(b, a, c) {
        var d = typeof b == "object" ? b : {days: b};
        d.type = t;
        d.css = "";
        if (a) {
            if (c)
                d.sections = c;
            d = B(d, b, a)
        }
        return d
    };
    scheduler.blockTime = function(b, a, c) {
        var d = x(b, a, c);
        return scheduler.addMarkedTimespan(d)
    };
    scheduler.unblockTime = function(b, a, c) {
        var a = a || "fullday", d = x(b, a, c);
        return scheduler.deleteMarkedTimespan(d)
    };
    scheduler.attachEvent("onBeforeViewChange", 
    function(b, a, c, d) {
        d = d || a;
        c = c || b;
        return scheduler.config.limit_view && (d.valueOf() > scheduler.config.limit_end.valueOf() || this.date.add(d, 1, c) <= scheduler.config.limit_start.valueOf()) ? (setTimeout(function() {
            scheduler.setCurrentView(scheduler._date, c)
        }, 1), !1) : !0
    });
    scheduler.checkInMarkedTimespan = function(b, a, c) {
        for (var a = a || v, d = !0, e = new Date(b.start_date.valueOf()), g = scheduler.date.add(e, 1, "day"), h = scheduler._marked_timespans; e < b.end_date; e = scheduler.date.date_part(g), g = scheduler.date.add(e, 1, "day")) {
            var f = 
            +scheduler.date.date_part(new Date(e)), i = e.getDay(), l = A(b, h, i, f, a);
            if (l)
                for (var m = 0; m < l.length; m += 2) {
                    var n = scheduler._get_zone_minutes(e), k = b.end_date > g || b.end_date.getDate() != e.getDate() ? 1440 : scheduler._get_zone_minutes(b.end_date), o = l[m], j = l[m + 1];
                    if (o < k && j > n && (d = c == "function" ? c(b, n, k, o, j) : !1, !d))
                        break
                }
        }
        return !d
    };
    var s = scheduler.checkLimitViolation = function(b) {
        if (!b)
            return !0;
        if (!scheduler.config.check_limits)
            return !0;
        for (var a = scheduler, c = a.config, d = [], d = b.rec_type ? scheduler.getRecDates(b) : [b], e = 
        !0, g = 0; g < d.length; g++) {
            var h = !0, f = d[g];
            f._timed = scheduler.isOneDayEvent(f);
            (h = c.limit_start && c.limit_end ? f.start_date.valueOf() >= c.limit_start.valueOf() && f.end_date.valueOf() <= c.limit_end.valueOf() : !0) && (h = !scheduler.checkInMarkedTimespan(f, t, function(b, c, d, e, f) {
                var g = !0;
                if (c <= f && c >= e) {
                    if (f == 1440 || d < f)
                        g = !1;
                    b._timed && a._drag_id && a._drag_mode == "new-size" ? (b.start_date.setHours(0), b.start_date.setMinutes(f)) : g = !1
                }
                if (d >= e && d < f || c < e && d > f)
                    b._timed && a._drag_id && a._drag_mode == "new-size" ? (b.end_date.setHours(0), 
                    b.end_date.setMinutes(e)) : g = !1;
                return g
            }));
            if (!h)
                a._drag_id = null, a._drag_mode = null, h = a.checkEvent("onLimitViolation") ? a.callEvent("onLimitViolation", [f.id, f]) : h;
            e = e && h
        }
        return e
    };
    scheduler.attachEvent("onMouseDown", function(b) {
        return !(b = t)
    });
    scheduler.attachEvent("onBeforeDrag", function(b) {
        return !b ? !0 : s(scheduler.getEvent(b))
    });
    scheduler.attachEvent("onClick", function(b) {
        return s(scheduler.getEvent(b))
    });
    scheduler.attachEvent("onBeforeLightbox", function(b) {
        var a = scheduler.getEvent(b);
        u = [a.start_date, 
            a.end_date];
        return s(a)
    });
    scheduler.attachEvent("onEventSave", function(b, a) {
        if (!a.start_date || !a.end_date) {
            var c = scheduler.getEvent(b);
            a.start_date = new Date(c.start_date);
            a.end_date = new Date(c.end_date)
        }
        if (a.rec_type) {
            var d = scheduler._lame_clone(a);
            scheduler._roll_back_dates(d);
            return s(d)
        }
        return s(a)
    });
    scheduler.attachEvent("onEventAdded", function(b) {
        if (!b)
            return !0;
        var a = scheduler.getEvent(b);
        if (!s(a) && scheduler.config.limit_start && scheduler.config.limit_end) {
            if (a.start_date < scheduler.config.limit_start)
                a.start_date = 
                new Date(scheduler.config.limit_start);
            if (a.start_date.valueOf() >= scheduler.config.limit_end.valueOf())
                a.start_date = this.date.add(scheduler.config.limit_end, -1, "day");
            if (a.end_date < scheduler.config.limit_start)
                a.end_date = new Date(scheduler.config.limit_start);
            if (a.end_date.valueOf() >= scheduler.config.limit_end.valueOf())
                a.end_date = this.date.add(scheduler.config.limit_end, -1, "day");
            if (a.start_date.valueOf() >= a.end_date.valueOf())
                a.end_date = this.date.add(a.start_date, this.config.event_duration || this.config.time_step, 
                "minute");
            a._timed = this.isOneDayEvent(a)
        }
        return !0
    });
    scheduler.attachEvent("onEventChanged", function(b) {
        if (!b)
            return !0;
        var a = scheduler.getEvent(b);
        if (!s(a)) {
            if (!u)
                return !1;
            a.start_date = u[0];
            a.end_date = u[1];
            a._timed = this.isOneDayEvent(a)
        }
        return !0
    });
    scheduler.attachEvent("onBeforeEventChanged", function(b) {
        return s(b)
    });
    scheduler.attachEvent("onBeforeEventCreated", function(b) {
        var a = scheduler.getActionData(b).date, c = {_timed: !0,start_date: a,end_date: scheduler.date.add(a, scheduler.config.time_step, "minute")};
        return s(c)
    });
    scheduler.attachEvent("onViewChange", function() {
        scheduler._mark_now()
    });
    scheduler.attachEvent("onSchedulerResize", function() {
        window.setTimeout(function() {
            scheduler._mark_now()
        }, 1);
        return !0
    });
    scheduler.attachEvent("onTemplatesReady", function() {
        scheduler._mark_now_timer = window.setInterval(function() {
            scheduler._mark_now()
        }, 6E4)
    });
    scheduler._mark_now = function(b) {
        var a = "dhx_now_time";
        this._els[a] || (this._els[a] = []);
        var c = scheduler._currentDate(), d = this.config;
        scheduler._remove_mark_now();
        if (!b && d.mark_now && c < this._max_date && c > this._min_date && c.getHours() >= d.first_hour && c.getHours() < d.last_hour) {
            var e = this.locate_holder_day(c);
            this._els[a] = scheduler._append_mark_now(e, c)
        }
    };
    scheduler._append_mark_now = function(b, a) {
        var c = "dhx_now_time", d = scheduler._get_zone_minutes(a), e = {zones: [d, d + 1],css: c,type: c};
        if (this._table_view) {
            if (this._mode == "month")
                return e.days = +scheduler.date.date_part(a), scheduler._render_marked_timespan(e, null, null)
        } else if (this._props && this._props[this._mode]) {
            for (var g = 
            this._els.dhx_cal_data[0].childNodes, h = [], f = 0; f < g.length - 1; f++) {
                var i = b + f;
                e.days = i;
                var l = scheduler._render_marked_timespan(e, null, i)[0];
                h.push(l)
            }
            return h
        } else
            return e.days = b, scheduler._render_marked_timespan(e, null, b)
    };
    scheduler._remove_mark_now = function() {
        for (var b = "dhx_now_time", a = this._els[b], c = 0; c < a.length; c++) {
            var d = a[c], e = d.parentNode;
            e && e.removeChild(d)
        }
        this._els[b] = []
    };
    scheduler._marked_timespans = {global: {}};
    scheduler._get_zone_minutes = function(b) {
        return b.getHours() * 60 + b.getMinutes()
    };
    scheduler._prepare_timespan_options = function(b) {
        var a = [], c = [];
        if (b.days == "fullweek")
            b.days = [0, 1, 2, 3, 4, 5, 6];
        if (b.days instanceof Array) {
            for (var d = b.days.slice(), e = 0; e < d.length; e++) {
                var g = scheduler._lame_clone(b);
                g.days = d[e];
                a.push.apply(a, scheduler._prepare_timespan_options(g))
            }
            return a
        }
        if (!b || !(b.start_date && b.end_date && b.end_date > b.start_date || b.days !== void 0 && b.zones))
            return a;
        var h = 0, f = 1440;
        if (b.zones == "fullday")
            b.zones = [h, f];
        if (b.zones && b.invert_zones)
            b.zones = scheduler.invertZones(b.zones);
        b.id = 
        scheduler.uid();
        b.css = b.css || "";
        b.type = b.type || v;
        var i = b.sections;
        if (i)
            for (var l in i) {
                if (i.hasOwnProperty(l)) {
                    var m = i[l];
                    m instanceof Array || (m = [m]);
                    for (e = 0; e < m.length; e++) {
                        var n = scheduler._lame_copy({}, b);
                        n.sections = {};
                        n.sections[l] = m[e];
                        c.push(n)
                    }
                }
            }
        else
            c.push(b);
        for (var k = 0; k < c.length; k++) {
            var o = c[k], j = o.start_date, p = o.end_date;
            if (j && p)
                for (var q = scheduler.date.date_part(new Date(j)), w = scheduler.date.add(q, 1, "day"); q < p; ) {
                    n = scheduler._lame_copy({}, o);
                    delete n.start_date;
                    delete n.end_date;
                    n.days = 
                    q.valueOf();
                    var r = j > q ? scheduler._get_zone_minutes(j) : h, s = p > w || p.getDate() != q.getDate() ? f : scheduler._get_zone_minutes(p);
                    n.zones = [r, s];
                    a.push(n);
                    q = w;
                    w = scheduler.date.add(w, 1, "day")
                }
            else {
                if (o.days instanceof Date)
                    o.days = scheduler.date.date_part(o.days).valueOf();
                o.zones = b.zones.slice();
                a.push(o)
            }
        }
        return a
    };
    scheduler._get_dates_by_index = function(b, a, c) {
        for (var d = [], a = scheduler.date.date_part(new Date(a || scheduler._min_date)), c = new Date(c || scheduler._max_date), e = a.getDay(), g = b - e >= 0 ? b - e : 7 - a.getDay() + b, 
        h = scheduler.date.add(a, g, "day"); h < c; h = scheduler.date.add(h, 1, "week"))
            d.push(h);
        return d
    };
    scheduler._get_css_classes_by_config = function(b) {
        var a = [];
        b.type == t && (a.push(t), b.css && a.push(t + "_reset"));
        a.push("dhx_marked_timespan", b.css);
        return a.join(" ")
    };
    scheduler._get_block_by_config = function(b) {
        var a = document.createElement("DIV");
        if (b.html)
            typeof b.html == "string" ? a.innerHTML = b.html : a.appendChild(b.html);
        return a
    };
    scheduler._render_marked_timespan = function(b, a, c) {
        var d = [], e = scheduler.config, g = this._min_date, 
        h = this._max_date, f = !1;
        if (!e.display_marked_timespans)
            return d;
        if (!c && c !== 0) {
            if (b.days < 7)
                c = b.days;
            else {
                var i = new Date(b.days), f = +i;
                if (!(+h >= +i && +g <= +i))
                    return d;
                c = i.getDay()
            }
            var l = g.getDay();
            l > c ? c = 7 - (l - c) : c -= l
        }
        var m = b.zones, n = scheduler._get_css_classes_by_config(b);
        if (scheduler._table_view && scheduler._mode == "month") {
            var k = [], o = [];
            if (a)
                k.push(a), o.push(c);
            else
                for (var o = f ? [f] : scheduler._get_dates_by_index(c), j = 0; j < o.length; j++)
                    k.push(this._scales[o[j]]);
            for (j = 0; j < k.length; j++)
                for (var a = k[j], c = o[j], 
                p = 0; p < m.length; p += 2) {
                	if (typeof a === 'undefined')
                        continue;
                    var q = m[j], s = m[j + 1];
                    if (s <= q)
                        return [];
                    var r = scheduler._get_block_by_config(b);
                    r.className = n;
                    var t = a.offsetHeight - 1, u = a.offsetWidth - 1, v = Math.floor((this._correct_shift(c, 1) - g.valueOf()) / (864E5 * this._cols.length)), x = this.locate_holder_day(c, !1) % this._cols.length, A = this._colsS[x], B = this._colsS.heights[v] + (this._colsS.height ? this.xy.month_scale_height + 2 : 2) - 1;
                    r.style.top = B + "px";
                    r.style.lineHeight = r.style.height = t + "px";
                    r.style.left = A + Math.round(q / 1440 * u) + "px";
                    r.style.width = Math.round((s - 
                    q) / 1440 * u) + "px";
                    a.appendChild(r);
                    d.push(r)
                }
        } else {
            var y = c;
            if (this._props && this._props[this._mode] && b.sections && b.sections[this._mode]) {
                var z = this._props[this._mode], y = z.order[b.sections[this._mode]];
                z.size && y > z.position + z.size && (y = 0)
            }
            a = a ? a : scheduler.locate_holder(y);
            for (j = 0; j < m.length; j += 2) {
                q = Math.max(m[j], e.first_hour * 60);
                s = Math.min(m[j + 1], e.last_hour * 60);
                if (s <= q)
                    if (j + 2 < m.length)
                        continue;
                    else
                        return [];
                r = scheduler._get_block_by_config(b);
                r.className = n;
                var D = this.config.hour_size_px * 24 + 1, C = 36E5;
                r.style.top = 
                Math.round((q * 6E4 - this.config.first_hour * C) * this.config.hour_size_px / C) % D + "px";
                r.style.lineHeight = r.style.height = Math.max(Math.round((s - q) * 6E4 * this.config.hour_size_px / C) % D, 1) + "px";
                a.appendChild(r);
                d.push(r)
            }
        }
        return d
    };
    scheduler.markTimespan = function(b) {
        var a = scheduler._prepare_timespan_options(b);
        if (a.length) {
            for (var c = [], d = 0; d < a.length; d++) {
                var e = a[d], g = scheduler._render_marked_timespan(e, null, null);
                g.length && c.push.apply(c, g)
            }
            return c
        }
    };
    scheduler.unmarkTimespan = function(b) {
        if (b)
            for (var a = 0; a < b.length; a++) {
                var c = 
                b[a];
                c.parentNode && c.parentNode.removeChild(c)
            }
    };
    scheduler._marked_timespans_ids = {};
    scheduler.addMarkedTimespan = function(b) {
        var a = scheduler._prepare_timespan_options(b), c = "global";
        if (a.length) {
            var d = a[0].id, e = scheduler._marked_timespans, g = scheduler._marked_timespans_ids;
            g[d] || (g[d] = []);
            for (var h = 0; h < a.length; h++) {
                var f = a[h], i = f.days, l = f.zones, m = f.css, n = f.sections, k = f.type;
                f.id = d;
                if (n)
                    for (var o in n) {
                        if (n.hasOwnProperty(o)) {
                            e[o] || (e[o] = {});
                            var j = n[o], p = e[o];
                            p[j] || (p[j] = {});
                            p[j][i] || (p[j][i] = {});
                            if (!p[j][i][k]) {
                                p[j][i][k] = 
                                [];
                                if (!scheduler._marked_timespans_types)
                                    scheduler._marked_timespans_types = {};
                                scheduler._marked_timespans_types[k] || (scheduler._marked_timespans_types[k] = !0)
                            }
                            var q = p[j][i][k];
                            f._array = q;
                            q.push(f);
                            g[d].push(f)
                        }
                    }
                else {
                    e[c][i] || (e[c][i] = {});
                    e[c][i][k] || (e[c][i][k] = []);
                    if (!scheduler._marked_timespans_types)
                        scheduler._marked_timespans_types = {};
                    scheduler._marked_timespans_types[k] || (scheduler._marked_timespans_types[k] = !0);
                    q = e[c][i][k];
                    f._array = q;
                    q.push(f);
                    g[d].push(f)
                }
            }
            return d
        }
    };
    scheduler._add_timespan_zones = 
    function(b, a) {
        var c = b.slice(), a = a.slice();
        if (!c.length)
            return a;
        for (var d = 0; d < c.length; d += 2)
            for (var e = c[d], g = c[d + 1], h = d + 2 == c.length, f = 0; f < a.length; f += 2) {
                var i = a[f], l = a[f + 1];
                if (l > g && i <= g || i < e && l >= e)
                    c[d] = Math.min(e, i), c[d + 1] = Math.max(g, l), d -= 2;
                else {
                    if (!h)
                        continue;
                    var m = e > i ? 0 : 2;
                    c.splice(d + m, 0, i, l)
                }
                a.splice(f--, 2);
                break
            }
        return c
    };
    scheduler._subtract_timespan_zones = function(b, a) {
        for (var c = b.slice(), d = 0; d < c.length; d += 2)
            for (var e = c[d], g = c[d + 1], h = 0; h < a.length; h += 2) {
                var f = a[h], i = a[h + 1];
                if (i > e && f < g) {
                    var l = 
                    !1;
                    e >= f && g <= i && c.splice(d, 2);
                    e < f && (c.splice(d, 2, e, f), l = !0);
                    g > i && c.splice(l ? d + 2 : d, l ? 0 : 2, i, g);
                    d -= 2;
                    break
                }
            }
        return c
    };
    scheduler.invertZones = function(b) {
        return scheduler._subtract_timespan_zones([0, 1440], b.slice())
    };
    scheduler._delete_marked_timespan_by_id = function(b) {
        var a = scheduler._marked_timespans_ids[b];
        if (a)
            for (var c = 0; c < a.length; c++)
                for (var d = a[c], e = d._array, g = 0; g < e.length; g++)
                    if (e[g] == d) {
                        e.splice(g, 1);
                        break
                    }
    };
    scheduler._delete_marked_timespan_by_config = function(b) {
        var a = scheduler._marked_timespans, 
        c = b.sections, d = b.days, e = b.type || v, g = [];
        if (c)
            for (var h in c) {
                if (c.hasOwnProperty(h) && a[h]) {
                    var f = c[h];
                    a[h][f] && a[h][f][d] && a[h][f][d][e] && (g = a[h][f][d][e])
                }
            }
        else
            a.global[d] && a.global[d][e] && (g = a.global[d][e]);
        for (var i = 0; i < g.length; i++) {
            var l = g[i], m = scheduler._subtract_timespan_zones(l.zones, b.zones);
            if (m.length)
                l.zones = m;
            else {
                g.splice(i, 1);
                i--;
                for (var n = scheduler._marked_timespans_ids[l.id], k = 0; k < n.length; k++)
                    if (n[k] == l) {
                        n.splice(k, 1);
                        break
                    }
            }
        }
    };
    scheduler.deleteMarkedTimespan = function(b) {
        if (!arguments.length)
            scheduler._marked_timespans = 
            {global: {}}, scheduler._marked_timespans_ids = {}, scheduler._marked_timespans_types = {};
        if (typeof b != "object")
            scheduler._delete_marked_timespan_by_id(b);
        else {
            if (!b.start_date || !b.end_date) {
                if (!b.days)
                    b.days = "fullweek";
                if (!b.zones)
                    b.zones = "fullday"
            }
            var a = [];
            if (b.type)
                a.push(b.type);
            else
                for (var c in scheduler._marked_timespans_types)
                    a.push(c);
            for (var d = scheduler._prepare_timespan_options(b), e = 0; e < d.length; e++)
                for (var g = d[e], h = 0; h < a.length; h++) {
                    var f = scheduler._lame_clone(g);
                    f.type = a[h];
                    scheduler._delete_marked_timespan_by_config(f)
                }
        }
    };
    scheduler._get_types_to_render = function(b, a) {
        var c = b ? b : {}, d;
        for (d in a || {})
            a.hasOwnProperty(d) && (c[d] = a[d]);
        return c
    };
    scheduler._get_configs_to_render = function(b) {
        var a = [], c;
        for (c in b)
            b.hasOwnProperty(c) && a.push.apply(a, b[c]);
        return a
    };
    scheduler.attachEvent("onScaleAdd", function(b, a) {
        if (!(scheduler._table_view && scheduler._mode != "month")) {
            var c = a.getDay(), d = a.valueOf(), e = this._mode, g = scheduler._marked_timespans, h = [];
            if (this._props && this._props[e]) {
                var f = this._props[e], i = f.options, l = scheduler._get_unit_index(f, 
                a), m = i[l], a = scheduler.date.date_part(new Date(this._date)), c = a.getDay(), d = a.valueOf();
                if (g[e] && g[e][m.key]) {
                    var n = g[e][m.key], k = scheduler._get_types_to_render(n[c], n[d]);
                    h.push.apply(h, scheduler._get_configs_to_render(k))
                }
            }
            var o = g.global, j = o[d] || o[c];
            h.push.apply(h, scheduler._get_configs_to_render(j));
            for (var p = 0; p < h.length; p++)
                scheduler._render_marked_timespan(h[p], b, a)
        }
    })
})();
