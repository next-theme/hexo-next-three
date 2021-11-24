/**
 * Created by Tang on 2017/4/15.
 * https://github.com/mrdoob/three.js/blob/r118/examples/webgl_lines_sphere.html
 */
(function () {
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;
  let mouseX = 0;
  let mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let camera;
  let scene;
  let renderer;
  init();
  animate();

  function init() {
    let container;
    let particle;
    container = document.createElement('div');
    // 设置css
    container.style.position = "fixed";
    container.style.top = "0px";
    container.style.left = "0px";
    container.style.zIndex = "-1";
    container.style.opacity = "0.5";

    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);
    // particles
    let geometry = new THREE.SphereGeometry(.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 10263708
    });
    for (let i = 0; i < 1000; i++) {
      particle = new THREE.Mesh(geometry, material);
      particle.position.x = Math.random() * 2 - 1;
      particle.position.y = Math.random() * 2 - 1;
      particle.position.z = Math.random() * 2 - 1;
      particle.position.normalize();
      particle.position.multiplyScalar(Math.random() * 10 + 450);
      particle.scale.multiplyScalar(2);
      scene.add(particle);
    }
    // lines
    for (let i = 0; i < 300; i++) {
      let geometry = new THREE.BufferGeometry();
      let points = [];
      const vertex = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      vertex.normalize();
      vertex.multiplyScalar(450);
      points.push(vertex);
      const vertex2 = vertex.clone();
      vertex2.multiplyScalar(Math.random() * 0.3 + 1);
      points.push(vertex2);
      geometry.setFromPoints(points);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 10263708,
        opacity: Math.random()
      }));
      scene.add(line);
    }
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
