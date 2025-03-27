"use client";

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import i18n from "../i18/config"

interface Category {
  id: number
  name_ru: string
  name_uz: string
  image: string | null
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        // First fetch to get total count
        const initialResponse = await fetch('https://coco20.uz/api/v1/brands/crud/category/?page=1&page_size=10')
        const initialData = await initialResponse.json()
        const totalItems = initialData.count
        const pageSize = 10
        const totalPages = Math.ceil(totalItems / pageSize)

        // Fetch all pages
        const promises = Array.from({ length: totalPages }, (_, i) =>
          fetch(`https://coco20.uz/api/v1/brands/crud/category/?page=${i + 1}&page_size=${pageSize}`)
            .then(res => res.json())
        )

        const results = await Promise.all(promises)
        const allCategories = results.flatMap(data => data.results)
        setCategories(allCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllCategories()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  // Helper function to get translated name based on current language
  const getTranslatedName = (category: Category) => {
    return i18n.language === 'uz' ? category.name_uz : category.name_ru
  }

  const handleCategoryClick = (category: Category) => {
    const categoryName = getTranslatedName(category)
    router.push(`/${i18n.language}/categories?category=${encodeURIComponent(categoryName)}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <motion.section 
      className="category-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div 
        className="category-grid"
        variants={containerVariants}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1rem',
          padding: '1rem',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',  // Firefox
          msOverflowStyle: 'none',  // IE/Edge
        }}
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            onClick={() => handleCategoryClick(category)}
            style={{ 
              cursor: 'pointer',
              flex: '0 0 auto',  // Prevent items from shrinking
              width: '158px',    // Match the image width
            }}
          >
            <div className="category-item">
              <div className="category-image">
                <Image 
                  src={category.image || '/default-category-image.jpg'}
                  alt={getTranslatedName(category)} 
                  width={158} 
                  height={210}
                  className="category-img" 
                />
              </div>
              <h3 className="category-name">{getTranslatedName(category)}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

