import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

const canvas = document.getElementById("neuralGalaxy");

// === RESPONSIVE SETTINGS ===
let PARTICLE_COUNT;

if (window.innerWidth < 480) {
  // mobile
  PARTICLE_COUNT = 45000;
} else if (window.innerWidth < 1024) {
  // tablet
  PARTICLE_COUNT = 90000;
} else {
  // desktop / large screens
  PARTICLE_COUNT = 180000;
}

// === SCENE ===
const scene = new THREE.Scene();

// === CAMERA ===
const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  400
);

// responsive camera distance
if (innerWidth < 480) camera.position.set(0, 0, 55);
else if (innerWidth < 1024) camera.position.set(0, 0, 45);
else camera.position.set(0, 0, 38);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

// limit pixel density to prevent mobile lag
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);

// === PARTICLES ===
const positions = new Float32Array(PARTICLE_COUNT * 3);
const explodedPositions = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const idx = i * 3;

  // small cluster
  positions[idx] = (Math.random() - 0.5) * 0.6;
  positions[idx + 1] = (Math.random() - 0.5) * 0.6;
  positions[idx + 2] = (Math.random() - 0.5) * 0.6;

  // galaxy spread
  const radius = THREE.MathUtils.randFloat(8, 20);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);

  explodedPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
  explodedPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
  explodedPositions[idx + 2] = radius * Math.cos(phi);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: innerWidth < 480 ? 0.07 : 0.055,
  color: new THREE.Color("#7ccfff"),
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

// === BURST ON LOAD ===
gsap.to(positions, {
  endArray: explodedPositions,
  duration: 3,
  ease: "power3.out",
  onUpdate: () => {
    geometry.attributes.position.needsUpdate = true;
  }
});

// === PARALLAX ===
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = (e.clientY / innerHeight - 0.5) * 2;
});

// Touch parallax
document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mouseX = (t.clientX / innerWidth - 0.5) * 2;
  mouseY = (t.clientY / innerHeight - 0.5) * 2;
});

// === ANIMATE ===
function animate() {
  requestAnimationFrame(animate);

  galaxy.rotation.y += 0.0007;
  galaxy.rotation.x += 0.00025;

  camera.position.x += (mouseX * 5 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 5 - camera.position.y) * 0.03;

  renderer.render(scene, camera);
}
animate();

// === RESIZE ===
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
