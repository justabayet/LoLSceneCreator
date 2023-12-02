declare class LOLLoader {
  async load (champion: string, skin: number, options: { static: boolean }): Promise<THREE.Mesh>
}

declare class Model {
  setAnimationOnce: (name: string) => void
  setAnimation: (name: string) => void
  toggleAnimation: () => void
  update: (time: number) => void
}

declare class MeshLoL extends THREE.Mesh {
  userData: {
    type: string,
    model: Model,
    animations: string[]
  }
}

export { LOLLoader, MeshLoL }
