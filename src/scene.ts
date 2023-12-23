import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { state } from './state'
import Stats from 'three/examples/jsm/libs/stats.module.js'

let controls: OrbitControls
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let light: THREE.HemisphereLight
let spotlight: THREE.SpotLight

let stats: Stats

const clock = new THREE.Clock()

function setupScene (): void {
  state.scene = new THREE.Scene()
  const canvas = document.getElementById('canvas3D')

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  )
  camera.position.set(100, 200, 700)

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('assets/bg.png', function (texture) {
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      depthWrite: true
    })
    const ground = new THREE.Mesh(new THREE.CircleGeometry(300, 100), material)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    state.scene.add(ground)
  })

  light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.05)
  light.position.set(0, 400, 0)
  state.scene.add(light)

  const loader = new THREE.TextureLoader()
  const texture = loader.load('assets/texture.jpg')
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.colorSpace = THREE.SRGBColorSpace

  spotlight = new THREE.SpotLight(0xffffff, 10, 0, undefined, undefined, 0)
  spotlight.position.set(0, 400, 100)
  spotlight.shadow.camera.far = 5000
  spotlight.shadow.mapSize.width = 1024
  spotlight.shadow.mapSize.height = 1024
  spotlight.castShadow = true
  spotlight.map = texture
  state.scene.add(spotlight)

  // scene.add( new THREE.CameraHelper( spotlight.shadow.camera ) );

  // var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add(grid);

  // initCurrentModel()

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  onWindowResize()

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 100, 0)
  controls.update()

  window.addEventListener('resize', onWindowResize, false)

  stats = new Stats()
  document.body.appendChild(stats.dom)
}

function onWindowResize (): void {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate (): void {
  requestAnimationFrame(animate)
  renderer.render(state.scene, camera)
  stats.update()
  state.champions.forEach((champion) => {
    champion.mesh?.userData.model.update(clock.getElapsedTime() * 1000)
  })

  const time = clock.getElapsedTime() / 10
  spotlight.position.x = Math.cos(time) * 2.5
  spotlight.position.z = Math.sin(time) * 2.5
}

export { setupScene, animate }
