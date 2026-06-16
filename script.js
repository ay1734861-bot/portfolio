/* ==========================================================
   PORTFOLIO — ADVANCED VANILLA JS
   Modules: Canvas thread bg, Typewriter, Nav, Reveal-on-scroll,
   Skill bars, Project cards + Modal, Contact form validation
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initThreadCanvas();
  initTypewriter();
  initRevealOnScroll();
  initSkillBars();
  initProjects();
  initSkillsGrid();
  initContactForm();
});

/* ---------------- Custom cursor ---------------- */
function initCursor(){
  const dot = document.getElementById('cursorDot');
  if (!dot || window.matchMedia('(pointer: coarse)').matches) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
  });
}

/* ---------------- Nav: scroll state + mobile toggle ---------------- */
function initNav(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ---------------- Hero canvas: drifting thread lines ---------------- */
function initThreadCanvas(){
  const canvas = document.getElementById('threadCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, points;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function makePoints(){
    const count = window.innerWidth < 720 ? 16 : 32;
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio
    }));
  }

  function step(){
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(201, 106, 63, 0.18)';
    ctx.lineWidth = 1;

    points.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    for (let i = 0; i < points.length; i++){
      for (let j = i + 1; j < points.length; j++){
        const a = points[i], b = points[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const maxDist = 220 * devicePixelRatio;
        if (dist < maxDist){
          ctx.globalAlpha = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makePoints();
  step();

  window.addEventListener('resize', () => { resize(); makePoints(); });
}

/* ---------------- Typewriter effect ---------------- */
function initTypewriter(){
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = ['an Aspiring Software Developer.', 'Web Developer'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const word = words[wordIndex];

    if (!deleting){
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length){
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(tick, deleting ? 45 : 85);
  }

  tick();
}

/* ---------------- Reveal-on-scroll (IntersectionObserver) ---------------- */
function initRevealOnScroll(){
  document.querySelectorAll(
    '.about-grid, .project-grid, .skills-grid, .contact-grid, .education, .photo-frame'
  ).forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---------------- Skill progress bars (animate on view) ---------------- */
function initSkillBars(){
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const percent = parseInt(bar.dataset.percent, 10);
      const fill = bar.querySelector('.skill-bar-fill');
      const label = bar.querySelector('.skill-bar-percent');

      let current = 0;
      const duration = 1200;
      const start = performance.now();

      function animate(now){
        const progress = Math.min((now - start) / duration, 1);
        current = Math.round(progress * percent);
        fill.style.width = current + '%';
        label.textContent = current + '%';
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      observer.unobserve(bar);
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
}

/* ---------------- Projects: data, render, modal ---------------- */
const PROJECTS_DATA = [
  {
    title: 'Lumen — Finance Dashboard',
    tags: ['React', 'Node.js', 'Chart.js'],
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    description: 'A real-time finance dashboard that tracks expenses, allows you to set budget goals, and displays spending patterns using interactive charts.',
    role: 'Front-end Developer',
    duration: '6 Weeks',
    link: '#'
  },
  {
    title: 'Verdant — E-commerce Store',
    tags: ['HTML', 'CSS', 'Vanilla JS'],
    thumb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    description: 'A fully responsive e-commerce site for a sustainable fashion brand, built with custom cart logic and filtering system in Vanilla JS.',
    role: 'UI/UX Designer & Developer',
    duration: '4 Weeks',
    link: '#'
  },
  {
    title: 'Pulse — Health Tracking App',
    tags: ['React', 'CSS', 'API'],
    thumb: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    description: 'A health-tracking web app that monitors sleep, hydration, and exercise, providing personalized insights.',
    role: 'Front-end Developer',
    duration: '8 Weeks',
    link: '#'
  }
];

function initProjects(){
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  grid.innerHTML = PROJECTS_DATA.map((p, i) => `
    <article class="project-card" data-index="${i}" tabindex="0" role="button" aria-label="${p.title} खोलें">
      <div class="project-thumb"><img src="${p.thumb}" alt="${p.title}" loading="lazy"></div>
      <div class="project-info">
        <span class="project-index">0${i + 1}</span>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openProjectModal(card.dataset.index);
      }
    });
  });

  initModal();
}

function initModal(){
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeProjectModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeProjectModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeProjectModal();
  });
}

function openProjectModal(index){
  const p = PROJECTS_DATA[index];
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');

  body.innerHTML = `
    <span class="modal-eyebrow">Project 0${parseInt(index) + 1}</span>
    <img src="${p.thumb}" alt="${p.title}">
    <h3>${p.title}</h3>
    <p>${p.description}</p>
    <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
    <div class="modal-meta">
      <div><span>Role</span><span>${p.role}</span></div>
      <div><span>Duration</span><span>${p.duration}</span></div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtnFocus();
}

function closeBtnFocus(){
  setTimeout(() => document.getElementById('modalClose').focus(), 50);
}

function closeProjectModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------------- Skills grid (icons) ---------------- */
const SKILLS_DATA = [
  { name: 'HTML5', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2L4.7 21L12 23L19.3 21L21 2H3Z" stroke="#C96A3F" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 7H17L16.6 12H7.4L7.6 14.5L12 15.7L16.4 14.5L16.7 11" stroke="#EDEAE2" stroke-width="1.2" stroke-linejoin="round"/></svg>` },
  { name: 'CSS3', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2L4.7 21L12 23L19.3 21L21 2H3Z" stroke="#C96A3F" stroke-width="1.4" stroke-linejoin="round"/><path d="M16.8 7H7L7.3 10H16.5L16.2 13.3H7.6L7.9 16L12 17.2L16 16L16.3 13" stroke="#EDEAE2" stroke-width="1.2" stroke-linejoin="round"/></svg>` },
  { name: 'JavaScript', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="2.5" width="19" height="19" rx="1.5" stroke="#C96A3F" stroke-width="1.4"/><path d="M8 17C8.5 17.8 9.2 18.3 10.1 18.3C11.2 18.3 11.8 17.6 11.8 16.5V10" stroke="#EDEAE2" stroke-width="1.3" stroke-linecap="round"/><path d="M14 16C14.4 17 15.2 17.6 16.2 17.6C17.3 17.6 18 17 18 16.1C18 13.8 13.8 14.5 13.8 12.2C13.8 11.2 14.6 10.4 15.8 10.4C16.7 10.4 17.4 10.9 17.7 11.7" stroke="#EDEAE2" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  { name: 'React', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2.2" fill="#C96A3F"/><ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#EDEAE2" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" stroke="#EDEAE2" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" stroke="#EDEAE2" stroke-width="1.2"/></svg>` },
  { name: 'Node.js', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="#C96A3F" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 13.5C9 15 10 16 12 16C14 16 14.5 15.2 14.5 14.3C14.5 11.8 9.3 13 9.3 10.6C9.3 9.7 10.1 8.8 11.8 8.8C13.3 8.8 14.2 9.5 14.4 10.5" stroke="#EDEAE2" stroke-width="1.2" stroke-linecap="round"/></svg>` }
];

function initSkillsGrid(){
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  grid.innerHTML = SKILLS_DATA.map(s => `
    <div class="skill-tile">
      ${s.svg}
      <span>${s.name}</span>
    </div>
  `).join('');
}

/* ---------------- Contact form: validation + fake submit ---------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: form.name, validate: v => v.trim().length >= 2, msg: 'Enter at least 2 characters.' },
    email: { el: form.email, validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address.' },
    message: { el: form.message, validate: v => v.trim().length >= 10, msg: 'Enter at least 10 characters.' }
  };

  Object.entries(fields).forEach(([key, field]) => {
    field.el.addEventListener('input', () => validateField(key, field));
    field.el.addEventListener('blur', () => validateField(key, field));
  });

  function validateField(key, field){
    const row = field.el.closest('.form-row');
    const errorEl = row.querySelector('.form-error');
    const valid = field.validate(field.el.value);
    row.classList.toggle('error', !valid);
    errorEl.textContent = valid ? '' : field.msg;
    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = Object.entries(fields)
      .map(([key, field]) => validateField(key, field))
      .every(Boolean);

    if (!allValid) return;

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // simulate async send (Advanced JS: Promise + setTimeout)
    sendMessage({
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    }).then(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      showToast('Message Sent ✓ धन्यवाद!');
      form.reset();
      Object.values(fields).forEach(f => {
        f.el.closest('.form-row').classList.remove('error');
      });
    });
  });
}

function sendMessage(data){
  return new Promise((resolve) => {
    console.log('Contact form submitted:', data);
    setTimeout(resolve, 1100);
  });
}

function showToast(text){
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  toastText.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}