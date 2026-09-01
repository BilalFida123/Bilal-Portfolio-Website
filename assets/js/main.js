/* =========================================================
   MAIN.JS — no external libraries, all vanilla
========================================================= */

(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  function getPreferredTheme() {
    var saved = localStorage.getItem('bf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  window.__bfTheme = { applyTheme: applyTheme };
  applyTheme(getPreferredTheme());
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Light scroll-reveal animation (runs first, wrapped defensively so a
     later error elsewhere on the page can never leave content invisible).
     Written in plain ES5 (no Map, no NodeList.forEach) for maximum
     browser/webview compatibility. ---- */
  try {
    var revealNodeList = document.querySelectorAll('.reveal');
    var revealItems = [];
    for (var ri = 0; ri < revealNodeList.length; ri++) { revealItems.push(revealNodeList[ri]); }

    if (revealItems.length) {
      var showAll = function () {
        for (var si = 0; si < revealItems.length; si++) { revealItems[si].className += ' is-visible'; }
      };
      var prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      if (prefersReducedMotion || typeof window.IntersectionObserver === 'undefined') {
        showAll();
      } else {
        // Stagger items slightly when several sit in the same row/grid.
        var parents = [];
        var parentCounts = [];
        for (var pi = 0; pi < revealItems.length; pi++) {
          var parentEl = revealItems[pi].parentElement;
          var idx = parents.indexOf(parentEl);
          if (idx === -1) { parents.push(parentEl); parentCounts.push(0); idx = parents.length - 1; }
          var n = parentCounts[idx];
          revealItems[pi].style.transitionDelay = (Math.min(n, 5) * 0.08) + 's';
          parentCounts[idx] = n + 1;
        }

        var revealObserver = new IntersectionObserver(function (entries) {
          for (var ei = 0; ei < entries.length; ei++) {
            if (entries[ei].isIntersecting) {
              entries[ei].target.className += ' is-visible';
              revealObserver.unobserve(entries[ei].target);
            }
          }
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        for (var oi = 0; oi < revealItems.length; oi++) { revealObserver.observe(revealItems[oi]); }

        // Safety net: force everything visible after a few seconds no matter
        // what, so content can never stay permanently hidden.
        setTimeout(showAll, 4000);
      }
    }
  } catch (e) {
    var fallbackNodes = document.querySelectorAll('.reveal');
    for (var fi = 0; fi < fallbackNodes.length; fi++) { fallbackNodes[fi].className += ' is-visible'; }
  }

  /* ---- Theme toggle ---- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      window.__bfTheme.applyTheme(next);
      localStorage.setItem('bf-theme', next);
    });
  }

  /* ---- Sticky header shrink on scroll ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Side drawer ---- */
  var drawerToggle = document.getElementById('drawerToggle');
  var drawerClose = document.getElementById('drawerClose');
  var sideDrawer = document.getElementById('sideDrawer');
  var drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    sideDrawer.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    sideDrawer.setAttribute('aria-hidden', 'false');
    drawerToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-locked');
  }
  function closeDrawer() {
    sideDrawer.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    sideDrawer.setAttribute('aria-hidden', 'true');
    drawerToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-locked');
  }
  if (drawerToggle && sideDrawer && drawerOverlay) {
    drawerToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
    sideDrawer.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeDrawer); });
  }

  /* ---- Lightweight carousel (no external library) ---- */
  function initCarousel(rootId, prevId, nextId) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var track = root.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 980) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView());
    }

    function update() {
      index = Math.min(index, maxIndex());
      var slideWidth = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var offset = index * (slideWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';
      if (prevBtn) prevBtn.classList.toggle('is-disabled', index <= 0);
      if (nextBtn) nextBtn.classList.toggle('is-disabled', index >= maxIndex());
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { index = Math.max(0, index - 1); update(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { index = Math.min(maxIndex(), index + 1); update(); });

    // touch / swipe support
    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (diff > 40) { index = Math.max(0, index - 1); update(); }
      else if (diff < -40) { index = Math.min(maxIndex(), index + 1); update(); }
      startX = null;
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  initCarousel('projCarousel', 'projPrev', 'projNext');
  initCarousel('testCarousel', 'testPrev', 'testNext');

  /* ---- Contact form -> Web3Forms (static site, real delivery, no backend needed) ----
     Get a free access key at https://web3forms.com (enter your email, no signup) and
     paste it into the hidden "access_key" input's value in index.html. */
  var form = document.getElementById('contactForm');
  if (form) {
    var submitBtn = document.getElementById('cfSubmitBtn');
    var noteEl = document.getElementById('cfFormNote');
    var defaultNote = noteEl ? noteEl.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      var message = document.getElementById('cf-message').value.trim();
      if (!name || !email || !message) {
        if (noteEl) { noteEl.textContent = 'Please fill in your name, email, and message.'; noteEl.classList.add('form-note-error'); }
        return;
      }

      var accessKey = form.querySelector('[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        if (noteEl) { noteEl.textContent = 'Form isn\'t connected yet — add your Web3Forms access key in index.html.'; noteEl.classList.add('form-note-error'); }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (noteEl) { noteEl.textContent = 'Sending…'; noteEl.classList.remove('form-note-error'); }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            if (noteEl) { noteEl.textContent = 'Thanks! Your message has been sent — I\'ll reply within a day.'; noteEl.classList.remove('form-note-error'); }
          } else {
            if (noteEl) { noteEl.textContent = 'Something went wrong. Please email me directly at mbilalfida9@gmail.com.'; noteEl.classList.add('form-note-error'); }
          }
        })
        .catch(function () {
          if (noteEl) { noteEl.textContent = 'Network error. Please email me directly at mbilalfida9@gmail.com.'; noteEl.classList.add('form-note-error'); }
        })
        .finally(function () { if (submitBtn) submitBtn.disabled = false; });
    });
  }
});
