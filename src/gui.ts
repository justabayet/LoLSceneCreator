import { GUI } from 'dat.gui'
import { type Champion, loadingOverlay, state } from './state'
import { championNames, id2key, key2id, key2skin } from './data'
import { initMeshChampion, newChampion } from './libIndex'
import * as THREE from 'three'

const gui = new GUI()
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
  const rotationFolder = settingsFolder.addFolder('rotation')
  rotationFolder.add(champion.mesh.rotation, 'x', 0, Math.PI * 2)
  rotationFolder.add(champion.mesh.rotation, 'y', 0, Math.PI * 2)
  rotationFolder.add(champion.mesh.rotation, 'z', 0, Math.PI * 2)

  const positionFolder = settingsFolder.addFolder('position')
  positionFolder.add(champion.mesh.position, 'x', -300, 300)
  positionFolder.add(champion.mesh.position, 'y', -300, 300)
  positionFolder.add(champion.mesh.position, 'z', -300, 300)

  settingsFolder.open()
  console.log(champion.mesh.userData.model)
  let frameSelector = settingsFolder.add(champion.mesh.userData.model, 'setFrame', 0, 10)

  function updateFrameSelector (): void {
    settingsFolder.remove(frameSelector)

    const nbFrames = (champion.mesh.userData.model as any).animations[0].bones[0].frames.length
    frameSelector = settingsFolder.add(champion.mesh.userData.model, 'setFrame', 0, nbFrames)
  }
  updateFrameSelector()

  function loadNewChampion (champion: Champion, championKey: string, skinIndex: number): void {
    state.scene.remove(state.ground)
    state.groundFlag = false
    loadingOverlay.show()

    if (champion.mesh) state.scene.remove(champion.mesh)

    initMeshChampion(championKey, skinIndex, champion.mesh.position, new THREE.Vector3(champion.mesh.rotation.x, champion.mesh.rotation.y, champion.mesh.rotation.z)).then((mesh) => {
      champion.mesh = mesh
      champion.championKey = championKey
      champion.skinIndex = skinIndex

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
  }, 'delete')
}

function initGUI (): void {
  const obj = {
    addChampion: function () {
      void newChampion()
    },
    exportScene: function () {
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
      console.log(JSON.stringify(report, null, 2))
    }
  }

  gui.add(obj, 'addChampion')
  gui.add(obj, 'exportScene')
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
