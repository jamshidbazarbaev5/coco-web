"use client";

import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import i18n from "../i18/config"
import { useRouter } from "next/navigation"

interface Category {
  id: number
  name_ru: string
  name_uz: string
  image: string | null
}

export default function CategorySection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const initialResponse = await fetch('https://coco20.uz/api/v1/brands/crud/category/?page=1&page_size=10')
        const initialData = await initialResponse.json()
        const totalItems = initialData.count
        const pageSize = 10
        const totalPages = Math.ceil(totalItems / pageSize)

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

  // Enhanced wheel event handler
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      
      e.preventDefault();
      el.scrollLeft += e.deltaY + e.deltaX;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Mouse drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

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

  const getTranslatedName = (category: Category) => {
    return i18n.language === 'uz' ? category.name_uz : category.name_ru
  }

  const handleCategoryClick = (category: Category) => {
    const categoryName = i18n.language === 'uz' ? category.name_uz : category.name_ru;
    router.push(`/${i18n.language}/categories?category=${encodeURIComponent(categoryName)}`);
  };

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
        ref={scrollRef}
        className="category-grid"
        variants={containerVariants}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          gap: '1rem',
          padding: '1rem',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            style={{ 
              flex: '0 0 auto',
              width: '158px',
              scrollSnapAlign: 'start',
              cursor: 'pointer',
            }}
            onClick={() => handleCategoryClick(category)}
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

      <style jsx>{`
        .category-item {
          transition: transform 0.2s ease;
        }
        
        .category-item:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </motion.section>
  )
}

