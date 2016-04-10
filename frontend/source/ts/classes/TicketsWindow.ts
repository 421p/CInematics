interface ITicket{
    col:number
    row:number
    type:string
    price: number
    getTicket(): ()=> (string)
}

class TicketsWindow{
    protected Template:JQuery;
    private Parent:JQuery;

    public Field:JQuery;
    public Poster:JQuery;
    public Title:JQuery;
    public Session:JQuery;
    public Hall:JQuery;
    public LowPrice:JQuery;
    public HighPrice:JQuery;
    public Checkout:JQuery;
    protected Prices:number[];
    protected Seats:Object[];

    TicketsList:ITicket[];
    Area:JQuery;
    private Order:JQuery;

    constructor(public template:string){
        $.get(template).done((data) =>{
            this.Template = $(data);
            this.Init();
        });

    }
    private Init(){
        let $t = this;

        let T = $t.Template;
        $t.TicketsList = [];

        $t.Parent = $(".details");
        //Init onClick button
        $t.Parent.delegate("button", "click", this.Draw.bind(this));
        //Attach links to Template object
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

        $t.Area.delegate(".car", "click", function(){
            $t.Selection.call(this, $t);
        });

    }
    
    protected Draw(){
        this.TicketsReset();

        let Button = this.Parent.find("button");
        let MovieID = Button.attr("movie-id");
        let SessionID = Button.attr("session-id");
        let Data = Movie.Data[MovieID].Data;
        this.Poster.html(`<img src='movies/${MovieID}/poster.jpg' class='poster' />`);
        this.Title.text(Data.Title);
        let Time = new Date(Data.Sessions[SessionID].Unix*1000).toLocaleString();
        this.Session.text(Time.substring(0,Time.length-3));
        this.Hall.text(Data.Sessions[SessionID].Hall);
        //Get Seats
        $.getJSON(Api.Url.Get.Seats(MovieID)).done((data) =>{
            this.Seats = data.seats;
            this.Prices = data.prices;
            this.LowPrice.text(`${data.prices[0].price} грн.`);
            this.HighPrice.text(`${data.prices[1].price} грн.`);

            let Park = this.GeneretePark(data.seats);
            this.Field.html(Park);
            this.Template.modal("show");
            });
    }

    private TicketsReset(){
        this.TicketsList = [];
        this.Order.hide();
        this.Checkout.html("");
    }

    private GeneretePark(obj){
        let row = 1;
        let html = '<div class="col-md-12">';
        for(let i in obj){
            if(obj[i].row != row) {
                html+= '</div><div class="col-md-12">';
                row = obj[i].row;
            }
            html+=this.GenerateSeat(obj[i]);
        }
        html+='</div>';
        return html;
    }

    private GenerateSeat(obj){
        let cls = obj.type != "light" ? " exp" : "";
        let sold = obj.isFree ? "" : "sold nohover ";
        if(!obj.isFree) cls = '';
        return `<div class="car ${sold + cls}" index="${obj.index}"></div>`;
    }

    Selection($parent){
        let i = $(this).attr("index");
        let Type = $parent.Seats[i].type === "light" ? true : false;

        var ticket = {
            type: Type ? "Легковик" : "Внедорожник",
            price: Type ? $parent.Prices[0].price : $parent.Prices[1].price,
            row: $(this).parent().index()+1,
            col: $(this).index()+1,
            getTicket: function(){
                var $this = this;
                return `<div class="ticket-container">
                            <div class="ticket">
                            <div class="name">
                                <h6>Тип:</h6>
                                <h6>Ряд:</h6>
                                <h6>Место:</h6>
                                <h6>Цена:</h6>
                            </div>
                            <div class="type">
                                <h6>${$this.type}</h6>
                                <h6>${$this.row}</h6>
                                <h6>${$this.col}</h6>
                                <h6>${$this.price}</h6>
                            </div>
                        </div>
                    </div>`;
            }

        };

        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            if($(this).hasClass("exp"))
                $(this).removeClass("Big");
            if($parent.TicketsList.length == 1) $parent.TicketsList = [];
            else{
                for(let i in $parent.TicketsList){
                    if($parent.TicketsList[i].row == ticket.row && $parent.TicketsList[i].col == ticket.col){
                        $parent.TicketsList.splice(i,1);
                        break;
                    }
                }
            }

        }
        else{
            $(this).addClass("selected");
            if($(this).hasClass("exp"))
                $(this).addClass("Big");

            $parent.TicketsList.push(ticket);
        }


        $parent.PrintTickets();

    }

    PrintTickets(){
        if(this.TicketsList.length == 0){
            this.Checkout.html("");
            this.Order.hide();
            return;
        }
        this.Order.show();
        let total = 0;
        this.Checkout.html("");
        this.TicketsList.forEach(tiket => {
            this.Checkout.append(tiket.getTicket());
            total += tiket.price;
            this.Checkout.append("<span>+</span>");
        });

        this.Checkout.find("span:last").html('<span>='+total+' грн.</span>').after('<div class="col-md-12"><button type="button" class="btn btn-danger">Сделать заказ</button></div>');
    }



}