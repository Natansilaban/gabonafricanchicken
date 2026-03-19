/* ──────────────────────────────────────
   GABON — main.js
   Custom cursor, preloader, nav scroll,
   scroll reveal, particles, hamburger
   ────────────────────────────────────── */

// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) {
      pre.classList.add('hidden');
      pre.addEventListener('transitionend', () => pre.remove(), { once: true });
    }
    // Trigger initial reveals
    document.querySelectorAll('.reveal-up').forEach(el => observeReveal(el));
  }, 800);
});

// ── CUSTOM CURSOR ──
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

if (dot && ring) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lag
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover effect on links / buttons
  document.querySelectorAll('a, button, .menu-card, .fr-card, .loc-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ── HAMBURGER ──
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── ABOUT GALLERY SLIDER ──
(function initSlider() {
  const slider  = document.getElementById('aboutSlider');
  if (!slider) return;
  const slides  = slider.querySelectorAll('.aslide');
  const dots    = slider.querySelectorAll('.asdot');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  let current   = 0;
  let timer     = null;
  const INTERVAL = 4000;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() { timer = setInterval(() => goTo(current + 1), INTERVAL); }
  function stopAuto()  { clearInterval(timer); }

  startAuto();
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach(dot => dot.addEventListener('click', () => { stopAuto(); goTo(+dot.dataset.i); startAuto(); }));

  // Touch swipe support
  let tx = 0;
  slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) { stopAuto(); goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });
})();

// ── MENU MODAL ──
const openMenuBtn      = document.getElementById('openMenuBtn');
const closeMenuBtn     = document.getElementById('closeMenuBtn');
const menuModal        = document.getElementById('menuModal');
const menuModalBackdrop = document.getElementById('menuModalBackdrop');

function openModal() {
  menuModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  menuModal.classList.remove('open');
  document.body.style.overflow = '';
}
if (openMenuBtn)       openMenuBtn.addEventListener('click', openModal);
if (closeMenuBtn)      closeMenuBtn.addEventListener('click', closeModal);
if (menuModalBackdrop) menuModalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuModal?.classList.contains('open')) closeModal(); });

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 0;
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

// ── SCROLL REVEAL ──
function observeReveal(el) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if card
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  observer.observe(el);
}

// Stagger siblings
document.querySelectorAll('.menu-grid, .franchise-cards, .loc-grid, .contact-cards').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.dataset.delay = i * 100;
  });
});

document.querySelectorAll('.reveal-up').forEach(el => {
  // Only observe after preloader (already done via setTimeout above)
  // But we also cover nav links triggered after load
  observeReveal(el);
});

// ── HERO PARTICLES ──
(function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size  = Math.random() * 3 + 1;
    const left  = Math.random() * 100;
    const delay = Math.random() * 12;
    const dur   = Math.random() * 12 + 10;
    const opacity = Math.random() * 0.3 + 0.1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      bottom:${Math.random() * 20}%;
      animation-delay:${delay}s;
      animation-duration:${dur}s;
      opacity:${opacity};
    `;
    container.appendChild(p);
  }
})();

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--gold-light)';
    }
  });
}, { passive: true });

// ── ABOUT IMAGE FALLBACK ──
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    if (this.classList.contains('about-img')) {
      const frame = this.closest('.about-img-frame');
      if (frame) {
        const ph = document.createElement('div');
        ph.className = 'about-img-placeholder';
        ph.innerHTML = '<span>🍗</span><p>Foto Restoran</p>';
        this.replaceWith(ph);
      }
    } else if (this.id === 'menuImg') {
      // menu.jpg not yet placed — show placeholder inside modal
      const wrap = this.closest('.menu-modal-img-wrap');
      if (wrap) {
        wrap.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;gap:1rem;color:var(--text-muted);">
            <span style="font-size:4rem;">📋</span>
            <p style="font-size:0.85rem;letter-spacing:0.1em;text-align:center;padding:0 2rem;">
              Simpan file menu kamu sebagai:<br/>
              <code style="color:var(--gold-light);font-size:0.8rem;">assets/images/menu.jpg</code>
            </p>
          </div>`;
      }
    } else {
      this.style.display = 'none';
    }
  });
});
