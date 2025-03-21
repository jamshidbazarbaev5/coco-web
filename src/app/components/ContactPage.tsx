import styles from '../styles/contact.module.css'
import { Send } from "lucide-react"
import Image from 'next/image'
export default function ContactPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
         <Image src="/coco.png" alt="COCO" width={112} height={27} unoptimized={true} />
          <p className={styles.brandTagline}>
            We develop & create
            <br />
            modern bags
          </p>
        </div>

        <div className={styles.socialSection}>
          <div className={styles.socialLink}>
            <div className={styles.socialIcon}>
              <Send size={18} />
            </div>
            <span>@coco.uz</span>
          </div>
          <div className={styles.socialLink}>
            <div className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span>@coco.uz</span>
          </div>
          <div className={styles.socialLink}>
            <div className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span>@coco.uz</span>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Чем мы можем вам помочь?</h2>
          <form className={styles.contactForm}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <input type="text" className={styles.input} placeholder="Имя" />
              </div>
              <div className={styles.inputGroup}>
                <input type="tel" className={styles.input} placeholder="Телефон" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <textarea className={styles.textarea} placeholder="Ваше предложение/пожелание" rows={4}></textarea>
            </div>
            <div className={styles.formFooter}>
              <button type="submit" className={styles.submitButton}>
                <Send size={16} />
                <span>Отправить</span>
              </button>
              <div className={styles.checkboxGroup}>
                <input type="checkbox" id="dataConsent" className={styles.checkbox} />
                <label htmlFor="dataConsent" className={styles.checkboxLabel}>
                  I agree that my data is collected and stored
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

