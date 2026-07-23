const PRESS_FALLBACK_IMAGE = 'https://www.polderke.com/wp-content/uploads/2026/07/beachvolley-1024x683.jpg';
const PRESS_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function getCachedPressMetadata(url) {
  try {
    const cached = JSON.parse(localStorage.getItem(`press-preview:${url}`));
    if (cached?.timestamp && Date.now() - cached.timestamp < PRESS_CACHE_MAX_AGE) {
      return cached.data;
    }
  } catch (_) {
    // Browsers can block localStorage; previews still work without caching.
  }

  return null;
}

function cachePressMetadata(url, data) {
  try {
    localStorage.setItem(`press-preview:${url}`, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (_) {
    // Ignore unavailable or full storage.
  }
}

async function fetchPressMetadata(url) {
  const cached = getCachedPressMetadata(url);
  if (cached) return cached;

  const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}&filter=image.url,logo.url`;
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Press metadata request failed with ${response.status}`);
  }

  const payload = await response.json();
  const data = {
    image: payload?.data?.image?.url || '',
    logo: payload?.data?.logo?.url || ''
  };

  cachePressMetadata(url, data);
  return data;
}

function buildPressCardPreview(link) {
  if (link.dataset.previewReady === 'true') return null;

  const sourceRow = link.querySelector('.press-source-row');
  const source = sourceRow?.querySelector('.press-source');
  const arrow = sourceRow?.querySelector('.press-arrow');
  const title = link.querySelector('.press-title');

  if (!sourceRow || !source || !title) return null;

  link.dataset.previewReady = 'true';

  const articleUrl = link.href;
  const domain = new URL(articleUrl).hostname.replace(/^www\./, '');
  const sourceName = source.textContent.trim();

  const media = document.createElement('div');
  media.className = 'press-media';

  const image = document.createElement('img');
  image.className = 'press-image';
  image.src = PRESS_FALLBACK_IMAGE;
  image.alt = `Artikelbeeld bij ${sourceName}: ${title.textContent.trim()}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.referrerPolicy = 'no-referrer';

  image.addEventListener('error', () => {
    if (image.src !== PRESS_FALLBACK_IMAGE) image.src = PRESS_FALLBACK_IMAGE;
  });

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
  logo.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  logo.alt = `${sourceName} logo`;
  logo.loading = 'lazy';
  logo.decoding = 'async';
  logo.referrerPolicy = 'no-referrer';

  logo.addEventListener('error', () => {
    logoShell.hidden = true;
  }, { once: true });

  logoShell.appendChild(logo);
  publication.append(logoShell, source);
  sourceRow.replaceChildren(publication, arrow);
  content.append(sourceRow, title);
  link.replaceChildren(media, content);

  return { articleUrl, image, logo, logoShell };
}

async function loadPressCardMetadata(preview) {
  try {
    const metadata = await fetchPressMetadata(preview.articleUrl);

    if (metadata.image) preview.image.src = metadata.image;
    if (metadata.logo) {
      preview.logoShell.hidden = false;
      preview.logo.src = metadata.logo;
    }
  } catch (_) {
    // Keep the source favicon and official event-photo fallback.
  }
}

function initialisePressPreviews() {
  const pressSection = document.getElementById('press');
  if (!pressSection) return;

  const previews = [...pressSection.querySelectorAll('.press-card > a')]
    .map(buildPressCardPreview)
    .filter(Boolean);

  const grid = pressSection.querySelector('.press-grid');
  if (grid && !pressSection.querySelector('.press-image-credit')) {
    const credit = document.createElement('p');
    credit.className = 'press-image-credit';
    credit.textContent = 'Artikelbeelden en logo’s worden geladen vanaf de respectieve bronpagina’s. Fallbackbeeld: Pim Waslander – Volley Vlaanderen.';
    grid.after(credit);
  }

  const loadAll = () => previews.forEach(loadPressCardMetadata);

  if (!('IntersectionObserver' in window)) {
    loadAll();
    return;
  }

  const pressObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      loadAll();
      pressObserver.disconnect();
    }
  }, { rootMargin: '300px 0px' });

  pressObserver.observe(pressSection);
}

initialisePressPreviews();

const revealElements = document.querySelectorAll('.reveal');

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
