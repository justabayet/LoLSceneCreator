import { type MeshLoL } from './lib/LOLLoader'
import * as THREE from 'three'

interface Champion {
  mesh?: MeshLoL
  championKey: string
  skinIndex: number
  index: number
}

interface State {
  champions: Champion[]
  scene: THREE.Scene
  ground?: THREE.Mesh
  groundFlag: boolean
}

const state: State = {
  champions: [],
  scene: new THREE.Scene(),
  ground: null,
  groundFlag: false
}

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

export { state, type Champion, loadingOverlay }
