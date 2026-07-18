document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-animate]').forEach((element) => {
  const siblings = Array.from(element.parentElement.querySelectorAll(':scope > [data-animate]'));
  const index = siblings.indexOf(element) % 6;
  element.style.setProperty('--delay', `${index * 90}ms`);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('[data-animate]').forEach((element) => observer.observe(element));

const shakeObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shake');
        entry.target.addEventListener(
          'animationend',
          () => entry.target.classList.remove('shake'),
          { once: true }
        );
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('[data-shake]').forEach((element) => shakeObserver.observe(element));

// Animated headline word stagger
document.querySelectorAll('.reveal-headline .word').forEach((word, index) => {
  word.style.setProperty('--i', index);
});

// Animated counters
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Floating hero particles
const particleField = document.getElementById('heroParticles');
if (particleField) {
  const particleCount = window.innerWidth < 720 ? 90 : 180;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'hero-particle';
    const size = 2 + Math.random() * 4;
    particle.style.setProperty('--size', `${size}px`);
    particle.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
    particle.style.setProperty('--delay', `${Math.random() * 4}s`);
    particle.style.setProperty('--drift', `${Math.random() * 100 - 50}px`);
    particle.style.left = `${Math.random() * 100}%`;
    particleField.appendChild(particle);
  }
}

// Hero parallax: background mesh, glow, and card drift on mouse move
const heroEl = document.getElementById('top');
const heroGlow = document.getElementById('heroGlow');
const heroContentEl = heroEl ? heroEl.querySelector('.hero-content') : null;
const heroPanelEl = heroEl ? heroEl.querySelector('.hero-panel') : null;

if (heroEl && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  heroEl.addEventListener('mousemove', (event) => {
    const rect = heroEl.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const offsetX = (x - 0.5) * 2;
    const offsetY = (y - 0.5) * 2;

    if (heroGlow) {
      heroGlow.style.setProperty('--gx', `${x * 100}%`);
      heroGlow.style.setProperty('--gy', `${y * 100}%`);
    }

    if (heroContentEl) {
      heroContentEl.style.transform = `translate(${offsetX * 3}px, ${offsetY * 3}px)`;
    }

    if (heroPanelEl) {
      heroPanelEl.style.transform = `translate(${offsetX * 5}px, ${offsetY * 5}px)`;
    }
  });

  heroEl.addEventListener('mouseleave', () => {
    if (heroContentEl) heroContentEl.style.transform = '';
    if (heroPanelEl) heroPanelEl.style.transform = '';
  });
}

// Custom cursor: dot + lagging ring, expands over interactive elements
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;

  document.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorDot.style.left = `${targetX}px`;
    cursorDot.style.top = `${targetY}px`;
  });

  const animateRing = () => {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);

  const hoverTargets = 'a, button, .service-card, .social-pill, .contact-pill';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}
