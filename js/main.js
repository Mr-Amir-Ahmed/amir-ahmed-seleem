/* ============================================================
   main.js
   Core UI interactions for Amir Ahmed's portfolio:
   - Navbar scroll state + active link highlighting
   - Mobile menu toggle
   - Scroll-reveal animations (IntersectionObserver)
   - Skill bar fill animation on reveal
   - 3D mouse-tilt effect on hero card & about card
   - Contact form submit handler with toast
   - Footer year auto-fill
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     NAVBAR — scrolled state + active section highlight
     ------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  function handleScroll() {
    // Toggle scrolled style
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight current section link
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // run once on load

  /* ------------------------------------------------------------
     MOBILE MENU — open/close + auto-close on link click
     ------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* ------------------------------------------------------------
     SCROLL REVEAL — fade/slide elements into view on scroll
     Also fills skill bars when their card becomes visible.
     ------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate skill bars inside this element
          const bars = entry.target.querySelectorAll('.skill-fill');
          bars.forEach(function (fill) {
            const w = fill.getAttribute('data-width');
            if (w) fill.style.width = w + '%';
          });
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ------------------------------------------------------------
     3D TILT — hero card & about card follow mouse
     ------------------------------------------------------------ */
  function attachTilt(el, max) {
    if (!el) return;
    const maxDeg = max || 12;

    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform =
        'rotateY(' + x * maxDeg + 'deg) rotateX(' + -y * maxDeg + 'deg) translateZ(0)';
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
  attachTilt(document.getElementById('hero3DCard'), 10);
  attachTilt(document.getElementById('aboutCard'), 8);

  /* ------------------------------------------------------------
     CONTACT FORM — fake submit with success toast
     ------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  if (form && toast && toastMsg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      toastMsg.textContent = 'Message sent successfully! I will get back to you soon.';
      toast.classList.add('show');
      form.reset();
      setTimeout(function () {
        toast.classList.remove('show');
      }, 3500);
    });
  }

  /* ------------------------------------------------------------
     FOOTER YEAR — auto-fill current year
     ------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
