/**
 * OCEAN EXPERIENCE — main.js
 * GSAP + ScrollTrigger · Layout 2/3 + 1/3 panel
 */

gsap.registerPlugin(ScrollTrigger);

const ZONES = [
  { name: 'Zone Euphotique', depth: '0 – 200 m', temp: '15 – 25°C', pressure: '1 – 21 atm', light: '100%', bio: 2 },
  { name: 'Zone Mésopélagique', depth: '200 – 1 000 m', temp: '4 – 15°C', pressure: '21 – 101 atm', light: '< 1%', bio: 55 },
  { name: 'Zone Bathypélagique', depth: '1 000 – 4 000 m', temp: '2 – 4°C', pressure: '101 – 400 atm', light: '0%', bio: 80 },
  { name: 'Zone Hadale', depth: '4 000 – 11 000 m', temp: '0 – 2°C', pressure: '400 – 1 100 atm', light: '0%', bio: 95 }
];

const EL = id => document.getElementById(id);
const depthFill = EL('depthFill'), depthValue = EL('depthValue'), sonarDepth = EL('sonarDepth');

window.addEventListener('scroll', () => {
  const p = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
  depthFill.style.height = `${p * 100}%`;
  const text = Math.round(p * 11000).toLocaleString('fr-FR');
  depthValue.textContent = text;
  if (sonarDepth) sonarDepth.textContent = text;
}, { passive: true });

let currentZone = -1;
function updatePanel(i) {
  const z = ZONES[i];
  if (!z) return;
  EL('zoneName').textContent = z.name;
  EL('zoneDepthLabel').textContent = z.depth;
  EL('envTemp').textContent = z.temp;
  EL('envPressure').textContent = z.pressure;
  EL('envLight').textContent = z.light;
  EL('bioFill').style.width = EL('bioLabel').textContent = `${z.bio}%`;
  gsap.fromTo('.hud-header', { opacity: .4 }, { opacity: 1, duration: .4, ease: 'power2.out' });
}

document.querySelectorAll('.zone').forEach((sect, i) => {
  ScrollTrigger.create({
    trigger: sect, start: 'top 60%', end: 'bottom 40%',
    onEnter: () => { if (currentZone !== i) { currentZone = i; updatePanel(i); } },
    onEnterBack: () => { if (currentZone !== i) { currentZone = i; updatePanel(i); } }
  });
});
updatePanel(0);

(function waveCanvas() {
  const cvs = EL('waveCanvas'), ctx = cvs?.getContext('2d');
  if (!ctx) return;
  let W, H, t = 0;
  const res = () => { W = cvs.width = cvs.offsetWidth; H = cvs.height = cvs.offsetHeight; };
  res(); new ResizeObserver(res).observe(cvs);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    [[.006, 0, .13, H * .22], [.009, Math.PI / 3, .08, H * .42], [.005, Math.PI, .05, H * .62]]
      .forEach(([f, p, a, b]) => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          let y = b + Math.sin(x * f + t + p) * 18 + Math.sin(x * f * 1.8 + t * 1.4 + p) * 9;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fillStyle = `rgba(0,229,255,${a})`; ctx.fill();
      });
    t += .006; requestAnimationFrame(draw);
  }
  draw();
})();

// ─── ABYSS CANVAS ────────────────────────────────────────────
(function abyssCanvas() {
  const cvs = EL('abyssCanvas'), sec = EL('zone-3'), ctx = cvs?.getContext('2d');
  if(!ctx) return;
  const res = () => { cvs.width = sec.offsetWidth; cvs.height = sec.offsetHeight; };
  res(); new ResizeObserver(res).observe(sec);
  const dots = Array.from({length: 90}, () => ({
    x: Math.random(), y: Math.random(), r: Math.random()*1.6+.3,
    a: Math.random()*.7+.1, ph: Math.random()*Math.PI*2,
    sp: Math.random()*.007+.003, c: Math.random()>.5?'0,229,255':'0,150,255'
  }));
  function draw() {
    ctx.clearRect(0,0,cvs.width,cvs.height);
    dots.forEach(d => {
      d.ph += d.sp;
      const a = d.a * (.4 + .6*Math.sin(d.ph)), x = d.x*cvs.width, y = d.y*cvs.height;
      const gr = ctx.createRadialGradient(x,y,0, x,y, d.r*5);
      gr.addColorStop(0, `rgba(${d.c},${a})`); gr.addColorStop(1, `rgba(${d.c},0)`);
      ctx.beginPath(); ctx.arc(x,y,d.r*5,0,Math.PI*2); ctx.fillStyle = gr; ctx.fill();
      ctx.beginPath(); ctx.arc(x,y,d.r,0,Math.PI*2); ctx.fillStyle = `rgba(${d.c},${Math.min(1,a*2)})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── ANIMATIONS GSAP (ScrollTrigger) ─────────────────────────
// Hero
gsap.from(['.hero__eyebrow','.hero__title','.hero__desc','.hero__cta'], { opacity:0, y:30, stagger:.18, duration:1, ease:'power3.out', delay:.25 });
gsap.from('.hstat', { opacity:0, y:16, stagger:.1, duration:.8, ease:'power2.out', delay:.7 });

// Zones — reveal au scroll
gsap.utils.toArray('.zone__header, .species-grid, .abyss-finale').forEach(el => {
  gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
});

// Créatures (en cascade)
document.querySelectorAll('.creature').forEach((c, i) => {
  gsap.to(c, {
    opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: i * .15,
    scrollTrigger: { trigger: c, start: 'top 88%', once: true },
    onComplete: () => floatCreature(c),
  });
});

// ─── FLOTTEMENT MÉDUSES ───────────────────────────────────────
function floatCreature(el) {
  const dur = 4.5 + Math.random() * 2.5;
  const ampY = 16 + Math.random() * 12;
  gsap.to(el, { y: `+=${ampY}`, duration: dur, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to(el, { rotation: 2.5, duration: dur * .85, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: .4 });
}

// Parallaxe créatures (léger décalage)
document.querySelectorAll('.creature').forEach((c, i) => {
  const section = c.closest('.zone');
  if (!section) return;
  gsap.to(c, {
    y: `-=${50 + i * 10}`,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 + i * .3 },
  });
});

// ─── CTA SMOOTH SCROLL ───────────────────────────────────────
document.querySelector('.hero__cta')?.addEventListener('click', e => { e.preventDefault(); EL('zone-0')?.scrollIntoView({behavior:'smooth'}); });
ScrollTrigger.refresh();

// ─── SPECIES OVERLAY ─────────────────────────────────────────
const O = { el: EL('spOverlay'), bg: EL('overlayBg'), s: EL('overlaySpinner'), 
            l: EL('overlayLatin'), n: EL('overlayName'), m: EL('overlayMeta'), a: EL('overlayLink') };
let isOpen = false;

async function fetchWiki(sp) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(sp)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=1400&origin=*`);
    const d = await res.json();
    return Object.values(d.query?.pages || {})[0]?.thumbnail?.source || null;
  } catch { return null; }
}

async function openOverlay(c) {
  const w = c.dataset.wiki; if(!w) return;
  O.l.textContent = w; O.n.textContent = c.querySelector('b')?.textContent || w;
  O.m.textContent = c.querySelector('small')?.textContent || '';
  O.a.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(w)}`;
  O.bg.style.backgroundImage = ''; O.s.style.display = 'block'; isOpen = true;
  O.el.classList.add('is-open');
  gsap.fromTo(O.el, {opacity:0}, {opacity:1, duration:.45, ease:'power2.out'});
  gsap.fromTo('#overlayInfo', {opacity:0, y:24}, {opacity:1, y:0, duration:.55, ease:'power3.out', delay:.1});
  
  const src = await fetchWiki(w);
  O.s.style.display = 'none';
  if (src) {
    const img = new Image();
    img.onload = () => { O.bg.style.backgroundImage = `url('${src}')`; gsap.fromTo(O.bg, {opacity: 0, scale: 1.06}, {opacity: 1, scale: 1, duration: .8, ease: 'power2.out'}); };
    img.src = src;
  } else {
    O.bg.style.backgroundImage = `radial-gradient(ellipse at 70% 40%, rgba(0,229,255,.08) 0%, transparent 70%)`;
    gsap.to(O.bg, {opacity: 1, duration: .5});
  }
}

const closeOverlay = () => {
  if(!isOpen) return; isOpen = false;
  gsap.to(O.el, { opacity: 0, duration: .3, ease: 'power2.in', onComplete: () => { O.el.classList.remove('is-open'); O.bg.style.backgroundImage = ''; } });
};

document.querySelectorAll('.sp-card[data-wiki]').forEach(c => c.addEventListener('click', () => openOverlay(c)));
EL('overlayClose').addEventListener('click', closeOverlay);
O.el.addEventListener('click', e => { if (e.target === O.el || e.target === O.bg) closeOverlay(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });