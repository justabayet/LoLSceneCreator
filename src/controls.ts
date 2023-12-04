function setupControls (): void {
  window.addEventListener('keydown', onKeyDown, false)
}

function onKeyDown (event: KeyboardEvent): void {
  // console.log(`Key stroke: ${event.key}`)
}

export { setupControls }
