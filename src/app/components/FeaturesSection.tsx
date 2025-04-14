"use client"

import '../styles/feature.css'
import Image from 'next/image'
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function CompanyFeatures() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentLang = i18n.language

  useEffect(() => {
    fetch('https://coco20.uz/api/v1/abouts/crud/profile/?page=1&page_size=10')
      .then(res => res.json())
      .then(data => {
        setData(data.results[0])
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!data) return null

  return (
    <motion.div 
      className="features-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="features-content">
        <motion.div 
          className="features-header"
          variants={fadeInUp}
        >
          <div className="header-left">
            <p className="subtitle">{data[`title_${currentLang}`]}</p>
            <h2 className="title">{data[`description_${currentLang}`]}</h2>
          </div>

          <div className="header-right">
            <p className="description">{data[`subtitles_${currentLang}`].subtitle_1}</p>
            <p className="description">{data[`subtitles_${currentLang}`].subtitle_2}</p>
          </div>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={staggerContainer}
        >
          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature1.png" alt="icon1" width={106} height={74} />
            </div>
            <h3 className="feature-title">{t('features.individual_approach')}</h3>
            <div className="feature-arrow">→</div>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature2.png" alt="icon2" width={106} height={74} />
            </div>
            <h3 className="feature-title">{t('features.fast_delivery')}</h3>
            <div className="feature-arrow">→</div>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature3.png" alt="icon3" width={82} height={82} />
            </div>
            <h3 className="feature-title">{t('features.wide_assortment')}</h3>
            <div className="feature-arrow">→</div>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature4.png" alt="icon4" width={60} height={74} />
            </div>
            <h3 className="feature-title">{t('features.quality_guarantee')}</h3>
            <div className="feature-arrow">→</div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

