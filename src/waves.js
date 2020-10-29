/*
 * https://github.com/mrdoob/three.js/blob/r118/examples/webgl_points_waves.html
 */
(function () {
  const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
  let container;
  let camera, scene, renderer;
  let particles, particle, count = 0;
  let mouseX = 0;
  const mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  init();
  animate();

  function init() {
    container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0px";
    container.style.left = "0px";
    container.style.zIndex = "-1";
    container.style.opacity = "0.5";
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    particles = [];

    const geometry = new THREE.SphereGeometry(.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 10263708
    });
    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        particle = particles[i++] = new THREE.Mesh(geometry, material);
        particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
        particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
        scene.add(particle)
      }
    }
    renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false)
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX
  }

  function animate() {
    requestAnimationFrame(animate);
    render()
  }

  function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y = 362.05;
    camera.lookAt(
      scene.position.x,
      window.innerHeight / 3,
      scene.position.z
    );
    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        particle = particles[i++];
        particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
        particle.scale.x = particle.scale.y = particle.scale.z = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4
      }
    }
    renderer.render(scene, camera);
    count += 0.1
  }
})();
