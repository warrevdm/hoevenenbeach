function createPressVisual(index) {
  const gradients = [
    ['#f4bb3c', '#eb7f28'],
    ['#f6eed6', '#f4bb3c'],
    ['#eb7f28', '#b84e22'],
    ['#f4bb3c', '#f6eed6'],
    ['#11110f', '#eb7f28']
  ];
  const [start, end] = gradients[index % gradients.length];
  const id = `press-gradient-${index}`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'press-image');
  svg.setAttribute('viewBox', '0 0 1200 675');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Hoevenen Beach persbeeld');
  svg.innerHTML = `
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${start}"/>
        <stop offset="1" stop-color="${end}"/>
      </linearGradient>
      <pattern id="sand-${index}" width="34" height="34" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="2" fill="#b97122" opacity=".32"/>
        <circle cx="26" cy="24" r="1.5" fill="#11110f" opacity=".16"/>
      </pattern>
    </defs>
    <rect width="1200" height="675" fill="url(#${id})"/>
    <circle cx="1010" cy="115" r="88" fill="#fff4c9" opacity=".9"/>
    <rect y="380" width="1200" height="295" fill="#f6eed6"/>
    <rect y="380" width="1200" height="295" fill="url(#sand-${index})"/>
    <path d="M115 565 L600 405 L1085 565" fill="none" stroke="#11110f" stroke-width="8" opacity=".68"/>
    <path d="M600 382 V590" stroke="#11110f" stroke-width="9"/>
    <g stroke="#ffffff" opacity=".82">
      <rect x="230" y="425" width="740" height="112" fill="none" stroke-width="5"/>
      <path d="M230 447H970M230 469H970M230 491H970M230 513H970" stroke-width="2"/>
      <path d="M285 425V537M340 425V537M395 425V537M450 425V537M505 425V537M560 425V537M615 425V537M670 425V537M725 425V537M780 425V537M835 425V537M890 425V537M945 425V537" stroke-width="2"/>
    </g>
    <circle cx="520" cy="255" r="55" fill="#ffffff" stroke="#11110f" stroke-width="8"/>
    <path d="M482 232c36 11 56 36 63 71M548 216c-3 34-22 60-52 77M480 278c36-11 69-7 98 13" fill="none" stroke="#eb7f28" stroke-width="12" stroke-linecap="round"/>
    <g fill="#11110f">
      <circle cx="390" cy="355" r="25"/>
      <path d="M372 382l-44 112h40l28-66 36 66h41l-57-112z"/>
      <circle cx="775" cy="340" r="25"/>
      <path d="M756 367l-55 120h43l36-74 31 74h43l-56-120z"/>
    </g>
    <text x="70" y="105" fill="#11110f" font-family="Arial Black, Arial, sans-serif" font-size="76" font-weight="900" letter-spacing="-4">HOEVENEN BEACH</text>
    <text x="72" y="156" fill="#11110f" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4">BELGIAN BEACH TOUR · 25–26 JULI 2026</text>
  `;
  return svg;
}

function createPressLogo(sourceName) {
  const key = sourceName.toLowerCase();
  const configs = {
    'hln': { label: 'HLN', bg: '#e30613', fg: '#ffffff', size: 38 },
    'het nieuwsblad': { label: 'N', bg: '#e30613', fg: '#ffffff', size: 48 },
    'polderke': { label: 'P', bg: '#11110f', fg: '#f4bb3c', size: 48 },
    'ad': { label: 'AD', bg: '#d71920', fg: '#ffffff', size: 38 }
  };
  const config = configs[key] || { label: sourceName.slice(0, 2).toUpperCase(), bg: '#11110f', fg: '#ffffff', size: 36 };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'press-logo');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${sourceName} logo`);
  svg.innerHTML = `
    <rect width="100" height="100" rx="18" fill="${config.bg}"/>
    <text x="50" y="64" text-anchor="middle" fill="${config.fg}" font-family="Arial Black, Arial, sans-serif" font-size="${config.size}" font-weight="900">${config.label}</text>
  `;
  return svg;
}

function embedPressVisuals() {
  document.querySelectorAll('.press-card').forEach((card, index) => {
    const currentImage = card.querySelector('.press-image');
    if (currentImage) currentImage.replaceWith(createPressVisual(index));

    const source = card.querySelector('.press-source');
    const currentLogo = card.querySelector('.press-logo');
    if (source && currentLogo) currentLogo.replaceWith(createPressLogo(source.textContent.trim()));
  });
}

embedPressVisuals();

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
