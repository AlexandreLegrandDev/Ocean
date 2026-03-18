# Ocean Depths Boilerplate

Minimal single-page boilerplate built for GSAP and ScrollTrigger experiments.

## Project Structure

- `index.html`: semantic page structure (header, depth sections, fixed depth indicator)
- `styles/main.scss`: SCSS source
- `styles/main.css`: CSS used directly by the browser
- `scripts/main.js`: GSAP + ScrollTrigger logic and test animations

## How to Run the Project

Because the page uses JavaScript modules from local files and remote assets, run it with a local server.

### Option 1: VS Code Live Server

1. Install the Live Server extension in VS Code.
2. Open `index.html`.
3. Right-click and select **Open with Live Server**.

### Option 2: Python Simple HTTP Server

From the project root, run:

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

## Notes for Animation Work

- Test content blocks (cards, images, floating markers) are included in each depth section.
- Replace or extend animation hooks in `scripts/main.js`:
	- section reveal timeline
	- image parallax
	- ambient floating particles