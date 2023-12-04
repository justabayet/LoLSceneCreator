import { LOLLoader, type MeshLoL } from './lib/LOLLoader'
import { type Champion, state, loadingOverlay } from './state'
import { setupControls } from './controls'
import { animate, setupScene } from './scene'
import * as THREE from 'three'
import { addChampionToGUI, initGUI } from './gui'
import { type SceneConfig } from './types'
import { testScene2 } from './scenes'

const DEFAULT_CHAMPION_KEY = '266'
const DEFAULT_SKIN_INDEX = 0

let championCounter: number = 0

function getNewChampion (): Champion {
  championCounter += 1

  return {
    championKey: DEFAULT_CHAMPION_KEY,
    skinIndex: DEFAULT_SKIN_INDEX,
    index: championCounter
  }
}

function loadSceneConfig (config: SceneConfig): void {
  config.forEach(({ championKey, skinIndex, position, rotation, setFrame, animName }) => {
    void loadChampionConfig(championKey, skinIndex, new THREE.Vector3(position.x, position.y, position.z), new THREE.Vector3(rotation.x, rotation.y, rotation.z), setFrame, animName)
  })
}

export async function init (): Promise<void> {
  setupScene()
  setupControls()

  loadingOverlay.init()
  loadingOverlay.show()

  initGUI()

  loadSceneConfig(testScene2)

  animate()
}

export async function initMeshChampion (championKey: string, skinIndex: number, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0), setFrame?: number, animName?: string): Promise<MeshLoL> {
  const loader = new LOLLoader()

  const meshLol = await loader.load(championKey, skinIndex, { static: false, enableTexture: false, setFrame, animName })

  state.scene.add(state.ground)
  state.groundFlag = true
  meshLol.position.copy(position)
  meshLol.rotation.set(rotation.x, rotation.y, rotation.z)
  meshLol.userData.model.update(100)
  state.scene.add(meshLol)
  loadingOverlay.hide()

  return meshLol
}

async function loadChampionConfig (championKey: string, skinIndex: number, position: THREE.Vector3, rotation: THREE.Vector3, setFrame?: number, animName?: string): Promise<void> {
  const { index } = getNewChampion()

  const mesh = await initMeshChampion(championKey, skinIndex, position, rotation, setFrame, animName)

  const champion: Champion = {
    championKey,
    skinIndex,
    mesh,
    index
  }

  state.champions.push(champion)

  addChampionToGUI(champion)
}

export async function newChampion (): Promise<void> {
  const { championKey, skinIndex, index } = getNewChampion()

  const mesh = await initMeshChampion(championKey, skinIndex, new THREE.Vector3(-200, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0))

  const champion: Champion = {
    championKey,
    skinIndex,
    mesh,
    index
  }

  state.champions.push(champion)

  addChampionToGUI(champion)
}
