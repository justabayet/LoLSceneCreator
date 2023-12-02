import './style.css'
import './libIndex'

const CLASH_ENDPOINT = 'https://whenisnextlolclash.justabayet.com/clashes'

async function main (): Promise<void> {
  const remoteData = await fetch(CLASH_ENDPOINT)
  console.log(await remoteData.json())
  const mockData = (await import('./data/clashMock.json')).default
  console.log(mockData)
}

void main()
