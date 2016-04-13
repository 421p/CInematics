module Api{
    export let Url = {
        Add: {
            Ticket: "ajax/add/ticket",
            Movie: "ajax/add/movie",
            Session: "ajax/add/seance"
        },
        Get: {
            Seats: (id) => {
                //return `ajax/seances/${id}`
                return `ajax/seances/${id}`
            },
            Session: (from, to) => {
                //return `ajax/seances/${from}/${to}`
                return `data.json`
            },
            AllHalls: () => {
                return `ajax/halls`
            },
            Hall: (id) => {
                return `ajax/halls/${id}`
            },
            MoviesList: () => {
                return "ajax/movies"
            }
        },
        Template: {
            Movie: "pages/movie.tpl",
            Ticket: "pages/tickets.tpl"
        }
    };
}



