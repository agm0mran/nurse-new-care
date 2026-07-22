(function () {
  'use strict';

  // Header scroll effect
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  function handleScroll() {
    const current = window.scrollY;
    if (current > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      siteNav.classList.toggle('open');
      const expanded = this.classList.contains('active');
      this.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking a link
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && siteNav.classList.contains('open')) {
        menuToggle.classList.remove('active');
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active nav link highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath.endsWith('/') && href === 'index.html')) {
      link.classList.add('active');
    } else if (currentPath.endsWith(href) && href !== '#') {
      link.classList.add('active');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Intersection Observer for animations
  if ('IntersectionObserver' in window) {
    const animElements = document.querySelectorAll(
      '.service-card, .value-item, .step, .stat-card, .team-card, .about-mission, .hero-content'
    );

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Booking form handling
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            showToast('Booking request sent! We will contact you shortly.', 'success');
            bookingForm.reset();
          } else {
            showToast('Something went wrong. Please try again.', 'error');
          }
        })
        .catch(function () {
          showToast('Something went wrong. Please try again.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            showToast('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
          } else {
            showToast('Something went wrong. Please try again.', 'error');
          }
        })
        .catch(function () {
          showToast('Something went wrong. Please try again.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
    });
  }

  // Toast notification
  function showToast(message, type) {
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || '');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // Counter animation
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-counter'), 10);
            if (isNaN(target)) return;
            animateCounter(el, target);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el, target) {
    var current = 0;
    var increment = Math.ceil(target / 60);
    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 16);
  }
})();
