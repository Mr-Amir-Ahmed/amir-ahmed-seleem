/* ============================================================
   typed-config.js
   Typed.js initialization — rotating job titles in the hero.
   Cycles through: IT Helpdesk Specialist → Network Admin →
   Web Developer → AI Prompt Engineer → UX/UI Designer → PM
   ============================================================ */
(function () {
  'use strict';

  // Wait for Typed library to load
  if (typeof Typed === 'undefined') {
    console.warn('[typed-config] Typed.js not loaded — skipping role rotator.');
    return;
  }

  const typedTarget = document.getElementById('typedRole');
  if (!typedTarget) {
    console.warn('[typed-config] #typedRole element not found.');
    return;
  }

  new Typed(typedTarget, {
    strings: [
      'IT Helpdesk Specialist',
      'Network Administrator',
      'Web Developer',
      'AI Prompt Engineer',
      'UX/UI Designer',
      'Project Manager'
    ],
    typeSpeed: 70,
    backSpeed: 35,
    backDelay: 1800,
    loop: true,
    showCursor: false
  });
})();
