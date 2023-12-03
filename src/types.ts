export type SceneConfig = ChampionConfig[]

interface ChampionConfig {
  championKey: string
  skinIndex: number
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
  setFrame: number
  animName: string
}
