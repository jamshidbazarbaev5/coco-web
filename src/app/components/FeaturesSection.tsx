"use client"

import '../styles/feature.css'
import Image from 'next/image'

export default function CompanyFeatures() {
  return (
    <div className="features-container">
      <div className="features-content">
        <div className="features-header">
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
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
             <Image src="/feature1.png" alt="icon1" width={106} height={74} />
            </div>
            <h3 className="feature-title">Индивидуальный подход</h3>
            <div className="feature-arrow">→</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
            <Image src="/feature2.png" alt="icon1" width={106} height={74} />
            </div>
            <h3 className="feature-title">Быстрая доставка</h3>
            <div className="feature-arrow">→</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
            <Image src="/feature3.png" alt="icon1" width={82} height={82} />
            </div>
            <h3 className="feature-title">Широкий ассортимент</h3>
            <div className="feature-arrow">→</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
            <Image src="/feature4.png" alt="icon1" width={60} height={74} />
            </div>
            <h3 className="feature-title">Гарантия качества</h3>
            <div className="feature-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  )
}

