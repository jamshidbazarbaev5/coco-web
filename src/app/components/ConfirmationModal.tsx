"use client"

import { useState, useEffect } from "react"
import '../styles/confirm.css'

interface ConfirmationModalProps {
  message?: string;
  onClose?: () => void;
}

export default function ConfirmationModal({ message = "Товар добавлен в корзину!", onClose }: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.();
    }, 300)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      closeModal()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="modal-overlay">
      <div className={`confirmation-modal ${isClosing ? "closing" : ""}`}>
        <button className="close-button" onClick={closeModal}>
          ✕
        </button>

        <h2 className="confirmation-title">{message}</h2>

        <div className="confirmation-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="39" stroke="#C19A6B" strokeWidth="2" />
            <path
              d="M25 40L35 50L55 30"
              stroke="#C19A6B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

