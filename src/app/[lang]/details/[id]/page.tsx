"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useTranslation } from 'react-i18next'

// Define interfaces for the data
interface ProductAttribute {
  color_code: string;
  image: string;
  sizes: number[];
  color_name_ru?: string;
  color_name_uz?: string;
}

interface Product {
  id: number;
  brand: number;
  category: number;
  title_ru: string;
  title_uz: string;
  description_ru: string;
  description_uz: string;
  material: number;
  price: string;
  new_price: string;
  quantity: number;
  product_attributes: ProductAttribute[];
  on_sale: boolean;
}

interface CartItem {
  product: number;
  quantity: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

interface Material {
  id: number;
  name: string;
  name_uz: string;
  name_ru: string;
}

interface Size {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { t } = useTranslation()
  
  const router = useRouter()
  const params = useParams()
  const productId = params.id
  
  const [brands, setBrands] = useState<Brand[]>([])
  
  useEffect(() => {
    const fetchAllData = async () => {
      if (!productId) {
        router.push('/catalog')
        return
      }
      
      try {
        const [productRes, materialsRes, sizesRes, brandsRes] = await Promise.all([
          fetch(`https://coco20.uz/api/v1/products/crud/product/${productId}/`),
          fetch('https://coco20.uz/api/v1/products/crud/material/?page=1'),
          fetch('https://coco20.uz/api/v1/products/crud/size/?page=1&page_size=10'),
          fetch('https://coco20.uz/api/v1/brands/crud/brand/?page=1')
        ]);

        const [productData, materialsData, sizesData, brandsData] = await Promise.all([
          productRes.json(),
          materialsRes.json(),
          sizesRes.json(),
          brandsRes.json()
        ]);

        setProduct(productData)
        setMaterials(materialsData.results)
        setSizes(sizesData.results)
        setBrands(brandsData.results)
        
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
    if (!product) return
    
    const brandName = brands.find(b => b.id === product.brand)?.name || "Unknown Brand"
    
    const cartItem: CartItem = {
      product: product.id,
      quantity: 1,
      name: brandName,
      description: product.title_ru,
      price: `${product.price} uzs`,
      stock: product.quantity,
      image: product.product_attributes[selectedColorIndex]?.image || "/placeholder.svg"
    }
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: CartItem) => item.product === product.id)
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      existingCart[existingItemIndex].quantity += 1
    } else {
      // Add new item to cart
      existingCart.push(cartItem)
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart))
    
    // Show confirmation modal
    setShowConfirmation(true)
  }

  const formatPrice = (price: string) => {
    // Convert price string to number, removing any non-digit characters except decimal point
    const numPrice = Number(price.replace(/[^\d.]/g, ''));
    
    // Format with spaces between thousands
    const formattedPrice = Math.floor(numPrice)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    // Return formatted price with 'uzs' suffix
    return `${formattedPrice} uzs`;
  }

  const getColorName = (hex: string, colorNameRu: string | null, colorNameUz: string | null) => {
    // If color names are provided, use them based on current language
    if (colorNameRu || colorNameUz) {
      const currentLang = params.lang as string;
      return currentLang === 'ru' ? (colorNameRu || hex) : (colorNameUz || hex);
    }

    // Fallback to the existing color mapping if no custom names provided
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
        <div className="product-image">
          <Image
            src={product.product_attributes[selectedColorIndex]?.image || '/DETAILS.png'}
            alt={product.title_ru}
            width={801}
            height={914}
            className="main-image"
          />
        </div>
        <div className="product-info">
          <h1 className="brand-name">
            {brands.find(b => b.id === product?.brand)?.name || "Unknown Brand"}
          </h1>
          <p className="product-name">{product.title_ru}</p>
          <p className="product-price">
            {product.on_sale ? (
              <>
                <span className="original-price">{formatPrice(product.price)}</span>
                <span className="sale-price">{formatPrice(product.new_price)}</span>
              </>
            ) : (
              formatPrice(product.price)
            )}
          </p>
          <p className="product-availability">{t('product_details.in_stock')} {product.quantity}</p>

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
                    {materials.find(m => m.id === product?.material)?.name_ru || t('product_details.table.premium_leather')}
                  </td>
                </tr>
                <tr>
                  <td className="info-label">{t('product_details.table.sizes')}</td>
                  <td className="info-value">
                    {product?.product_attributes[selectedColorIndex]?.sizes
                      .map(sizeId => sizes.find(s => s.id === sizeId)?.name)
                      .filter(Boolean)
                      .join(', ') || 'Не указаны'}
                  </td>
                </tr>
               
              </tbody>
            </table>
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
      `}</style>
    </main>
  )
}

