"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import i18n from "../i18/config";

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
    product: string;
    image: string;
  }[];
}

interface Product {
  id: number;
  brand: number;
  image: string;
  name: string;
  price: string;  
  new_price: string;
  availability: string;
  category: number;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  description_ru: string;
  material: number;
  product_attributes: ProductAttribute[];
}

interface CartItem {
  product: number;
  product_variant: number;
  size: number;
  quantity: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getTranslatedTitle = (product: any) => {
    return i18n.language === 'uz' ? product.title_uz : product.title_ru;
  };

  const getAvailabilityText = (quantity: number) => {
    if (quantity === 0) {
      return i18n.language === 'uz' ? "Buyurtma asosida" : "Предзаказ";
    }
    return i18n.language === 'uz' ? `Mavjud: ${quantity}` : `Рассцветки: ${quantity}`;
  };

  const getSalesTitle = () => {
    return i18n.language === 'uz' ? "Chegirmalar" : "Скидки";
  };

  const formatPrice = (price: any) => {
    const priceStr = typeof price === 'number' ? price.toString() : price;
    const numPrice = Number(priceStr.replace(/[^\d.]/g, ''));
    const formattedPrice = Math.floor(numPrice)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedPrice} uzs`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('https://coco20.uz/api/v1/products/crud/product/');
        const productsData = await productsResponse.json();

        const formattedProducts = productsData.results
          .filter((product: Product) =>
            product.product_attributes.some(attr => attr.on_sale)
          )
          .map((product: Product) => {
            const saleVariant = product.product_attributes.find(attr => attr.on_sale);

            return {
              id: product.id,
              brand: product.brand,
              name: getTranslatedTitle(product),
              price: saleVariant?.price || "0",
              new_price: saleVariant?.new_price || "0",
              availability: getAvailabilityText(saleVariant?.quantity || 0),
              image: saleVariant?.attribute_images?.[0]?.image || "/placeholder.svg",
              on_sale: true,
              product_variant: saleVariant?.id || 0,
              sizes: saleVariant?.sizes || [],
              product_attributes: product.product_attributes?.map(attr => ({
                ...attr,
                image: attr.attribute_images?.[0]?.image || null
              })) || []
            };
          });

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

  const handleAddToCart = (product: any) => {
    const cartItem: CartItem = {
      product: product.id,
      product_variant: product.product_variant,
      size: product.sizes[0],
      quantity: 1,
      name: product.brand.toString(),
      description: product.name,
      price: formatPrice(product.new_price || product.price),
      stock: parseInt(product.availability.match(/\d+/)?.[0] || "0"),
      image: product.image
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: CartItem) =>
      item.product === product.id &&
      item.product_variant === product.product_variant &&
      item.size === product.sizes[0]
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowConfirmation(true);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/${i18n.language}/details/${productId}`);
  };

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">{getSalesTitle()}</h1>

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
            </div>
            <div className="product-details">
              <h3 className="product-brand">{product.brand}</h3>
              <p className="product-name">{product.name}</p>
              <div className="price-container">
                <p className="product-old-price">{formatPrice(product.price)}</p>
                <p className="product-new-price">{formatPrice(product.new_price)} </p>
              </div>
              <div className="color-variants">
                {product.product_attributes?.map((attr) => (
                  <button
                    key={attr.id}
                    className="color-circle"
                    style={{ backgroundColor: attr.color_code }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label={`Color ${i18n.language === 'uz' ? attr.color_name_uz : attr.color_name_ru}`}
                  />
                ))}
              </div>
              <button
                className="add-to-cart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                {i18n.language === "uz" ? "Savatga qo'shish" : "Добавить в корзину"}
              </button>
            </div>
          </div>
        ))}
      </div>

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
          display: none;
        }

        .add-to-cart-button {
          width: 100%;
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 14px;
          margin-top: 10px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-to-cart-button:hover {
          background-color: #b89559;
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

        .price-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .product-old-price {
          text-decoration: line-through;
          color: #666;
          font-size: 14px;
        }

        .product-new-price {
          color: #E11D48;
          font-weight: 500;
          font-size: 16px;
        }

        .color-variants {
          display: flex;
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
          transition: transform 0.2s ease;
        }

        .color-circle:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
