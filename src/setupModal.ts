import { modal as Modal } from 'tingle.js'
import './tingle.css'
import { getRunningScene } from './state'
import { loadSceneConfig } from './libIndex'

const modalExportTitle = '<h1>Scene JSON</h1>'

const getModalExportTextArea = (config: string): string => {
  return `<textarea readonly style="width:100%;resize:none;height: 100px;">${config}</textarea>`
}

export const modalExport = new Modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: 'Close',
  onOpen: function () {
    modalExport.setContent(modalExportTitle + getModalExportTextArea(getRunningScene()))
  }
})

modalExport.addFooterBtn('Copy', 'tingle-btn tingle-btn--primary', function () {
  void navigator.clipboard.writeText(getRunningScene())
  modalExport.close()
})

modalExport.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function () {
  modalExport.close()
})

function getModalInputScene (): Modal {
  const container = document.createElement('div')

  const title = document.createElement('h1')
  title.innerHTML = 'Enter Scene JSON:'

  const textArea = document.createElement('textarea')
  textArea.style.width = '100%'
  textArea.style.height = '100px'
  textArea.style.resize = 'none'

  container.appendChild(title)
  container.appendChild(textArea)

  const modalInputScene = new Modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: 'Close',
    onOpen: function () {
      textArea.value = '[]'
    },
    onClose: function () {
    }
  })

  modalInputScene.addFooterBtn('Load Scene', 'tingle-btn tingle-btn--primary', function () {
    const sceneConfig = JSON.parse(textArea.value)
    loadSceneConfig(sceneConfig)
    modalInputScene.close()
  })

  modalInputScene.addFooterBtn('Cancel', 'tingle-btn tingle-btn--danger', function () {
    modalInputScene.close()
  })

  modalInputScene.setContent(container)

  return modalInputScene
}
export const modalInputScene = getModalInputScene()
