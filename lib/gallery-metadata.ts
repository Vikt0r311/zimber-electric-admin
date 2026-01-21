import fs from 'fs'
import path from 'path'

export interface FolderMetadata {
  id: string
  name: string
  createdAt: string
}

const METADATA_PATH = path.join(process.cwd(), 'data', 'gallery-metadata.json')

export function ensureDataDirectory() {
  const dataDir = path.dirname(METADATA_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export function loadFolderMetadata(): Record<string, FolderMetadata> {
  ensureDataDirectory()
  
  if (!fs.existsSync(METADATA_PATH)) {
    // Initialize with existing hardcoded folders for backward compatibility
    const defaultMetadata: Record<string, FolderMetadata> = {
      'tata-140m2-csaladi-haz': {
        id: 'tata-140m2-csaladi-haz',
        name: 'Tata - 140m² Családi Ház',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      'almasfuzito_55m2_panellakas': {
        id: 'almasfuzito_55m2_panellakas',
        name: 'Almasfüzitő - 55m² Panellakás',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      'komarom-64m2-panellakas': {
        id: 'komarom-64m2-panellakas',
        name: 'Komárom - 64m² Panellakás',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      'homlokzati-hoszigeteleshez-szerelvenyek': {
        id: 'homlokzati-hoszigeteleshez-szerelvenyek',
        name: 'Homlokzati Hőszigetelés',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      'kiseloszto-csere': {
        id: 'kiseloszto-csere',
        name: 'Kiselosztó Csere',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
    
    saveFolderMetadata(defaultMetadata)
    return defaultMetadata
  }
  
  try {
    const content = fs.readFileSync(METADATA_PATH, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error loading metadata:', error)
    return {}
  }
}

export function saveFolderMetadata(metadata: Record<string, FolderMetadata>) {
  ensureDataDirectory()
  
  try {
    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2))
  } catch (error) {
    console.error('Error saving metadata:', error)
  }
}

export function addFolderMetadata(id: string, name: string) {
  const metadata = loadFolderMetadata()
  metadata[id] = {
    id,
    name,
    createdAt: new Date().toISOString()
  }
  saveFolderMetadata(metadata)
}

export function removeFolderMetadata(id: string) {
  const metadata = loadFolderMetadata()
  delete metadata[id]
  saveFolderMetadata(metadata)
}

export function updateFolderName(id: string, newName: string) {
  const metadata = loadFolderMetadata()
  if (metadata[id]) {
    metadata[id].name = newName
    saveFolderMetadata(metadata)
    return true
  }
  return false
}

export function getFolderDisplayName(folderId: string): string {
  const metadata = loadFolderMetadata()
  return metadata[folderId]?.name || folderId.replace(/-/g, ' ').replace(/_/g, ' ')
}