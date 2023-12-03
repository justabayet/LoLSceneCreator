import { state } from './state'

function setupControls (): void {
  window.addEventListener('keydown', onKeyDown, false)
}

function onKeyDown (event: KeyboardEvent): void {
  if (event.key === 'q') {
    state.champions.forEach((champion) => champion.mesh?.userData.model.setAnimationOnce('spell1'))
  }
  if (event.key === 'w') {
    state.champions.forEach((champion) => champion.mesh?.userData.model.setAnimationOnce('spell2'))
  }
  if (event.key === 'e') {
    state.champions.forEach((champion) => champion.mesh?.userData.model.setAnimationOnce('spell3'))
  }
  if (event.key === 'r') {
    state.champions.forEach((champion) => champion.mesh?.userData.model.setAnimationOnce('spell4'))
  }
  if (event.key === 'a') {
    state.champions.forEach((champion) => champion.mesh?.userData.model.setAnimationOnce('attack1'))
  }
}

export { setupControls }
