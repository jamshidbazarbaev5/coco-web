"use client"

import '../styles/feature.css'
import Image from 'next/image'
import { motion } from "framer-motion"

export default function CompanyFeatures() {
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
            <p className="subtitle">ОСОБЕННОСТИ КОМПАНИИ</p>
            <h2 className="title">We produce a wide range of finished products</h2>
          </div>

          <div className="header-right">
            <p className="description">
              Adipiscing elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco.
            </p>
            <p className="description">
              Adipiscing elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
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
            <h3 className="feature-title">Индивидуальный подход</h3>
            <div className="feature-arrow">→</div>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature2.png" alt="icon1" width={106} height={74} />
            </div>
            <h3 className="feature-title">Быстрая доставка</h3>
            <div className="feature-arrow">→</div>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature3.png" alt="icon1" width={82} height={82} />
            </div>
            <h3 className="feature-title">Широкий ассортимент</h3>
            <div className="feature-arrow">→</div>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon">
              <Image src="/feature4.png" alt="icon1" width={60} height={74} />
            </div>
            <h3 className="feature-title">Гарантия качества</h3>
            <div className="feature-arrow">→</div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

