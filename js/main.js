/**
 * OCEAN EXPERIENCE — main.js
 * GSAP + ScrollTrigger · Layout 2/3 + 1/3 panel
 */

gsap.registerPlugin(ScrollTrigger);

// ─── DONNÉES PAR ZONE ─────────────────────────────────────────
const ZONES = [
  {
    name: 'Zone Euphotique',
    depth: '0 – 200 m',
    temp: '15 – 25°C',
    pressure: '1 – 21 atm',
    light: '100%',
    o2: '8 mg/L',
    salinity: '35 PSU',
    bio: 2,
    species: [
      ['Aurelia aurita',        'Méduse lune'],
      ['Chelonia mydas',        'Tortue verte'],
      ['Tursiops truncatus',    'Grand dauphin'],
      ['Thunnus thynnus',       'Thon rouge'],
      ['Sphyrna lewini',        'Requin marteau'],
    ],
  },
  {
    name: 'Zone Mésopélagique',
    depth: '200 – 1 000 m',
    temp: '4 – 15°C',
    pressure: '21 – 101 atm',
    light: '< 1%',
    o2: '3 mg/L',
    salinity: '34.5 PSU',
    bio: 55,
    species: [
      ['Dosidicus gigas',       'Calmar Humboldt'],
      ['Architeuthis dux',      'Calmar géant'],
      ['Idiacanthus fasciola',  'Poisson-dragon'],
      ['Myctophidae spp.',      'Poisson-lanterne'],
      ['Argyropelecus spp.',    'Poisson-hachette'],
    ],
  },
  {
    name: 'Zone Bathypélagique',
    depth: '1 000 – 4 000 m',
    temp: '2 – 4°C',
    pressure: '101 – 400 atm',
    light: '0%',
    o2: '1 mg/L',
    salinity: '34.7 PSU',
    bio: 80,
    species: [
      ['Chauliodus sloani',     'Poisson vipère'],
      ['Vampyroteuthis infernalis', 'Calmar vampire'],
      ['Grimpoteuthis spp.',    'Poulpe Dumbo'],
      ['Anoplogaster cornuta',  'Fangtooth'],
      ['Macropinna microstoma', 'Poisson-baril'],
    ],
  },
  {
    name: 'Zone Hadale',
    depth: '4 000 – 11 000 m',
    temp: '0 – 2°C',
    pressure: '400 – 1 100 atm',
    light: '0%',
    o2: '< 0.5 mg/L',
    salinity: '34.8 PSU',
    bio: 95,
    species: [
      ['Melanocetus johnsonii', 'Baudroie abyssale'],
      ['Pseudoliparis swirei',  'Escargot des fosses'],
      ['Hirondellea gigas',     'Amphipode géant'],
      ['Periphylla periphylla', 'Méduse casque'],
      ['Kiwa hirsuta',          'Crabe yéti'],
    ],
  },
];

// ─── DEPTH BAR ────────────────────────────────────────────────
const depthFill  = document.getElementById('depthFill');
const depthValue = document.getElementById('depthValue');
const sonarDepth = document.getElementById('sonarDepth');
const MAX_DEPTH  = 11000;

window.addEventListener('scroll', () => {
  const p = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
  depthFill.style.height = `${p * 100}%`;
  const d = Math.round(p * MAX_DEPTH);
  depthValue.textContent = d.toLocaleString('fr-FR');
  sonarDepth.textContent = d.toLocaleString('fr-FR');
}, { passive: true });

// ─── MISE À JOUR PANNEAU DROIT selon zone active ───────────────
function updatePanel(zoneIdx) {
  const z = ZONES[zoneIdx];
  if (!z) return;

  document.getElementById('zoneName').textContent      = z.name;
  document.getElementById('zoneDepthLabel').textContent = z.depth;
  document.getElementById('spZoneName').textContent    = z.name;
  document.getElementById('envDepth').textContent      = z.depth;
  document.getElementById('envTemp').textContent       = z.temp;
  document.getElementById('envPressure').textContent   = z.pressure;
  document.getElementById('envLight').textContent      = z.light;
  document.getElementById('envO2').textContent         = z.o2;
  document.getElementById('envSalinity').textContent   = z.salinity;

  // Bioluminescence
  document.getElementById('bioFill').style.width  = `${z.bio}%`;
  document.getElementById('bioLabel').textContent = `${z.bio}%`;

  // Liste espèces
  const list = document.getElementById('speciesList');
  list.innerHTML = z.species.map(([name, fr]) =>
    `<li><span>${name}</span><em>${fr}</em></li>`
  ).join('');

  // Animation subtile de la zone indicator
  gsap.fromTo('#zoneIndicator', { opacity:.4 }, { opacity:1, duration:.4, ease:'power2.out' });
}

// Zone triggers
let currentZone = -1;
document.querySelectorAll('.zone').forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter:      () => { if (currentZone !== i) { currentZone = i; updatePanel(i); } },
    onEnterBack:  () => { if (currentZone !== i) { currentZone = i; updatePanel(i); } },
  });
});

// Init panel avec zone 0
updatePanel(0);

// ─── HERO CANVAS (vagues ancrées en bas) ─────────────────────
(function waveCanvas() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // 3 couches de vagues — dessinées depuis le bas du canvas
    [
      [.006, 0,          .13, H * .22],
      [.009, Math.PI/3,  .08, H * .42],
      [.005, Math.PI,    .05, H * .62],
    ].forEach(([freq, phase, alpha, baseY]) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = baseY
          + Math.sin(x * freq + t + phase)         * 18
          + Math.sin(x * freq * 1.8 + t * 1.4 + phase) * 9;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fill();
    });
    t += .006;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── ABYSS CANVAS ────────────────────────────────────────────
(function abyssCanvas() {
  const canvas  = document.getElementById('abyssCanvas');
  if (!canvas) return;
  const section = document.getElementById('zone-3');
  const ctx     = canvas.getContext('2d');

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(section);

  const dots = Array.from({ length: 90 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.6 + .3,
    a: Math.random() * .7 + .1,
    ph: Math.random() * Math.PI * 2,
    sp: Math.random() * .007 + .003,
    col: Math.random() > .5 ? '0,229,255' : '0,150,255',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.ph += d.sp;
      const a = d.a * (.4 + .6 * Math.sin(d.ph));
      const x = d.x * canvas.width;
      const y = d.y * canvas.height;
      // glow halo
      const gr = ctx.createRadialGradient(x,y,0, x,y, d.r*5);
      gr.addColorStop(0, `rgba(${d.col},${a})`);
      gr.addColorStop(1, `rgba(${d.col},0)`);
      ctx.beginPath();
      ctx.arc(x, y, d.r*5, 0, Math.PI*2);
      ctx.fillStyle = gr;
      ctx.fill();
      // core
      ctx.beginPath();
      ctx.arc(x, y, d.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${d.col},${Math.min(1,a*2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── ANIMATIONS GSAP (ScrollTrigger) ─────────────────────────
// Hero
gsap.from(['.hero__eyebrow','.hero__title','.hero__desc','.hero__cta'], {
  opacity:0, y:30, stagger:.18, duration:1, ease:'power3.out', delay:.25,
});
gsap.from('.hstat', {
  opacity:0, y:16, stagger:.1, duration:.8, ease:'power2.out', delay:.7,
});

// Zones — reveal au scroll
document.querySelectorAll('.zone').forEach(zone => {

  // Header info
  gsap.to(zone.querySelector('.zone__header'), {
    opacity:1, y:0, duration:.9, ease:'power3.out',
    scrollTrigger: { trigger: zone.querySelector('.zone__header'), start:'top 80%', once:true },
  });

  // Grille espèces
  const grid = zone.querySelector('.species-grid');
  if (grid) {
    gsap.to(grid, {
      opacity:1, y:0, duration:.8, ease:'power3.out',
      scrollTrigger: { trigger: grid, start:'top 85%', once:true },
    });
  }

  // Créatures (en cascade)
  zone.querySelectorAll('.creature').forEach((c, i) => {
    gsap.to(c, {
      opacity:1, y:0, duration:1.1, ease:'power3.out', delay: i * .15,
      scrollTrigger: { trigger: c, start:'top 88%', once:true },
      onComplete: () => floatCreature(c),
    });
  });
});

// Finale abysses
const finale = document.querySelector('.abyss-finale');
if (finale) {
  gsap.to(finale, {
    opacity:1, y:0, duration:1.2, ease:'power3.out',
    scrollTrigger: { trigger: finale, start:'top 80%', once:true },
  });
}

// ─── FLOTTEMENT MÉDUSES ───────────────────────────────────────
function floatCreature(el) {
  const dur  = 4.5 + Math.random() * 2.5;
  const ampY = 16  + Math.random() * 12;
  gsap.to(el, { y:`+=${ampY}`, duration:dur, ease:'sine.inOut', repeat:-1, yoyo:true });
  gsap.to(el, { rotation: 2.5, duration:dur*.85, ease:'sine.inOut', repeat:-1, yoyo:true, delay:.4 });
}

// Parallaxe créatures (léger décalage)
document.querySelectorAll('.creature').forEach((c, i) => {
  const section = c.closest('.zone');
  if (!section) return;
  gsap.to(c, {
    y: `-=${50 + i * 10}`,
    ease: 'none',
    scrollTrigger: { trigger: section, start:'top bottom', end:'bottom top', scrub: 1.5 + i * .3 },
  });
});

// ─── CTA SMOOTH SCROLL ───────────────────────────────────────
document.querySelector('.hero__cta')?.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#zone-0')?.scrollIntoView({ behavior:'smooth' });
});

ScrollTrigger.refresh();

// ─── SPECIES OVERLAY ─────────────────────────────────────────
const overlay       = document.getElementById('spOverlay');
const overlayBg     = document.getElementById('overlayBg');
const overlaySpinner= document.getElementById('overlaySpinner');
const overlayLatin  = document.getElementById('overlayLatin');
const overlayName   = document.getElementById('overlayName');
const overlayMeta   = document.getElementById('overlayMeta');
const overlayLink   = document.getElementById('overlayLink');
const overlayClose  = document.getElementById('overlayClose');

let isOpen = false;

// Fetch image Wikipedia (pageimages API, CORS ok via origin=*)
async function fetchWikiImage(species) {
  const api = `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent(species)}` +
    `&prop=pageimages&format=json&pithumbsize=1400&origin=*`;
  try {
    const res  = await fetch(api);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function openOverlay(card) {
  if (!card.dataset.wiki) return;

  const wiki   = card.dataset.wiki;
  const name   = card.querySelector('b')?.textContent  || wiki;
  const meta   = card.querySelector('small')?.textContent || '';

  // Pré-remplir infos texte immédiatement
  overlayLatin.textContent = wiki;
  overlayName.textContent  = name;
  overlayMeta.textContent  = meta;
  overlayLink.href  = `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki)}`;
  overlayBg.style.backgroundImage = '';

  // Montrer overlay + spinner
  isOpen = true;
  overlay.classList.add('is-open');
  overlaySpinner.style.display = 'block';

  gsap.fromTo(overlay,
    { opacity: 0 },
    { opacity: 1, duration: .45, ease: 'power2.out' }
  );
  gsap.fromTo('#overlayInfo',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: .55, ease: 'power3.out', delay: .1 }
  );

  // Fetch image en parallèle
  const src = await fetchWikiImage(wiki);
  overlaySpinner.style.display = 'none';

  if (src) {
    // Précharger l'image avant de l'afficher
    const img = new Image();
    img.onload = () => {
      overlayBg.style.backgroundImage = `url('${src}')`;
      gsap.fromTo(overlayBg,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: .8, ease: 'power2.out' }
      );
    };
    img.src = src;
  } else {
    // Pas d'image → fond dégradé néon subtil comme fallback
    overlayBg.style.backgroundImage =
      `radial-gradient(ellipse at 70% 40%, rgba(0,229,255,.08) 0%, transparent 70%)`;
    gsap.to(overlayBg, { opacity: 1, duration: .5 });
  }
}

function closeOverlay() {
  if (!isOpen) return;
  isOpen = false;
  gsap.to(overlay, {
    opacity: 0, duration: .3, ease: 'power2.in',
    onComplete: () => {
      overlay.classList.remove('is-open');
      overlayBg.style.backgroundImage = '';
    },
  });
}

// Clic sur une card avec data-wiki
document.querySelectorAll('.sp-card[data-wiki]').forEach(card => {
  card.addEventListener('click', () => openOverlay(card));
});

// Fermer : bouton ✕ ou clic sur le fond
overlayClose.addEventListener('click', closeOverlay);
overlay.addEventListener('click', e => {
  if (e.target === overlay || e.target === overlayBg) closeOverlay();
});

// Fermer avec Échap
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOverlay();
});

