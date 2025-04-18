"use client"

import { useState, useEffect } from 'react'
import styles from '../styles/contact.module.css'
import { Send } from "lucide-react"
import Image from 'next/image'
import ConfirmationModal from './ConfirmationModal'
import { useTranslation } from 'react-i18next'

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    feedback: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [contactDetails, setContactDetails] = useState<any>(null)

  useEffect(() => {
    setFormData(prev => ({ ...prev, phone_number: '+998 ' }))
    fetchContactDetails()
  }, [])

  const fetchContactDetails = async () => {
    try {
      const response = await fetch('https://coco20.uz/api/v1/contact_detail/crud/')
      const data = await response.json()
      console.log('API Response:', data)
      if (data.results && data.results.length > 0) {
        setContactDetails(data.results[0])
        console.log('Contact Details:', data.results[0])
      }
    } catch (error) {
      console.error('Error fetching contact details:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone_number') {
      handlePhoneChange(value)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
const cartConfirmationMessage = {
  uz: "Arizangiz muvaffaqiyatli jo'natildi",
  ru: "Ваша пожелание успешно отправлен!"
};

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/[^\d+]/g, '')
    
    if (!digits.startsWith('+998')) {
      digits = '+998' + digits.replace(/^\+998/, '')
    }
    
    let formatted = digits
    
    if (digits.length > 4) {
      formatted = `+998 ${digits.slice(4, 6)}`
      
      if (digits.length > 6) {
        formatted += ` ${digits.slice(6, 9)}`
        
        if (digits.length > 9) {
          formatted += `-${digits.slice(9, 11)}`
          
          if (digits.length > 11) {
            formatted += `-${digits.slice(11, 13)}`
          }
        }
      }
    }
    
    if (formatted.replace(/[^\d+]/g, '').length > 13) {
      return
    }
    
    setFormData(prev => ({ ...prev, phone_number: formatted }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsentChecked(e.target.checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!consentChecked) {
      alert('Please agree to the data collection consent')
      return
    }
    
    const phoneDigits = formData.phone_number.replace(/[^\d+]/g, '')
    if (phoneDigits.length < 13) {
      alert('Please enter a complete phone number')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const apiData = {
        ...formData,
        phone_number: formData.phone_number.replace(/[^\d+]/g, '')
      }
      
      const response = await fetch('https://coco20.uz/api/v1/feedback/crud/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })
      
      if (response.ok) {
        setShowConfirmation(true)
        setFormData({ name: '', phone_number: '+998 ', feedback: '' })
        setConsentChecked(false)
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending feedback:', error)
      alert('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.main}>
      {showConfirmation && (
        <ConfirmationModal 
        
          messageUz="Arizangiz muvaffaqiyatli jo'natildi"
          messageRu="Ваша пожелание успешно отправлен!"
        
          onClose={() => setShowConfirmation(false)} 
        />
      )}
      
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <Image src="/logo-3.svg" alt="COCO" width={150} height={150} unoptimized={true} />
          <p className={styles.brandTagline}>
            {t('contact_page.brand_tagline')}
          </p>
        </div>

        <div className={styles.socialSection}>
          <div className={styles.socialLink}>
            <div className={styles.socialIcon}>
              <Send size={18} />
            </div>
            <a 
              href={contactDetails?.social_media_urls?.telegram || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span>{contactDetails?.social_media_urls?.telegram_name || 'Telegram'}</span>
            </a>
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
            <a 
              href={contactDetails?.social_media_urls?.instagram || '#'}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span>{contactDetails?.social_media_urls?.instagram_name || 'Instagram'}</span>
            </a>
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
            <a 
              href={contactDetails?.social_media_urls?.facebook || '#'}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span>{contactDetails?.social_media_urls?.facebook_name || 'Facebook'}</span>
            </a>
          </div>
          
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>{t('contact_page.help_title')}</h2>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input} 
                  placeholder={t('form.name')}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input 
                  type="tel" 
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={styles.input} 
                  placeholder={t('form.phone')}
                  required
                  
                />
                
              </div>
            </div>
            <div className={styles.inputGroup}>
              <textarea 
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                className={styles.textarea} 
                placeholder={t('form.feedback')}
                rows={4}
                required
              ></textarea>
            </div>
            <div className={styles.formFooter}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                <Send size={16} />
                <span>{isSubmitting ? t('form.sending2') : t('form.send2')}</span>
              </button>
              <div className={styles.checkboxGroup}>
                <input 
                  type="checkbox" 
                  id="dataConsent" 
                  checked={consentChecked}
                  onChange={handleCheckboxChange}
                  className={styles.checkbox} 
                  required
                />
                <label htmlFor="dataConsent" className={styles.checkboxLabel}>
                  {t('form.consent')}
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

