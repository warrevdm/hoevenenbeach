const pressArticles = [
  {
    source: 'HLN',
    title: '14-jarige Noah Eennaes treft Belgische beachtoppers op pleinen waar hij zijn eerste volleybalstappen zette: “Op een paar honderd meter van thuis”',
    url: 'https://www.hln.be/sport-in-de-buurt/14-jarige-noah-eennaes-treft-belgische-beachtoppers-op-pleinen-waar-hij-zijn-eerste-volleybalstappen-zette-op-een-paar-honderd-meter-van-thuis~a350d5c8/'
  },
  {
    source: 'Het Nieuwsblad',
    title: 'Hoevenen wordt voor het eerst halte van de Belgian Beach Tour',
    url: 'https://www.nieuwsblad.be/regio/antwerpen/regio-antwerpen/stabroek/hoevenen-wordt-voor-het-eerst-halte-van-de-belgian-beach-tour/159054242.html'
  },
  {
    source: 'Het Nieuwsblad',
    title: 'Na afhaken van Antwerpen houdt Belgian Beach Tour voortaan halt in Hoevenen: “We hopen dat dit het begin van iets heel moois kan worden”',
    url: 'https://www.nieuwsblad.be/sport/sportregio/na-afhaken-van-antwerpen-houdt-belgian-beach-tour-voortaan-halt-in-hoevenen-we-hopen-dat-dit-het-begin-van-iets-heel-moois-kan-worden/158698969.html'
  },
  {
    source: 'Polderke',
    title: 'Hoevenen maakt debuut als gastgemeente van de Belgian Beach Tour',
    url: 'https://www.polderke.com/hoevenen-maakt-debuut-als-gastgemeente-van-de-belgian-beach-tour/'
  },
  {
    source: 'AD',
    title: 'Belgian Beach Tour strijkt voor het eerst neer in Hoevenen: Tom van Walle en Sam Deroo aan de start',
    url: 'https://www.ad.nl/woensdrecht/belgian-beach-tour-strijkt-voor-het-eerst-neer-in-hoevenen-tom-van-walle-en-sam-deroo-aan-de-start~ae86236a/276121773/'
  }
];

function addPressSection() {
  if (document.getElementById('press')) return;

  if (!document.querySelector('link[href="press.css"]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'press.css';
    document.head.appendChild(stylesheet);
  }

  const practicalSection = document.getElementById('praktisch');
  if (!practicalSection) return;

  const pressSection = document.createElement('section');
  pressSection.className = 'press section';
  pressSection.id = 'press';
  pressSection.setAttribute('aria-labelledby', 'press-title');

  const cards = pressArticles.map((article, index) => `
    <article class="press-card reveal">
      <a href="${article.url}" target="_blank" rel="noopener noreferrer" aria-label="Lees artikel van ${article.source}: ${article.title}">
        <div class="press-source-row">
          <span class="press-source">${article.source}</span>
          <span class="press-arrow" aria-hidden="true">↗</span>
        </div>
        <h3 class="press-title">${article.title}</h3>
      </a>
    </article>
  `).join('');

  pressSection.innerHTML = `
    <div class="section-kicker reveal">04 — Gezien in de pers</div>
    <div class="press-head">
      <div class="reveal">
        <h2 id="press-title">MAKING<br><span>HEADLINES.</span></h2>
      </div>
      <p class="reveal">Hoevenen Beach haalt de regionale en nationale pers. Lees de artikels over het tornooi, de locatie en de spelers aan de start.</p>
    </div>
    <div class="press-grid">${cards}</div>
  `;

  practicalSection.before(pressSection);

  const navigation = document.querySelector('.nav');
  if (navigation && !navigation.querySelector('a[href="#press"]')) {
    const pressLink = document.createElement('a');
    pressLink.href = '#press';
    pressLink.textContent = 'Pers';
    const practicalLink = navigation.querySelector('a[href="#praktisch"]');
    navigation.insertBefore(pressLink, practicalLink || null);
  }

  const practicalKicker = document.querySelector('.practical .section-kicker');
  const partnersKicker = document.querySelector('.partners .section-kicker');
  if (practicalKicker) practicalKicker.textContent = '05 — Praktisch';
  if (partnersKicker) partnersKicker.textContent = '06 — Partners';
}

addPressSection();

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