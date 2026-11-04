(() => {
  const data = window.PORTFOLIO || {};
  const email = typeof data.email === 'string' && data.email.trim() ? data.email.trim() : '';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeExternalURL = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  const setExternalLink = (element, value) => {
    const url = safeExternalURL(value);
    if (!url) { element.hidden = true; return; }
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    element.hidden = false;
  };
  document.querySelectorAll('[data-link="linkedin"]').forEach(link => setExternalLink(link, data.linkedin));
  document.querySelectorAll('[data-link="github"]').forEach(link => setExternalLink(link, data.github));
  document.querySelectorAll('[data-email]').forEach(link => {
    if (!email) { link.hidden = true; return; }
    link.href = `mailto:${email}`;
    const strong = link.querySelector('strong');
    if (strong) strong.textContent = email;
    link.hidden = false;
  });

  const list = document.getElementById('project-list');
  const projects = Array.isArray(data.projects) ? data.projects : [];
  if (projects.length) {
    list.innerHTML = projects.map((project, index) => {
      const tags = Array.isArray(project.stack) ? project.stack : [];
      const links = [
        safeExternalURL(project.repo) ? `<a href="${safeExternalURL(project.repo)}" target="_blank" rel="noopener noreferrer">Source code ↗</a>` : '',
        safeExternalURL(project.demo) ? `<a href="${safeExternalURL(project.demo)}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>` : ''
      ].filter(Boolean).join('');
      const preview = project.image ? `<div class="project-preview"><img src="${escapeHTML(project.image)}" alt="Screenshot of ${escapeHTML(project.title)}"></div>` : '';
      return `<article class="project-card">${preview}<div class="project-card-copy"><div class="project-card-meta"><span>PROJECT ${String(index + 1).padStart(2, '0')}</span><span>${escapeHTML(project.status || 'PROJECT')}</span></div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p>${tags.length ? `<ul class="project-card-tags">${tags.map(tag => `<li>${escapeHTML(tag)}</li>`).join('')}</ul>` : ''}${links ? `<div class="project-card-links">${links}</div>` : ''}</div></article>`;
    }).join('');
  } else {
    list.innerHTML = `<article class="empty-projects"><div class="empty-project-mark" aria-hidden="true">01</div><div class="empty-project-copy"><p class="project-status">NO PROJECTS PUBLISHED YET</p><h3>Projects will go here as I build them.</h3><p>I’m developing my programming and web fundamentals. When I have finished work to share, I’ll add its purpose, the tools I used, and a repository or live link here.</p><a href="#journey">See what I’m learning <span>↗</span></a></div></article>`;
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); };
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-28% 0px -62% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  const form = document.getElementById('contact-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const note = document.getElementById('form-message');
    if (!form.reportValidity()) {
      note.textContent = 'Please check the highlighted fields and try again.';
      note.setAttribute('data-state', 'error');
      return;
    }
    if (!email) {
      note.textContent = 'Add your email address in portfolio-data.js to enable this form.';
      note.setAttribute('data-state', 'error');
      return;
    }
    const values = new FormData(form);
    const subject = encodeURIComponent(`Portfolio message from ${values.get('name')}`);
    const body = encodeURIComponent(`${values.get('message')}\n\nFrom: ${values.get('name')} (${values.get('email')})`);
    note.textContent = 'Your email app will open with a draft. This form does not send or store messages.';
    note.removeAttribute('data-state');
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
  });

  // Reveal sections as they enter view; keep content visible if motion is reduced.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('has-reveal');
    document.querySelectorAll('.hero-content, .hero-details, .section-heading, .about-grid, .skill-card, .empty-projects, .project-card, .learning-list li, .education-card, .contact-layout').forEach((element, index) => {
      element.classList.add('reveal');
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
    });
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  }

  // Short, relevant typing loop; disabled for reduced-motion preferences.
  const role = document.getElementById('typed-role');
  if (role && !reduceMotion) {
    const phrases = ['problem solving', 'web development', 'computer science'];
    let phraseIndex = 0;
    let letterIndex = phrases[0].length;
    let deleting = true;
    const typeNext = () => {
      const phrase = phrases[phraseIndex];
      letterIndex += deleting ? -1 : 1;
      role.textContent = phrase.slice(0, letterIndex);
      let delay = deleting ? 48 : 82;
      if (!deleting && letterIndex === phrase.length) { deleting = true; delay = 1450; }
      else if (deleting && letterIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 320; }
      window.setTimeout(typeNext, delay);
    };
    window.setTimeout(typeNext, 1500);
  }

  // Lightweight particle network. Particle count and pixel ratio are capped for mobile.
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !reduceMotion && canvas.getContext) {
    const context = canvas.getContext('2d', { alpha: true });
    if (context) {
      let width = 0;
      let height = 0;
      let particles = [];
      let frame = 0;
      let running = true;
      const pointer = { x: -1000, y: -1000 };
      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const count = Math.min(78, Math.max(24, Math.round(width / 17)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          radius: Math.random() * 1.35 + 0.55,
          hue: Math.random() > 0.48 ? '157, 126, 255' : '101, 211, 241'
        }));
      };
      const draw = () => {
        if (!running) return;
        context.clearRect(0, 0, width, height);
        const linkDistance = width < 600 ? 92 : 125;
        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (pointer.x > -500) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 115 && distance > 0) { particle.x += dx / distance * 0.08; particle.y += dy / distance * 0.08; }
          }
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          if (particle.y < -8) particle.y = height + 8;
          if (particle.y > height + 8) particle.y = -8;
          context.beginPath();
          context.fillStyle = `rgba(${particle.hue}, .65)`;
          context.shadowBlur = 9;
          context.shadowColor = `rgba(${particle.hue}, .45)`;
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
          context.shadowBlur = 0;
          for (let j = i + 1; j < particles.length; j += 1) {
            const other = particles[j];
            const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
            if (distance < linkDistance) {
              context.beginPath();
              context.strokeStyle = `rgba(145, 151, 231, ${(1 - distance / linkDistance) * 0.13})`;
              context.lineWidth = 0.65;
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.stroke();
            }
          }
        }
        frame = window.requestAnimationFrame(draw);
      };
      resize();
      draw();
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
      window.addEventListener('pointerleave', () => { pointer.x = -1000; pointer.y = -1000; }, { passive: true });
      document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) frame = window.requestAnimationFrame(draw);
        else window.cancelAnimationFrame(frame);
      });
    }
  }
})();
