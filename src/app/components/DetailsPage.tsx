"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState("brown")
  const router = useRouter()

  
  const handleAddToCart = () => {
    alert("Product added to cart!")
  }

  return (
    <div className="product-container">
      <div className="product-image">
        <Image
        src={'/DETAILS.png'}
          alt="Gucci Garavani for Women"
          width={801}
          height={914}
          className="main-image"
        />
      </div>
      <div className="product-info">
        <h1 className="brand-name">Gucci</h1>
        <p className="product-name">Garavani for Women</p>
        <p className="product-price">4 850 540 uzs</p>
        <p className="product-availability">В наличии: 1</p>

        <div className="color-section">
          <p className="color-title">Цвета:</p>
          <div className="color-options">
            <button
              className={`color-option brown ${selectedColor === "brown" ? "selected" : ""}`}
              onClick={() => setSelectedColor("brown")}
              aria-label="Brown color"
            ></button>
            <button
              className={`color-option beige ${selectedColor === "beige" ? "selected" : ""}`}
              onClick={() => setSelectedColor("beige")}
              aria-label="Beige color"
            ></button>
            <button
              className={`color-option peach ${selectedColor === "peach" ? "selected" : ""}`}
              onClick={() => setSelectedColor("peach")}
              aria-label="Peach color"
            ></button>
            <button
              className={`color-option green ${selectedColor === "green" ? "selected" : ""}`}
              onClick={() => setSelectedColor("green")}
              aria-label="Green color"
            ></button>
          </div>
        </div>

        <div className="additional-info">
          <p className="info-title">Дополнительная информация:</p>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">Цвет</td>
                <td className="info-value">Коричневый</td>
              </tr>
              <tr>
                <td className="info-label">Материал</td>
                <td className="info-value">Премиум веган кожа</td>
              </tr>
              <tr>
                <td className="info-label">Размеры</td>
                <td className="info-value">34/10/24</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
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
      `}</style>
    </div>
  )
}

