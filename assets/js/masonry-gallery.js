 gsap.registerPlugin(ScrollTrigger);

    const loading = document.getElementById("loading");
    const gridContainer = document.getElementById("gridContainer");
    const items = document.querySelectorAll(".grid-item");

    function simulateLoading() {
      loading.classList.remove("hidden");

      let loaded = 0;
      const images = document.querySelectorAll(".grid-item img");
      const total = images.length;

      images.forEach((img) => {
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
      gsap.to(loading, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => loading.classList.add("hidden"),
      });

      gsap.to(gridContainer, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      });

      document.querySelectorAll(".grid-item").forEach((item, i) => {
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


    document.addEventListener("DOMContentLoaded", finish);
