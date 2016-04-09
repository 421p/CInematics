interface IFilter{
    Day?:JQuery
    Time?:JQuery
}
interface ISelection{
    Day:number
    From:number
    To:number
}
class DetailedInfo{
    public Filter:IFilter = {};
    private xOld;
    private xNew;
    private SessionsUnix:Array<number>;
    public Data:Object;
    private MonthLocale = [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    private Days = ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    private SessionsLocale = [
        "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
        "23:00", "23:30", "0:00", "0:30", "1:00", "1:30"];

    constructor(public Hall:JQuery = $(".hall"),
                public Info:JQuery = $(".details"),
                public Slider:JQuery = $("#scrolling ul"),
                filterTime:JQuery = $("#seans"),
                filterDay:JQuery = $("#day")){
        this.Filter["Time"] = filterTime;
        this.Filter["Day"] = filterDay;
    }

    Init(Data:Object){
        this.Data = Data;
        //Unix Time Prototype
        Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };

        //Parse Sessions to UnixTime format
        this.SessionsUnix = this.ParseTime(this.SessionsLocale);


        /*********************************
         * Init Filters
         ********************************/
        let Now = new Date();
        let NowUnix = Now.getUnixTime() - Now.getHours()*3600 - Now.getMinutes()*60 - Now.getSeconds();
        let D = Now.getDate();
        let M = Now.getMonth();
        let Y = Now.getFullYear();
        let MaxDays = new Date(Y,M,0).getDate();
        let FirstDay = this.ReplaceDays(Now);
        let Selected:ISelection = {
            Day: 0,
            From: 0,
            To: this.SessionsLocale.length-1
        };

        let TimeResult = this.CalculateDateRange(Selected, NowUnix);
        this.FindSessions(TimeResult.From, TimeResult.To);


        $(()=> {

            //Init DayFilter
            this.Filter.Day.ionRangeSlider({
                type: "single",
                grid: true,
                min: 0,
                max: 6,
                grid_num: 3,
                prettify: (num) => {
                    if (D + num > MaxDays)
                        return `${FirstDay[num]} ${D + num - MaxDays} ${this.MonthLocale[M + 1]}`;
                    return `${FirstDay[num]} ${D + num} ${this.MonthLocale[M]}`;
                },
                onChange: (obj) => {
                    Selected.Day = obj.from;
                    TimeResult = this.CalculateDateRange(Selected, NowUnix);
                    this.FindSessions(TimeResult.From, TimeResult.To);
                },
                onFinish: () =>{
                    this.ShowRange(TimeResult.From, TimeResult.To);
                }
            });

            //Init TimeFilter
            this.Filter.Time.ionRangeSlider({
                type: "double",
                grid: true,
                from_shadow: true,
                to_shadow: true,
                values: this.SessionsLocale,
                onStart: (obj) => {
                    let CurrentTime = Now.toLocaleTimeString()
                            .slice(0, 3) + "00";
                    let result = this.SessionsLocale.indexOf(CurrentTime);
                    obj.from = result > 0 ? result : 0;
                },
                onChange: (obj) => {
                    Selected.From = obj.from;
                    Selected.To = obj.to;
                    TimeResult = this.CalculateDateRange(Selected, NowUnix);
                    this.FindSessions(TimeResult.From, TimeResult.To);
                },
                onFinish: () =>{
                    this.ShowRange(TimeResult.From, TimeResult.To);
                }


            });

            //Init SessionSlider

            this.ShowRange(TimeResult.From, TimeResult.To);
            this.Slider.itemslide({
                duration: 0,
                disable_autowidth: true
            });


            $(window).resize(() =>{
                let width = 0;
                this.Slider.find("li").each(function(){
                    width+= $(this).outerWidth();
                });
                this.Slider.css("transform", `translate3d(${($(window).width() - width - this.Slider.find(".itemslide-active").outerWidth())/2}px, 0px, 0px)`);

            });

            //Init SessionSlider Info Load
            this.Slider.on("changeActiveIndex", (e) => {
                let curSel = $(e.target).children().eq(this.Slider.getActiveIndex());

                let MID = curSel.attr("movie-id");
                let SID = curSel.attr("session-id");

                if(MID == null || SID == null) return;

                this.LoadInfo(MID, SID);
            });
            this.Slider.gotoSlide(Math.round(this.Slider.children().length/2));

            //Init Hall Filter
            this.Hall.find("input").change(() =>{
                this.FindSessions(TimeResult.From, TimeResult.To);
                this.ShowRange(TimeResult.From, TimeResult.To);
            });

            //FancyBox
            $(document).ready(function() {
                $(".fancybox").fancybox();
            });


        });
    }

    CalculateDateRange(Selection:ISelection, Now:number){
        const UnixDay = 86400;
        return {
            From: Now + Selection.Day*UnixDay + this.SessionsUnix[Selection.From],
            To: Now + Selection.Day*UnixDay + this.SessionsUnix[Selection.To]
        }
    }

    ReplaceDays(now:Date):Array<string>{
        if(now.getDay() === 0) return this.Days;
        let result = this.Days.slice(now.getDay(), 7);
        this.Days.slice(0, now.getDay()).forEach((el) =>{
            result.push(el);
        });
        return result;
    }

    ParseTime(obj:Array<string>):Array<number>{
        let result:Array<number> = [];
        //Till this hour parsing like next day (24H)
        let FromHour = 6;
        for(let i = 0; i < obj.length; i++){
            let times = obj[i].split(":");
            let time = (parseInt(times[1], 10) + (parseInt(times[0], 10)* 60))*60;
            result.push(time < FromHour*3600 ? time + 86400 : time);
        }
        return result;

    }

    LoadInfo(id:string|number, sid:string|number){
        this.Info.stop(true,true);
        this.Info.animate({opacity: 0.01}, 200, () => {
            this.Info.html(this.Data[id].html);
            this.Info.find("button").attr("session-id", sid);
            this.Info.animate({opacity: 1}, 200);
        });
    }

    ShowRange(from:number, to:number):void{

        if(!(typeof(this.xNew) === "object"))
            this.FindSessions.call(from,to);

        if(this.Equals(this.xNew,this.xOld)){
            return;
        }else if($.isEmptyObject(this.xNew)){
            this.xOld = JSON.parse(JSON.stringify(this.xNew))
            this.Slider.html("<li>В данный период нет показов</li>");
            if(!$.isEmptyObject(this.Slider.data()))
                this.Slider.reload();
            return;
        }

        let List = this.CreateList();
        if(List.length === 0)
            this.Slider.html("<li>В данный период нет показов</li>");
        else
            this.Slider.html(List);
        if(!$.isEmptyObject(this.Slider.data()))
            this.Slider.reload();

        this.Slider.gotoSlide(Math.round(List.length/2));

        this.xOld = JSON.parse(JSON.stringify(this.xNew));
    }

    private CreateList():string{
        let List = "";
        let el = this.xNew;
        for(let i in el){
            for(let j = el[i].length; j--;){
                List += this.Data[i].Data.Sessions[el[i][j]].HTML;
            }
        }
        return List;
    }

    private FindSessions(from:number, to:number):void{
        let Hall = +this.Hall.find(":checked").val();
        let result:Object = {};
        for(let i in this.Data){
            for(let j = this.Data[i].Data.Sessions.length; j--;){
                let Unix = this.Data[i].Data.Sessions[j].Unix;
                let HallID = this.Data[i].Data.Sessions[j].HallID;
                if(Unix <= to && Unix >= from){
                    if(typeof(result[i]) === "undefined")
                        result[i] = [];
                    if(Hall === 0 || HallID === Hall)
                        result[i].push(j);
                }
            }
        }
        this.xNew = result;
    }

    private Equals(x:Object, y:Object) {
        if(!((typeof(x) === "object") && (typeof(y) === "object")))
            return false;
        let xKeys = Object.keys(x);
        let yKeys = Object.keys(y);
        let Length = xKeys.length;
        if(!(() =>  {
                if(xKeys.length != yKeys.length) return false;
                for(let i = Length; i--;){
                    if(xKeys[i] === yKeys[i]) continue;
                    else return false;
                }
                return true;
            })()) return false;


        for(let i in x){
            if(x[i].length != y[i].length) return false;
            for(let j = x[i].length; j--;){
                if(x[i][j] === y[i][j]) continue;
                else return false;
            }
        }
        return true;
    }

}