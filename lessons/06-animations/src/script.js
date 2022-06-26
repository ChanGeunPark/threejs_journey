import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// let time = Date.now();

//Clock
//const clock = new THREE.Clock();

gsap.to(mesh.position, {
  x: 1,
  duration: 1,
  delay: 1,
});
gsap.to(mesh.position, {
  x: 0,
  duration: 1,
  delay: 2,
});

const tick = () => {
  //Clock
  //const elapsedTime = clock.getElapsedTime(); //재생되고 있는 시간
  //console.log(elapsedTime);

  //update object
  //console.log(Math.sin(elapsedTime));
  //   camera.position.x = Math.sin(elapsedTime); //sin은 사인값을 반환해줌 직사각형의 대변의 길이 / 사변의 길이 1 ~ -1 사이의 값을 가지고 있다.
  //   camera.position.y = Math.cos(elapsedTime);
  //   camera.lookAt(mesh.position);
  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
