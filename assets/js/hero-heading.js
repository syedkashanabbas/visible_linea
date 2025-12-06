document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll("#hero-title .line");
  const reveals = document.querySelectorAll(".reveal-item");

  let delay = 0;

  // Animate each H1 line
  lines.forEach(line => {
    setTimeout(() => {
      line.classList.add("visible");
    }, delay);
    delay += 400;
  });

  // Animate paragraph + body + buttons
  reveals.forEach(item => {
    setTimeout(() => {
      item.classList.add("visible");
    }, delay);
    delay += 300;
  });
});