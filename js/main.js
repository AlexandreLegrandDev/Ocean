/**
 * OCEAN EXPERIENCE — main.js
 * Accessibility-first interactions with GSAP + ScrollTrigger.
 */

gsap.registerPlugin(ScrollTrigger);

const ZONES = [
    { name: 'Zone Euphotique', depth: '0 – 200 m', temp: '15 – 25°C', pressure: '1 – 21 atm', light: '100%', bio: 2 },
    { name: 'Zone Mésopélagique', depth: '200 – 1 000 m', temp: '4 – 15°C', pressure: '21 – 101 atm', light: '< 1%', bio: 55 },
    { name: 'Zone Bathypélagique', depth: '1 000 – 4 000 m', temp: '2 – 4°C', pressure: '101 – 400 atm', light: '0%', bio: 80 },
    { name: 'Zone Hadale', depth: '4 000 – 11 000 m', temp: '0 – 2°C', pressure: '400 – 1 100 atm', light: '0%', bio: 95 }
];

const EL = id => document.getElementById(id);
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const STORAGE_KEYS = {
    forceReducedMotion: 'oceanForceReducedMotion',
    highContrast: 'oceanHighContrast'
};

const motionToggleBtn = EL('motionToggle');
const contrastToggleBtn = EL('contrastToggle');

function safeStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage is unavailable (privacy mode / blocked context). Keep runtime functional.
    }
}

let forceReducedMotion = safeStorageGet(STORAGE_KEYS.forceReducedMotion) === 'true';
let highContrastEnabled = safeStorageGet(STORAGE_KEYS.highContrast) === 'true';

const isReducedMotion = () => forceReducedMotion || motionQuery.matches;

const depthBar = EL('depthBar');
const depthFill = EL('depthFill');
const depthValue = EL('depthValue');
const sonarDepth = EL('sonarDepth');
const zoneAnnouncer = EL('zoneAnnouncer');

function setAnnouncerText(text) {
    if (!zoneAnnouncer) return;
    zoneAnnouncer.textContent = '';
    window.setTimeout(() => {
        zoneAnnouncer.textContent = text;
    }, 20);
}

function applyAccessibilityPreferences() {
    document.body.classList.toggle('is-high-contrast', highContrastEnabled);

    if (motionToggleBtn) {
        motionToggleBtn.setAttribute('aria-pressed', String(forceReducedMotion));
        motionToggleBtn.textContent = forceReducedMotion
            ? 'Réduction animations: activée'
            : 'Réduction animations: auto';
    }

    if (contrastToggleBtn) {
        contrastToggleBtn.setAttribute('aria-pressed', String(highContrastEnabled));
        contrastToggleBtn.textContent = highContrastEnabled
            ? 'Contraste renforcé: activé'
            : 'Contraste renforcé: désactivé';
    }
}

applyAccessibilityPreferences();

if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', () => {
        forceReducedMotion = !forceReducedMotion;
        safeStorageSet(STORAGE_KEYS.forceReducedMotion, String(forceReducedMotion));
        applyAccessibilityPreferences();
        setAnnouncerText(
            forceReducedMotion
                ? 'Réduction des animations activée.'
                : 'Réduction des animations revenue au réglage système.'
        );
        window.location.reload();
    });
}

if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', () => {
        highContrastEnabled = !highContrastEnabled;
        safeStorageSet(STORAGE_KEYS.highContrast, String(highContrastEnabled));
        applyAccessibilityPreferences();
        setAnnouncerText(
            highContrastEnabled
                ? 'Contraste renforcé activé.'
                : 'Contraste renforcé désactivé.'
        );
    });
}

if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', () => {
        if (!forceReducedMotion) applyAccessibilityPreferences();
    });
}

function updateDepthProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const p = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
    const depth = Math.round(p * 11000);
    const text = depth.toLocaleString('fr-FR');

    if (depthFill) depthFill.style.height = `${p * 100}%`;
    if (depthValue) depthValue.textContent = text;
    if (sonarDepth) sonarDepth.textContent = text;

    if (depthBar) {
        depthBar.setAttribute('aria-valuenow', String(depth));
        depthBar.setAttribute('aria-valuetext', `${text} mètres`);
    }
}

window.addEventListener('scroll', updateDepthProgress, { passive: true });
window.addEventListener('resize', updateDepthProgress);
updateDepthProgress();

let currentZone = -1;
let lastAnnouncedZone = -1;
function updatePanel(i, announce = false) {
    const z = ZONES[i];
    if (!z) return;

    EL('zoneName').textContent = z.name;
    EL('zoneDepthLabel').textContent = z.depth;
    EL('envTemp').textContent = z.temp;
    EL('envPressure').textContent = z.pressure;
    EL('envLight').textContent = z.light;
    EL('bioFill').style.width = `${z.bio}%`;
    EL('bioLabel').textContent = `${z.bio}%`;

    if (!isReducedMotion()) {
        gsap.fromTo('.hud-header', { opacity: 0.4 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    }

    if (announce && i !== lastAnnouncedZone) {
        setAnnouncerText(`Zone active: ${z.name}, profondeur ${z.depth}.`);
        lastAnnouncedZone = i;
    }
}

document.querySelectorAll('.zone').forEach((sect, i) => {
    ScrollTrigger.create({
        trigger: sect,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
            if (currentZone !== i) {
                currentZone = i;
                updatePanel(i, true);
            }
        },
        onEnterBack: () => {
            if (currentZone !== i) {
                currentZone = i;
                updatePanel(i, true);
            }
        }
    });
});
updatePanel(0, false);

(function waveCanvas() {
    const cvs = EL('waveCanvas');
    const ctx = cvs?.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let t = 0;

    const res = () => {
        W = cvs.width = cvs.offsetWidth;
        H = cvs.height = cvs.offsetHeight;
    };

    res();
    new ResizeObserver(res).observe(cvs);

    function drawWaveFrame() {
        ctx.clearRect(0, 0, W, H);

        [
            [0.006, 0, 0.13, H * 0.22],
            [0.009, Math.PI / 3, 0.08, H * 0.42],
            [0.005, Math.PI, 0.05, H * 0.62]
        ].forEach(([f, p, a, b]) => {
            ctx.beginPath();
            for (let x = 0; x <= W; x += 2) {
                const y = b + Math.sin(x * f + t + p) * 18 + Math.sin(x * f * 1.8 + t * 1.4 + p) * 9;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.fillStyle = `rgba(0,229,255,${a})`;
            ctx.fill();
        });
    }

    function loop() {
        drawWaveFrame();
        t += 0.006;
        requestAnimationFrame(loop);
    }

    drawWaveFrame();
    if (!isReducedMotion()) loop();
})();

(function abyssCanvas() {
    const cvs = EL('abyssCanvas');
    const sec = EL('zone-3');
    const ctx = cvs?.getContext('2d');
    if (!ctx || !sec) return;

    const res = () => {
        cvs.width = sec.offsetWidth;
        cvs.height = sec.offsetHeight;
    };

    res();
    new ResizeObserver(res).observe(sec);

    const dots = Array.from({ length: 90 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.6 + 0.3,
        a: Math.random() * 0.7 + 0.1,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.007 + 0.003,
        c: Math.random() > 0.5 ? '0,229,255' : '0,150,255'
    }));

    function drawAbyssFrame(animate = true) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        dots.forEach(d => {
            if (animate) d.ph += d.sp;
            const alpha = d.a * (0.4 + 0.6 * Math.sin(d.ph));
            const x = d.x * cvs.width;
            const y = d.y * cvs.height;

            const gr = ctx.createRadialGradient(x, y, 0, x, y, d.r * 5);
            gr.addColorStop(0, `rgba(${d.c},${alpha})`);
            gr.addColorStop(1, `rgba(${d.c},0)`);

            ctx.beginPath();
            ctx.arc(x, y, d.r * 5, 0, Math.PI * 2);
            ctx.fillStyle = gr;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${d.c},${Math.min(1, alpha * 2)})`;
            ctx.fill();
        });
    }

    function loop() {
        drawAbyssFrame(true);
        requestAnimationFrame(loop);
    }

    drawAbyssFrame(false);
    if (!isReducedMotion()) loop();
})();

if (isReducedMotion()) {
    gsap.set('.zone__header, .species-grid, .abyss-finale', { opacity: 1, y: 0, clearProps: 'transform' });
} else {
    gsap.from(['.hero__eyebrow', '.hero__title', '.hero__desc', '.hero__cta'], {
        opacity: 0,
        y: 30,
        stagger: 0.18,
        duration: 1,
        ease: 'power3.out',
        delay: 0.25
    });

    gsap.from('.hstat', {
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.7
    });

    gsap.utils.toArray('.zone__header, .species-grid, .abyss-finale').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });
}

const heroCta = document.querySelector('.hero__cta');
if (heroCta) {
    heroCta.addEventListener('click', e => {
        e.preventDefault();
        EL('zone-0')?.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth' });
    });
}

function initSectionFishSwarm() {
    if (isReducedMotion()) return;

    const defaultFishImages = ['assets/anime_fish_tilapia.png'];

    const fishFilterOverrides = {
        'assets/anime_fish_clown.png': 'saturate(1.08) brightness(1.02) contrast(1.04) drop-shadow(0 0 8px rgba(255,255,255,.08))'
    };

    const fishImagesBySection = {
        'zone-0': [
            'assets/anime_fish_clown.png',
            'assets/anime_fish_dolphin.png',
            'assets/anime_fish_hammer_shark.png',
            'assets/anime_fish_ray.png',
            'assets/anime_fish_tuna.png',
            'assets/anime_fish_turtle.png',
            'assets/anime_fish_trumpet.png'
        ],
        'zone-1': [
            'assets/anime_fish_tilapia.png'
        ],
    };

    const getSectionFishImages = section => {
        const sectionImages = fishImagesBySection[section.id];
        if (Array.isArray(sectionImages) && sectionImages.length) {
            return sectionImages;
        }
        return defaultFishImages;
    };

    const normalizeFishConfig = value => {
        if (typeof value === 'string') {
            return {
                src: value,
                filter: fishFilterOverrides[value] || null
            };
        }

        if (value && typeof value === 'object' && typeof value.src === 'string') {
            return {
                src: value.src,
                filter: value.filter || fishFilterOverrides[value.src] || null
            };
        }

        return {
            src: defaultFishImages[0],
            filter: fishFilterOverrides[defaultFishImages[0]] || null
        };
    };

    const pickRandomFishConfig = images => {
        if (!Array.isArray(images) || images.length === 0) {
            return normalizeFishConfig(defaultFishImages[0]);
        }
        return normalizeFishConfig(images[Math.floor(Math.random() * images.length)]);
    };

    const depthFilters = [
        'hue-rotate(170deg) saturate(1.1) brightness(0.92) contrast(1.05) drop-shadow(0 0 10px rgba(0,160,255,.22))',
        'hue-rotate(185deg) saturate(1.05) brightness(0.8) contrast(1.08) drop-shadow(0 0 10px rgba(0,130,230,.2))',
        'hue-rotate(200deg) saturate(1) brightness(0.68) contrast(1.1) drop-shadow(0 0 10px rgba(0,95,190,.18))',
        'hue-rotate(215deg) saturate(0.92) brightness(0.58) contrast(1.14) drop-shadow(0 0 10px rgba(0,70,150,.16))'
    ];

    document.querySelectorAll('.zone').forEach((section, sectionIndex) => {
        const fishImages = getSectionFishImages(section);
        const layer = document.createElement('div');
        layer.className = 'zone__fish-layer';
        section.appendChild(layer);

        const density = Math.max(3, Math.min(8, Math.round(section.offsetWidth / 220)));
        const fishCount = density + Math.floor(Math.random() * 2);

        for (let i = 0; i < fishCount; i++) {
            const fish = document.createElement('img');
            fish.className = 'zone__fish';
            const fishConfig = pickRandomFishConfig(fishImages);
            fish.src = fishConfig.src;
            fish.alt = '';
            fish.setAttribute('aria-hidden', 'true');

            const scale = 0.55 + Math.random() * 0.9;
            const size = 80 + Math.random() * 120;
            const y = 18 + Math.random() * 64;
            const direction = Math.random() > 0.5 ? 1 : -1; // 1 = droite, -1 = gauche

            // Plus on descend, plus la nage est lente.
            const depthSpeedFactor = 1 + sectionIndex * 0.28;

            // Plus le poisson est petit, plus il nage lentement (effet profondeur de champ).
            const sizeNormalized = (scale - 0.55) / 0.9; // 0..1
            const sizeSpeedFactor = 1.35 - sizeNormalized * 0.55;

            const duration = (26 + Math.random() * 24) * depthSpeedFactor * sizeSpeedFactor;
            const mirroredScaleX = direction === 1 ? scale : -scale;

            fish.style.width = `${Math.round(size)}px`;
            fish.style.top = `${y}%`;
            fish.style.opacity = `${(0.2 + scale * 0.14).toFixed(2)}`;
            const depthFilter = depthFilters[Math.min(sectionIndex, depthFilters.length - 1)];
            fish.style.setProperty('--fish-filter', fishConfig.filter || depthFilter);
            fish.style.transformOrigin = '50% 50%';

            layer.appendChild(fish);

            const startX = direction === 1 ? -260 : section.offsetWidth + 260;
            const endX = direction === 1 ? section.offsetWidth + 260 : -260;

            gsap.fromTo(fish,
                {
                    x: startX,
                    scale,
                    // Le sprite source est considéré orienté vers la droite.
                    // Quand le poisson nage vers la gauche, on applique un miroir horizontal.
                    scaleX: mirroredScaleX,
                    rotate: 0
                },
                {
                    x: endX,
                    scaleX: mirroredScaleX,
                    duration,
                    ease: 'none',
                    repeat: -1,
                    delay: -Math.random() * duration
                }
            );

            gsap.to(fish, {
                y: `+=${(Math.random() * 14 - 7).toFixed(2)}`,
                duration: 4.8 + Math.random() * 4.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to(fish, {
                rotate: direction === 1 ? 1.6 : -1.6,
                duration: 3.8 + Math.random() * 2.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    });
}

initSectionFishSwarm();

ScrollTrigger.refresh();

const O = {
    el: EL('spOverlay'),
    bg: EL('overlayBg'),
    i: EL('overlayInfo'),
    c: EL('overlayClose'),
    l: EL('overlayLatin'),
    n: EL('overlayName'),
    m: EL('overlayMeta'),
    a: EL('overlayLink')
};

const DEFAULT_SPECIES_IMAGE = 'assets/calamar_geant.jpg';
const SPECIES_IMAGE_BY_WIKI = {
    'Amphiprioninae': 'assets/clown_fish.jpg',
    'Sphyrna lewini': 'assets/hammer_shark.jpg',
    'Chelonia mydas': 'assets/sea_turtle.jpg',
    'Tursiops truncatus': 'assets/dauphin.png',
    'Mobula birostris': 'assets/raie.png',
    'Octopus vulgaris': 'assets/pieuvre.png',
    'Thunnus thynnus': 'assets/thon.png',
    'Aulostomus chinensis': 'assets/poisson_trompette.png',
    'Myctophidae': 'assets/lantern_fish.png',
    'Architeuthis dux': 'assets/calamar_geant.jpg',
    'Hoplostethus atlanticus': 'assets/orange_roughy.jpg',
    'Argyropelecus': 'assets/poisson_hachette.png',
    'Chiroteuthis': 'assets/Chiroteuthis.png',
    'Idiacanthus fasciola': 'assets/dragon_fish.png',
    'Oplophorus': 'assets/Oplophorus.png',
    'Stomias boa': 'assets/stomias.png',
    'Vampyroteuthis infernalis': 'assets/calamar_vampire.png',
    'Eurypharynx pelecanoides': 'assets/gulper.png',
    'Coryphaenoides': 'assets/macrure.png',
    'Grimpoteuthis': 'assets/dumbo.png',
    'Macropinna microstoma': 'assets/Poisson-baril.png',
    'Anoplogaster cornuta': 'assets/fangtooth.png',
    'Phronima': 'assets/Phronima.png',
    'Chimaera monstrosa': 'assets/chimere.png',
    'Abyssobrotula galatheae': 'assets/Abyssobrotula.png',
    'Pseudoliparis swirei': 'assets/snailfish.png',
    'Hirondellea gigas': 'assets/Hirondellea.png',
    'Polychaeta': 'assets/Polychaeta.png',
    'Holothuroidea': 'assets/Holothuria.png',
    'Brisingida': 'assets/Brisingida.png',
    'Kiwa hirsuta': 'assets/yeti_crab.png',
    'Opisthoteuthis': 'assets/Opisthoteuthis.png'
};

let isOpen = false;
let previouslyFocused = null;

const getFocusable = () => {
    if (!O.el) return [];
    return Array.from(
        O.el.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
};

function trapOverlayFocus(e) {
    if (!isOpen) return;

    if (e.key === 'Escape') {
        e.preventDefault();
        closeOverlay();
        return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

document.addEventListener('keydown', trapOverlayFocus);

function setCardAccessibilityLabel(card) {
    const name = card.querySelector('b')?.textContent?.trim();
    const meta = card.querySelector('small')?.textContent?.trim();
    if (!name) return;
    const label = meta
        ? `${name}. ${meta}. Ouvrir la fiche détaillée.`
        : `${name}. Ouvrir la fiche détaillée.`;
    card.setAttribute('aria-label', label);
}

function getSpeciesImagePath(wikiName) {
    return SPECIES_IMAGE_BY_WIKI[wikiName] || DEFAULT_SPECIES_IMAGE;
}

function setOverlayBackgroundImage(imagePath) {
    const img = new Image();
    img.onload = () => {
        O.bg.style.backgroundImage = `url('${imagePath}')`;
    };
    img.onerror = () => {
        O.bg.style.backgroundImage = `url('${DEFAULT_SPECIES_IMAGE}')`;
    };
    img.src = imagePath;
}

function openOverlay(card) {
    const wikiName = card.dataset.wiki;
    if (!wikiName || !O.el) return;

    previouslyFocused = document.activeElement;

    O.l.textContent = wikiName;
    O.n.textContent = card.querySelector('b')?.textContent || wikiName;
    O.m.textContent = card.querySelector('small')?.textContent || '';
    O.a.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiName)}`;

    const imagePath = getSpeciesImagePath(wikiName);

    setOverlayBackgroundImage(imagePath);
    O.el.classList.add('is-open');
    O.el.removeAttribute('inert');
    O.el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    isOpen = true;

    if (isReducedMotion()) {
        O.el.style.opacity = '1';
        O.i.focus();
    } else {
        gsap.fromTo(O.el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        gsap.fromTo('#overlayInfo', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 });
        gsap.fromTo(O.bg, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
        O.i.focus();
    }
}

function closeOverlay() {
    if (!isOpen || !O.el) return;
    isOpen = false;
    document.body.style.overflow = '';

    const completeClose = () => {
        O.el.classList.remove('is-open');
        O.el.setAttribute('aria-hidden', 'true');
        O.el.setAttribute('inert', '');
        O.bg.style.backgroundImage = '';
        O.el.style.opacity = '0';

        if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
            previouslyFocused.focus();
        }
    };

    if (isReducedMotion()) {
        completeClose();
    } else {
        gsap.to(O.el, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: completeClose });
    }
}

document.querySelectorAll('.sp-card[data-wiki]').forEach(card => {
    setCardAccessibilityLabel(card);
    card.addEventListener('click', () => openOverlay(card));
});

if (O.c) O.c.addEventListener('click', closeOverlay);
if (O.el) {
    O.el.addEventListener('click', e => {
        if (e.target === O.el || e.target === O.bg) closeOverlay();
    });
}
