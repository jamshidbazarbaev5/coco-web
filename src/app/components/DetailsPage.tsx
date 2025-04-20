"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import ConfirmationModal from "./ConfirmationModal"

// Define interfaces for the data
interface ProductAttribute {
  color: string;
  image: string;
  sizes: number[];
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

interface Brand {
  id: number;
  name: string;
}

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState("brown")
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        router.push('/catalog')
        return
      }
      
      try {
        const response = await fetch(`https://coco20.uz/api/v1/products/crud/product/${productId}/`)
        const data = await response.json()
        setProduct(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching product details:", error)
        setLoading(false)
      }
    }
    
    fetchProductDetails()
  }, [productId, router])
  
  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true)
      try {
        const response = await fetch('https://coco20.uz/api/v1/products/crud/brand/')
        const data = await response.json()
        setBrands(data.results)
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setBrandsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // Helper function to get brand name
  const getBrandName = (brandId: number) => {
    if (brandsLoading) return "Loading..."
    const brand = brands.find(b => b.id === brandId)
    return brand?.name || 'Unknown Brand'
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Create a cart item from the product
    const cartItem: CartItem = {
      product: product.id,
      quantity: 1,
      name: getBrandName(product.brand),
      description: product.title_ru,
      price: `${product.price} uzs`,
      stock: product.quantity,
      image: product.product_attributes[0]?.image || "/placeholder.svg"
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

  if (loading || brandsLoading) {
    return <div className="loading">Loading...</div>
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  return (
    <div className="product-container">
      <div className="product-image">
        <Image
          src={product.product_attributes[0]?.image || '/DETAILS.png'}
          alt={product.title_ru}
          width={801}
          height={914}
          className="main-image"
        />
      </div>
      <div className="product-details">
        {/* Only show name if title exists */}
        {product.title_ru && (
          <h1 className="brand-name">
            {product.title_ru}
          </h1>
        )}
        
        {/* Only show brand name if brand_details exists */}
        {product.brand && (
          <p className="product-name">{getBrandName(product.brand)}</p>
        )}
        
        {/* Only show description if it exists */}
        {product.description_ru && (
          <p className="product-description">
            {product.description_ru}
          </p>
        )}
        
        {/* Only show price if it exists */}
        {product.price && (
          <p className="product-price">
            {product.on_sale ? (
              <>
                <span className="original-price">
                  {product.price} uzs
                </span>
                {product.new_price && (
                  <span className="sale-price">
                    {product.new_price} uzs
                  </span>
                )}
              </>
            ) : (
              `${product.price} uzs`
            )}
          </p>
        )}
        
        {/* Show availability if quantity exists */}
        {typeof product.quantity !== 'undefined' && (
          <p className="product-availability">
            В наличии: {product.quantity}
          </p>
        )}

        {/* Only show color section if there are color variants */}
        {product.product_attributes?.length > 0 && (
          <div className="color-section">
            <p className="color-title">Цвета:</p>
            <div className="color-options">
              {product.product_attributes.map((attr) => (
                <button
                  key={attr.color}
                  className={`color-option ${selectedColor === attr.color ? "selected" : ""}`}
                  onClick={() => setSelectedColor(attr.color)}
                  aria-label={`Color ${attr.color}`}
                  style={{ backgroundColor: attr.color }}
                ></button>
              ))}
            </div>
          </div>
        )}

        {/* Only show size section if there are sizes */}
        {product.product_attributes[0]?.sizes?.length > 0 && (
          <div className="size-section">
            <p className="size-title">Размеры:</p>
            <div className="size-options">
              {product.product_attributes[0].sizes.map((size) => (
                <button
                  key={size}
                  className="size-option"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Only show additional info if relevant fields exist */}
        {(product.material || product.product_attributes[0]?.color) && (
          <div className="additional-info">
            <p className="info-title">Дополнительная информация:</p>
            <table className="info-table">
              <tbody>
                {/* Only show color row if color exists */}
                {product.product_attributes[0]?.color && (
                  <tr>
                    <td className="info-label">Цвет</td>
                    <td className="info-value">
                      {product.product_attributes[0].color}
                    </td>
                  </tr>
                )}
                
                {/* Only show material row if material exists */}
                {product.material && (
                  <tr>
                    <td className="info-label">Материал</td>
                    <td className="info-value">
                      {product.material}
                    </td>
                  </tr>
                )}
                
                {/* Only show sizes row if sizes exist */}
                {product.product_attributes[0]?.sizes?.length > 0 && (
                  <tr>
                    <td className="info-label">Размеры</td>
                    <td className="info-value">
                      {product.product_attributes[0].sizes.join(", ")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Добавить в корзину
      </button>

      {/* Add Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal 
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
        
        .color-option.brown {
          background-color: #8B6E4E;
        }
        
        .color-option.beige {
          background-color: #F0EAE4;
        }
        
        .color-option.peach {
          background-color: #FFCBA4;
        }
        
        .color-option.green {
          background-color: #C5D9A5;
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
        
        .loading, .error {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  )
}

