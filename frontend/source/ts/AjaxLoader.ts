$(document).ajaxStart(() => {
    $( "#loader" ).show();
});
$(document).ajaxStop(() => {
    $( "#loader" ).hide();
});
