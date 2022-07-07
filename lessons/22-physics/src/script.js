import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON from "cannon";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};

debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createSphere");

debugObject.createBox = () => {
  createBox(
    Math.random(),
    Math.random(),
    Math.random(),

    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }
  );
};
gui.add(debugObject, "createBox");

debugObject.reset = () => {
  objectsToUpdate.map(async (object) => {
    // Remove body
    object.body.removeEventListener("collide", playHitSound); //사운드 제거
    world.removeBody(object.body); // 바디제거

    //Remove mesh
    await scene.remove(object.mesh);
    objectsToUpdate.splice(0, objectsToUpdate.length);
  });
};
gui.add(debugObject, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Sounds
 */
const hitSound = new Audio("/sounds/hit.mp3"); // 박스소리 추가

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal(); // 얼마나 높이에서 부딛혔는지 숫치로 보여준다.

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0; // 바운스 터치할때마다 소리가 들린다
    hitSound.play(); // 사운드가 일정하다
    console.log(impactStrength);
  }
};

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */

//world
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world); // 더 나은 성능을 위해 broadphase를 사용할 수 있다.
world.allowSleep = true; //개선된 broadphase 알고리즘을 사용하더라도 더 이상 움직이지 않는 바디까지 모든 바디가 테스트됩니다. 몸의 속도가 정말 느려지면 몸은 잠이 들 수 있고 충분한 힘이 가해지지 않으면 테스트를 하지 않습니다.
world.gravity.set(0, -9.82, 0); //y 에 중력 적용

// Materials
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.4, //바닥에 튕킬때 height
  }
);

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;
//SPhere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1, // 중력적용
//   position: new CANNON.Vec3(0, 3, 0), // x y z 포지션
//   shape: sphereShape,
//   //material: defaultMaterial,
// });

/*
ApplyForce
바람과 같이 공간의 특정 지점(반드시 신체 표면에 있는 것은 아님)에 힘을 가하거나 도미노를 살짝 밀거나 앵그리버드에 강한 힘을 가합니다.

applyImpulse
applyForce와 비슷하지만 힘을 추가하는 대신 속도를 추가합니다.

applyLocalForce
applyForce와 동일하지만 좌표는 Body에 로컬입니다(0,0,0은 Body의 중심이 됨).

applyLocalImpulse
applyImpulse와 동일하지만 좌표는 Body에 로컬입니다.
*/
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(300, 0, 0), // 밀 방향
//   new CANNON.Vec3(0, 0, 0) // 가속?
// );
// world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
//floorBody.material = defaultMaterial;
floorBody.mass = 0; //안움직일거다
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); //첫번째 매개변수는 회전축이고 두 번째 매개변수는 각도이다.
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

//box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createBox = (width, height, depth, position) => {
  //Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth); // 크기변경
  mesh.castShadow = true;
  mesh.position.copy(position); //중력작용한 포지션을 따라가기위함
  scene.add(mesh);

  //Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  ); // cannonjs에선 가로 높이 뎁스가 큐브 정 중앙에서 시작한다 그래서 /2를 해줘야함

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position);

  body.addEventListener("collide", playHitSound); //충돌할때
  world.addBody(body);

  // Save in ovejct to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

//sphere
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radius, position) => {
  //Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius); // 크기변경
  mesh.castShadow = true;
  mesh.position.copy(position); //중력작용한 포지션을 따라가기위함
  scene.add(mesh);

  //Cannon.js body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound); //충돌할때
  world.addBody(body);
  // Save in ovejct to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

console.log(objectsToUpdate);
/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world

  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position); //구체 포지션 방향으로 밀어라
  world.step(1 / 60, deltaTime, 3); // 1. 고정된 시간단계 , 2. 마지막단계후 얼마나 많은 시간이 흘렀는지, 3. 잠재적인 지연을 따라잡기 위해 적용할수 있는 반복 횟수

  objectsToUpdate.map((object) => {
    object.mesh.position.copy(object.body.position); //object를 중력을 적용시킨다. //오브젝트끼리 서로 부딛힐땐 오브젝트가 돌아가진 않는다
    object.mesh.quaternion.copy(object.body.quaternion); //quaternion이 있어야지 회전한다
  });

  //   sphere.position.copy(sphereBody.position); //카피하면 아래 세줄 요약할 수 있다.
  //   sphere.position.x = sphereBody.position.x; //threejs의 mesh를 cannon의 위치랑 맞춘다
  //   sphere.position.y = sphereBody.position.y; //threejs의 mesh를 cannon의 위치랑 맞춘다
  //   sphere.position.z = sphereBody.position.z; //threejs의 mesh를 cannon의 위치랑 맞춘다

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
