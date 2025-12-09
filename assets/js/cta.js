document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("ctaSection");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add("revealed");

          // Split text into words
          const titleSplit = new SplitType(".cta-title", { types: "words" });
          const subSplit = new SplitType(".cta-sub", { types: "words" });

          gsap.from(titleSplit.words, {
            opacity: 0,
            y: 20,
            filter: "blur(5px)",
            stagger: 0.05,
            duration: 0.7,
            ease: "power2.out"
          });

          gsap.from(subSplit.words, {
            opacity: 0,
            y: 20,
            filter: "blur(5px)",
            stagger: 0.04,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.3
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
});