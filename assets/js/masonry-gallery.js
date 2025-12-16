gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  const loading = document.getElementById("loading");
  const gridContainer = document.getElementById("gridContainer");
  const items = document.querySelectorAll(".grid-item");

  function simulateLoading() {
    // Safe check for loading element
    if (loading) loading.classList.remove("hidden");

    let loaded = 0;
    const images = document.querySelectorAll(".grid-item img");
    const total = images.length;

    if (total === 0) {
      finish();
      return;
    }

    images.forEach(img => {
      if (img.complete) {
        done();
      } else {
        img.onload = done;
        img.onerror = done;
      }
    });

    function done() {
      loaded++;
      if (loaded === total) finish();
    }
  }

  function finish() {
    // Fade out loading if exists
    if (loading) {
      gsap.to(loading, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => loading?.classList.add("hidden"),
      });
    }

    // Reveal the gallery container
    if (gridContainer) {
      gsap.to(gridContainer, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    }

    // Animate each grid item on scroll
    items.forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
        },
        delay: i * 0.05,
      });
    });
  }

  simulateLoading();
});
