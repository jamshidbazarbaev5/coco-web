"use client";

import { useState } from "react";
import "../styles/luxury-handbags.css";
import Image from "next/image";
import { Send, MapPin, Phone, AtSign, Instagram, Facebook } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

export default function LuxuryHandbags() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    consent: false,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <div className="container">
        <div className="content-wrapper">
          <div className="image-section">
            <Image
              src="/image.png"
              alt="Luxury handbags collection with white, brown and gray bags arranged among tropical plants"
              className="main-image"
              width={802}
              height={206}
              style={{height:"500px"}}
            />
          </div>

          <div className="info-section">
            <h3 className="info-title">BEAUTY & COMFORT</h3>

            <p className="info-text">
              Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
              aspernatur aut odit aut fugi.
            </p>

            <div className="benefits">
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Exclusive Offers and discounts</span>
              </div>

              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Tips and advice from our experts</span>
              </div>

              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Beautiful inspiration for your new home</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-header">
              <p className="contact-subtitle">СВЯЖИТЕСЬ С НАМИ</p>
              <h1 className="contact-title">Have questions?</h1>
              <h2 className="contact-subtitle-large">Get in touch</h2>
            </div>

            <div className="contact-details">
              <div className="contact-detail-item">
                <MapPin className="contact-icon" size={20} />
                <span>2972 Westheimer Rd, Santa Ana, Illinois 85486</span>
              </div>

              <div className="contact-detail-item">
                <Phone className="contact-icon" size={20} />
                <span>+998 90 909-90-90</span>
              </div>

              <div className="contact-detail-item">
                <AtSign className="contact-icon" size={20} />
                <span>@cocobags.uz</span>
              </div>

              <div className="contact-detail-item">
                <Instagram className="contact-icon" size={20} />
                <span>@cocobags.uz</span>
              </div>

              <div className="contact-detail-item">
                <Facebook className="contact-icon" size={20} />
                <span>@cocobags.uz</span>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Ваше предложение/пожелание"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input message-input"
                ></textarea>
              </div>

              <div className="form-footer" style={{display:"flex" ,gap:"15px"}}>
                <button type="submit" className="submit-button">
                  <Send size={16} />
                  <span>Отправить</span>
                </button>

                <div className="consent-checkbox">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                  />
                  <label htmlFor="consent">
                    I agree that my data is <a href="#">collected and stored</a>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showConfirmation && <ConfirmationModal />} 
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9931.956214047315!2d-0.12775!3d51.507222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ce3941eb1f%3A0x1a5342fdf089c627!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1647881760889!5m2!1sen!2sus"
          width="100%"
          height="600"
          style={{ border: 0, marginBottom: "120px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
}
