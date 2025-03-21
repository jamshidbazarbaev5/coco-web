import React from 'react';
import BrandCard from './BrabdCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import '../styles/BrandShowcases.css';

interface Brand {
    id: number;
    number: string;
    name: string;
    description: string;
    imageUrl: string;
}

const luxuryBrands: Brand[] = [
    {
        id: 1,
        number: '01.',
        name: 'Louis Vuitton',
        description: 'Adipiscing elit sed',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1035&auto=format&fit=crop'
    },
    {
        id: 2,
        number: '02.',
        name: 'Saint Laurent',
        description: 'Adipiscing elit sed',
        imageUrl: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=1374&auto=format&fit=crop'
    },
    {
        id: 3,
        number: '03.',
        name: 'Balenciaga',
        description: 'Adipiscing elit sed',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1374&auto=format&fit=crop'
    },
    {
        id: 4,
        number: '04.',
        name: 'Alexander McQueen',
        description: 'Adipiscing elit sed',
        imageUrl: 'https://images.unsplash.com/photo-1604001307862-2d953b875079?q=80&w=1287&auto=format&fit=crop'
    }
];

const BrandShowcase: React.FC = () => {
    // Add useRef hooks
    const prevRef = React.useRef<HTMLButtonElement>(null);
    const nextRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className="showcase-container">
            <div className="luxury-container">
                <div className="showcase-header">
                    <h2 className="showcase-title">Luxury Collection</h2>
                    <div className="showcase-controls">
                        <button ref={prevRef} className="control-button prev-button" aria-label="Previous brand">
                            <ChevronLeft size={20} />
                        </button>
                        <button ref={nextRef} className="control-button next-button" aria-label="Next brand">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={4}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }
                    }}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    speed={800}
                    effect={'slide'}
                    cssMode={false}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 20
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 24
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24
                        }
                    }}
                >
                    {luxuryBrands.map((brand) => (
                        <SwiperSlide key={brand.id}>
                            <BrandCard
                                number={brand.number}
                                brand={brand.name}
                                description={brand.description}
                                imageUrl={brand.imageUrl}
                                isActive={false}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default BrandShowcase;