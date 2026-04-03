(() => {
  'use strict';

  /* ── CURSOR ──────────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .skill-tag, .project-card, .filter-btn, .tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  /* ── NAV SCROLL ──────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const progressBar = document.getElementById('progress-bar');
  const scrollTop   = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;

    progressBar.style.width = pct + '%';
    navbar.classList.toggle('scrolled', scrolled > 40);
    scrollTop.classList.toggle('visible', scrolled > 400);
  }, { passive: true });

  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── MOBILE MENU ─────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  /* ── TABS ────────────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) {
        target.classList.add('active');
        // Animate skill bars when tab is shown
        if (btn.dataset.tab === 'skills') animateBars();
        // Animate timeline items
        animateTimeline();
      }
    });
  });

  /* ── SKILL BARS ──────────────────────────────────────── */
  function animateBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 100);
    });
  }

  /* ── TIMELINE REVEAL ─────────────────────────────────── */
  function animateTimeline() {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 120);
    });
  }
  animateTimeline();

  /* ── INTERSECTION OBSERVER ───────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Also trigger bars if skills tab visible
        const fills = entry.target.querySelectorAll('.skill-bar-fill');
        if (fills.length) animateBars();
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Observe timeline items when they scroll into view
  const timelineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-item').forEach(el => timelineObs.observe(el));

  // Observe skill bars
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateBars();
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-bars').forEach(el => barObs.observe(el));

  /* ── PORTFOLIO FILTER ────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.transition = 'opacity .3s, transform .3s';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '.15';
          card.style.transform = 'scale(.97)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });

  /* ── CONTACT FORM ────────────────────────────────────── */
  const form      = document.getElementById('contact-form');
  const status    = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');
  const btnText   = document.getElementById('btn-text');
  const btnArrow  = document.getElementById('btn-arrow');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !message) {
      showStatus('error', '✕  Please fill in all required fields.');
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      showStatus('error', '✕  Please enter a valid email address.');
      return;
    }

    // Loading state
    submitBtn.classList.add('loading');
    btnText.textContent = 'Sending…';
    btnArrow.textContent = '';
    status.className = 'form-status';
    status.style.display = 'none';

    // Simulate sending (replace with your actual endpoint / EmailJS / Formspree)
    await new Promise(r => setTimeout(r, 1800));

    /*
     * To wire up real email notifications, replace the simulation above with one of:
     *
     * Option A — Formspree (no backend needed):
     *   const res = await fetch('https://formspree.io/f/YOUR_ID', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
     *     body: JSON.stringify({ name, email, message })
     *   });
     *   if (!res.ok) throw new Error();
     *
     * Option B — EmailJS:
     *   await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', { name, email, message });
     *
     * Option C — Your own API endpoint:
     *   await fetch('/api/contact', { method: 'POST', body: JSON.stringify({name,email,message}) });
     */

    submitBtn.classList.remove('loading');
    btnText.textContent = 'Send Message';
    btnArrow.textContent = '→';
    showStatus('success', '✓  Message sent! I\'ll be in touch within 24 hours.');
    form.reset();
  });

  function showStatus(type, msg) {
    status.className = 'form-status ' + type;
    status.textContent = msg;
    status.style.display = 'block';
  }

  /* ── SMOOTH NAV LINKS ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
