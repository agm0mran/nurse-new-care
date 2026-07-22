(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var counters = document.querySelectorAll('[data-counter]');

  counters.forEach(function (el) {
    el.textContent = '0';
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-counter'), 10);
          if (isNaN(target) || target <= 0) return;

          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) {
    observer.observe(el);
  });

  function animateCounter(el, target) {
    var current = 0;
    var duration = 1500;
    var stepTime = Math.max(16, Math.floor(duration / target));
    var increment = 1;

    if (target > 100) {
      increment = Math.ceil(target / 60);
    }

    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, stepTime);
  }
})();
