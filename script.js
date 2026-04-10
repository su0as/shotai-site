// Auto-advancing showcase carousels
const carouselTracks = document.querySelectorAll('[data-carousel-track]');

carouselTracks.forEach((track) => {
  const originalSlides = [...track.children];
  const count = originalSlides.length;

  if (!count) {
    return;
  }

  for (let i = 0; i < 2; i++) {
    originalSlides.forEach((slide) => track.appendChild(slide.cloneNode(true)));
  }

  const allSlides = [...track.querySelectorAll('.carousel-slide')];
  const wrapper = track.parentElement;
  const intervalMs = Number(wrapper.dataset.carouselSpeed || 3000);
  let current = count;

  function getMetrics() {
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    const slideW = allSlides[0].offsetWidth;
    return { step: slideW + gap };
  }

  function update(animate) {
    const { step } = getMetrics();
    const wrapperW = wrapper.offsetWidth;
    const offset = (wrapperW / 2) - (step / 2) - (current * step);

    track.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
      : 'none';
    track.style.transform = `translateX(${offset}px)`;

    allSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === current);
    });
  }

  update(false);
  window.addEventListener('resize', () => update(false));

  setInterval(() => {
    current += 1;
    update(true);

    if (current >= count * 2) {
      setTimeout(() => {
        current = count;
        update(false);
      }, 620);
    }
  }, intervalMs);
});
