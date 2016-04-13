/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../AjaxLoader.ts" />
/// <reference path="../Api.ts" />
/// <reference path="classes/MovieObject.ts" />
/// <reference path="classes/DetailedInfo.ts" />
/// <reference path="classes/TicketsWindow.ts" />

    let Movie = new MovieObject(Api.Url.Get.Session("2016-01-01","2016-05-05"),Api.Url.Template.Movie);
    let Details = new DetailedInfo();
    let Ticket = new TicketsWindow(Api.Url.Template.Ticket);


    Movie.onLoad = () => {
        Details.Init(Movie.Data);
    };








