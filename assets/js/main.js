(function () {
  'use strict';

  // Homepage Photo Intro
  if (document.location.pathname === '/') {
    $('header .photo').addClass('ken-burns');

    // go through photos
    $('header .photo').on('animationiteration', '.inner-photo', function(event) {
      var currentPhoto = $(this).parent().attr('data-active-photo');
      var photos = ['one', 'two', 'three'];
      var nextPhoto = photos.indexOf(currentPhoto) + 1;
      if (nextPhoto > photos.length - 1) nextPhoto = 0;
      $(this).parent().attr('data-active-photo', photos[nextPhoto]);
    });

    // init controller
    var controller = new ScrollMagic.Controller();

    var createScene = function() {
      // build tween
      var tl = new TimelineMax().add([
      	TweenMax.to('.site-header.home', 0.5, {width: '17rem', ease: Sine.easeIn}),
      	TweenMax.to('.site-header.home .site-photos', 0.5, {padding: 0, ease: Power1.easeIn}),
      ]);

      // build scene and set duration to window height
      return new ScrollMagic.Scene({offset: 50, duration: '75%'})
      	.setTween(tl)
      	.on('start', function(event) {
      		var photo = $('header .photo');
      		if (event.scrollDirection === 'REVERSE') photo.addClass('ken-burns');
      		else photo.removeClass('ken-burns');
      	})
      	//.addIndicators() // add indicators (requires plugin)
      	.addTo(controller);
    }

    var scene;
    var widthBreakpoint = 768;
    if (window.innerWidth >= widthBreakpoint) scene = createScene();

    $(window).on('resize', _.debounce(function() {
    	scene.destroy(true);
      document.querySelector('.site-header.home').removeAttribute('style');
      document.querySelector('.site-header.home .site-photos').removeAttribute('style');
    	if (window.innerWidth >= widthBreakpoint) {
        scene = createScene();
        controller.update();
      }
    }, 500));
  }

  var photoSwipeGalleryArray = null;

  var initPhotoSwipe = function() {
    var galleryItems = document.querySelectorAll('.portfolio picture, .portfolio-page picture');
    var index = 0;

    for (var i = 0; i < galleryItems.length; i++) {
      // set onclick if not link
      var parentTag = galleryItems[i].parentNode;
      if (parentTag.tagName.toLowerCase() === 'a') {
        // disable if link is to image
        if (parentTag.hasAttribute('data-image')) {
          parentTag.onclick = function() {
            return false;
          };
        }
        else continue;
      }

      // set index for reuse
      galleryItems[i].setAttribute('data-index', index);
      galleryItems[i].onclick = function(index) {
        return function() {
          openPhotoSwipe(index);
        };
      }(index);

      index++;
    }
  }

  var openPhotoSwipe = function(index) {
    if (photoSwipeGalleryArray === null) createPhotoSwipe();

    var options = {
      history: false,
      bgOpacity: 0.75,
      loop: false,
      shareEl: false,
      index: index
    };

    var pswpElement = document.querySelectorAll('.pswp')[0];
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, photoSwipeGalleryArray, options);
    gallery.init();
  }

  var createPhotoSwipe = function() {
    // generate array to use in PhotoSwipe
    var items = [];
    var galleryItems = document.querySelectorAll('.portfolio picture[data-index], .portfolio-page picture[data-index]');

    for (var i = 0; i < galleryItems.length; i++) {
      var url,
          parentTag = galleryItems[i].parentNode,
          imageTag = galleryItems[i].querySelector('img'),
          sourceTag = galleryItems[i].querySelector('source'),
          width = 600 * 2,
          height = 350 * 2;

      // get dimensions of image
      width = (imageTag.naturalWidth > 0)? imageTag.naturalWidth : imageTag.width;
      height = (imageTag.naturalHeight > 0)? imageTag.naturalHeight : imageTag.height;

      // find best image to use
      if (parentTag.tagName.toLowerCase() === 'a' && parentTag.hasAttribute('data-image')) {
        url = parentTag.href;
        width = parentTag.getAttribute('data-image-width');
        height = parentTag.getAttribute('data-image-height');
      }
      else if (sourceTag && typeof SVGRect !== 'undefined' && sourceTag.getAttribute('type') == 'image/svg+xml') url = sourceTag.getAttribute('srcset');
      else if (sourceTag) url = sourceTag.getAttribute('srcset').split(' ')[0];
      else url = imageTag.src;

      // calc best zoomed in dimensions
      var ratio = height / width;
      var windowW = window.innerWidth;
      var windowH = window.innerHeight;

      if (width <= height) {
        width = windowW;
        height = windowW * ratio;
      }
      else {
        width = windowH / ratio;
        height = windowH;
      }

      items.push({
        src: url,
        w: width,
        h: height
      });
    }

    photoSwipeGalleryArray = items;

    // generate new dimensions if window resized
    $(window).on('resize', _.debounce(function() {
    	photoSwipeGalleryArray = null;
    }, 500));
  }

  // activate gallery
  if (document.querySelector('.portfolio, .portfolio-page')) initPhotoSwipe();

}());
