/**
 * Created by mrart on 10.04.2016.
 */
$(document).ajaxStart(() => {
    $( "#loader" ).show();
});
$(document).ajaxStop(() => {
    $( "#loader" ).hide();
});