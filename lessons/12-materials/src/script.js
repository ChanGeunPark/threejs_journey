import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter; //gradientTexture의 색상영역이 클때마다 단계를 나눠준다.
gradientTexture.magFilter = THREE.NearestFilter; //gradientTexture의 색상영역이 클때마다 단계를 나눠준다.
gradientTexture.generateMipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * object
 */

// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial(); // 입혀진 텍스쳐에 색상에 맞춰서 입혀지게 도외준다.
// const material = new THREE.MeshDepthMaterial();// 카메라가 멀어지면 안보임
// const material = new THREE.MeshLambertMaterial(); // light 가 있어야지 음형이 작용된다.
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000; // mashphongmaterail 의윤기
// material.specular = new THREE.Color(0x1188ff); // 반사된 빛의 색상
// const material = new THREE.MeshToonMaterial(); // 카툰처럼 변경됨
// material.gradientMap = gradientTexture; // 카툰의 맵핑을 작은 이미지로 늘려서 부드럽게 만들어줌

const material = new THREE.MeshStandardMaterial(); //그림자가 스무스함.
material.metalness = 0.6; //사물을 어둡게 한다.
material.roughness = 0.1; //빛을 부드럽게 해준다.
material.envMap = environmentMapTexture; // 좌우상하앞뒤 비치는 텍스쳐를 넣어줌

// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionexture; //텍스쳐의 음형을 더해줬음 -> shadow
// material.aoMapIntensity = 2; //음형의 밝기 숫자가 높으면 높을수록 음형이 짙어짐
// material.displacementMap = doorHeightTexture; //맵의 음형에 따라 왜곡효과를 준다. 경계면을 튀어나오도록 설정
// material.displacementScale = 0.05; // 스케일을 줄어준다
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture; // 세부 디테일의 들어가는 효과등을 표현 할 수 있다.
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;// transparent 가 무조건 있어야 한다

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.1);
gui.add(material, "displacementScale").min(0).max(1).step(0.1);

// material.flatShading = true;

//material.matcap = matcapTexture; // 밖에다 사용할 수도 있음 // matcap은 텍스쳐가 가지고있는 고유의 색상으로 오브젝트의 색상을 변환한다
// material.color = new THREE.Color(0xff00ff);
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true; // transparent를 해줘야지 opcity가 먹는다.
// material.alphaMap = doorAlphaTexture; // transparent를 해줘야지 alphatexture가 적용된다. alphaMap은 해당 구역에 transparent를 준다.
// material.size = THREE.DoubleSide;

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

sphere.position.x = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100), // 3,4파라미터는 sagments를 쪼갠다
  material
);
plane.geometry.setAttribute(
  //새로운 텍스쳐를 입히기 위해 uv 설정을 uv2로 복사했음
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
console.log(plane.geometry.attributes);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const poitLinght = new THREE.PointLight(0xffffff, 0.5);
poitLinght.position.x = 2;
poitLinght.position.y = 2;
poitLinght.position.z = 2;
scene.add(poitLinght);

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
  //update object
  sphere.rotation.y = elapsedTime * 0.005;
  plane.rotation.y = elapsedTime * 0.005;
  torus.rotation.y = elapsedTime * 0.005;

  sphere.rotation.x = elapsedTime * 0.005;
  plane.rotation.x = elapsedTime * 0.005;
  torus.rotation.x = elapsedTime * 0.005;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
