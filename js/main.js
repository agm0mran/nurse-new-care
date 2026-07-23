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

  // Booking form handling - WhatsApp integration
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const WHATSAPP_NUMBER = '201200625243';

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('bf-name').value.trim();
      const phone = document.getElementById('bf-phone').value.trim();
      const area = document.getElementById('bf-area').value;
      const service = document.getElementById('bf-service').value;
      const notes = document.getElementById('bf-notes').value.trim();

      if (!name || !phone || !area || !service) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const whatsappMessage =
        '\uD83C\uDFE5 New Booking Request\n' +
        '\n' +
        '\uD83D\uDC64 Full Name:\n' + name + '\n' +
        '\n' +
        '\uD83D\uDCF1 Phone:\n' + phone + '\n' +
        '\n' +
        '\uD83D\uDCCD Area:\n' + area + '\n' +
        '\n' +
        '\uD83E\uDE7A Requested Service:\n' + service + '\n' +
        '\n' +
        '\uD83D\uDCDD Notes:\n' + (notes || 'Not provided');

      const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(whatsappMessage);

      window.open(whatsappUrl, '_blank');

      showToast('Booking request sent! We will contact you shortly.', 'success');
      bookingForm.reset();
    });
  }

  // Contact form handling - WhatsApp integration
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const WHATSAPP_NUMBER = '201200625243';

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const phone = document.getElementById('cf-phone').value.trim();
      const service = document.getElementById('cf-service').value;
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !email || !phone || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const whatsappMessage =
        '\uD83C\uDFE5 New Contact Form Submission\n' +
        '\n' +
        '\uD83D\uDC64 Full Name:\n' + name + '\n' +
        '\n' +
        '\uD83D\uDCE7 Email:\n' + email + '\n' +
        '\n' +
        '\uD83D\uDCF1 Phone:\n' + phone + '\n' +
        '\n' +
        '\uD83E\uDE7A Requested Service:\n' + (service || 'Not specified') + '\n' +
        '\n' +
        '\uD83D\uDCAC Message:\n' + message;

      const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(whatsappMessage);

      window.open(whatsappUrl, '_blank');

      showToast('Message sent successfully! We will get back to you soon.', 'success');
      contactForm.reset();
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
