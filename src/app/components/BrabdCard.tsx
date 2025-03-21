import React from 'react';
import '../styles/BrandCard.css';

interface BrandCardProps {
  number: string;
  brand: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  onClick?: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  number,
  brand,
  description,
  imageUrl,
  isActive = false,
  onClick,
}) => {
  const cardClassName = `luxury-card ${isActive ? 'active-brand' : ''}`;

  return (
    <div className={cardClassName} onClick={onClick}>
      <div className="luxury-card-inner">
        <div className="card-image-container">
          <img 
            src={imageUrl} 
            alt={brand}
            className="luxury-card-image"
          />
          <div className="card-number">
            {number}
          </div>
          <div className="luxury-card-content">
            <h3 className="card-title">{brand}</h3>
            <p className="card-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;