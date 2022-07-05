import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
//scene.add(cube);
/**
 * Galaxy
 */
const parameters = {};
parameters.count = 100000; // 별의 갯수
parameters.size = 0.01; // 별의 사이즈
parameters.radius = 5; // 얼마나 길게 돌릴건지
parameters.branches = 3; // 뻗어있는 손의 개수
parameters.spin = 1; // 스핀을 얼마나 줄건지
parameters.randomness = 0.2; //
parameters.randomnessPower = 3; // 배수를 사용하여 곡선을 나타낸다
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  /**
   * Destroy old galaxy
   */
  if (points !== null) {
    geometry.dispose(); //threejs에 있는 메서드  값을 초기화 시켜준다.
    material.dispose();
    scene.remove(points); //지워준다.
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor); //컬러를 rgb 값을 보기위해
  const colorOutside = new THREE.Color(parameters.outsideColor); //컬러를 rgb 값을 보기위해

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3; // x y z 3개의 옵션이 있어서 *3의 배수로 설정

    //position
    const radius = Math.random() * parameters.radius;
    const brancheAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2; // 3나머지인것들. 0 , 1 , 2 , 0 , 1 , 2  // 3으로 나눈이유는 중앙정렬을 위해
    const spinAngle = radius * parameters.spin;
    // const randomX = (Math.random() - 0.5) * parameters.randomness;
    // const randomY = (Math.random() - 0.5) * parameters.randomness;
    // const randomZ = (Math.random() - 0.5) * parameters.randomness;
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    if (i < 20) {
      console.log(brancheAngle);
    }

    positions[i3 + 0] = Math.cos(brancheAngle + spinAngle) * radius + randomX; // 첫번째 옵션 x
    positions[i3 + 1] = 0 + randomY; // 두번째 옵션 y
    positions[i3 + 2] = Math.sin(brancheAngle + spinAngle) * radius + randomZ; // 세번째 옵션 z

    //Color
    // colorInside.lerp(colorOutside, 0.5); // 컬러를 믹스할때 사용됨
    const mixedColor = colorInside.clone(); // 인사이트컬러를 복사함
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onChange(generateGalaxy);

gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onChange(generateGalaxy);

gui.add(parameters, "branches").min(2).max(20).step(1).onChange(generateGalaxy);
gui.add(parameters, "spin").min(-5).max(5).step(0.001).onChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onChange(generateGalaxy);

gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onChange(generateGalaxy);

gui.addColor(parameters, "insideColor").onChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onChange(generateGalaxy);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
