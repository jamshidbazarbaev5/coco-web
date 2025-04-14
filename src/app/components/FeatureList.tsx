import Image from "next/image"
import styles from '../styles/feature.module.css'
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const currentLang = i18n.language
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://coco20.uz/api/v1/abouts/crud/service/?page=1&page_size=10')
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

  const handleGetInTouch = () => {
    router.push(`/${i18n.language}/about#contact-form`)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!data) return null

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
              src={data.image_first}
              alt="Feature image 1"
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 425px, 33vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.handbagImage}>
            <Image
              src={data.image_second}
              alt="Feature image 2"
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
            {data[`title_${currentLang}`]}
          </motion.span>
          <h2 className={styles.heading}>{data[`subtitles_${currentLang}`].subtitle_1}</h2>
          <p className={styles.description}>
            {data[`subtitles_${currentLang}`].subtitle_2}
          </p>

          <motion.ul 
            className={styles.featuresList}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              data[`services_${currentLang}`].service_1,
              data[`services_${currentLang}`].service_2,
              data[`services_${currentLang}`].service_3
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
            onClick={handleGetInTouch}
          >
            {t('contact.get_in_touch')}
          </motion.button>
        </motion.div>
      </section>
    </main>
  )
}

