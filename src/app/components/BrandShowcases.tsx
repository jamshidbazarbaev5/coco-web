"use client";
import { useState, useEffect, useRef, TouchEvent } from "react";
import styles from "../styles/BrandSlider.module.css";
const slides = [
  {
    id: "01",
    brand: "Louis Vuitton",
    description: "Adipiscing elit sed",
    image: "/cart-3.jpg",
  },
  {
    id: "02",
    brand: "Saint Laurent",
    description: "Adipiscing elit sed",
    image: "/cart-1.jpg",
  },
  {
    id: "03",
    brand: "Balenciaga",
    description: "Adipiscing elit sed",
    image: "/cart-2.jpg",
  },
  {
    id: "04",
    brand: "Alexander McQueen",
    description: "Adipiscing elit sed",
    image: "/cart-4.jpg",
  },
];

export default function BrandSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Create an extended array of slides for infinite effect
  const extendedSlides = [...slides, ...slides, ...slides];

  // Updated getSlideWidth function
  const getSlideWidth = () => {
    if (typeof window === 'undefined') return 25;
    const width = window.innerWidth;
    if (width <= 768) return 100;
    if (width <= 1200) return 50;
    return 25;
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= slides.length) {
      setCurrentIndex(currentIndex % slides.length);
    } else if (currentIndex < 0) {
      setCurrentIndex(slides.length - 1);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      const slideWidth = getSlideWidth();
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  // Updated touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    setIsTransitioning(false); // Disable transition during touch
    setTouchStart(e.touches[0].clientX);
    setTouchMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while swiping
    setTouchMove(e.touches[0].clientX);
    
    if (sliderRef.current && touchStart !== null) {
      const diff = touchStart - e.touches[0].clientX;
      const slideWidth = getSlideWidth();
      const move = (diff / window.innerWidth) * 100; // Use percentage based on screen width
      sliderRef.current.style.transform = `translateX(${-(currentIndex * slideWidth + move)}%)`;
    }
  };

  const handleTouchEnd = () => {
    if (touchStart !== null && touchMove !== null) {
      const diff = touchStart - touchMove;
      const threshold = window.innerWidth * 0.2; // Increased threshold to 20% for better detection

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        // Reset to current slide if threshold not met
        if (sliderRef.current) {
          const slideWidth = getSlideWidth();
          sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        }
      }
    }
    
    setIsTransitioning(true); // Re-enable transition
    setTouchStart(null);
    setTouchMove(null);
  };

  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!touchStart) { // Don't auto-advance while touching
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [touchStart]);

  // Calculate slider position
  const getSliderStyle = () => {
    const slideWidth = getSlideWidth();
    const baseTransform = -(currentIndex * slideWidth);
    return {
      transform: `translateX(${baseTransform}%)`,
      transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    };
  };

  return (
    <div className={styles.sliderContainer}>
      <div 
        ref={sliderRef}
        className={styles.slider} 
        style={getSliderStyle()}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {extendedSlides.map((slide, index) => (
          <div 
            key={`${slide.id}-${index}`} 
            className={styles.slide}
          >
            <div className={styles.slideContent}>
              <span className={styles.slideNumber}>{slide.id}.</span>
              <div className={styles.slideInfo}>
                <h2 className={styles.brandName}>{slide.brand}</h2>
                <p className={styles.description}>{slide.description}</p>
              </div>
            </div>
            <img
              src={slide.image}
              alt={slide.brand}
              className={styles.slideImage}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Hide navigation buttons on mobile */}
      <div className={styles.navigationButtons}>
       
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.7">
              <path
                d="M8.64035 26.9999C8.64035 16.8479 16.8484 8.63989 27.0004 8.63989C37.1524 8.63989 45.3604 16.8479 45.3604 26.9999C45.3604 37.1519 37.1524 45.3599 27.0004 45.3599C16.8484 45.3599 8.64035 37.1519 8.64035 26.9999ZM43.2004 26.9999C43.2004 18.0359 35.9644 10.7999 27.0004 10.7999C18.0364 10.7999 10.8004 18.0359 10.8004 26.9999C10.8004 35.9639 18.0364 43.1999 27.0004 43.1999C35.9644 43.1999 43.2004 35.9639 43.2004 26.9999Z"
                fill="white"
              />
              <path
                d="M25.1643 35.9639L34.1283 26.9999L25.1643 18.0359L26.6763 16.5239L37.1523 26.9999L26.6763 37.4759L25.1643 35.9639Z"
                fill="white"
              />
              <path
                d="M35.6396 25.9199V28.0799H17.2796V25.9199H35.6396Z"
                fill="white"
              />
            </g>
          </svg>
        </button>
      </div>

      <div className={styles.pagination}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.paginationDot} ${
              currentIndex % slides.length === index ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
