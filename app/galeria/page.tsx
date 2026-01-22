'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, Facebook, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
}

interface Category {
  id: string
  name: string
  folder: string
  imageCount: number
  images: Array<{
    name: string
    src: string
    alt: string
  }>
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      
      // Get folders directly from gallery-folders-v2 for real-time updates
      const foldersEndpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/gallery-folders-v2'
        : '/api/gallery/folders'
        
      const foldersResponse = await fetch(foldersEndpoint)
      const folders = await foldersResponse.json()
      
      // Load images for each folder
      const categoriesWithImages = await Promise.all(folders.map(async (folder: any) => {
        try {
          const imagesEndpoint = process.env.NODE_ENV === 'production'
            ? `/.netlify/functions/supabase-images?folder=${folder.id}`
            : `/api/gallery/folders/${folder.id}/images`
          
          const imagesResponse = await fetch(imagesEndpoint)
          const images = await imagesResponse.json()
          
          return {
            ...folder,
            images: images.map((img: any) => ({
              name: img.name,
              src: img.path || img.src,
              alt: `${folder.name} - ${img.name}`
            }))
          }
        } catch (error) {
          console.error(`Error loading images for folder ${folder.id}:`, error)
          return {
            ...folder,
            images: []
          }
        }
      }))
      
      // Add "All" category at the beginning
      const allCategories = [
        { id: 'all', name: 'Összes', folder: '', imageCount: 0, images: [] },
        ...categoriesWithImages
      ]
      
      setCategories(allCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
    setLoading(false)
  }

  const generateImages = useCallback(() => {
    const allImages: GalleryImage[] = []
    
    categories.forEach(category => {
      if (category.images && category.images.length > 0) {
        category.images.forEach((image, index) => {
          allImages.push({
            id: `${category.id}-${index}`,
            src: image.src,
            alt: image.alt,
            category: category.id
          })
        })
      }
    })
    
    return allImages
  }, [categories])

  const images = generateImages()
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc)
    setCurrentImageIndex(filteredImages.findIndex(img => img.src === imageSrc))
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const goToPrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1
    setCurrentImageIndex(newIndex)
    setLightboxImage(filteredImages[newIndex].src)
  }

  const goToNext = () => {
    const newIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0
    setCurrentImageIndex(newIndex)
    setLightboxImage(filteredImages[newIndex].src)
  }

  const upcomingFeatures = [
    'Új villamos hálózat kiépítések',
    'LED világítási projektek',
    'Elosztó & biztosítéktábla cserék',
    'Korszerűsítések előtte-utána',
  ]

  return (
    <>
      <div className="bg-midnight min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Referencia Munkák
            </h1>
            <p className="text-white/70 text-lg">
              Elvégzett projektjeink galériája 
            </p>
          </motion.div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-electric-cyan text-midnight'
                        : 'bg-graphite text-white hover:bg-graphite/80 border border-electric-cyan/20 hover:border-electric-cyan/50'
                    }`}
                  >
                    {category.name} {category.id !== 'all' && category.imageCount > 0 && `(${category.imageCount})`}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-electric-cyan text-xl">Betöltés...</div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-graphite to-midnight border border-electric-cyan/20 hover:border-electric-cyan/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => openLightbox(image.src)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="text-white/30 mx-auto mb-4" size={64} />
              <p className="text-white/60 text-lg">Még nincsenek feltöltött képek</p>
            </div>
          )}

        {filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-graphite rounded-xl p-8 lg:p-12 border border-electric-cyan/20 mb-12"
          >
            <div className="text-5xl mb-4">💡</div>
            <h2 className="text-3xl font-bold text-white mb-4">Érdekel a munkám? Kérj árajánlatot bátran!</h2>
            <p className="text-white/80 mb-4 leading-relaxed text-lg">
              Referencia galériám feltöltése folyamatban van, a legfrissebb projektjeim fotói hamarosan itt is megtekinthetők lesznek.
            </p>
            <p className="text-white/80 mb-4 leading-relaxed">
              Addig is szeretettel várlak a Facebook oldalamon, ahol folyamatosan osztok meg képeket az elkészült munkákról.
            </p>
            <p className="text-white/80 mb-6 leading-relaxed font-medium">
              Ha tetszik a munkám és szeretnél egy megbízható szakembert, hívj bizalommal vagy kérj árajánlatot!
            </p>
            <p className="text-electric-cyan mb-8 font-medium">
              👉 További képek és elérhetőség a Facebook oldalon.
            </p>

            <a
              href="https://www.facebook.com/zimberelectric"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-electric-cyan text-midnight font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              <Facebook size={20} />
              Facebook Oldal
            </a>
          </motion.div>
        )}

      </div>
    </div>

    {/* Lightbox Modal */}
    {lightboxImage && (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-midnight/80 rounded-full text-white hover:bg-midnight transition-colors"
          >
            <X size={24} />
          </button>
          
          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-midnight/80 rounded-full text-white hover:bg-midnight transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-midnight/80 rounded-full text-white hover:bg-midnight transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Image */}
          <div className="relative max-w-7xl max-h-full w-full h-full">
            <Image
              src={lightboxImage}
              alt={`Galéria kép ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-midnight/80 px-4 py-2 rounded-full text-white">
            {currentImageIndex + 1} / {filteredImages.length}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
