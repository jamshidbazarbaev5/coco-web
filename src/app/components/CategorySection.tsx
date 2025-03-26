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
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://coco20.uz/api/v1/brands/crud/category/?page=1&page_size=10')
        const data = await response.json()
        setCategories(data.results)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
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
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-item">
              <div className="category-image">
                <Image 
                  src={`/cart-${(category.id % 4) + 1}.jpg`}
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

