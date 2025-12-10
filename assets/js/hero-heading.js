document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll("#hero-title .line");
  const reveals = document.querySelectorAll(".reveal-item");
  const logoWrapper = document.querySelector("#logo-wrapper");

  let delay = 0;

  lines.forEach(line => {
    setTimeout(() => line.classList.add("visible"), delay);
    delay += 400;
  });

  reveals.forEach(item => {
    setTimeout(() => item.classList.add("visible"), delay);
    delay += 300;
  });

  // Animate the wrapper last
  setTimeout(() => {
    if (logoWrapper) logoWrapper.classList.add("visible");
  }, delay);
});
