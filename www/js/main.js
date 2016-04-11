$(document).ajaxStart(function () {
    $("#loader").show();
});
$(document).ajaxStop(function () {
    $("#loader").hide();
});
var MovieObject = (function () {
    function MovieObject(data, template) {
        var MovieData = $.getJSON(data);
        var Template = $.get(template);
        $.when(MovieData, Template)
            .then(this.CreateObject.bind(this), function (e) {
            console.log("Error occured\n\tCode: " + e.status + "\n\tMessage: " + e.statusText.text);
        });
    }
    MovieObject.prototype.ReplaceWithTemplate = function (str, pattern) {
        for (var param in pattern)
            str = str.replace(new RegExp(param, "g"), pattern[param]);
        return str;
    };
    MovieObject.prototype.GenerateSliderItem = function (MovieID, Title, Session, SessionID) {
        return "<li movie-id=\"" + MovieID + "\" session-id=\"" + SessionID + "\">\n                    <section class=\"poster\">\n                        <img src=\"movies/" + MovieID + "/poster.jpg\" alt=\"" + Title + "\" class=\"img-responsive\">\n                        <div class=\"info bgTitle text-center\">\n                            <div class=\"title text-left text-center\">" + Session.Hall + "</div>\n                            <div class=\"price text-left inline-block\">" + Session.Price + "\u0433\u0440\u043D.</div>\n                            <div class=\"session text-right inline-block\">" + Session.Session.substring(11, 16) + "</div>\n                        </div>\n                    </section>\n                </li>";
    };
    MovieObject.prototype.ParseTime = function (str) {
        var datetime = str.split(" ");
        var FromHour = 6;
        var times = datetime[1].split(":");
        var time = (parseInt(times[1], 10) + (parseInt(times[0], 10) * 60)) * 60;
        return (Date.parse(datetime[0] + " 00:00") / 1000 | 0) + (time < FromHour * 3600 ? time + 86400 : time);
    };
    MovieObject.prototype.CreateObject = function (movieData, template) {
        var data = movieData[0];
        var nData = {};
        var _loop_1 = function(i) {
            nData[data[i].MovieID] = { Data: data[i] };
            nData[data[i].MovieID]['html'] = this_1.ReplaceWithTemplate(template[0], {
                '{Title}': data[i].Title,
                '{MovieID}': data[i].MovieID,
                '{SessionStarts}': data[i].SessionStarts,
                '{Year}': data[i].Year,
                '{Country}': data[i].Country,
                '{Genre}': data[i].Genre,
                '{Budget}': data[i].Budget,
                '{Time}': data[i].Time,
                '{Translation}': data[i].Lang,
                '{Actors}': data[i].Actors,
                '{About}': data[i].About,
                '{Video}': data[i].Video
            });
            var session = nData[data[i].MovieID].Data.Sessions;
            var _loop_2 = function(s) {
                session[s]['HTML'] = this_1.GenerateSliderItem(data[i].MovieID, data[i].Title, session[s], s);
                session[s]['Unix'] = this_1.ParseTime(session[s].Session);
                session[s]['HallID'] = (function () {
                    switch (session[s].Hall) {
                        case "Евробазар": return 1;
                        case "Акура Центр": return 2;
                    }
                })();
            };
            for (var s = session.length; s--;) {
                _loop_2(s);
            }
        };
        var this_1 = this;
        for (var i = data.length; i--;) {
            _loop_1(i);
        }
        this.Data = nData;
        this.onLoad(this.Data);
    };
    return MovieObject;
}());
var Api;
(function (Api) {
    Api.Url = {
        Add: {
            Ticket: "https://kndr-prokopenko.c9users.io/ajax/add/ticket",
            Movie: "https://kndr-prokopenko.c9users.io/ajax/add/movie",
            Session: "https://kndr-prokopenko.c9users.io/ajax/add/seance"
        },
        Get: {
            Seats: function (id) {
                return "https://kndr-prokopenko.c9users.io/ajax/seances/" + id;
            },
            Session: function (from, to) {
                return "data.json";
            },
            AllHalls: function () {
                return "https://kndr-prokopenko.c9users.io/ajax/halls";
            },
            Hall: function (id) {
                return "https://kndr-prokopenko.c9users.io/ajax/halls/" + id;
            },
            MoviesList: function () {
                return "https://kndr-prokopenko.c9users.io/ajax/movies";
            }
        },
        Template: {
            Movie: "pages/movie.tpl",
            Ticket: "pages/tickets.tpl"
        }
    };
})(Api || (Api = {}));
var DetailedInfo = (function () {
    function DetailedInfo(Hall, Info, Slider, filterTime, filterDay) {
        if (Hall === void 0) { Hall = $(".hall"); }
        if (Info === void 0) { Info = $(".details"); }
        if (Slider === void 0) { Slider = $("#scrolling ul"); }
        if (filterTime === void 0) { filterTime = $("#seans"); }
        if (filterDay === void 0) { filterDay = $("#day"); }
        this.Hall = Hall;
        this.Info = Info;
        this.Slider = Slider;
        this.Filter = {};
        this.MonthLocale = [
            "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
        this.Days = ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        this.SessionsLocale = [
            "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
            "23:00", "23:30", "0:00", "0:30", "1:00", "1:30"];
        this.Filter["Time"] = filterTime;
        this.Filter["Day"] = filterDay;
    }
    DetailedInfo.prototype.Init = function (Data) {
        var _this = this;
        this.Data = Data;
        Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0; };
        this.SessionsUnix = this.ParseTime(this.SessionsLocale);
        var Now = new Date();
        var NowUnix = Now.getUnixTime() - Now.getHours() * 3600 - Now.getMinutes() * 60 - Now.getSeconds();
        var D = Now.getDate();
        var M = Now.getMonth();
        var Y = Now.getFullYear();
        var MaxDays = new Date(Y, M, 0).getDate();
        var FirstDay = this.ReplaceDays(Now);
        var Selected = {
            Day: 0,
            From: 0,
            To: this.SessionsLocale.length - 1
        };
        var TimeResult = this.CalculateDateRange(Selected, NowUnix);
        this.FindSessions(TimeResult.From, TimeResult.To);
        $(function () {
            _this.Filter.Day.ionRangeSlider({
                type: "single",
                grid: true,
                min: 0,
                max: 6,
                grid_num: 3,
                prettify: function (num) {
                    if (D + num > MaxDays)
                        return FirstDay[num] + " " + (D + num - MaxDays) + " " + _this.MonthLocale[M + 1];
                    return FirstDay[num] + " " + (D + num) + " " + _this.MonthLocale[M];
                },
                onChange: function (obj) {
                    Selected.Day = obj.from;
                    TimeResult = _this.CalculateDateRange(Selected, NowUnix);
                    _this.FindSessions(TimeResult.From, TimeResult.To);
                },
                onFinish: function () {
                    _this.ShowRange(TimeResult.From, TimeResult.To);
                }
            });
            _this.Filter.Time.ionRangeSlider({
                type: "double",
                grid: true,
                from_shadow: true,
                to_shadow: true,
                values: _this.SessionsLocale,
                onStart: function (obj) {
                    var CurrentTime = Now.toLocaleTimeString()
                        .slice(0, 3) + "00";
                    var result = _this.SessionsLocale.indexOf(CurrentTime);
                    obj.from = result > 0 ? result : 0;
                },
                onChange: function (obj) {
                    Selected.From = obj.from;
                    Selected.To = obj.to;
                    TimeResult = _this.CalculateDateRange(Selected, NowUnix);
                    _this.FindSessions(TimeResult.From, TimeResult.To);
                },
                onFinish: function () {
                    _this.ShowRange(TimeResult.From, TimeResult.To);
                }
            });
            _this.ShowRange(TimeResult.From, TimeResult.To);
            _this.Slider.itemslide({
                duration: 0,
                disable_autowidth: false
            });
            $(window).resize(function () {
                var width = 0;
                _this.Slider.find("li").each(function () {
                    width += $(this).outerWidth();
                });
                _this.Slider.css({
                    width: width,
                    transform: "translate3d(" + (($(window).outerWidth() - width - _this.Slider.find(".itemslide-active").outerWidth()) / 2 - 10) + "px, 0px, 0px)"
                });
            });
            _this.Slider.on("changeActiveIndex", function (e) {
                var curSel = $(e.target).children().eq(_this.Slider.getActiveIndex());
                var MID = curSel.attr("movie-id");
                var SID = curSel.attr("session-id");
                if (MID == null || SID == null)
                    return;
                _this.LoadInfo(MID, SID);
            });
            _this.Slider.gotoSlide(Math.round(_this.Slider.children().length / 2));
            _this.Hall.find("input").change(function () {
                _this.FindSessions(TimeResult.From, TimeResult.To);
                _this.ShowRange(TimeResult.From, TimeResult.To);
            });
            $(document).ready(function () {
                $(".fancybox").fancybox();
            });
        });
    };
    DetailedInfo.prototype.CalculateDateRange = function (Selection, Now) {
        var UnixDay = 86400;
        return {
            From: Now + Selection.Day * UnixDay + this.SessionsUnix[Selection.From],
            To: Now + Selection.Day * UnixDay + this.SessionsUnix[Selection.To]
        };
    };
    DetailedInfo.prototype.ReplaceDays = function (now) {
        if (now.getDay() === 0)
            return this.Days;
        var result = this.Days.slice(now.getDay(), 7);
        this.Days.slice(0, now.getDay()).forEach(function (el) {
            result.push(el);
        });
        return result;
    };
    DetailedInfo.prototype.ParseTime = function (obj) {
        var result = [];
        var FromHour = 6;
        for (var i = 0; i < obj.length; i++) {
            var times = obj[i].split(":");
            var time = (parseInt(times[1], 10) + (parseInt(times[0], 10) * 60)) * 60;
            result.push(time < FromHour * 3600 ? time + 86400 : time);
        }
        return result;
    };
    DetailedInfo.prototype.LoadInfo = function (id, sid) {
        var _this = this;
        this.Info.stop(true, true);
        this.Info.animate({ opacity: 0.01 }, 200, function () {
            _this.Info.html(_this.Data[id].html);
            _this.Info.find("button").attr("session-id", sid);
            _this.Info.animate({ opacity: 1 }, 200);
        });
    };
    DetailedInfo.prototype.ShowRange = function (from, to) {
        if (!(typeof (this.xNew) === "object"))
            this.FindSessions.call(from, to);
        if (this.Equals(this.xNew, this.xOld)) {
            return;
        }
        else if ($.isEmptyObject(this.xNew)) {
            this.xOld = JSON.parse(JSON.stringify(this.xNew));
            this.Slider.html("<li>В данный период нет показов</li>");
            if (!$.isEmptyObject(this.Slider.data()))
                this.Slider.reload();
            return;
        }
        var List = this.CreateList();
        if (List.length === 0)
            this.Slider.html("<li>В данный период нет показов</li>");
        else
            this.Slider.html(List);
        if (!$.isEmptyObject(this.Slider.data()))
            this.Slider.reload();
        this.Slider.gotoSlide(Math.round(List.length / 2));
        this.xOld = JSON.parse(JSON.stringify(this.xNew));
    };
    DetailedInfo.prototype.CreateList = function () {
        var List = "";
        var el = this.xNew;
        for (var i in el) {
            for (var j = el[i].length; j--;) {
                List += this.Data[i].Data.Sessions[el[i][j]].HTML;
            }
        }
        return List;
    };
    DetailedInfo.prototype.FindSessions = function (from, to) {
        var Hall = +this.Hall.find(":checked").val();
        var result = {};
        for (var i in this.Data) {
            for (var j = this.Data[i].Data.Sessions.length; j--;) {
                var Unix = this.Data[i].Data.Sessions[j].Unix;
                var HallID = this.Data[i].Data.Sessions[j].HallID;
                if (Unix <= to && Unix >= from) {
                    if (typeof (result[i]) === "undefined")
                        result[i] = [];
                    if (Hall === 0 || HallID === Hall)
                        result[i].push(j);
                }
            }
        }
        this.xNew = result;
    };
    DetailedInfo.prototype.Equals = function (x, y) {
        if (!((typeof (x) === "object") && (typeof (y) === "object")))
            return false;
        var xKeys = Object.keys(x);
        var yKeys = Object.keys(y);
        var Length = xKeys.length;
        if (!(function () {
            if (xKeys.length != yKeys.length)
                return false;
            for (var i = Length; i--;) {
                if (xKeys[i] === yKeys[i])
                    continue;
                else
                    return false;
            }
            return true;
        })())
            return false;
        for (var i in x) {
            if (x[i].length != y[i].length)
                return false;
            for (var j = x[i].length; j--;) {
                if (x[i][j] === y[i][j])
                    continue;
                else
                    return false;
            }
        }
        return true;
    };
    return DetailedInfo;
}());
var TicketsWindow = (function () {
    function TicketsWindow(template) {
        var _this = this;
        this.template = template;
        $.get(template).done(function (data) {
            _this.Template = $(data);
            _this.Init();
        });
    }
    TicketsWindow.prototype.Init = function () {
        var $t = this;
        var T = $t.Template;
        $t.TicketsList = [];
        $t.Parent = $(".details");
        $t.Parent.delegate("button", "click", this.Draw.bind(this));
        $t.Field = T.find(".parking .cars");
        $t.Poster = T.find(".posterblock");
        $t.Title = T.find(".title");
        $t.Session = T.find(".session");
        $t.Hall = T.find(".place");
        $t.LowPrice = T.find(".lightPrice");
        $t.HighPrice = T.find(".heavyPrice");
        $t.Area = T.find("#tickets");
        $t.Order = T.find(".order");
        $t.Checkout = T.find(".checkout");
        $t.Area.delegate(".car", "click", function () {
            $t.Selection.call(this, $t);
        });
    };
    TicketsWindow.prototype.Draw = function () {
        var _this = this;
        this.TicketsReset();
        var Button = this.Parent.find("button");
        var MovieID = Button.attr("movie-id");
        var SessionID = Button.attr("session-id");
        var Data = Movie.Data[MovieID].Data;
        this.Poster.html("<img src='movies/" + MovieID + "/poster.jpg' class='poster' />");
        this.Title.text(Data.Title);
        var Time = new Date(Data.Sessions[SessionID].Unix * 1000).toLocaleString();
        this.Session.text(Time.substring(0, Time.length - 3));
        this.Hall.text(Data.Sessions[SessionID].Hall);
        $.getJSON(Api.Url.Get.Seats(MovieID)).done(function (data) {
            _this.Seats = data.seats;
            _this.Prices = data.prices;
            _this.LowPrice.text(data.prices[0].price + " \u0433\u0440\u043D.");
            _this.HighPrice.text(data.prices[1].price + " \u0433\u0440\u043D.");
            var Park = _this.GeneretePark(data.seats);
            _this.Field.html(Park);
            _this.Field.find(".dragger").draggable({
                containment: [-200, -200, 200, 200]
            });
            _this.Template.modal("show");
        });
    };
    TicketsWindow.prototype.TicketsReset = function () {
        this.TicketsList = [];
        this.Order.hide();
        this.Checkout.html("");
    };
    TicketsWindow.prototype.GeneretePark = function (obj) {
        var row = 1;
        var html = '<div class="dragger"><div class="row"><div class="col-md-12">';
        for (var i in obj) {
            if (obj[i].row != row) {
                html += '</div><div class="col-md-12">';
                row = obj[i].row;
            }
            html += this.GenerateSeat(obj[i]);
        }
        html += '</div></div></div>';
        return html;
    };
    TicketsWindow.prototype.GenerateSeat = function (obj) {
        var cls = obj.type != "light" ? " exp" : "";
        var sold = obj.isFree ? "" : "sold nohover ";
        if (!obj.isFree)
            cls = '';
        return "<div class=\"car " + (sold + cls) + "\" index=\"" + obj.index + "\"></div>";
    };
    TicketsWindow.prototype.Selection = function ($parent) {
        var i = $(this).attr("index");
        var Type = $parent.Seats[i].type === "light" ? true : false;
        var ticket = {
            type: Type ? "Легковик" : "Внедорожник",
            price: Type ? $parent.Prices[0].price : $parent.Prices[1].price,
            row: $(this).parent().index() + 1,
            col: $(this).index() + 1,
            getTicket: function () {
                var $this = this;
                return "<div class=\"ticket-container\">\n                            <div class=\"ticket\">\n                            <div class=\"name\">\n                                <h6>\u0422\u0438\u043F:</h6>\n                                <h6>\u0420\u044F\u0434:</h6>\n                                <h6>\u041C\u0435\u0441\u0442\u043E:</h6>\n                                <h6>\u0426\u0435\u043D\u0430:</h6>\n                            </div>\n                            <div class=\"type\">\n                                <h6>" + $this.type + "</h6>\n                                <h6>" + $this.row + "</h6>\n                                <h6>" + $this.col + "</h6>\n                                <h6>" + $this.price + "</h6>\n                            </div>\n                        </div>\n                    </div>";
            }
        };
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            if ($(this).hasClass("exp"))
                $(this).removeClass("Big");
            if ($parent.TicketsList.length == 1)
                $parent.TicketsList = [];
            else {
                for (var i_1 in $parent.TicketsList) {
                    if ($parent.TicketsList[i_1].row == ticket.row && $parent.TicketsList[i_1].col == ticket.col) {
                        $parent.TicketsList.splice(i_1, 1);
                        break;
                    }
                }
            }
        }
        else {
            $(this).addClass("selected");
            if ($(this).hasClass("exp"))
                $(this).addClass("Big");
            $parent.TicketsList.push(ticket);
        }
        $parent.PrintTickets();
    };
    TicketsWindow.prototype.PrintTickets = function () {
        var _this = this;
        if (this.TicketsList.length == 0) {
            this.Checkout.html("");
            this.Order.hide();
            return;
        }
        this.Order.show();
        var total = 0;
        this.Checkout.html("");
        this.TicketsList.forEach(function (tiket) {
            _this.Checkout.append(tiket.getTicket());
            total += tiket.price;
            _this.Checkout.append("<span>+</span>");
        });
        this.Checkout.find("span:last").html('=' + total + ' грн.').after('<div class="col-md-12"><button type="button" class="btn btn-danger">Сделать заказ</button></div>');
    };
    return TicketsWindow;
}());
var Movie = new MovieObject(Api.Url.Get.Session("2016-01-01", "2016-05-05"), Api.Url.Template.Movie);
var Details = new DetailedInfo();
var Ticket = new TicketsWindow(Api.Url.Template.Ticket);
Movie.onLoad = function () {
    Details.Init(Movie.Data);
};

//# sourceMappingURL=main.js.map
