'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Folder, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Save,
  X,
  Settings,
  Lock,
  Edit2
} from 'lucide-react'
import Image from 'next/image'

interface GalleryFolder {
  id: string
  name: string
  folder: string
  imageCount: number
}

interface GalleryImage {
  name: string
  path: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null)
  
  const [folders, setFolders] = useState<GalleryFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderId, setNewFolderId] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [editFolderName, setEditFolderName] = useState('')

  // Check authentication on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Load folders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadFolders()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      if (token) {
        const authEndpoint = process.env.NODE_ENV === 'production' 
          ? '/.netlify/functions/admin-auth'
          : '/api/admin/auth'
          
        const response = await fetch(authEndpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
          setAuthToken(token)
        } else {
          localStorage.removeItem('admin-token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('admin-token')
    }
    setIsLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const authEndpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/admin-auth'
        : '/api/admin/auth'
        
      const response = await fetch(authEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()
      if (response.ok && (data.success || data.token)) {
        setIsAuthenticated(true)
        setAuthToken(data.token || 'authenticated')
        setPassword('')
        localStorage.setItem('admin-token', data.token || 'authenticated')
      } else {
        setLoginError('Hibás jelszó')
      }
    } catch (error) {
      setLoginError('Bejelentkezési hiba')
    }
  }

  const loadFolders = async () => {
    try {
      const foldersEndpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/gallery-folders-simple'
        : '/api/admin/folders'
        
      const response = await fetch(foldersEndpoint)
      const data = await response.json()
      
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setFolders(data)
      } else {
        console.error('Invalid data format:', data)
        setFolders([])
      }
    } catch (error) {
      console.error('Error loading folders:', error)
      setFolders([])
    }
  }

  const loadImages = async (folderId: string) => {
    try {
      const imagesEndpoint = process.env.NODE_ENV === 'production' 
        ? `/.netlify/functions/gallery-images-simple?folder=${folderId}`
        : `/api/admin/folders/${folderId}/images`
        
      const response = await fetch(imagesEndpoint)
      const data = await response.json()
      
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setImages(data)
      } else {
        console.error('Invalid images data format:', data)
        setImages([])
      }
    } catch (error) {
      console.error('Error loading images:', error)
      setImages([])
    }
  }

  const createFolder = async () => {
    if (!newFolderName.trim() || !newFolderId.trim()) return

    try {
      const createFolderEndpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/gallery-folders-simple'
        : '/api/admin/folders'
        
      const response = await fetch(createFolderEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName,
          folder: newFolderId,
        }),
      })

      if (response.ok) {
        setNewFolderName('')
        setNewFolderId('')
        setShowCreateFolder(false)
        loadFolders()
      }
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const deleteFolder = async (folderId: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a mappát és az összes benne lévő képet?')) {
      return
    }

    try {
      const deleteFolderEndpoint = process.env.NODE_ENV === 'production' 
        ? `/.netlify/functions/gallery-folder?id=${folderId}`
        : `/api/admin/folders/${folderId}`
        
      const response = await fetch(deleteFolderEndpoint, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadFolders()
        if (selectedFolder === folderId) {
          setSelectedFolder(null)
          setImages([])
        }
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadingFiles(files)
  }

  const uploadImages = async () => {
    if (!selectedFolder || uploadingFiles.length === 0) return

    const formData = new FormData()
    uploadingFiles.forEach((file) => {
      formData.append('images', file)
    })

    try {
      const uploadEndpoint = process.env.NODE_ENV === 'production' 
        ? `/.netlify/functions/upload-images-simple?folder=${selectedFolder}`
        : `/api/admin/folders/${selectedFolder}/upload`
        
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadingFiles([])
        loadImages(selectedFolder)
        loadFolders() // Update image count
      }
    } catch (error) {
      console.error('Error uploading images:', error)
    }
  }

  const deleteImage = async (imageName: string) => {
    if (!selectedFolder || !confirm('Biztosan törölni szeretnéd ezt a képet?')) {
      return
    }

    try {
      const deleteImageEndpoint = process.env.NODE_ENV === 'production' 
        ? `/.netlify/functions/gallery-images?folder=${selectedFolder}&image=${imageName}`
        : `/api/admin/folders/${selectedFolder}/images/${imageName}`
        
      const response = await fetch(deleteImageEndpoint, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadImages(selectedFolder)
        loadFolders() // Update image count
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId)
    loadImages(folderId)
  }

  const startEditFolder = (folderId: string, currentName: string) => {
    setEditingFolder(folderId)
    setEditFolderName(currentName)
  }

  const cancelEditFolder = () => {
    setEditingFolder(null)
    setEditFolderName('')
  }

  const saveEditFolder = async () => {
    if (!editingFolder || !editFolderName.trim()) return

    try {
      const updateFolderEndpoint = process.env.NODE_ENV === 'production' 
        ? `/.netlify/functions/gallery-folder?id=${editingFolder}`
        : `/api/admin/folders/${editingFolder}`
        
      const response = await fetch(updateFolderEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editFolderName.trim() }),
      })

      if (response.ok) {
        setEditingFolder(null)
        setEditFolderName('')
        loadFolders()
      } else {
        console.error('Failed to update folder name')
      }
    } catch (error) {
      console.error('Error updating folder name:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-midnight min-h-screen flex items-center justify-center">
        <div className="text-electric-cyan text-xl">Betöltés...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-midnight min-h-screen flex items-center justify-center">
        <div className="bg-graphite rounded-xl p-8 border border-electric-cyan/20 w-full max-w-md">
          <div className="text-center mb-6">
            <Lock className="text-electric-cyan mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold text-white">Admin Bejelentkezés</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-midnight text-white rounded-lg border border-electric-cyan/20 focus:border-electric-cyan outline-none"
                required
              />
            </div>
            
            {loginError && (
              <div className="text-red-400 text-sm text-center">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-electric-cyan text-midnight p-3 rounded-lg font-medium hover:scale-105 transition-transform"
            >
              Bejelentkezés
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-midnight min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="text-electric-cyan" size={48} />
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Admin Felület
            </h1>
          </div>
          <p className="text-white/70 text-lg">
            Galéria mappák és képek kezelése
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Folders Panel */}
          <div className="bg-graphite rounded-xl p-6 border border-electric-cyan/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Folder className="text-electric-cyan" size={24} />
                Mappák
              </h2>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="p-2 bg-electric-cyan text-midnight rounded-lg hover:scale-105 transition-transform"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Create Folder Form */}
            {showCreateFolder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-4 bg-midnight rounded-lg border border-electric-cyan/20"
              >
                <input
                  type="text"
                  placeholder="Mappa neve (pl: Tata - 140m² Családi Ház)"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full p-3 mb-3 bg-graphite text-white rounded-lg border border-electric-cyan/20 focus:border-electric-cyan outline-none"
                />
                <input
                  type="text"
                  placeholder="Mappa ID (pl: tata-140m2-csaladi-haz)"
                  value={newFolderId}
                  onChange={(e) => setNewFolderId(e.target.value)}
                  className="w-full p-3 mb-3 bg-graphite text-white rounded-lg border border-electric-cyan/20 focus:border-electric-cyan outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createFolder}
                    className="flex-1 bg-electric-cyan text-midnight p-2 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Létrehozás
                  </button>
                  <button
                    onClick={() => setShowCreateFolder(false)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                  >
                    <X size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Folders List */}
            <div className="space-y-2">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`p-3 rounded-lg transition-all border ${
                    selectedFolder === folder.id
                      ? 'bg-electric-cyan/20 border-electric-cyan'
                      : 'bg-midnight border-electric-cyan/20 hover:border-electric-cyan/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleFolderSelect(folder.id)}
                    >
                      {editingFolder === folder.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editFolderName}
                            onChange={(e) => setEditFolderName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                saveEditFolder()
                              }
                              if (e.key === 'Escape') {
                                e.preventDefault()
                                cancelEditFolder()
                              }
                            }}
                            className="w-full p-2 bg-graphite text-white rounded border border-electric-cyan/20 focus:border-electric-cyan outline-none"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                saveEditFolder()
                              }}
                              className="p-1 bg-green-500 text-white rounded hover:scale-110 transition-transform"
                            >
                              <Save size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                cancelEditFolder()
                              }}
                              className="p-1 bg-gray-500 text-white rounded hover:scale-110 transition-transform"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-white font-medium">{folder.name}</div>
                          <div className="text-white/60 text-sm">{folder.imageCount} kép</div>
                        </>
                      )}
                    </div>
                    {editingFolder !== folder.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditFolder(folder.id, folder.name)
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFolder(folder.id)
                          }}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Panel */}
          <div className="lg:col-span-2 bg-graphite rounded-xl p-6 border border-electric-cyan/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="text-electric-cyan" size={24} />
                Képek
                {selectedFolder && (
                  <span className="text-white/60 text-lg font-normal">
                    ({images.length})
                  </span>
                )}
              </h2>
              {selectedFolder && (
                <label className="p-2 bg-electric-cyan text-midnight rounded-lg hover:scale-105 transition-transform cursor-pointer">
                  <Upload size={20} />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {!selectedFolder ? (
              <div className="text-center py-12">
                <Folder className="text-white/30 mx-auto mb-4" size={64} />
                <p className="text-white/60">Válassz egy mappát a képek megtekintéséhez</p>
              </div>
            ) : (
              <>
                {/* Upload Queue */}
                {uploadingFiles.length > 0 && (
                  <div className="mb-6 p-4 bg-midnight rounded-lg border border-electric-cyan/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Feltöltésre váró képek:</h3>
                      <button
                        onClick={uploadImages}
                        className="flex items-center gap-2 bg-electric-cyan text-midnight px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                      >
                        <Save size={16} />
                        Feltöltés
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadingFiles.map((file, index) => (
                        <div key={index} className="text-white/70 text-sm truncate">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.name}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-midnight border border-electric-cyan/20"
                    >
                      <Image
                        src={image.path}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                        <button
                          onClick={() => deleteImage(image.name)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {images.length === 0 && (
                  <div className="text-center py-12">
                    <ImageIcon className="text-white/30 mx-auto mb-4" size={64} />
                    <p className="text-white/60">Ebben a mappában még nincsenek képek</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}