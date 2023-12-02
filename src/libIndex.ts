import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LOLLoader, type MeshLoL } from './lib/LOLLoader'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI, type GUIController } from 'dat.gui'
import { id2key, key2id, key2skin } from './data'

let stats: Stats
let controls: OrbitControls
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let light: THREE.HemisphereLight
let spotlight: THREE.SpotLight

const clock = new THREE.Clock()

let model: MeshLoL = null
let ground: THREE.Mesh = null
let groundFlag: boolean = false

const loadingOverlay = {
  obj: null as HTMLElement,
  init: () => {
    loadingOverlay.obj = document.getElementById('loading')
  },
  show: () => {
    loadingOverlay.obj.style.display = 'block'
  },
  hide: () => {
    loadingOverlay.obj.style.display = 'none'
  }
}

let actionFolder: GUIController = null
let skinFolder: GUIController = null
let championKey = '266'
let skinIndex = 0
const gui = new GUI()
const options = {
  Champion: '',
  Skin: '',
  Animation: 'idle1',
  Freeze: false,
  Controls: 'QWERA'
}

init()
animate()

function init (): void {
  const canvas = document.getElementById('canvas3D')

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  )
  camera.position.set(100, 200, 700)

  scene = new THREE.Scene()

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('assets/bg.png', function (texture) {
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      // side: THREE.DoubleSide,
      depthWrite: true
    })
    ground = new THREE.Mesh(new THREE.CircleGeometry(300, 100), material)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    // scene.add(ground);
  })

  light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5)
  light.position.set(0, 400, 0)
  scene.add(light)

  spotlight = new THREE.SpotLight(0xff0000, 100, 0, undefined, undefined, 0)
  spotlight.position.set(0, 400, 100)
  spotlight.shadow.camera.far = 5000
  spotlight.castShadow = true
  scene.add(spotlight)

  // scene.add( new THREE.CameraHelper( spotlight.shadow.camera ) );

  // var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add(grid);

  initGUI()

  loadingOverlay.init()
  loadingOverlay.show()

  initModel()

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

  window.addEventListener('keydown', onKeyDown, false)

  stats = new Stats()
  document.body.appendChild(stats.dom)
}

function onKeyDown (event: KeyboardEvent): void {
  if (event.key === 'q') {
    model.userData.model.setAnimationOnce('spell1')
  }
  if (event.key === 'w') {
    model.userData.model.setAnimationOnce('spell2')
  }
  if (event.key === 'e') {
    model.userData.model.setAnimationOnce('spell3')
  }
  if (event.key === 'r') {
    model.userData.model.setAnimationOnce('spell4')
  }
  if (event.key === 'a') {
    model.userData.model.setAnimationOnce('attack1')
  }
}

function initModel (): void {
  const loader = new LOLLoader()
  loader.load(championKey, skinIndex, { static: false }).then(
    function (object: MeshLoL) {
      model = object
      console.log(model.userData)
      if (actionFolder) updateGUI(actionFolder, model.userData.animations)
      scene.add(ground)
      groundFlag = true
      scene.add(object)
      loadingOverlay.hide()
    },
    () => {
      scene.add(ground)
      groundFlag = true
      loadingOverlay.hide()
    }
  )
}

function updateGUI (target: any, list: any): void {
  let innerHTMLStr = ''
  if (list.constructor.name === 'Array') {
    for (let i = 0; i < list.length; i++) {
      const str = "<option value='" + list[i] + "'>" + list[i] + '</option>'
      innerHTMLStr += str
    }
  }

  if (list.constructor.name === 'Object') {
    for (const key in list) {
      const str = "<option value='" + list[key] + "'>" + key + '</option>'
      innerHTMLStr += str
    }
  }
  if (innerHTMLStr !== '') {
    target.domElement.children[0].innerHTML = innerHTMLStr
  }
}

function initGUI (): void {
  const names = Object.values(key2id)
    .map((value) => value)
    .sort(function (a, b) {
      return a.localeCompare(b)
    })
  // have loaded two json
  // init champion
  options.Champion = key2id[championKey]
  // only need to add once
  gui.add(options, 'Champion', names).onChange(function (id) {
    scene.remove(ground)
    groundFlag = false
    loadingOverlay.show()
    championKey = id2key[id]
    updateGUI(skinFolder, key2skin[championKey])
    skinIndex = 0
    if (model) {
      scene.remove(model)
    }
    model = null
    initModel()
  })

  options.Skin = key2skin[championKey][0]

  skinFolder = gui
    .add(options, 'Skin', key2skin[championKey])
    .onChange(function (val) {
      scene.remove(ground)
      groundFlag = false
      loadingOverlay.show()
      for (let i = 0; i < key2skin[championKey].length; i++) {
        if (key2skin[championKey][i] === val) {
          skinIndex = i
          break
        }
      }
      if (model) {
        scene.remove(model)
      }
      model = null
      initModel()
    })
  actionFolder = gui.add(options, 'Animation', []).onChange(function (val) {
    model.userData.model.setAnimation(val)
  })
  gui.add(options, 'Freeze').onChange(function () {
    model.userData.model.toggleAnimation()
  })
  gui.add(options, 'Controls')
}

function onWindowResize (): void {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate (): void {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  renderer.render(scene, camera)
  stats.update()
  if (model) model.userData.model.update(clock.getElapsedTime() * 1000)
  if (ground && groundFlag) ground.rotateZ(0.1 * delta)
}
