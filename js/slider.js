(function () {
  'use strict';

  return; /* static grid — no slider needed */

  var track = document.querySelector('.testimonials-track');
  var prevBtn = document.querySelector('.t-nav--prev');
  var nextBtn = document.querySelector('.t-nav--next');
  var dotsContainer = document.querySelector('.testimonials-dots');

  if (!track || !prevBtn || !nextBtn) return;

  var slides = track.children;
  var totalSlides = slides.length;
  var currentIndex = 0;
  var slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth >= 900) return 2;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function getSlideWidth() {
    var viewport = track.parentElement;
    return viewport.offsetWidth / slidesPerView;
  }

  function updateCardWidths() {
    var slideWidth = getSlideWidth();
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.flex = '0 0 ' + slideWidth + 'px';
    }
  }

  function goTo(index) {
    var slideWidth = getSlideWidth();
    var maxIndex = Math.max(0, totalSlides - slidesPerView);

    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    currentIndex = index;
    track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
    updateCardWidths();
    updateButtons();
    updateDots();
  }

  function updateButtons() {
    var maxIndex = Math.max(0, totalSlides - slidesPerView);
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('button');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Create dots
  if (dotsContainer) {
    var maxIndex = Math.max(0, totalSlides - slidesPerView);
    for (var i = 0; i <= maxIndex; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn.addEventListener('click', function () {
    goTo(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    goTo(currentIndex + 1);
  });

  // Touch/swipe support
  var startX = 0;
  var isDragging = false;

  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    isDragging = false;
    var endX = e.changedTouches[0].clientX;
    var diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goTo(currentIndex + 1);
      } else {
        goTo(currentIndex - 1);
      }
    }
  }, { passive: true });

  // Auto-play
  var autoPlayInterval = setInterval(function () {
    var maxIndex = Math.max(0, totalSlides - slidesPerView);
    if (currentIndex >= maxIndex) {
      goTo(0);
    } else {
      goTo(currentIndex + 1);
    }
  }, 5000);

  // Pause on hover/touch
  var sliderEl = track.closest('.testimonials-slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', function () {
      clearInterval(autoPlayInterval);
    });
    sliderEl.addEventListener('mouseleave', function () {
      autoPlayInterval = setInterval(function () {
        var maxIndex = Math.max(0, totalSlides - slidesPerView);
        if (currentIndex >= maxIndex) {
          goTo(0);
        } else {
          goTo(currentIndex + 1);
        }
      }, 5000);
    });
  }

  // Responsive resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newSlidesPerView = getSlidesPerView();
      if (newSlidesPerView !== slidesPerView) {
        slidesPerView = newSlidesPerView;
        // Rebuild dots
        if (dotsContainer) {
          dotsContainer.innerHTML = '';
          var maxIndex = Math.max(0, totalSlides - slidesPerView);
          for (var i = 0; i <= maxIndex; i++) {
            var dot = document.createElement('button');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', function () { goTo(i); });
            dotsContainer.appendChild(dot);
          }
        }
        goTo(0);
      } else {
        goTo(currentIndex);
      }
    }, 200);
  });

  // Initial setup
  goTo(0);
})();
