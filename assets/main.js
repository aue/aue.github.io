/*$(document).ready(function() {
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
*/

document.querySelector('header .photo').classList.add('ken-burns');

// init controller
var controller = new ScrollMagic.Controller();

// build tween
var tl = new TimelineMax().add([
	TweenMax.to('header .photo', 0.5, {left: 0, top: 0, bottom: 0, width: '17rem', ease: Sine.easeIn}),
	TweenMax.to('header .faux-photo.one', 0.5, {left: '17rem', top: '2rem', bottom: '2rem', width: 0, ease: Power1.easeIn}),
	TweenMax.to('header .faux-photo.two', 0.51, {left: '17rem', top: '4rem', bottom: '4rem', width: 0, ease: Power1.easeIn})
]);

// build scene and set duration to window height
var scene = new ScrollMagic.Scene({offset: 50, duration: '75%'})
	.setTween(tl)
	.on('end', function(event) {
		var photo = document.querySelector('header .photo');
		if (event.scrollDirection === 'REVERSE') photo.classList.add('ken-burns');
		else photo.classList.remove('ken-burns');
	})
	.addIndicators() // add indicators (requires plugin)
	.addTo(controller);
