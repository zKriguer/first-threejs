import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

//camera que recebe posições fixas nesse caso, campo de visão, e engloba todo o aspect ratio da tela, 0.1 é a area onde o objeto nao sera visivel, e 1000 é a render distance da camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//responsavel por dizer ao webgl que deve renderizar isso dentro do canvas do html
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//objeto geometrico ou objeto 3d criado no blender (radius, tube, radialSegments, tubularSegments, arc)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

//criando um tipo de material, no caso meshStandard, com uma cor especifica (Normalmente necessitam de pontos de luz ambiente ou esparsa)
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

//criaçao do objeto misturando a geometria e o material
const torus = new THREE.Mesh(geometry, material);

//criar uma area pontual de luz e precisa de uma posição pré definida
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

//ambient light engloba toda a cena e emite luz de todos os angulos
const ambientLight = new THREE.AmbientLight(0xffffff);
//adicionando coisas a cena ja criada, durante o codigo

scene.add(torus, pointLight, ambientLight);

//lightHelper ajuda a visualizar de onde está vindo o ponto de luz
const lightHelper = new THREE.PointLightHelper(pointLight);

//gridHelper ajuda a visualizar de qual ponto de vista estamos com a camera 👇

/*
{
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);
}
*/

//orbit controls habilita a utilização do mouse para movimentar a camera
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("/images/space.jpg");

scene.background = spaceTexture;

const krigTexture = new THREE.TextureLoader().load("/images/kriguer.jpeg");

const krig = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({ map: krigTexture })
);

scene.add(krig);

const moonTexture = new THREE.TextureLoader().load("images/moon.jpg");

const normalTexture = new THREE.TextureLoader().load("images/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

moon.position.z = 30;
moon.position.setX(-10);

scene.add(moon);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  krig.rotation.y += 0.01;
  krig.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * 0.0002;
  camera.positiony = t * 0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
