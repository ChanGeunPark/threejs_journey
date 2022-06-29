import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import imageSource from "../static/textures/door/color.jpg";

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoaded = () => {
  console.log("onLoaded");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};

const textureLoaderer = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoaderer.load(
  //함수 첫번째 파라미터 = load됬을때, 두번째 진전될때 , 세번째 에러일때
  "/textures/minecraft.png",
  () => {
    console.log("load");
  },
  () => {
    console.log("progress");
  },
  () => {
    console.log("errer");
  }
);

const alphaTexture = textureLoaderer.load("/textures/door/alpha.jpg");
const heightTexture = textureLoaderer.load("/textures/door/height.jpg");
const normalTexture = textureLoaderer.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoaderer.load(
  "/textures/door/ambientOcclusion.jpg"
);
const mealnessTexture = textureLoaderer.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoaderer.load("/textures/door/roughness.jpg");
// const image = new Image();
// const texture = new THREE.Texture(image); // texture  =  함수 안에서만 작동할 수 있다. 여러곳에 써주기위해 전역으로 뺐다

// image.onload = () => {
//   texture.needsUpdate = true; // texture를 함수 안에서 사용하려고 update를 시켜줬다.
// };
// image.src = "/textures/door/color.jpg";

// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

//colorTexture.minFilter = THREE.NearestFilter; //크기에 따라 사진 퀄리티 조정 작은사이즈일때 경계선 흐리게
colorTexture.magFilter = THREE.NearestFilter; // 경계선 확실한 퀄리티

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
