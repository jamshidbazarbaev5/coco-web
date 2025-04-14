"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import i18n from "../i18/config";

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

interface CollectionImage {
  id: number;
  image: string;
}

interface Collection {
  id: number;
  products_details: ProductDetails[]; // Changed to array
  title_uz: string;
  title_ru: string;
  caption_uz: string;
  caption_ru: string;
  description_uz: string;
  description_ru: string;
  collection_images: CollectionImage[];
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
  product_details?: ProductDetails;
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
  const router = useRouter();
  const [currentCollection, setCurrentCollection] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        console.log('Fetching collections...');
        const response = await fetch('https://coco20.uz/api/v1/collections/crud/collection/?page=1');
        const data: ApiResponse = await response.json();
        console.log('Received collections data:', data);
        
        if (data.results && data.results.length > 0) {
          setCollections(data.results);
          setCurrentCollection(0); // Reset to first collection
          setCurrentImageIndex(0); // Reset image index
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const getCurrentImage = () => {
    if (collections.length === 0 || currentCollection < 0 || currentCollection >= collections.length) {
      return fallbackSlides[0].image;
    }

    const collection = collections[currentCollection];
    if (!collection || !collection.collection_images.length) {
      return fallbackSlides[0].image;
    }

    const imageIndex = Math.min(currentImageIndex, collection.collection_images.length - 1);
    return collection.collection_images[imageIndex].image;
  };

  const nextSlide = () => {
    if (isAnimating || collections.length === 0) return;
    
    setIsAnimating(true);
    const maxCollectionIndex = collections.length - 1;
    const currentCollectionImages = collections[currentCollection]?.collection_images || [];
    
    if (currentImageIndex < currentCollectionImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
      setCurrentCollection(prev => (prev >= maxCollectionIndex ? 0 : prev + 1));
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || collections.length === 0) return;
    
    setIsAnimating(true);
    const currentCollectionImages = collections[currentCollection]?.collection_images || [];
    
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      const prevCollectionIndex = currentCollection - 1 < 0 ? collections.length - 1 : currentCollection - 1;
      setCurrentCollection(prevCollectionIndex);
      const prevCollectionImages = collections[prevCollectionIndex]?.collection_images || [];
      setCurrentImageIndex(prevCollectionImages.length - 1);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (collections.length === 0) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [collections.length, currentCollection, currentImageIndex]);

  const handleDetailsClick = () => {
    const currentSlideData = collections[currentCollection];
    console.log('Current slide data:', currentSlideData);
    console.log('Current language:', i18n.language);
    
    if (currentSlideData?.products_details?.[0]?.id) {
      const url = `/${i18n.language}/details/${currentSlideData.products_details[0].id}`;
      console.log('Navigating to:', url);
      try {
        router.push(url);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.warn('No product details available for this slide');
    }
  };

  if (isLoading) {
    return <div className="hero loading">Loading...</div>;
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-content-top">
          <h2 className="collection-label">
            {collections[currentCollection]?.[i18n.language === 'uz' ? 'title_uz' : 'title_ru']}
          </h2>
          <h1 className="collection-title">
            {collections[currentCollection]?.[i18n.language === 'uz' ? 'caption_uz' : 'caption_ru']}
          </h1>
        </div>
        
        <div className="hero-content-bottom">
          <div className="collection-description">
            <p>{collections[currentCollection]?.[i18n.language === 'uz' ? 'description_uz' : 'description_ru']}</p>
          </div>
          <button 
            className="details-button" 
            onClick={handleDetailsClick}
            data-product-id={collections[currentCollection]?.products_details?.[0]?.id}
          >
            {i18n.language === 'uz' ? 'Batafsil' : 'Подробнее'}
          </button>
        </div>
      </div>
     
      <div className="hero-image">
        <Image
          src={getCurrentImage()}
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
        {collections.map((collection, index) => (
          <span
            key={index}
            className={`dot ${currentCollection === index ? 'active' : ''}`}
            onClick={() => {
              setCurrentCollection(index);
              setCurrentImageIndex(0);
            }}
          ></span>
        ))}
      </div>
    </section>
  );
}