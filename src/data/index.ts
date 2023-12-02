import key2id_ from './key2id.json'
import id2key_ from './id2key.json'
import key2data_ from './key2data.json'
import key2skin_ from './key2skin.json'

interface Skin {
  id: string
  num: number
  name: string
  chromas: boolean
}

interface ChampionData {
  id: string
  key: string
  name: string
  title: string
  skins: Skin[]
}

const key2id = key2id_ as Record<string, string>
const id2key = id2key_ as Record<string, string>
const key2data = key2data_ as Record<string, ChampionData>
const key2skin = key2skin_ as Record<string, string[]>

export { key2id, id2key, key2data, key2skin }
