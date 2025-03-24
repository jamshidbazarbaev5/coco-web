import Image from "next/image"
import styles from  '../styles/feature.module.css'
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className={styles.main}>
      <section className={styles.newArrivalsSection}>
        <motion.div 
          className={styles.imageContainer}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className={styles.backpackImage}>
            <Image
              src="/feature-1.jpeg"
              alt="Black backpack with brown leather accents"
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 425px, 33vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.handbagImage}>
            <Image
              src="/feature-2.jpeg"
              alt="Collection of luxury handbags"
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 425px, 33vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </motion.div>

        <motion.div 
          className={styles.contentContainer}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('beauty_comfort')}
          </motion.span>
          <h2 className={styles.heading}>{t('features.company_features')}</h2>
          <p className={styles.description}>
            {t('features.wide_range')}
          </p>

          <motion.ul 
            className={styles.featuresList}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              t('benefits.exclusive_offers'),
              t('benefits.expert_tips'),
              t('benefits.inspiration')
            ].map((feature, index) => (
              <motion.li 
                key={index}
                className={styles.featureItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                viewport={{ once: true }}
              >
                <span className={styles.checkmark}>✓</span>
                {feature}
              </motion.li>
            ))}
          </motion.ul>

          <motion.button 
            className={styles.ctaButton}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            viewport={{ once: true }}
          >
            {t('contact.get_in_touch')}
          </motion.button>
        </motion.div>
      </section>
    </main>
  )
}

