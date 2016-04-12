function $get(url, obj){
    $.ajax({
        url: url +"?" + JSON.stringify(obj),
        type: 'get',
        dataType: 'json', 
        success: function(response){
            console.log(response);
        }
    });
}

$.getJSON('https://kndr-prokopenko.c9users.io/movies').done(function(data){
    var films = $(".seansFilms");
    for(var i in data)
        films.append("<option>"+data[i].Title+"</option>");

})

$.getJSON('https://kndr-prokopenko.c9users.io/halls').done(function(data){
    var halls = $(".seansHalls");
    for(var i in data)
        halls.append("<option>"+data[i].name+"</option>");

})

$('#addfilm').on('click', function() {

    var form = $("#addfilmform");
    var obj = {
        Category: "default",
        Title: form.find("#Title").val(),
        Year: form.find("#Year").val(),
        Country: form.find("#Country").val(),
        Genre: form.find("#Genre").val(),
        Budget: form.find("#Budget").val(),
        Time: form.find("#Time").val(),
        Lang: form.find("#Lang").val(),
        Actors: form.find("#Actors").val(),
        About: form.find("#About").val(),
        Video: form.find("#Video").val()
    };
    $get('https://kndr-prokopenko.c9users.io/add/movie', obj);
    return false;
});

$('#addseans').on('click', function() {

    var form = $(".bs-seans-modal-lg");
    var obj = {
        Hall: form.find('.seansHalls :selected').val(),
        Movie: form.find('.seansFilms :selected').val(),
        Price: form.find("#Price").val(),
        Date: form.find('#Date').val() + " " + form.find('#Time').val()
    };
    $get('https://kndr-prokopenko.c9users.io/add/seance', obj);
    return false;
});