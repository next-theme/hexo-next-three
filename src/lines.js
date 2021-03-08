/**
 * Created by Tang on 2017/4/15.
 */
(function () {
  let mouseX = 0;
  let mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  const SEPARATION = 200;
  const AMOUNTX = 10;
  const AMOUNTY = 10;
  let camera;
  let scene;
  let renderer;
  init();
  animate();

  function init() {
    let container;
    const separation = 100;
    const amountX = 50;
    const amountY = 50;
    let particles;
    let particle;
    container = document.createElement('div');
    // 设置css
    container.style.position = "fixed";
    container.style.top = "0px";
    container.style.left = "0px";
    container.style.zIndex = "-1";
    container.style.opacity = "0.5";

    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    // particles
    const geometry = new THREE.SphereGeometry(5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 10263708
    });
    const lines = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i < 100; i++) {
      particle = new THREE.Mesh(geometry, material);
      particle.position.x = Math.random() * 2 - 1;
      particle.position.y = Math.random() * 2 - 1;
      particle.position.z = Math.random() * 2 - 1;
      particle.position.normalize();
      particle.position.multiplyScalar(Math.random() * 10 + 450);
      scene.add(particle);
      points.push(particle.position);
    }
    lines.setFromPoints(points);
    // lines
    const line = new THREE.Line(lines, new THREE.LineBasicMaterial({
      color: 10263708,
      opacity: 0.8
    }));
    scene.add(line);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    //
    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //
  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }

  function onDocumentTouchStart(event) {
    if (event.touches.length > 1) {
      //event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      //mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
      //event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      //mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
  }
  //
  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY + 200 - camera.position.y) * .05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
})();
