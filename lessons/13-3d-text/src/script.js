import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import typefaceFont from "../static/fonts/helvetiker_regular.typeface.json";
import mytypefaceFont from "../static/fonts/Pretendard_Black_Regular.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import {
  TextBufferGeometry,
  TextGeometry,
} from "three/examples/jsm/geometries/TextGeometry";
console.log(mytypefaceFont);

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

/**
 * Fonts
 */

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Park Chan Geun", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5, //곡선부분 얼마나 부르럽게 할건지 sigments 기억해야됨

    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02, // 꺽이는부부 부드럽게 할때 간격
    bevelOffset: 0,
    bevelSegments: 4, //꺽이는 부분 얼마나 부드럽게 할건지
  });

  //  textGeometry.computeBoundingBox(); //오브젝트의 공간에서 차지하는 최소, 최대 좌표값을 알 수 있다/ boundedingbox() 가 있어야지만 속성에 들어간다
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5, //최대 x값 / 2
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  textGeometry.center();

  const materail = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  //textMaterail.wireframe = true;
  const text = new THREE.Mesh(textGeometry, materail);

  scene.add(text);

  console.time("donuts");

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45); // geometry, material은 반복문에 넣지 말기  -> 성능저하

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, materail);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
  console.timeEnd("donuts");
});

/**
 * Object
 */

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
