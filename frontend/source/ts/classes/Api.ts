module Api{
    export let Url = {
        Add: {
            Ticket: "https://kndr-prokopenko.c9users.io/ajax/add/ticket",
            Movie: "https://kndr-prokopenko.c9users.io/ajax/add/movie",
            Session: "https://kndr-prokopenko.c9users.io/ajax/add/seance"
        },
        Get: {
            Seats: (id) => {
                //return `https://kndr-prokopenko.c9users.io/ajax/seances/${id}`
                return `https://kndr-prokopenko.c9users.io/ajax/seances/${id}`
            },
            Session: (from, to) => {
                //return `https://kndr-prokopenko.c9users.io/ajax/seances/${from}/${to}`
                return `data.json`
            },
            AllHalls: () => {
                return `https://kndr-prokopenko.c9users.io/ajax/halls`
            },
            Hall: (id) => {
                return `https://kndr-prokopenko.c9users.io/ajax/halls/${id}`
            },
            MoviesList: () => {
                return "https://kndr-prokopenko.c9users.io/ajax/movies"
            }
        },
        Template: {
            Movie: "pages/movie.tpl",
            Ticket: "pages/tickets.tpl"
        }
    };
}



