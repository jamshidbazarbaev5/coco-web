"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  label: string;
  title: string;
  description: string[];
  image: string;
}

const slides: Slide[] = [
  {
    label: "Новая коллекция",
    title: "\"Весна-Лето\"",
    description: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    image: "/main-image.png"
  },
  {
    label: "Специальное предложение",
    title: "\"Осень 2024\"",
    description: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
   image: "/main-image.png"
  },
  {
    label: "Эксклюзивная серия",
    title: "\"Premium\"",
    description: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    image: "/main-image.png"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-content-top">
          <h2 className="collection-label">{slides[currentSlide].label}</h2>
          <h1 className="collection-title">{slides[currentSlide].title}</h1>
        </div>
        
        <div className="hero-content-bottom">
          <div className="collection-description">
            {slides[currentSlide].description.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          <button className="details-button">Подробнее</button>
        </div>
      </div>
     
      <div className="hero-image">
        <Image
          src={slides[currentSlide].image}
          alt="Collection image"
          width={1200}
          height={800}
          priority
          className={isAnimating ? 'sliding' : ''}
        />
      </div>

      <button className="nav-arrow prev" onClick={prevSlide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button className="nav-arrow next" onClick={nextSlide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className="slide-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}