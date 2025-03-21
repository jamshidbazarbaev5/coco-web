"use client"

import { useState } from "react"
import Image from "next/image"
import { Send } from "lucide-react"
import styles from '../styles/language-selector.module.css'
export default function CartPage() {
  // Initial cart items data
  const initialItems = [
    {
      id: 1,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 5,
      quantity: 1,
      image:"/cart-1.jpg"
    },
    {
      id: 2,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 5,
      quantity: 1,
      image: "/cart-2.jpg"
    },
    {
      id: 3,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 5,
      quantity: 1,
      image: "/cart-3.jpg"
    },
    {
      id: 4,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 1,
      quantity: 1,
      image:"/cart-4.jpg"
    },
    {
      id: 5,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 5,
      quantity: 1,
        image: "/cart-3.jpg"
    },
    {
      id: 6,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 5,
      quantity: 1,
     image:"/cart-4.jpg"
    },
    {
      id: 7,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 5,
      quantity: 1,
       image: "/cart-3.jpg"
    },
    {
      id: 8,
      name: "Gucci",
      description: "Garavani for Women",
      price: "4 850 540 uzs",
      stock: 1,
      quantity: 1,
       image: "/cart-3.jpg"
    },
  ]

  // State for cart items
  const [cartItems, setCartItems] = useState(initialItems)

  // Function to update item quantity
  const updateQuantity = (id:any, newQuantity:any) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        // Don't allow quantity to exceed stock
        const quantity = Math.min(newQuantity, item.stock)
        return { ...item, quantity }
      }
      return item
    })

    setCartItems(updatedItems)
  }

  // Function to remove item from cart
  const removeItem = (id:any) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedItems)
  }

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Корзина</h1>

      <div className="cart-grid">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="item-image-container">
              <Image
                src={item.image}
                alt={item.description}
                width={300}
                height={300}
                className="item-image"
              />
              <button className="remove-button" onClick={() => removeItem(item.id)} aria-label="Remove item">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.46882 7.24854L7.93398 22.1387C8.04674 22.8204 8.39784 23.4399 8.92472 23.8869C9.4516 24.3338 10.1201 24.5792 10.811 24.5794H14.717M22.5313 7.24854L20.0673 22.1387C19.9546 22.8204 19.6035 23.4399 19.0766 23.8869C18.5497 24.3338 17.8813 24.5792 17.1903 24.5794H13.2843M11.693 12.9687V18.8592M16.3083 12.9687V18.8592M3.20898 7.24854H24.7923M17.2405 7.24854V5.17187C17.2405 4.70775 17.0561 4.26263 16.7279 3.93444C16.3997 3.60625 15.9546 3.42188 15.4905 3.42188H12.5108C12.0467 3.42188 11.6016 3.60625 11.2734 3.93444C10.9452 4.26263 10.7608 4.70775 10.7608 5.17187V7.24854H17.2405Z" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </button>
            </div>

            <div className="item-details">
              <h3 className="item-brand">{item.name}</h3>
              <p className="item-name">{item.description}</p>
              <p className="item-price">{item.price}</p>
              <p className="item-stock">В наличии: {item.stock}</p>

              <div className="quantity-control">
                <button
                  className="quantity-button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input type="text" className="quantity-input" value={item.quantity} readOnly />
                <button
                  className="quantity-button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="contact-content">
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Ваше предложение/пожелание"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input message-input"
                ></textarea>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-button">
                  <Send size={16} />
                  <span>Отправить</span>
                </button>

                <div className="consent-checkbox">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    name="consent" 
                    checked={formData.consent} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="consent">
                    I agree that my data is <a href="#">collected and stored</a>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
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
          // padding: 20px;
        }
        
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .cart-title {
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 30px;
          color: #000;
        }
        
        .cart-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        
        @media (min-width: 576px) {
          .cart-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 992px) {
          .cart-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .cart-item {
          background-color: #fff;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .item-image-container {
          position: relative;
          width: 100%;
          background-color: #f0f0f0;
        }
        
        .item-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          aspect-ratio: 1 / 1;
        }
        
        .remove-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 35px;
          border-radius: 9px;
          background-color: #ff3b30;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .remove-button:hover {
          background-color: #d63530;
        }
        
        .item-details {
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .item-brand {
          font-size: 16px;
          font-weight: 500;
          color: #000;
        }
        
        .item-name {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .item-price {
          font-size: 16px;
          font-weight: 500;
          color: #000;
        }
        
        .item-stock {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          width: fit-content;
        }
        
        .quantity-button {
          width: 30px;
          height: 30px;
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .quantity-button:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
        
        .quantity-input {
          width: 30px;
          height: 30px;
          border: none;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          text-align: center;
          font-size: 14px;
        }

        .contact-content {
          width: 100%;
          display: flex;
          padding: 40px;
          justify-content: center;
          grid-column: 1 / -1;
        }

        .contact-form {
          flex: 1;
          max-width: 600px;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          flex: 1;
          margin-bottom: 20px;
        }

        .form-input {
          width: 100%;
          background-color: transparent;
          border: none;
          border-bottom: 1px solid rgba(51, 51, 51, 0.3);
          color: #333;
          padding: 0.5rem 0;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s;
        }

        .form-input::placeholder {
          color: rgba(51, 51, 51, 0.6);
        }

        .form-input:focus {
          border-color: #c9aa71;
        }

        .message-input {
          resize: none;
          min-height: 206px;
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .submit-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 30px;
          background-color: #b39b65;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .submit-button:hover {
          background-color: #a08a54;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 20px;
          }
          
          .form-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

