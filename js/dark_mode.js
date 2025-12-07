
/* DARK MODE AND LIGHT MODE TOGGLER*/
$(".toggle").click(function () {
    var clickeado = $(this);
    var icono = clickeado.children('a').children('i');
    $(".mode a i").not(icono).removeClass('fa-toggle-on').addClass
        ('fa-toggle-off');
    icono.toggleClass('fa-toggle-on fa-toggle-off');
    document.body.classList.toggle("light-mode");
});
/* RESPONSIVE MENU*/
$("#menuicon").click(function () {
    $("#menucontainer").slideToggle();
});

/* DIALOG */
var background = document.getElementById("bg");

$("#open-modal").click(function () {
    console.log("prueba");
    background.style.display = "block";
});

$("#close-modal").click(function () {
    background.style.display = "none";
});
/* ACCORDION */
$(".card__header").click(function () {
    var clickeado = $(this);
    var hijoclickeado = clickeado.next();
    var icono = clickeado.children('i');

    $(".card__content").not(hijoclickeado).slideUp();
    $(".card__header i").not(icono).removeClass('fa-square-minus').addClass
        ('fa-square-plus');

    hijoclickeado.slideToggle();
    icono.toggleClass('fa-square-minus fa-square-plus');
});