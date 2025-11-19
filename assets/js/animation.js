// === 3D Particle Explosion Background for Hero ===
// by ChatGPT (rewritten from your old logic)

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';

const canvas = document.getElementById('hero-bg');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 8);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// === Lighting ===
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const pointLight = new THREE.PointLight(0x7cffb2, 2, 50);
pointLight.position.set(2, 3, 5);
scene.add(pointLight);

// === Particle Variables ===
let particles;
let originalPositions = [];
let explodedPositions = [];
let morph = 0;

// === Load Image to Convert to Particles ===
const loader = new THREE.TextureLoader();
loader.load('assets/imgs/face.png', (texture) => {

  const img = texture.image;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');

  c.width = img.width;
  c.height = img.height;

  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height);

  const positions = [];
  const colors = [];
  const color = new THREE.Color();

  // Create Particles From Bright Pixels
  for (let y = 0; y < img.height; y += 3) {
    for (let x = 0; x < img.width; x += 3) {
      const i = (y * img.width + x) * 4;

      if (data.data[i] > 40) {
        const px = (x - img.width / 2) / 50;
        const py = -(y - img.height / 2) / 50;
        const pz = (Math.random() - 0.5) * 0.3;

        positions.push(px, py, pz);

        color.setHSL(0.55 + Math.random() * 0.1, 1, 0.65);
        colors.push(color.r, color.g, color.b);
      }
    }
  }

  // BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.95
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const count = positions.length / 3;

  for (let i = 0; i < count; i++) {
    const ox = positions[i * 3];
    const oy = positions[i * 3 + 1];
    const oz = positions[i * 3 + 2];

    originalPositions.push(new THREE.Vector3(ox, oy, oz));

    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    const dist = 6 + Math.random() * 3;

    explodedPositions.push(
      new THREE.Vector3(
        ox + dir.x * dist,
        oy + dir.y * dist,
        oz + dir.z * dist
      )
    );
  }

  // === One-time Explosion ===
  gsap.to({ t: 0 }, {
    t: 1,
    duration: 2.8,
    ease: "power3.out",
    onUpdate() {
      morph = this.targets()[0].t;
    }
  });
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  if (particles) {
    const arr = particles.geometry.attributes.position.array;

    for (let i = 0; i < arr.length; i += 3) {
      const idx = i / 3;

      const o = originalPositions[idx];
      const e = explodedPositions[idx];

      arr[i] = THREE.MathUtils.lerp(o.x, e.x, morph);
      arr[i + 1] = THREE.MathUtils.lerp(o.y, e.y, morph);
      arr[i + 2] = THREE.MathUtils.lerp(o.z, e.z, morph);
    }

    particles.geometry.attributes.position.needsUpdate = true;

    particles.rotation.y += 0.0015;
  }

  renderer.render(scene, camera);
}
animate();

// === Resize Handler ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
