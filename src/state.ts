import { GUI } from 'dat.gui'
import { type MeshLoL } from './lib/LOLLoader'
import * as THREE from 'three'
import { type SceneConfig } from './types'

interface Champion {
  mesh?: MeshLoL
  championKey: string
  skinIndex: number
  index: number
  folder?: GUI
}

interface State {
  champions: Champion[]
  scene: THREE.Scene
  ground?: THREE.Mesh
  groundFlag: boolean
  currentSceneConfig?: SceneConfig
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
const gui = new GUI()

function getRunningScene (): string {
  const report = state.champions.map((champion: Champion) => {
    return {
      championKey: champion.championKey,
      skinIndex: champion.skinIndex,
      position: {
        x: champion.mesh.position.x,
        y: champion.mesh.position.y,
        z: champion.mesh.position.z
      },
      rotation: {
        x: champion.mesh.rotation.x,
        y: champion.mesh.rotation.y,
        z: champion.mesh.rotation.z
      },
      setFrame: champion.mesh.userData.model.setFrame,
      animName: champion.mesh.userData.model.animName
    }
  })

  const exportableReport = JSON.stringify(report, null, 2)

  return exportableReport
}

export { state, type Champion, loadingOverlay, gui, getRunningScene }
