/* ============================================================
   three-scene.js
   Animated 3D background using Three.js (WebGL)
   - Wireframe icosahedron (emerald)
   - Inner solid icosahedron (gold tint)
   - Torus knot (emerald-gold blend)
   - 250 colored particles with mouse parallax
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('[three-scene] Canvas or THREE not available — skipping 3D background.');
    return;
  }

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ---- Scene + Camera ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 6;

  // ---- Main wireframe icosahedron (emerald) ----
  const geo1 = new THREE.IcosahedronGeometry(2.2, 1);
  const mat1 = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const mesh1 = new THREE.Mesh(geo1, mat1);
  scene.add(mesh1);

  // ---- Inner solid icosahedron (gold tint) ----
  const geo2 = new THREE.IcosahedronGeometry(1.4, 0);
  const mat2 = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const mesh2 = new THREE.Mesh(geo2, mat2);
  scene.add(mesh2);

  // ---- Torus knot (emerald-gold blend) ----
  const geo3 = new THREE.TorusKnotGeometry(3.5, 0.08, 100, 16);
  const mat3 = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const mesh3 = new THREE.Mesh(geo3, mat3);
  scene.add(mesh3);

  // ---- Floating particle field ----
  const particleCount = 250;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

    // Mix emerald + gold
    const isGold = Math.random() > 0.5;
    if (isGold) {
      colors[i * 3]     = 0.96; // r
      colors[i * 3 + 1] = 0.62; // g
      colors[i * 3 + 2] = 0.04; // b
    } else {
      colors[i * 3]     = 0.06;
      colors[i * 3 + 1] = 0.73;
      colors[i * 3 + 2] = 0.51;
    }
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Mouse parallax ----
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Animation loop ----
  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.0005;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mesh1.rotation.x = t * 0.5 + targetY * 0.3;
    mesh1.rotation.y = t * 0.7 + targetX * 0.3;
    mesh2.rotation.x = -t * 0.3;
    mesh2.rotation.y = -t * 0.5 + targetX * 0.2;
    mesh3.rotation.x = t * 0.2;
    mesh3.rotation.y = t * 0.3 + targetY * 0.2;
    particles.rotation.y = t * 0.05;
    particles.rotation.x = t * 0.03;

    camera.position.x = targetX * 0.5;
    camera.position.y = -targetY * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // ---- Resize handler ----
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
