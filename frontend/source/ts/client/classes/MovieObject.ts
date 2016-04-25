interface Session {
    Hall : string
    Session: string
    Price : number
    HTML?: string
    UnixTime: number
}
interface IMovieObject {
    MovieID?:  number
    Title : string
    Year: boolean
    SessionStarts : string
    Country: string
    Genre : string
    Budget : number
    Time: number
    Lang: string
    Actors: string
    About: string
    Video: string
    Sessions: Session[]
}
interface IMovieData {
    Data?:IMovieObject
    HTML?:string
}
class MovieObject {
    public Data:Object;
    public onLoad: (obj:any) => void;
    constructor(data:string, template:string) {
        let MovieData = $.getJSON(data);
        let Template = $.get(template);
        $.when(MovieData, Template)
            .then(this.CreateObject.bind(this), (e) => {
                console.log(`Error occured\n\tCode: ${e.status}\n\tMessage: ${e.statusText.text}`);
            });
    }

    private ReplaceWithTemplate(str:string, pattern) {
        for (let param in pattern)
            str = str.replace(new RegExp(param, "g"), pattern[param]);
        return str;
    }

    private GenerateSliderItem(MovieID, Title, Session, SessionID):string{
        return `<li movie-id="${MovieID}" session-id="${SessionID}">
                    <section class="poster">
                        <img src="movies/${MovieID}/poster.jpg" alt="${Title}" class="img-responsive">
                        <div class="info bgTitle text-center">
                            <div class="title text-left text-center">${Session.Hall}</div>
                            <div class="price text-left inline-block">${Session.Price}грн.</div>
                            <div class="session text-right inline-block">${Session.Session.substring(11, 16)}</div>
                        </div>
                    </section>
                </li>`;
    }

    private ParseTime(str:string):number{
        let datetime = str.split(" ");
        let FromHour = 6;
        let times = datetime[1].split(":");
        let time = (parseInt(times[1], 10) + (parseInt(times[0], 10)* 60))*60;
        return (Date.parse(datetime[0]+" 00:00")/1000|0) + (time < FromHour*3600 ? time + 86400 : time);
    }

    private CreateObject(movieData, template:string) {
        let data = movieData[0];
        let nData = {};
        for (let i = data.length; i--;) {
            nData[data[i].MovieID] = {Data: data[i]};
            nData[data[i].MovieID]['html'] = this.ReplaceWithTemplate(template[0], {
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

            let session:Session[] = nData[data[i].MovieID].Data.Sessions;
            for (let s = session.length; s--;) {
                session[s]['HTML'] = this.GenerateSliderItem(data[i].MovieID, data[i].Title, session[s], s);
                session[s]['Unix'] = this.ParseTime(session[s].Session);
                session[s]['HallID'] = (() => {
                    switch(session[s].Hall){
                        case "Евробазар": return 1;
                        case "Акура Центр": return 2;
                    }
                })();
            }

        }

        this.Data = nData;
        this.onLoad(this.Data);
    }

}