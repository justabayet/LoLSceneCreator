declare class LOLLoader {
  async load (champion: string, skin: number, options: { static: boolean, enableTexture?: boolean, setFrame?: number, animName?: string }): Promise<MeshLoL>
}

declare class Model {
  setAnimationOnce: (name: string) => void
  setAnimation: (name: string) => void
  toggleAnimation: () => void
  update: (time: number) => void
  setFrame: number
  animName: string
}

declare class MeshLoL extends THREE.Mesh {
  userData: {
    type: string,
    model: Model,
    animations: string[],
  }
}

export { LOLLoader, MeshLoL }
