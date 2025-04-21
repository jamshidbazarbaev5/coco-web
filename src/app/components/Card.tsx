"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Send } from "lucide-react"
import styles from '../styles/language-selector.module.css'
import ConfirmationModal from "./ConfirmationModal"
import { useTranslation } from 'react-i18next'
import i18n from "../i18/config"

// Define interface for cart items
interface CartItem {
  product: number;
  product_variant: number; // Add this
  size: number; // Add this
  quantity: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
  product_attributes: {
    id: number;
    color_code: string;
    color_name_ru: string;
    color_name_uz: string;
    quantity: number;
    attribute_images: {
      id: number;
      product: string;
      image: string;
    }[];
  }[];
  selected_color?: number; // Add this line
}

export default function CartPage() {
  const { t } = useTranslation()
  // State for cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState("")
  const [selectedColorIds, setSelectedColorIds] = useState<{[key: number]: number}>({});

  // Add new function to fetch product details
  const fetchProductDetails = async (productId: number) => {
    try {
      const response = await fetch(`https://coco20.uz/api/v1/products/crud/product/${productId}/`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId} details:`, error);
      return null;
    }
  };

  // Update the useEffect for loading cart items
  useEffect(() => {
    const loadCartItems = async () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        
        // Initialize selected colors from stored cart items
        const initialSelectedColors: {[key: number]: number} = {};
        parsedCart.forEach((item: CartItem) => {
          if (item.selected_color) {
            initialSelectedColors[item.product] = item.selected_color;
          }
        });
        setSelectedColorIds(initialSelectedColors);

        // Fetch product details for each cart item
        const updatedCart = await Promise.all(
          parsedCart.map(async (item: CartItem) => {
            const productDetails = await fetchProductDetails(item.product);
            if (productDetails) {
              return {
                ...item,
                product_attributes: productDetails.product_attributes
              };
            }
            return item;
          })
        );

        console.log('Updated cart with product attributes:', updatedCart);
        setCartItems(updatedCart);
      }
      setLoading(false);
    };

    loadCartItems();
  }, []);

  // Update localStorage whenever cart items change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems, loading])

  // Function to update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedItems = cartItems.map((item) => {
      if (item.product === id) {
        // Prevent negative quantities and exceeding stock
        if (newQuantity < 1 || newQuantity > item.stock) {
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedItems)
  }

  // Add new function to update color variant quantity
  const updateColorVariantQuantity = (productId: number, attributeId: number, newQuantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.product === productId) {
          return {
            ...item,
            product_attributes: item.product_attributes?.map(attr => {
              if (attr.id === attributeId) {
                return {
                  ...attr,
                  quantity: Math.max(0, Math.min(newQuantity, attr.quantity))
                };
              }
              return attr;
            })
          };
        }
        return item;
      })
    );
  };

  // Function to remove item from cart
  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.product !== id)
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
    // Dispatch the cartUpdated event
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    consent: false,
  });

  // Initialize phone number with +998 prefix
  useEffect(() => {
    setFormData(prev => ({ ...prev, phone: '+998 ' }))
  }, [])

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/[^\d+]/g, '')
    
    if (!digits.startsWith('+998')) {
      digits = '+998' + digits.replace(/^\+998/, '')
    }
    let formatted = digits
    
    if (digits.length > 4) {
      formatted = `+998 ${digits.slice(4, 6)}`
      
      if (digits.length > 6) {
        formatted += ` ${digits.slice(6, 9)}`
        
        if (digits.length > 9) {
          formatted += `-${digits.slice(9, 11)}`
          
          if (digits.length > 11) {
            formatted += `-${digits.slice(11, 13)}`
          }
        }
      }
    }
    if (formatted.replace(/[^\d+]/g, '').length > 13) {
      return
    }
    
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === 'phone') {
      // Handle phone number formatting
      handlePhoneChange(value)
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.consent) {
      setOrderError("Please fill in all required fields and accept the terms");
      return;
    }
    
    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone.replace(/[^\d+]/g, ''),
        customer_preferences: formData.message,
        order_items: cartItems.map(item => ({
          product_variant: item.product_variant,
          size: item.size,
          quantity: !item.stock || item.stock === 0 ? 0 : item.quantity // Send 0 if stock is null or 0
        }))
      };

      const response = await fetch('https://coco20.uz/api/v1/orders/crud/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.order_items?.[0]?.non_field_errors?.[0] || 'Failed to place order');
      }
      
      // Clear cart and show success message
      localStorage.removeItem('cart');
      setCartItems([]);
      setFormData({
        name: "",
        phone: "",
        message: "",
        consent: false,
      });
      setOrderSuccess(true);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError(error instanceof Error ? error.message : "Failed to place order. Please try again.");
    }
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    return `${numericPrice.toLocaleString('ru-RU')} UZS`;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, '')); // Remove non-digit characters except decimal point
      return total + (price * item.quantity);
    }, 0);
  };

  // Update getAvailabilityText function
  const getAvailabilityText = (quantity: number | null) => {
    if (quantity === null) {
      return i18n.language === "uz" ? "Oldindan buyurtma" : "Предзаказ";
    }
    if (quantity === 0) {
      return i18n.language === "uz" ? "Sotilgan" : "Распродано";
    }
    return i18n.language === "uz" ? `Mavjud` : `Есть в наличии`;
  };

  const isColorSelected = (productId: number, attributeId: number) => {
    return selectedColorIds[productId] === attributeId;
  };

  if (loading) {
    return <div className="cart-container">Loading...</div>;
  }
  const cartConfirmationMessage = {
    uz: "Mahsulot muvaffaqiyatli savatga qo'shildi",
    ru: "Товар успешно добавлен в корзину"
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">{t('cart.title', 'Корзина')}</h1>
        {cartItems.length > 0 && (
          <div className="cart-total">
            <span>{t('cart.total')}:</span>
            <span className="total-price">{calculateTotal().toLocaleString()} UZS</span>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-cart">
            <p>{t('cart.empty', 'Ваша корзина пуста')}</p>
          </div>
        </div>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item) => {
            console.log('Rendering cart item:', item)
            console.log('Item product_attributes:', item.product_attributes)
            
            return (
              <div className="cart-item" key={item.product}>
                <div className="item-image-container">
                  <Image
                    src={item.image}
                    alt={item.description}
                    width={300}
                    height={300}
                    className="item-image"
                  />
                  <button 
                    className="remove-button" 
                    onClick={() => removeItem(item.product)} 
                    aria-label={t('cart.remove_item')}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.46882 7.24854L7.93398 22.1387C8.04674 22.8204 8.39784 23.4399 8.92472 23.8869C9.4516 24.3338 10.1201 24.5792 10.811 24.5794H14.717M22.5313 7.24854L20.0673 22.1387C19.9546 22.8204 19.6035 23.4399 19.0766 23.8869C18.5497 24.3338 17.8813 24.5792 17.1903 24.5794H13.2843M11.693 12.9687V18.8592M16.3083 12.9687V18.8592M3.20898 7.24854H24.7923M17.2405 7.24854V5.17187C17.2405 4.70775 17.0561 4.26263 16.7279 3.93444C16.3997 3.60625 15.9546 3.42188 15.4905 3.42188H12.5108C12.0467 3.42188 11.6016 3.60625 11.2734 3.93444C10.9452 4.26263 10.7608 4.70775 10.7608 5.17187V7.24854H17.2405Z" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="item-details">
                  <h3 className="item-brand">{item.name}</h3>
                  <p className="item-name">{item.description}</p>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  <p className="item-stock">{getAvailabilityText(item.stock)}</p>

                  {/* Simplified color variants display */}
                  <div className="color-variants">
                    {item.product_attributes?.map((attr) => (
                      <button
                        key={attr.id}
                        className={`color-circle ${isColorSelected(item.product, attr.id) ? 'selected' : ''}`}
                        style={{ backgroundColor: attr.color_code }}
                        onClick={() => setSelectedColorIds(prev => ({
                          ...prev,
                          [item.product]: attr.id
                        }))}
                        aria-label={i18n.language === 'uz' ? attr.color_name_uz : attr.color_name_ru}
                      />
                    ))}
                  </div>

                  {/* Only show quantity controls if stock > 0 */}
                  {item.stock > 0 && (
                    <div className="quantity-control">
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={t('cart.quantity.decrease')}
                      >
                        -
                      </button>
                      <input type="text" className="quantity-input" value={item.quantity} readOnly />
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label={t('cart.quantity.increase')}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          <div className="contact-content">
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder={t('form.name')}
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder={t('form.phone')}
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder={t('form.feedback')}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input message-input"
                  ></textarea>
                </div>

                {orderError && <p className="error-message">{t('form.alerts.error')}</p>}

                <div className="form-footer">
                  <button type="submit" className="submit-button">
                    <Send size={16} />
                    <span>{t('form.sendOrder')}</span>
                  </button>

                  <div className="consent-checkbox">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      name="consent" 
                      checked={formData.consent} 
                      onChange={handleChange} 
                      required
                    />
                    <label htmlFor="consent">
                      {t('form.consent')}
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      
      {orderSuccess && (
        <ConfirmationModal 
          messageUz="Mahsulot muvaffaqiyatli buyurtma qilindi"
          messageRu="Товар успешно заказан  !"
          onClose={() => setOrderSuccess(false)}
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
          // padding: 20px;
        }
        
        .cart-container {
          max-width: 1418px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .cart-title {
          font-size: 24px;
          font-weight: 400;
          color: #000;
          margin: 0; /* Remove default margin */
        }
        
        .cart-total {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 500;
        }
        
        .total-price {
          color: #b39b65;
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
          align-items: stretch;
          border: 1px solid #ddd;
          width: fit-content;
          height: 36px;
        }
        
        .quantity-button {
          width: 36px;
          height: 100%;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          transition: background-color 0.2s;
        }
        
        .quantity-button:hover:not(:disabled) {
          background-color: #f5f5f5;
        }
        
        .quantity-button:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
        
        .quantity-input {
          width: 40px;
          height: 100%;
          border: none;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          text-align: center;
          font-size: 14px;
          -moz-appearance: textfield;
        }
        
        .quantity-input::-webkit-outer-spin-button,
        .quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
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
          gap: 15px;
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

        .consent-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .consent-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin: 0;
          cursor: pointer;
        }

        .consent-checkbox label {
          cursor: pointer;
          user-select: none;
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

        @media (max-width: 576px) {
          .cart-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        .empty-cart-container {
          display: flex;
          flex-direction: column;
          min-height: 60vh;
          justify-content: center;
        }
        
        .empty-cart {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        }
        
        .error-message {
          color: #ff3b30;
          margin-bottom: 15px;
        }

        .color-variants {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 8px 0;
        }

        .color-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #ddd;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .color-circle.selected {
          border: 2px solid #c9a66b;
          transform: scale(1.1);
        }

        .color-circle.selected::after {
          content: '';
          position: absolute;
          top: -4px;
          right: -4px;
          bottom: -4px;
          left: -4px;
          border: 1px solid #c9a66b;
          border-radius: 50%;
          animation: pulse 1s ease-out;
        }

        @keyframes pulse {
          from {
            transform: scale(0.8);
            opacity: 1;
          }
          to {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        .color-circle:hover {
          transform: scale(1.1);
        }

        /* Remove old color variant styles */
        .color-variant-item,
        .color-variant-header,
        .color-name,
        .variant-quantity,
        .quantity-display {
          display: none;
        }
      `}</style>
    </div>
  )
}

