# Ocean Experience

Site immersif sur les profondeurs océaniques (HTML, SCSS, JavaScript, GSAP), avec un focus accessibilité.

## Objectif

Créer une expérience de scroll narrative de la surface aux abysses, avec:
- animations fluides
- panneau de données contextuelles
- interactions accessibles (navigation clavier, contraste, motion reduced)

## Démarrage rapide

1. Installer les dépendances

```bash
npm install
```

2. Compiler le SCSS

```bash
npm run scss:build
```

3. Lancer le serveur de dev

```bash
npm run dev
```

## Commandes utiles

- Dev server Vite: `npm run dev`
- Build production (inclut compilation SCSS): `npm run build`
- Preview du build: `npm run preview`
- Compiler SCSS une fois: `npm run scss:build`
- Compiler SCSS en continu: `npm run scss:watch`

## Workflow SCSS

- Source de travail: [css/style.scss](css/style.scss)
- Fichier servi dans la page: [css/style.css](css/style.css)
- [index.html](index.html) référence [css/style.css](css/style.css)

En pratique:
- tu modifies [css/style.scss](css/style.scss)
- tu lances `npm run scss:watch`
- le CSS est régénéré automatiquement

## Accessibilité

Audit Axe:

```bash
npm run a11y:axe
```

Audit Lighthouse (catégorie accessibilité):

```bash
npm run a11y:lighthouse
```

Rapports disponibles dans [reports](reports).

## Structure principale

- [index.html](index.html): page principale
- [js/main.js](js/main.js): logique GSAP + interactions
- [css/style.scss](css/style.scss): source SCSS
- [css/style.css](css/style.css): CSS compilé
- [presentation.html](presentation.html): support de présentation
- [reports](reports): résultats d'audit

## Checklist avant livraison

1. `npm run scss:build`
2. `npm run build`
3. `npm run a11y:axe`
4. Vérification visuelle desktop + mobile

## Notes

- Si un style ne s'applique pas, vérifier que [css/style.css](css/style.css) a bien été recompilé.
- En cas de conflit d'animations, tester avec le bouton de réduction des animations dans l'UI.