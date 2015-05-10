function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return false;
}

if (detectIE()) document.body.classList.add('ie');

$(document).ready(function() {
    $('nav').height($('nav ul li.logo').outerHeight());
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
