gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray('.depth-stage');
const depthCounter = document.querySelector('[data-depth-counter]');
const depthProgress = document.querySelector('[data-depth-progress]');
const TOTAL_DEPTH = 10000;

function setActiveSection(activeSection) {
  sections.forEach((section) => {
    section.classList.toggle('is-active', section === activeSection);
  });
}

function updateDepthIndicator(progress) {
  const depthValue = Math.round(progress * TOTAL_DEPTH);
  depthCounter.textContent = `${depthValue.toLocaleString('fr-FR')} m`;

  if (depthProgress) {
    depthProgress.style.height = `${Math.round(progress * 100)}%`;
  }
}

sections.forEach((section) => {
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

updateDepthIndicator(0);