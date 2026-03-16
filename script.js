// Carousel — 3 visible, center bigger, auto-advancing
const track = document.getElementById('carouselTrack');
if (track) {
  const originalSlides = [...track.children];
  const count = originalSlides.length;

  // Clone slides twice for seamless infinite loop
  for (let i = 0; i < 2; i++) {
    originalSlides.forEach(slide => track.appendChild(slide.cloneNode(true)));
  }

  const allSlides = track.querySelectorAll('.carousel-slide');
  let current = count; // start in the middle set

  function getMetrics() {
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    const slideW = allSlides[0].offsetWidth;
    return { gap, step: slideW + gap };
  }

  function update(animate) {
    const { step } = getMetrics();
    const wrapperW = track.parentElement.offsetWidth;
    const offset = (wrapperW / 2) - (step / 2) - (current * step);

    track.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
      : 'none';
    track.style.transform = `translateX(${offset}px)`;

    allSlides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
    });
  }

  // Initial render
  update(false);

  // Re-center on resize
  window.addEventListener('resize', () => update(false));

  // Auto-advance every 3s
  setInterval(() => {
    current++;
    update(true);

    // Seamlessly reset when past the second set
    if (current >= count * 2) {
      setTimeout(() => {
        current = count;
        update(false);
      }, 620);
    }
  }, 3000);
}
