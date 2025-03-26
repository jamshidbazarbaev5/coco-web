"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductAttribute {
  color: string;
  image: string;
  sizes: any[];
}

interface ProductDetails {
  id: number;
  brand: number;
  category: number;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  description_ru: string;
  material: number;
  price: string;
  quantity: number;
  product_attributes: ProductAttribute[];
  on_sale: boolean;
}

interface Collection {
  id: number;
  product_details: ProductDetails;
  title_uz: string;
  title_ru: string;
  caption_uz: string;
  caption_ru: string;
  description_uz: string;
  description_ru: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Collection[];
}

interface Slide {
  label: string;
  title: string;
  description: string[];
  image: string;
}

// Keeping the fallback slides in case API fails
const fallbackSlides: Slide[] = [
  {
    label: "Новая коллекция",
    title: "\"Весна-Лето\"",
    description: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    image: "/main-image.png"
  },
  {
    label: "Новая коллекция",
    title: "\"Весна-Лето\"",
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
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('https://coco20.uz/api/v1/collections/crud/collection/?page=1');
        const data: ApiResponse = await response.json();
        
        if (data.results && data.results.length > 0) {
          const apiSlides = data.results.map(collection => ({
            label: collection.title_ru,
            title: `"${collection.caption_ru}"`,
            description: [collection.description_ru], // Converting to array as our component expects string[]
            image: collection.product_details.product_attributes[0]?.image || "/main-image.png"
          }));
          
          setSlides(apiSlides);
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        // Fallback to hardcoded slides
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
    const timer = setInterval(nextSlide, 5000); 
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <div className="hero loading">Loading...</div>;
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-content-top">
          <h2 className="collection-label">{slides[currentSlide]?.label}</h2>
          <h1 className="collection-title">{slides[currentSlide]?.title}</h1>
        </div>
        
        <div className="hero-content-bottom">
          <div className="collection-description">
            {slides[currentSlide]?.description.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          <button className="details-button">Подробнее</button>
        </div>
      </div>
     
      <div className="hero-image">
        <Image
          src={slides[currentSlide]?.image}
          alt="Collection image"
          fill
          priority
          unoptimized={true}
          className={`hero-img ${isAnimating ? 'sliding' : ''}`}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
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