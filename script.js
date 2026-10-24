// ---------- Glow colour swatches ----------
const stage = document.getElementById('heroStage');
const heroWrap = document.getElementById('tilt');
const photo = document.getElementById('heroPhoto');
const swatches = [...document.querySelectorAll('.sw')];
const dots = [...document.querySelectorAll('.pager i')];
let current = 0, timer;

function showBike(i) {
  current = i;
  const btn = swatches[i];
  swatches.forEach(b => b.classList.toggle('active', b === btn));
  dots.forEach((d, k) => d.classList.toggle('on', k === i));
  stage.style.setProperty('--glow', btn.dataset.glow);
  document.getElementById('colourName').textContent = btn.dataset.name;
  photo.classList.add('swap');
  const next = new Image();
  next.onload = () => {
    setTimeout(() => {
      photo.src = btn.dataset.img;
      photo.alt = 'Royal Enfield Classic in ' + btn.dataset.name.toLowerCase();
      photo.classList.remove('swap');
    }, 250);
  };
  next.src = btn.dataset.img;
}
function autoplay() {
  clearInterval(timer);
  timer = setInterval(() => showBike((current + 1) % swatches.length), 5000);
}
swatches.forEach((btn, i) => btn.addEventListener('click', () => { showBike(i); autoplay(); }));
dots.forEach((d, i) => d.addEventListener('click', () => { showBike(i); autoplay(); }));
stage.addEventListener('mouseenter', () => clearInterval(timer));
stage.addEventListener('mouseleave', autoplay);
showBike(0);
autoplay();

// ---------- Mouse-follow 3D tilt ----------
if (matchMedia('(hover:hover)').matches) {
  stage.addEventListener('mousemove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroWrap.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 8}deg) translateX(${x * 14}px)`;
  });
  stage.addEventListener('mouseleave', () => (heroWrap.style.transform = ''));

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => (card.style.transform = ''));
  });
}

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .15 });
document.querySelectorAll('.title, .card, .about-grid > *, .support-grid > *').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 90 + 'ms';
  io.observe(el);
});

// ---------- Stat counters ----------
document.querySelectorAll('.stats b').forEach(b => {
  const t = b.textContent.trim();
  const n = parseInt(t);
  if (!n) return;
  const suffix = t.replace(String(n), '');
  const o = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    const start = performance.now(), dur = 1400, from = n > 1000 ? 1800 : 0;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      b.textContent = Math.round(from + (n - from) * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    o.disconnect();
  });
  o.observe(b);
});

// ---------- Scroll progress ----------
const bar = document.createElement('div');
bar.id = 'progress';
document.body.appendChild(bar);
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
});

// ---------- Mobile menu + demo form ----------
document.querySelectorAll('nav a').forEach(a =>
  a.addEventListener('click', () => document.body.classList.remove('nav-open'))
);
document.getElementById('supportForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('thanks').hidden = false;
  e.target.reset();
});
