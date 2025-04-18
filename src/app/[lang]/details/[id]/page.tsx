"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useTranslation } from 'react-i18next'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

// Define interfaces for the data
interface ProductAttribute {
  id: number;
  color_code: string;
  sizes: number[];
  color_name_ru: string;
  color_name_uz: string;
  price: string;
  new_price: string | null;
  quantity: number;
  created_at: string;
  on_sale: boolean;
  attribute_images: {
    id: number;
    image: string;
  }[];
}

interface Product {
  id: number;
  title_uz: string;
  title_ru: string;
  description_uz: string | null;
  description_ru: string | null;
  product_attributes: ProductAttribute[];
  brand_details: {
    id: number;
    name: string;
  };
  material_details: {
    id: number;
    name_uz: string;
    name_ru: string;
  };
  category_details: {
    id: number;
    name_ru: string;
    name_uz: string;
    image: string;
  };
}

interface CartItem {
  product: number;
  product_variant: number;
  size: number | null;
  quantity: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

interface Size {
  id: number;
  name_uz: string;
  name_ru: string;
  length: string;
  width: string;
  height: string;
}

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { t } = useTranslation()
  
  const router = useRouter()
  const params = useParams()
  const productId = params.id
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    const images = product?.product_attributes[selectedColorIndex]?.attribute_images || []
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    const images = product?.product_attributes[selectedColorIndex]?.attribute_images || []
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedColorIndex])

  useEffect(() => {
    const fetchAllData = async () => {
      if (!productId) {
        router.push('/catalog')
        return
      }
      
      try {
        const [productRes, sizesRes] = await Promise.all([
          fetch(`https://coco20.uz/api/v1/products/${productId}/`),
          fetch('https://coco20.uz/api/v1/products/crud/size/?page=1&page_size=10')
        ]);

        const [productData, sizesData] = await Promise.all([
          productRes.json(),
          sizesRes.json()
        ]);

        setProduct(productData)
        setSizes(sizesData.results)
        
        if (productData.product_attributes.length > 0) {
          setSelectedColor(productData.product_attributes[0].color_code)
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [productId, router])
  
  const handleAddToCart = () => {
    if (!product || !product.product_attributes[selectedColorIndex]) return
    
    if (!selectedSize) {
      alert(t('product_details.select_size'));
      return;
    }
    
    const brandName = product.brand_details?.name || "Unknown Brand"
    const currentVariant = product.product_attributes[selectedColorIndex];
    
    const cartItem: CartItem = {
      product: product.id,
      product_variant: currentVariant.id,
      size: selectedSize,
      quantity: 1,
      name: brandName,
      description: product.title_ru,
      price: formatPrice(currentVariant.price),
      stock: currentVariant.quantity,
      image: currentVariant.attribute_images?.[0]?.image || "/placeholder.svg"
    }
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    const existingItemIndex = existingCart.findIndex((item: CartItem) => 
      item.product === product.id && 
      item.product_variant === currentVariant.id && 
      item.size === selectedSize
    )
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    
    const event = new CustomEvent('cartUpdated', { 
      detail: { cart: existingCart }
    });
    window.dispatchEvent(event);
    
    setShowConfirmation(true)
  }

  const formatPrice = (price: string) => {
    const numPrice = Number(price.replace(/[^\d.]/g, ''));
    const formattedPrice = Math.floor(numPrice)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedPrice} uzs`;
  }

  const getColorName = (hex: string, colorNameRu: string | null, colorNameUz: string | null) => {
    if (colorNameRu || colorNameUz) {
      const currentLang = params.lang as string;
      return currentLang === 'ru' ? (colorNameRu || hex) : (colorNameUz || hex);
    }

    const colorMap: { [key: string]: string } = {
      '#ef2525': 'filters.colors_list.red',
      '#ff0000': 'filters.colors_list.red',
      '#000000': 'filters.colors_list.black',
      '#ffffff': 'filters.colors_list.white',
      '#0000ff': 'filters.colors_list.blue',
      '#008000': 'filters.colors_list.green',
      '#ffff00': 'filters.colors_list.yellow',
      '#ffa500': 'filters.colors_list.orange',
      '#800080': 'filters.colors_list.purple',
      '#a52a2a': 'filters.colors_list.brown',
      '#808080': 'filters.colors_list.gray',
      '#ffc0cb': 'filters.colors_list.pink',
      '#40e0d0': 'filters.colors_list.turquoise',
      '#c0c0c0': 'filters.colors_list.silver',
      '#ffd700': 'filters.colors_list.gold',
      '#00ffff': 'filters.colors_list.cyan',
      '#ff00ff': 'filters.colors_list.magenta',
      '#f5f5dc': 'filters.colors_list.beige',
      '#800000': 'filters.colors_list.maroon',
      '#008080': 'filters.colors_list.teal',
      '#000080': 'filters.colors_list.navy',
      '#808000': 'filters.colors_list.olive'
    }

    const lowerHex = hex?.toLowerCase()
    const translationKey = colorMap[lowerHex]
    return translationKey ? t(translationKey) : hex
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="product-container">
          <div className="loading-container">{t('product_details.loading')}</div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <div className="product-container">
          <div className="loading-container">{t('product_details.error')}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="product-container">
        <div className="product-image-container">
          <div className="main-image-wrapper">
            <button className="nav-button prev" onClick={previousImage}>
              <IoChevronBackOutline size={24} />
            </button>
            
            <div className="image-container">
              <Image
                src={product.product_attributes[selectedColorIndex]?.attribute_images?.[currentImageIndex]?.image || '/DETAILS.png'}
                alt={product.title_ru}
                width={600}
                height={800}
                className="main-image"
                priority
              />
            </div>
            
            <button className="nav-button next" onClick={nextImage}>
              <IoChevronForwardOutline size={24} />
            </button>
          </div>
          <div className="thumbnail-container">
            {product.product_attributes[selectedColorIndex]?.attribute_images.map((image, index) => (
              <div 
                key={image.id}
                className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image.image}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="product-info">
          <h1 className="brand-name">
          {params.lang === 'uz' ? product.title_uz : product.title_ru}
          </h1>
          <p className="product-name">
          {product?.brand_details?.name || "Unknown Brand"}

          </p>
          <p className="product-description">
            {params.lang === 'uz' ? product.description_uz : product.description_ru}
          </p>
          <p className="product-price">
            {product.product_attributes[selectedColorIndex].on_sale ? (
              <>
                <span className="original-price">
                  {formatPrice(product.product_attributes[selectedColorIndex].price)}
                </span>
                <span className="sale-price">
                  {formatPrice(product.product_attributes[selectedColorIndex].new_price || '')}
                </span>
              </>
            ) : (
              formatPrice(product.product_attributes[selectedColorIndex].price)
            )}
          </p>
          <p className="product-availability">
            {t('product_details.in_stock')} {product.product_attributes[selectedColorIndex].quantity}
          </p>

          <div className="color-section">
            <p className="color-title">{t('product_details.colors')}</p>
            <div className="color-options">
              {product?.product_attributes.map((attr, index) => (
                <button
                  key={attr.color_code}
                  className={`color-option ${selectedColor === attr.color_code ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedColor(attr.color_code)
                    setSelectedColorIndex(index)
                  }}
                  aria-label={`Color ${attr.color_code}`}
                  style={{ backgroundColor: attr.color_code }}
                ></button>
              ))}
            </div>
          </div>

          <div className="size-section">
            <p className="size-title">{t('product_details.sizes')}</p>
            <div className="size-options">
              {product?.product_attributes[selectedColorIndex]?.sizes.map(sizeId => {
                const size = sizes.find(s => s.id === sizeId);
                if (!size) return null;
                const sizeName = params.lang === 'uz' ? size.name_uz : size.name_ru;
                return (
                  <button
                    key={sizeId}
                    className={`size-option ${selectedSize === sizeId ? "selected" : ""}`}
                    onClick={() => setSelectedSize(sizeId)}
                  >
                    {sizeName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="additional-info">
            <p className="info-title">{t('product_details.additional_info')}</p>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">{t('product_details.table.color')}</td>
                  <td className="info-value">
                    {getColorName(
                      selectedColor,
                      product.product_attributes[selectedColorIndex]?.color_name_ru || null,
                      product.product_attributes[selectedColorIndex]?.color_name_uz || null
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="info-label">{t('product_details.table.material')}</td>
                  <td className="info-value">
                    {params.lang === 'uz' 
                      ? product.material_details?.name_uz 
                      : product.material_details?.name_ru}
                  </td>
                </tr>
                <tr>
                  <td className="info-label">{t('product_details.table.sizes')}</td>
                  <td className="info-value">
                    {product?.product_attributes[selectedColorIndex]?.sizes
                      .map(sizeId => {
                        const size = sizes.find(s => s.id === sizeId);
                        return params.lang === 'uz' ? size?.name_uz : size?.name_ru;
                      })
                      .filter(Boolean)
                      .join(', ') || t('product_details.no_sizes')}
                  </td>
                </tr>
              </tbody>
            </table>

            {selectedSize && (
              <div className="size-details">
                {/* <p className="info-title">{t('product_details.size_details')}</p> */}
                <table className="info-table">
                  <tbody>
                    {/* Single row for dimensions */}
                    <tr>
                      <td className="info-label">{t('product_details.table.dimensions')}</td>
                      <td className="info-value">
                        {(() => {
                          const size = sizes.find(s => s.id === selectedSize);
                          if (!size) return null;
                          return (
                            <div className="dimensions-row">
                              <span>{t('product_details.table.length')}: {size.length} sm</span>
                              <span> × </span>
                              <span>{t('product_details.table.width')}: {size.width} sm</span>
                              <span> × </span>
                              <span>{t('product_details.table.height')}: {size.height} sm</span>
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button className="add-to-cart-button" onClick={handleAddToCart}>
            {t('product_details.add_to_cart')}
          </button>
        </div>

        {/* Add Confirmation Modal */}
        {showConfirmation && (
          <ConfirmationModal 
            onClose={() => setShowConfirmation(false)}
          />
        )}
      </div>

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
        
        .product-container {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          padding:  70px 20px;
          gap: 40px;
        }
        
        .product-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        
        .main-image {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
        
        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .brand-name {
          font-size: 28px;
          font-weight: 500;
          font-family: var(--font-plus-jakarta);
          color: #333;
        }
        
        .product-name {
          font-size: 16px;
          color: #666;
          margin-bottom: 10px;
        }

        .product-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
          font-family: var(--font-plus-jakarta);
        }
        
        .product-price {
          font-size: 18px;
          font-weight: 500;
          font-family: var(--font-plus-jakarta);
          color: #333;
        }
        
        .product-availability {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          font-family: var(--font-plus-jakarta);
        }
        
        .color-section {
          margin-top: 10px;
        }
        
        .color-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          font-family: var(--font-plus-jakarta);
        }
        
        .color-options {
          display: flex;
          gap: 10px;
        }
        
        .color-option {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .color-option:hover {
          transform: scale(1.1);
        }
        
        .color-option.selected {
          border: 2px solid #333;
        }

        .size-section {
          margin-top: 10px;
        }

        .size-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          font-family: var(--font-plus-jakarta);
        }

        .size-options {
          display: flex;
          gap: 10px;
        }

        .size-option {
          padding: 5px 10px;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .size-option:hover {
          transform: scale(1.1);
        }

        .size-option.selected {
          border: 2px solid #333;
        }
        
        .additional-info {
          margin-top: 20px;
        }
        
        .info-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .info-table tr {
          border-bottom: 1px solid #eee;
        }
        
        .info-table tr:last-child {
          border-bottom: none;
        }
        
        .info-label, .info-value {
          padding: 12px 10px;
          font-size: 14px;
        }
        
        .info-label {
          color: #666;
          width: 40%;
        }
        
        .info-value {
          color: #333;
        }
        
        .add-to-cart-button {
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #C9A66B;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
          width: 100%;
        }
        
        .add-to-cart-button:hover {
          background-color: #B89559;
        }
        
        @media (max-width: 768px) {
          .product-container {
            flex-direction: column;
          }
          
          .product-image, .product-info {
            width: 100%;
          }
        }
        
        .original-price {
          text-decoration: line-through;
          color: #999;
          margin-right: 10px;
        }
        
        .sale-price {
          color: #e74c3c;
          font-weight: bold;
        }
        
        .loading-container {
          width: 100%;
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          color: #666;
        }

        .product-image-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .main-image-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .image-container {
          position: relative;
          width: 100%;
          padding-top: 133.33%; /* 4:3 aspect ratio */
        }

        .main-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(201, 166, 107, 0.85);
          color: white;
          border: none;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.3s ease;
          opacity: 0;
          z-index: 10;
        }

        .main-image-wrapper:hover .nav-button {
          opacity: 1;
        }

        .nav-button.prev {
          left: 12px;
        }

        .nav-button.next {
          right: 12px;
        }

        @media (max-width: 768px) {
          .nav-button {
            width: 36px;
            height: 36px;
            opacity: 0.9;
          }

          .nav-button svg {
            width: 20px;
            height: 20px;
          }
          
          .nav-button.prev {
            left: 16px;
          }
          
          .nav-button.next {
            right: 16px;
          }
        }

        .thumbnail-container {
          display: flex;
          gap: 8px;
          padding: 10px 0;
          max-width: 600px;
          margin: 0;
          overflow-x: auto;
          scrollbar-width: thin;
          -ms-overflow-style: none;
          scrollbar-color: rgba(201, 166, 107, 0.5) transparent;
        }

        .thumbnail-container::-webkit-scrollbar {
          height: 4px;
        }

        .thumbnail-container::-webkit-scrollbar-thumb {
          background-color: rgba(201, 166, 107, 0.5);
          border-radius: 4px;
        }

        .thumbnail {
          width: 82px;
          height: 82px;
          border: 1px solid #eee;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .thumbnail.active {
          border: 2px solid #C9A66B;
          transform: scale(1.05);
        }

           @media (max-width: 768px) {           .image-container {             padding-top: 100%; /* 1:1 aspect ratio on mobile */           }            .thumbnail {             width: 60px;             height: 60px;           }                      .thumbnail-container {             grid-template-columns: repeat(auto-fit, 60px);             gap: 6px;           }         }       

        .size-details {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .size-details .info-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .dimensions-row {
          display: flex;
          gap: 5px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .dimensions-row span {
          white-space: nowrap;
        }
      `}</style>
    </main>
  )
}