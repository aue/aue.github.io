if (navigator.userAgent.indexOf("MSIE") > -1) {
    document.body.classList.add("ie10");
}

$(document).ready(function() {
    $('nav').height($('nav .wrapper').outerHeight());
    NavOffset = $('nav').offset().top;
});

$(window).resize(function() {
    NavOffset = $('nav').offset().top;
});

$(window).scroll(function() {
    var scrolledOver = $(window).scrollTop() > NavOffset;
    if (scrolledOver && !$('nav').hasClass('fixed')) $('nav').addClass('fixed');
    else if (!scrolledOver && $('nav').hasClass('fixed')) $('nav').removeClass('fixed');
});
