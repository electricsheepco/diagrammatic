// ============================================
// animations.js — Landing Page Animations
// 1. Header backdrop blur on scroll
// 2. Hero load-in (staggered via data-delay)
// 3. Scroll-triggered .reveal elements
// ============================================
(function () {
  // 1. Header scroll behaviour
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // 2. Hero load-in — elements with data-delay animate immediately
  document.querySelectorAll('[data-delay]').forEach(function (el) {
    el.style.transitionDelay = (el.getAttribute('data-delay') || '0') + 'ms';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('visible'); });
    });
  });

  // 3. Scroll reveals
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    // Skip hero elements — they animate on load, not scroll
    if (!el.hasAttribute('data-delay')) observer.observe(el);
  });
}());
