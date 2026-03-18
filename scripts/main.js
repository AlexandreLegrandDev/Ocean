gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray('.depth-stage');
const depthCounter = document.querySelector('[data-depth-counter]');
const depthProgress = document.querySelector('[data-depth-progress]');
const depthTicks = gsap.utils.toArray('.depth-indicator__tick');
const TOTAL_DEPTH = 10000;

function setActiveSection(activeSection) {
  sections.forEach((section) => {
    section.classList.toggle('is-active', section === activeSection);
  });
}

function setupDepthTicks() {
  depthTicks.forEach((tick) => {
    const tickDepth = Number(tick.dataset.tickDepth || 0);
    const position = (tickDepth / TOTAL_DEPTH) * 100;
    tick.style.top = `${position}%`;
  });
}

function setActiveDepthTick(depthValue) {
  depthTicks.forEach((tick) => {
    const tickDepth = Number(tick.dataset.tickDepth || 0);
    tick.classList.toggle('is-active', depthValue >= tickDepth);
  });
}

function updateDepthIndicator(progress) {
  if (!depthCounter) {
    return;
  }

  const depthValue = Math.round(progress * TOTAL_DEPTH);
  depthCounter.textContent = `${depthValue.toLocaleString('fr-FR')} m`;
  setActiveDepthTick(depthValue);

  if (depthProgress) {
    // The line now fills from top to bottom to match the dive direction.
    depthProgress.style.height = `${Math.round(progress * 100)}%`;
  }
}

function setupSectionAnimations(section) {
  const revealTargets = section.querySelectorAll('[data-animate="card"], .depth-stage__meta, h2, p');
  const imageCard = section.querySelector('[data-animate="image"]');
  const image = section.querySelector('[data-animate="image"] img');
  const bubbles = section.querySelectorAll('[data-animate="bubble"]');
  const infoCard = section.querySelector('.depth-card--info');

  gsap.set(revealTargets, { autoAlpha: 0, y: 22 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    once: true,
    onEnter: () => {
      // Base reveal timeline: remplace ou enrichis ce bloc pour tes animations futures.
      gsap.to(revealTargets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power1.out'
      });
    }
  });

  if (image) {
    if (imageCard) {
      imageCard.classList.add('is-swimming');

      // Floating fish placeholder motion: smooth lateral and vertical drift.
      gsap.to(imageCard, {
        x: gsap.utils.random(-12, 12),
        y: gsap.utils.random(-10, 10),
        rotation: gsap.utils.random(-1.4, 1.4),
        duration: gsap.utils.random(3.2, 5.4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Subtle scale breathing to feel like movement through water.
    gsap.to(image, {
      scale: 1.06,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Parallax image test tied to section scroll.
    gsap.fromTo(
      image,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  if (infoCard) {
    // Soft interaction feedback for explanatory cards.
    infoCard.addEventListener('pointerenter', () => {
      gsap.to(infoCard, { y: -4, duration: 0.3, ease: 'power1.out' });
    });

    infoCard.addEventListener('pointerleave', () => {
      gsap.to(infoCard, { y: 0, duration: 0.3, ease: 'power1.out' });
    });
  }

  bubbles.forEach((bubble, index) => {
    // Ambient motion test for decorative particles.
    gsap.to(bubble, {
      y: -14 - index * 6,
      duration: 1.6 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

sections.forEach((section) => {
  setupSectionAnimations(section);

  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => {
      setActiveSection(section);
      console.log(`Section active: ${section.querySelector('h2')?.textContent || 'Unknown'}`);
      // Ajoute ici les animations spécifiques a cette section.
    },
    onEnterBack: () => {
      setActiveSection(section);
      // Ajoute ici les animations de retour (scroll vers le haut).
    }
  });
});

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    // Ce hook global sert de base pour synchroniser la profondeur et tes futures timelines.
    updateDepthIndicator(self.progress);
  }
});

setupDepthTicks();
updateDepthIndicator(0);