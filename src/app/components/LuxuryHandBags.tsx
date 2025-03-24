"use client";

import { useState } from "react";
import "../styles/luxury-handbags.css";
import Image from "next/image";
import { Send, MapPin, Phone, AtSign, Instagram, Facebook } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import { useTranslation } from "react-i18next";

export default function LuxuryHandbags() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "+998 ", // Initialize with +998 prefix
    feedback: "",
    consent: false,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/[^\d+]/g, "");

    if (!digits.startsWith("+998")) {
      digits = "+998" + digits.replace(/^\+998/, "");
    }

    let formatted = digits;

    if (digits.length > 4) {
      formatted = `+998 ${digits.slice(4, 6)}`;
      if (digits.length > 6) {
        formatted += ` ${digits.slice(6, 9)}`;
        if (digits.length > 9) {
          formatted += `-${digits.slice(9, 11)}`;
          if (digits.length > 11) {
            formatted += `-${digits.slice(11, 13)}`;
          }
        }
      }
    }

    if (formatted.replace(/[^\d+]/g, "").length <= 13) {
      setFormData((prev) => ({ ...prev, phone_number: formatted }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "phone_number") {
      handlePhoneChange(value);
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      alert(t("form.alerts.consent_required"));
      return;
    }

    const phoneDigits = formData.phone_number.replace(/[^\d+]/g, "");
    if (phoneDigits.length < 13) {
      alert(t("form.alerts.complete_phone"));
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        name: formData.name,
        phone_number: formData.phone_number.replace(/[^\d+]/g, ""),
        feedback: formData.feedback,
      };

      const response = await fetch("https://coco20.uz/api/v1/feedback/crud/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setFormData({
          name: "",
          phone_number: "+998 ",
          feedback: "",
          consent: false,
        });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert(t("form.alerts.error"));
    } finally {
      setIsSubmitting(false);
    }
  };
  const cartConfirmationMessage = {
    uz: "Arizangiz muvaffaqiyatli jo'natildi",
    ru: "Ваша пожелание успешно отправлен!",
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
              style={{ height: "500px" }}
            />
          </div>

          <div className="info-section">
            <h3 className="info-title">{t("beauty_comfort")}</h3>

            <p className="info-text">{t("info_text")}</p>

            <div className="benefits">
              <div className="benefit-item">
                <span className="check-icon">
                  <svg
                    width="15"
                    height="29"
                    viewBox="0 0 15 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_23_1409)">
                      <path
                        d="M5.41276 19.3418C5.27341 19.4811 5.10289 19.5508 4.90119 19.5508C4.6995 19.5508 4.52897 19.4811 4.38962 19.3418L0.308043 15.2492C0.102681 15.0365 0 14.7816 0 14.4846C0 14.1875 0.102681 13.9327 0.308043 13.72L0.825116 13.2029C1.03781 12.9975 1.29268 12.8948 1.58972 12.8948C1.88677 12.8948 2.14164 12.9975 2.35433 13.2029L4.90669 15.7552L11.7937 8.86827C12.0064 8.66291 12.2612 8.56023 12.5583 8.56023C12.8553 8.56023 13.1102 8.66291 13.3229 8.86827L13.84 9.37434C13.9793 9.5137 14.0728 9.67689 14.1205 9.86391C14.1682 10.0509 14.1682 10.238 14.1205 10.425C14.0728 10.612 13.9793 10.7752 13.84 10.9146L5.41276 19.3418Z"
                        fill="#C19A5B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_1409">
                        <rect
                          width="14.17"
                          height="28.02"
                          fill="white"
                          transform="matrix(1 0 0 -1 0 28.0601)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>{t("benefits.exclusive_offers")}</span>
              </div>

              <div className="benefit-item">
                <span className="check-icon">
                  <svg
                    width="15"
                    height="29"
                    viewBox="0 0 15 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_23_1409)">
                      <path
                        d="M5.41276 19.3418C5.27341 19.4811 5.10289 19.5508 4.90119 19.5508C4.6995 19.5508 4.52897 19.4811 4.38962 19.3418L0.308043 15.2492C0.102681 15.0365 0 14.7816 0 14.4846C0 14.1875 0.102681 13.9327 0.308043 13.72L0.825116 13.2029C1.03781 12.9975 1.29268 12.8948 1.58972 12.8948C1.88677 12.8948 2.14164 12.9975 2.35433 13.2029L4.90669 15.7552L11.7937 8.86827C12.0064 8.66291 12.2612 8.56023 12.5583 8.56023C12.8553 8.56023 13.1102 8.66291 13.3229 8.86827L13.84 9.37434C13.9793 9.5137 14.0728 9.67689 14.1205 9.86391C14.1682 10.0509 14.1682 10.238 14.1205 10.425C14.0728 10.612 13.9793 10.7752 13.84 10.9146L5.41276 19.3418Z"
                        fill="#C19A5B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_1409">
                        <rect
                          width="14.17"
                          height="28.02"
                          fill="white"
                          transform="matrix(1 0 0 -1 0 28.0601)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>{t("benefits.expert_tips")}</span>
              </div>

              <div className="benefit-item">
                <span className="check-icon">
                  <svg
                    width="15"
                    height="29"
                    viewBox="0 0 15 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_23_1409)">
                      <path
                        d="M5.41276 19.3418C5.27341 19.4811 5.10289 19.5508 4.90119 19.5508C4.6995 19.5508 4.52897 19.4811 4.38962 19.3418L0.308043 15.2492C0.102681 15.0365 0 14.7816 0 14.4846C0 14.1875 0.102681 13.9327 0.308043 13.72L0.825116 13.2029C1.03781 12.9975 1.29268 12.8948 1.58972 12.8948C1.88677 12.8948 2.14164 12.9975 2.35433 13.2029L4.90669 15.7552L11.7937 8.86827C12.0064 8.66291 12.2612 8.56023 12.5583 8.56023C12.8553 8.56023 13.1102 8.66291 13.3229 8.86827L13.84 9.37434C13.9793 9.5137 14.0728 9.67689 14.1205 9.86391C14.1682 10.0509 14.1682 10.238 14.1205 10.425C14.0728 10.612 13.9793 10.7752 13.84 10.9146L5.41276 19.3418Z"
                        fill="#C19A5B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_1409">
                        <rect
                          width="14.17"
                          height="28.02"
                          fill="white"
                          transform="matrix(1 0 0 -1 0 28.0601)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>{t("benefits.inspiration")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-header">
              <p className="contact-subtitle">{t("contact.contact_us")}</p>
              <h1 className="contact-title">{t("contact.have_questions")}</h1>
              <h2 className="contact-subtitle-large">
                {t("contact.get_in_touch")}
              </h2>
            </div>

            <div className="contact-details">
              <div className="contact-detail-item">
                <MapPin className="contact-icon" size={20} />
                <span>{t("contact.address")}</span>
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
                    placeholder={t("form.name")}
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder={t("form.phone")}
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <textarea
                  name="feedback"
                  placeholder={t("form.feedback")}
                  value={formData.feedback}
                  onChange={handleChange}
                  className="form-input message-input"
                  required
                ></textarea>
              </div>

              <div
                className="form-footer"
                style={{ display: "flex", gap: "15px" }}
              >
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                  <span>
                    {isSubmitting ? t("form.sending") : t("form.send")}
                  </span>
                </button>

                <div className="consent-checkbox">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="consent">{t("form.consent")}</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationModal
           messageUz="Arizangiz muvaffaqiyatli jo'natildi"
           messageRu="Ваша пожелание успешно отправлен!"
          onClose={() => setShowConfirmation(false)}
        />
      )}
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
