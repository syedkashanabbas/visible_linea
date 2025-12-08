// Responsive icons
const icons = [
  "assets/imgs/crm_icon.jpeg",
  "assets/imgs/erp_icon.jpeg",
  "assets/imgs/shopify_icon.jpeg",
  "assets/imgs/marketing_icon.jpeg",
  "assets/imgs/kb_icon.jpeg",
  "assets/imgs/db_icon.jpeg"
];

const nodeContainer = document.getElementById("node-container");
const svg = document.getElementById("system-lines");

// Dynamically calculated radius based on screen width
function getResponsiveRadius() {
  if (window.innerWidth < 480) return 28;    // mobile
  if (window.innerWidth < 768) return 32;    // small tablet
  return 38;                                 // desktop
}

// Responsive node size
function getNodeSize() {
  if (window.innerWidth < 480) return 56;    // 14 tailwind units
  if (window.innerWidth < 768) return 70;    // 18 units
  return 96;                                 // 24 units
}

function createSystemMap() {
  nodeContainer.innerHTML = "";
  svg.innerHTML = "";

  const center = { x: 50, y: 50 };
  const radius = getResponsiveRadius();
  const nodeSize = getNodeSize();

  icons.forEach((icon, i) => {
    const angle = (i / icons.length) * Math.PI * 2;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);

    const node = document.createElement("div");
    node.className = `
      absolute rounded-full overflow-hidden node transition-all duration-700
      flex items-center justify-center border border-white/10 bg-black/60 opacity-50
    `;
    node.style.width = nodeSize + "px";
    node.style.height = nodeSize + "px";
    node.style.left = x + "%";
    node.style.top = y + "%";
    node.style.transform = "translate(-50%, -50%)";

    node.innerHTML = `
      <img src="${icon}"
           class="w-full h-full object-cover rounded-full pointer-events-none" />
    `;

    nodeContainer.appendChild(node);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "50%");
    line.setAttribute("y1", "50%");
    line.setAttribute("x2", x + "%");
    line.setAttribute("y2", y + "%");
    line.setAttribute("stroke", "rgba(255,255,255,0.12)");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  });
}

createSystemMap();

let activeIndex = 0;

function cycleNodes() {
  const nodes = document.querySelectorAll("#node-container .node");

  nodes.forEach((n, i) => {
    if (i === activeIndex) {
      n.style.opacity = "1";
      n.style.backgroundColor = "rgba(255,255,255,0.12)";
      n.style.boxShadow = "0 0 20px rgba(255,255,255,0.25)";
      n.style.transform = "translate(-50%, -50%) scale(1.12)";
    } else {
      n.style.opacity = "0.4";
      n.style.backgroundColor = "rgba(0,0,0,0.6)";
      n.style.boxShadow = "none";
      n.style.transform = "translate(-50%, -50%) scale(1)";
    }
  });

  activeIndex = (activeIndex + 1) % icons.length;
}

setInterval(cycleNodes, 2500);
cycleNodes();

// Re-render on resize for full responsiveness
window.addEventListener("resize", () => {
  createSystemMap();
  cycleNodes();
});
