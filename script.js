const PRESS_ASSETS = [
  {
    logo: 'assets/press/hln.svg',
    fallback: 'assets/press/beach-1.svg',
    image: 'https://images.weserv.nl/?url=www.polderke.com/wp-content/uploads/2026/07/beachvolley-1024x683.jpg&w=1400&h=788&fit=cover&output=webp'
  },
  {
    logo: 'assets/press/nieuwsblad.svg',
    fallback: 'assets/press/beach-1.svg',
    image: 'https://images.weserv.nl/?url=www.polderke.com/wp-content/uploads/2026/07/beachvolley-1024x683.jpg&w=1200&h=675&fit=cover&output=webp'
  },
  {
    logo: 'assets/press/nieuwsblad.svg',
    fallback: 'assets/press/beach-1.svg',
    image: 'https://images.weserv.nl/?url=www.polderke.com/wp-content/uploads/2026/07/web-beach.jpg&w=1200&h=675&fit=cover&output=webp'
  },
  {
    logo: 'assets/press/polderke.svg',
    fallback: 'assets/press/beach-1.svg',
    image: 'https://images.weserv.nl/?url=www.polderke.com/wp-content/uploads/2026/07/web-beach.jpg&w=1200&h=675&fit=cover&output=webp'
  },
  {
    logo: 'assets/press/ad.svg',
    fallback: 'assets/press/beach-1.svg',
    image: 'https://images.weserv.nl/?url=www.polderke.com/wp-content/uploads/2026/07/beachvolley-1024x683.jpg&w=1200&h=675&fit=cover&output=webp'
  }
];

function buildPressCardPreview(link, index) {
  if (link.dataset.previewReady === 'true') return;

  const sourceRow = link.querySelector('.press-source-row');
  const source = sourceRow?.querySelector('.press-source');
  const arrow = sourceRow?.querySelector('.press-arrow');
  const title = link.querySelector('.press-title');
  const asset = PRESS_ASSETS[index] || PRESS_ASSETS[0];

  if (!sourceRow || !source || !title || !asset) return;

  link.dataset.previewReady = 'true';

  const media = document.createElement('div');
  media.className = 'press-media';

  const image = document.createElement('img');
  image.className = 'press-image';
  image.src = asset.fallback;
  image.alt = `Persbeeld bij ${source.textContent.trim()}: ${title.textContent.trim()}`;
  image.loading = index === 0 ? 'eager' : 'lazy';
  image.decoding = 'async';

  // Toon altijd eerst een lokaal beeld. Zodra het echte persbeeld beschikbaar is,
  // wordt het zonder flikkering overgenomen. Zo blijven de kaarten nooit leeg.
  const remoteImage = new Image();
  remoteImage.decoding = 'async';
  remoteImage.referrerPolicy = 'no-referrer';
  remoteImage.addEventListener('load', () => {
    image.src = asset.image;
    image.dataset.remoteLoaded = 'true';
  }, { once: true });
  remoteImage.src = asset.image;

  const readLabel = document.createElement('span');
  readLabel.className = 'press-read-label';
  readLabel.textContent = 'Lees het artikel';

  media.append(image, readLabel);

  const content = document.createElement('div');
  content.className = 'press-card-content';

  const publication = document.createElement('span');
  publication.className = 'press-publication';

  const logoShell = document.createElement('span');
  logoShell.className = 'press-logo-shell';

  const logo = document.createElement('img');
  logo.className = 'press-logo';
  logo.src = asset.logo;
  logo.alt = `${source.textContent.trim()} logo`;
  logo.loading = 'lazy';
  logo.decoding = 'async';

  logoShell.appendChild(logo);
  publication.append(logoShell, source);
  sourceRow.replaceChildren(publication, arrow);
  content.append(sourceRow, title);
  link.replaceChildren(media, content);
}

function initialisePressPreviews() {
  const pressSection = document.getElementById('press');
  if (!pressSection) return;

  [...pressSection.querySelectorAll('.press-card > a')]
    .forEach((link, index) => buildPressCardPreview(link, index));

  const grid = pressSection.querySelector('.press-grid');
  if (grid && !pressSection.querySelector('.press-image-credit')) {
    const credit = document.createElement('p');
    credit.className = 'press-image-credit';
    credit.textContent = 'Persbeelden: Pim Waslander – Volley Vlaanderen. Publicatielogo’s worden lokaal geladen.';
    grid.after(credit);
  }
}

initialisePressPreviews();

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const hero = document.querySelector('.hero');
const ball = document.querySelector('.hero-ball');

if (hero && ball && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ball.style.translate = `${x * 18}px ${y * 18}px`;
  });
}

// Van de Wielle Tim - Deroo Sam received a wildcard and is seeded eighth.
const teamsBody = document.querySelector('.team-table tbody');

if (teamsBody) {
  const rows = [...teamsBody.querySelectorAll('tr')];
  const wildcardRow = rows.find((row) =>
    row.querySelector('.team-name')?.textContent.includes('Van de Wielle Tim - Deroo Sam')
  );

  if (wildcardRow) {
    const eighthRow = rows[7];

    if (eighthRow && wildcardRow !== eighthRow) {
      teamsBody.insertBefore(wildcardRow, eighthRow);
    }

    wildcardRow.classList.add('wildcard-team');
    wildcardRow.setAttribute('aria-label', 'Seed 8: Van de Wielle Tim en Deroo Sam, wildcard');

    const teamName = wildcardRow.querySelector('.team-name');
    if (teamName && !teamName.querySelector('.wildcard-badge')) {
      const badge = document.createElement('span');
      badge.className = 'wildcard-badge';
      badge.textContent = 'Wildcard';
      teamName.appendChild(badge);
    }

    [...teamsBody.querySelectorAll('tr')].forEach((row, index) => {
      const rank = row.querySelector('.team-rank');
      if (rank) rank.textContent = String(index + 1).padStart(2, '0');
    });
  }
}
