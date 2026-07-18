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
