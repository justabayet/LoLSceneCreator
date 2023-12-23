import { type Champion, loadingOverlay, state, gui } from './state'
import { championNames, id2key, key2id, key2skin } from './data'
import { initMeshChampion, loadSceneConfig, newChampion } from './libIndex'
import * as THREE from 'three'
import { modalExport, modalInputScene } from './setupModal'

const options = {
  Champion: '',
  Skin: '',
  Animation: 'idle1'
}

function addChampionToGUI (champion: Champion): void {
  const { index, championKey, skinIndex } = champion
  const championFolder = gui.addFolder(`Champion ${index}`)
  championFolder.open()

  options.Champion = key2id[championKey]
  const championNameSelector = championFolder.add(options, 'Champion', championNames)

  options.Skin = key2skin[championKey][skinIndex]
  const skinSelector = championFolder.add(options, 'Skin', key2skin[championKey])

  const animationSelector = championFolder.add(options, 'Animation', champion.mesh.userData.animations)

  const settingsFolder = championFolder.addFolder('settings')

  let rotationFolder = settingsFolder.addFolder('rotation')
  function loadRotationFolder (): void {
    settingsFolder.removeFolder(rotationFolder)
    rotationFolder = settingsFolder.addFolder('rotation')
    rotationFolder.add(champion.mesh.rotation, 'x', 0, Math.PI * 2)
    rotationFolder.add(champion.mesh.rotation, 'y', 0, Math.PI * 2)
    rotationFolder.add(champion.mesh.rotation, 'z', 0, Math.PI * 2)
  }
  loadRotationFolder()

  let positionFolder = settingsFolder.addFolder('position')
  function loadPositionFolder (): void {
    settingsFolder.removeFolder(positionFolder)
    positionFolder = settingsFolder.addFolder('position')
    positionFolder.add(champion.mesh.position, 'x', -300, 300)
    positionFolder.add(champion.mesh.position, 'y', -300, 300)
    positionFolder.add(champion.mesh.position, 'z', -300, 300)
  }
  loadPositionFolder()

  settingsFolder.open()
  let frameSelector = settingsFolder.add(champion.mesh.userData.model, 'setFrame', 0, 10).name('Anim Frame')

  function updateFrameSelector (): void {
    settingsFolder.remove(frameSelector)

    const animIndex = (champion.mesh.userData.model as any).animIndex as number

    const nbFrames = (champion.mesh.userData.model as any).animations[animIndex].bones[0].frames.length
    frameSelector = settingsFolder.add(champion.mesh.userData.model, 'setFrame', 0, nbFrames).name('Anim Frame')
  }
  updateFrameSelector()

  function loadNewChampion (champion: Champion, championKey: string, skinIndex: number): void {
    loadingOverlay.show()

    if (champion.mesh) state.scene.remove(champion.mesh)

    initMeshChampion(championKey, skinIndex, champion.mesh.position, new THREE.Vector3(champion.mesh.rotation.x, champion.mesh.rotation.y, champion.mesh.rotation.z)).then((mesh) => {
      champion.mesh = mesh
      champion.championKey = championKey
      champion.skinIndex = skinIndex

      loadRotationFolder()
      loadPositionFolder()
      updateFrameSelector()

      updateGUI(animationSelector, champion.mesh.userData.animations)
    }).catch((reason) => { console.log(`Init mesh champion failed: ${reason}`) })
  }

  championNameSelector.onChange(function (id) {
    const championKey = id2key[id]
    updateGUI(skinSelector, key2skin[championKey])

    loadNewChampion(champion, championKey, 0)
  })

  skinSelector.onChange(function (val) {
    let skinIndex = 0
    for (let i = 0; i < key2skin[champion.championKey].length; i++) {
      if (key2skin[champion.championKey][i] === val) {
        skinIndex = i
        break
      }
    }

    loadNewChampion(champion, champion.championKey, skinIndex)
  })

  animationSelector.onChange(function (val) {
    champion.mesh.userData.model.setAnimation(val)

    updateFrameSelector()
  })

  championFolder.add({
    delete: function () {
      const championId = state.champions.findIndex((champion) => champion.index === index)
      if (champion.mesh) state.scene.remove(champion.mesh)

      state.champions.splice(championId)
      gui.removeFolder(championFolder)
    }
  }, 'delete').name('❌ Delete')

  champion.folder = championFolder
}

function initGUI (): void {
  const obj = {
    addChampion: function () {
      void newChampion()
    },
    exportScene: function () {
      modalExport.open()
    },
    reset: function () {
      if (state.currentSceneConfig) loadSceneConfig(state.currentSceneConfig)
    },
    scene: function () {
      modalInputScene.open()
    }
  }

  gui.add(obj, 'scene').name('⏳ Load Scene')
  gui.add(obj, 'exportScene').name('📊 Export')
  gui.add(obj, 'reset').name('🙌 Reset')
  gui.add(obj, 'addChampion').name('➕ Add Champion')
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

export { initGUI, addChampionToGUI }
