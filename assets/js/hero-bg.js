import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-bg');
if (!canvas) {
  console.warn('hero-bg canvas not found');
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.AmbientLight(0xffffff, 0.35));

const pointLight = new THREE.PointLight(0x66ccff, 2, 40);
pointLight.position.set(2, 3, 5);
scene.add(pointLight);

// ================== PARTICLES ==================
const particleCount = 1500;

// compact core
const originalPositions = [];
const explodedPositions = [];
const positionArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  // random point in small sphere (core)
  const r = 1.8 * Math.cbrt(Math.random()); // dense center
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const ox = r * Math.sin(phi) * Math.cos(theta);
  const oy = r * Math.sin(phi) * Math.sin(theta);
  const oz = r * Math.cos(phi);

  originalPositions.push(new THREE.Vector3(ox, oy, oz));

  positionArray[i * 3] = ox;
  positionArray[i * 3 + 1] = oy;
  positionArray[i * 3 + 2] = oz;

  // explosion: same direction, much further out so it covers screen
  const dir = new THREE.Vector3(ox, oy, oz).normalize();
  const explodeDist = 7 + Math.random() * 4; // full screen blast
  explodedPositions.push(
    new THREE.Vector3(
      ox + dir.x * explodeDist,
      oy + dir.y * explodeDist,
      oz + dir.z * explodeDist
    )
  );
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionArray, 3)
);

const material = new THREE.PointsMaterial({
  size: 0.04,
  color: 0x88e3ff,
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// ================== INTERACTION ==================
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
});

// ================== EXPLOSION LOGIC ==================
let explodeProgress = 0;       // 0 = core, 1 = fully exploded
let explosionStarted = false;
let lastTime = performance.now();

// start explosion after 1.5s
setTimeout(() => {
  explosionStarted = true;
}, 1500);

// ================== ANIMATION LOOP ==================
function animate(now) {
  requestAnimationFrame(animate);

  const delta = (now - lastTime) / 1000;
  lastTime = now;

  if (explosionStarted && explodeProgress < 1) {
    // increase progress over ~2s
    explodeProgress = Math.min(1, explodeProgress + delta / 2);
  }

  const pos = geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    const o = originalPositions[i];
    const e = explodedPositions[i];

    pos[i * 3] = THREE.MathUtils.lerp(o.x, e.x, easeOut(explodeProgress));
    pos[i * 3 + 1] = THREE.MathUtils.lerp(o.y, e.y, easeOut(explodeProgress));
    pos[i * 3 + 2] = THREE.MathUtils.lerp(o.z, e.z, easeOut(explodeProgress));
  }

  geometry.attributes.position.needsUpdate = true;

  // subtle rotation with mouse influence
  particles.rotation.y += (mouseX - particles.rotation.y) * 0.03;
  particles.rotation.x += (-mouseY - particles.rotation.x) * 0.03;

  renderer.render(scene, camera);
}

// easing for smoother explosion
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

animate(performance.now());

// ================== RESIZE ==================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
