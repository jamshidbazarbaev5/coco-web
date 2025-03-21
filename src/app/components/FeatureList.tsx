import Image from "next/image"
import styles from  '../styles/feature.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.newArrivalsSection}>
        <div className={styles.imageContainer}>
          <div className={styles.backpackImage}>
            <Image
              src="/feature-1.jpeg"
              alt="Black backpack with brown leather accents"
              width={425}
              height={700}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.handbagImage}>
            <Image
              src="/feature-2.jpeg"
              alt="Collection of luxury handbags"
              width={425}
              height={700}
              style={{ objectFit: "cover", border: "2px solid #0066cc" }}
            />
          </div>
        </div>

        <div className={styles.contentContainer}>
          <span className={styles.subtitle}>BEAUTY & COMFORT</span>
          <h2 className={styles.heading}>New Arrivals</h2>
          <p className={styles.description}>
            Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
          </p>

          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              Exclusive Offers and discounts
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              Tips and advice from our experts
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              Beautiful inspiration for your new home
            </li>
          </ul>

          <button className={styles.ctaButton}>Find Out More</button>
        </div>
      </section>
    </main>
  )
}

