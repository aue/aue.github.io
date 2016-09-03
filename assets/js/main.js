(function () {
  'use strict';

  // Homepage Photo Intro
  if (document.location.pathname === '/') {
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
    	.on('start', function(event) {
    		var photo = document.querySelector('header .photo');
    		if (event.scrollDirection === 'REVERSE') photo.classList.add('ken-burns');
    		else photo.classList.remove('ken-burns');
    	})
    	.addIndicators() // add indicators (requires plugin)
    	.addTo(controller);
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
      width = imageTag.naturalWidth;
      height = imageTag.naturalHeight;

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

    // debounce code
    var _now = Date.now || function() {
      return new Date().getTime();
    };

    var _debounce = function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;

      var later = function() {
        var last = _now() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          }
        }
      };

      return function() {
        context = this;
        args = arguments;
        timestamp = _now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };
    };

    // generate new dimensions if window resized
    $(window).on('resize', function() {
      _debounce(function() {
    		photoSwipeGalleryArray = null;
    	}, 250);
  	});
  }

  // activate gallery
  if (document.querySelector('.portfolio, .portfolio-page')) initPhotoSwipe();

}());
