const pressPhotos = [
  'assets/press/pwa2026052424408.jpg',
  'assets/press/pwa202605246796.jpg'
];

const pressImages = document.querySelectorAll('.press-card .press-image');
pressImages.forEach((image, index) => {
  image.src = pressPhotos[index % pressPhotos.length];
  image.alt = `Beachvolley in actie — persfoto ${index % pressPhotos.length + 1}`;
  image.loading = index === 0 ? 'eager' : 'lazy';
  image.decoding = 'async';
});

const pressCredit = document.querySelector('.press-image-credit');
if (pressCredit) {
  pressCredit.textContent = "Foto's: Pim Waslander - Volley Vlaanderen.";
}

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
