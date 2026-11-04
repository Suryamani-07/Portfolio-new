# Suryamani — portfolio

Responsive portfolio made with HTML, CSS, and vanilla JavaScript. The visual design uses a dark navy base with restrained violet and cyan accents, an accessible particle-network canvas, responsive cards, and motion that respects reduced-motion preferences.

## Run locally

Open `index.html` in a browser. Or run `npx serve .` from this folder, or use VS Code Live Server.

## Personalize

Edit `portfolio-data.js`:
- `github`: the GitHub profile URL used by the contact section.
- `linkedin`: update the profile URL if needed.
- `projects`: add objects with `title`, `description`, `stack` (array), optional `repo`, `demo`, `image`, and `status`. Store project preview images inside `assets/` and use a relative path such as `assets/project-name.png`.

Replace `assets/suryamani-profile.pdf` with an updated resume or profile PDF to update the download. The supplied file is a one-page profile export, so the button says “Download profile PDF.”

The contact form validates in the browser and opens an email draft. It does not send to a server or store messages.

## GitHub and Netlify

This is a static site with no build step. Put the contents of this folder at the root of a GitHub repository, commit and push, then import that repository into Netlify. Leave the build command blank and set the publish directory to `.`. Keep `index.html`, `styles.css`, `script.js`, `portfolio-data.js`, `favicon.svg`, and `assets/` together so the relative links keep working.

## Assets

- `assets/suryamani-profile.pdf`: supplied profile PDF.

## Accessibility and motion

- The particle canvas and typing animation are disabled when the visitor prefers reduced motion.
- The canvas uses a capped particle count and pixel ratio, pauses while the page is hidden, and never captures pointer input.
- Navigation remains keyboard accessible and collapses into a menu on narrow screens.
