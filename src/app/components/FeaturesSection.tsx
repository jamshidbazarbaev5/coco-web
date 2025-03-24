"use client"

import '../styles/feature.css'
import Image from 'next/image'
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'

export default function CompanyFeatures() {
  const { t } = useTranslation()

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
            <p className="subtitle">{t('features.company_features')}</p>
            <h2 className="title">{t('features.wide_range')}</h2>
          </div>

          <div className="header-right">
            <p className="description">{t('features.description1')}</p>
            <p className="description">{t('features.description2')}</p>
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

