// === Explosive Morph Transition (One-way, no reassemble) ===
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const pointLight = new THREE.PointLight(0x7cffb2, 2, 50);
pointLight.position.set(2, 3, 5);
scene.add(pointLight);

let particles, originalPositions, explodedPositions, morph = 0;

const loader = new THREE.TextureLoader();
loader.load('assets/imgs/face.png', (texture) => {
  const img = texture.image;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  c.width = img.width;
  c.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const imgData = ctx.getImageData(0, 0, img.width, img.height);

  const positions = [], colors = [];
  const color = new THREE.Color();

  for (let y = 0; y < img.height; y += 3) {
    for (let x = 0; x < img.width; x += 3) {
      const i = (y * img.width + x) * 4;
      const brightness = imgData.data[i];
      if (brightness > 40) {
        const posX = (x - img.width / 2) / 50;
        const posY = -(y - img.height / 2) / 50;
        const posZ = Math.random() * 0.3 - 0.15;
        positions.push(posX, posY, posZ);
        color.setHSL(0.35 + Math.random() * 0.1, 1, 0.6 + Math.random() * 0.2);
        colors.push(color.r, color.g, color.b);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.95,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const count = positions.length / 3;
  originalPositions = [];
  explodedPositions = [];

  for (let i = 0; i < count; i++) {
    const ox = positions[i * 3];
    const oy = positions[i * 3 + 1];
    const oz = positions[i * 3 + 2];
    originalPositions.push(new THREE.Vector3(ox, oy, oz));

    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const dist = 6 + Math.random() * 3;
    explodedPositions.push(new THREE.Vector3(ox + dir.x * dist, oy + dir.y * dist, oz + dir.z * dist));
  }

  // one-time explosion
  gsap.to({ t: 0 }, {
    t: 1,
    duration: 2.5,
    ease: 'power3.out',
    onUpdate: function () { morph = this.targets()[0].t; }
  });
});

function animate() {
  requestAnimationFrame(animate);
  if (particles) {
    const posArray = particles.geometry.attributes.position.array;
    for (let i = 0; i < posArray.length; i += 3) {
      const idx = i / 3;
      const o = originalPositions[idx];
      const e = explodedPositions[idx];
      posArray[i] = THREE.MathUtils.lerp(o.x, e.x, morph);
      posArray[i + 1] = THREE.MathUtils.lerp(o.y, e.y, morph);
      posArray[i + 2] = THREE.MathUtils.lerp(o.z, e.z, morph);
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0015;
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
