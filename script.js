/* Shot AI — site interactions */
(function () {
  "use strict";

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      if (open) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Sticky mobile CTA ---------- */
  var cta = document.getElementById("mobileCta");
  if (cta) {
    var onScroll = function () {
      if (window.scrollY > 620) cta.classList.add("show");
      else cta.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Showcase carousel ---------- */
  document.querySelectorAll(".showcase-carousel-wrapper").forEach(function (wrapper) {
    var track = wrapper.querySelector("[data-carousel-track]");
    if (!track) return;
    var slides = Array.from(track.querySelectorAll(".carousel-slide"));
    if (slides.length < 2) return;
    var speed = parseInt(wrapper.getAttribute("data-carousel-speed")) || 2600;
    var current = 0;

    /* Build dot nav and insert after wrapper */
    var dotsEl = document.createElement("div");
    dotsEl.className = "carousel-dots";
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); resetTimer(); });
      dotsEl.appendChild(dot);
    });
    wrapper.parentNode.insertBefore(dotsEl, wrapper.nextSibling);

    function goTo(n) {
      current = ((n % slides.length) + slides.length) % slides.length;
      var gap = 14; /* must match CSS gap */
      var slideW = slides[0].offsetWidth + gap;
      track.style.transform = "translateX(-" + (current * slideW) + "px)";
      dotsEl.querySelectorAll(".carousel-dot").forEach(function (d, i) {
        d.classList.toggle("active", i === current);
      });
    }

    var timer = setInterval(function () { goTo(current + 1); }, speed);
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, speed);
    }

    /* Pause on hover */
    wrapper.addEventListener("mouseenter", function () { clearInterval(timer); });
    wrapper.addEventListener("mouseleave", function () { resetTimer(); });

    /* Touch swipe */
    var startX = 0;
    wrapper.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      clearInterval(timer);
    }, { passive: true });
    wrapper.addEventListener("touchend", function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      resetTimer();
    }, { passive: true });
  });

  /* ---------- Smooth anchor offset for sticky nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
