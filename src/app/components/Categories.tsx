"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FilterModal from "./filter-modal";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import i18n from "../i18/config";

// Define interfaces for your data structures
interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  availability: string;
  image: string;
  on_sale: boolean;
  new_price: number;
}

// Add a new interface for cart items
interface CartItem {
  product: number;
  quantity: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

export default function CatalogPage() {
  // Add state for brands
  const [brands, setBrands] = useState<{id: number, name: string}[]>([]);
  const [activeFilter, setActiveFilter] = useState("Все");

  // Add state for filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Add state for API data with proper typing
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  
  // Add translation based on current language
  const getTranslatedTitle = (product: any) => {
    return i18n.language === 'uz' ? product.title_uz : product.title_ru;
  };

  const getTranslatedDescription = (product: any) => {
    return i18n.language === 'uz' ? product.description_uz : product.description_ru;
  };

  // Modify the catalog title based on language
  const getCatalogTitle = () => {
    return i18n.language === 'uz' ? "Bizning katalog" : "Наш каталог";
  };

  // Modify the availability text based on language
  const getAvailabilityText = (quantity: number) => {
    if (i18n.language === 'uz') {
      return quantity > 0 ? `Mavjud: ${quantity}` : "Buyurtma asosida";
    }
    return quantity > 0 ? `В наличии: ${quantity}` : "На заказ";
  };

  // Modify the "All" filter text based on language
  const getAllFilterText = () => {
    return i18n.language === 'uz' ? "Hammasi" : "Все";
  };

  // Add translation helper for category names
  const getTranslatedCategoryName = (category: any) => {
    return i18n.language === 'uz' ? category.name_uz : category.name_ru;
  };
  // Add this helper function at the top level of your component
const formatPrice = (price: string | number) => {
  // Remove any non-digit characters and convert to string
  const numStr = price.toString().replace(/\D/g, '');
  
  // Split into groups of 3 from the right and join with spaces
  const formattedNum = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Return formatted price with 'uzs' suffix
  return `${formattedNum} uzs`;
};

  // Modify useEffect to fetch brands as well
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const brandsResponse = await fetch('https://coco20.uz/api/v1/brands/crud/brand/');
        const brandsData = await brandsResponse.json();
        
        // Add "All" as the first option with translation
        const formattedBrands = [
          { id: 0, name: getAllFilterText() },
          ...brandsData.results
        ];
        
        setBrands(formattedBrands);
        setActiveFilter(getAllFilterText());

        // Fetch categories
        const categoriesResponse = await fetch('https://coco20.uz/api/v1/brands/crud/category/?page=1');
        const categoriesData = await categoriesResponse.json();
        
        // Fetch products
        const productsResponse = await fetch('https://coco20.uz/api/v1/products/crud/product/');
        const productsData = await productsResponse.json();
        
        // Transform categories data with translations
        const formattedCategories: Category[] = categoriesData.results.map((category: any, index: number) => ({
          id: index + 1,
          name: getTranslatedCategoryName(category),
          image: "/cart-" + ((index % 4) + 1) + ".jpg",
        }));
        
        // Transform products data with translations
        const formattedProducts: Product[] = productsData.results.map((product: any) => ({
          id: product.id,
          brand: product.brand === 1 ? "Apple" : "Gucci",
          name: getTranslatedTitle(product),
          price: formatPrice(product.price),
          availability: getAvailabilityText(product.quantity),
          image: product.product_attributes[0]?.image || "/placeholder.svg",
          on_sale: product.on_sale,
          new_price: product.new_price
        }));
        
        setCategories(formattedCategories);
        setProducts(formattedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [i18n.language]); 
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddToCart = (product: Product) => {
    // Create a cart item from the product
    const cartItem: CartItem = {
      product: product.id,
      quantity: 1,
      name: product.brand,
      description: product.name,
      price: product.price,
      stock: parseInt(product.availability.match(/\d+/) ? product.availability.match(/\d+/)?.[0] || "0" : "0"),
      image: product.image
    };
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: CartItem) => item.product === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/${i18n.language}/details/${productId}`);
  };

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">{getCatalogTitle()}</h1>

      {/* Updated Brand filters */}
      <div className="brand-filters">
        {brands.map((brand) => (
          <button
            key={brand.id}
            className={`brand-filter ${activeFilter === brand.name ? "active" : ""}`}
            onClick={() => setActiveFilter(brand.name)}
          >
            {brand.name}
          </button>
        ))}
        <button
          className="filter-button"
          onClick={() => setShowFilterModal(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7H21M6 12H18M10 17H14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Add Filter Modal */}
      {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} />}

      {/* Categories */}
      <div className="categories-container">
        {categories.map((category) => (
          <div className="category-item" key={category.id}>
            <div className="category-image-container">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={150}
                height={150}
                className="category-image"
              />
            </div>
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Products grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div 
            className="product-card" 
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-image-container">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="product-image"
              />
              <button 
                className="cart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.8337 19.0002C19.4525 19.0002 20.046 19.246 20.4836 19.6836C20.9212 20.1212 21.167 20.7147 21.167 21.3335C21.167 21.9523 20.9212 22.5458 20.4836 22.9834C20.046 23.421 19.4525 23.6668 18.8337 23.6668C18.2148 23.6668 17.6213 23.421 17.1837 22.9834C16.7462 22.5458 16.5003 21.9523 16.5003 21.3335C16.5003 20.0385 17.5387 19.0002 18.8337 19.0002ZM0.166992 0.333496H3.98199L5.07866 2.66683H22.3337C22.6431 2.66683 22.9398 2.78975 23.1586 3.00854C23.3774 3.22733 23.5003 3.52408 23.5003 3.8335C23.5003 4.03183 23.442 4.23016 23.3603 4.41683L19.1837 11.9652C18.787 12.6768 18.017 13.1668 17.142 13.1668H8.45033L7.40032 15.0685L7.36533 15.2085C7.36533 15.2859 7.39605 15.36 7.45075 15.4147C7.50545 15.4694 7.57964 15.5002 7.65699 15.5002H21.167V17.8335H7.16699C6.54815 17.8335 5.95466 17.5877 5.51708 17.1501C5.07949 16.7125 4.83366 16.119 4.83366 15.5002C4.83366 15.0918 4.93866 14.7068 5.11366 14.3802L6.70033 11.5218L2.50033 2.66683H0.166992V0.333496ZM7.16699 19.0002C7.78583 19.0002 8.37932 19.246 8.81691 19.6836C9.25449 20.1212 9.50033 20.7147 9.50033 21.3335C9.50033 21.9523 9.25449 22.5458 8.81691 22.9834C8.37932 23.421 7.78583 23.6668 7.16699 23.6668C6.54815 23.6668 5.95466 23.421 5.51708 22.9834C5.07949 22.5458 4.83366 21.9523 4.83366 21.3335C4.83366 20.0385 5.87199 19.0002 7.16699 19.0002ZM17.667 10.8335L20.9103 5.00016H6.16366L8.91699 10.8335H17.667Z"
                    fill="#18191A"
                  />
                </svg>
              </button>
            </div>
            <div className="product-details">
              <h3 className="product-brand">{product.brand}</h3>
              <p className="product-name">{product.name}</p>
              <p className="product-price">{product.price}</p>
              <p className="product-availability">{product.availability}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal 
        messageRu="Товар успешно добавлен в корзину"
        messageUz="Mahsulot muvaffaqiyatli savatga qo'shildi"
          onClose={() => setShowConfirmation(false)}
        />
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
         font-family: var(--font-plus-jakarta);
        }

        body {
          background-color: #f8f8f6;
        }

        .catalog-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .catalog-title {
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 30px;
          color: #000;
        }

        /* Brand filters */
        .brand-filters {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }

        .brand-filters::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }

        .brand-filter {
          background: none;
          border: none;
          padding: 8px 16px;
          margin-right: 10px;
          font-size: 14px;
          cursor: pointer;
          color: #666;
          white-space: nowrap;
        }

        .brand-filter.active {
          color: #000;
          border-bottom: 2px solid #000;
        }

        .filter-button {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Categories */
        .categories-container {
          display: flex;
          overflow-x: auto;
          gap: 15px;
          margin-bottom: 40px;
          padding-bottom: 10px;
          scrollbar-width: none; /* Firefox */
        }

        .categories-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }

        .category-image-container {
          width: 100px;
          height: 100px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-name {
          font-size: 12px;
          text-align: center;
          color: #333;
        }

        /* Products grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }

        @media (min-width: 576px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 992px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .product-card {
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          overflow: hidden;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          background-color: #f0f0f0;
        }

        .product-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          aspect-ratio: 1 / 1;
        }

        .cart-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.6);
          
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .cart-button:hover {
          transform: scale(1.05);
        }

        .product-details {
          padding: 15px;
        }

        .product-brand {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 5px;
          color: #000;
        }

        .product-name {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .product-price {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 5px;
          color: #000;
        }

        .product-availability {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
