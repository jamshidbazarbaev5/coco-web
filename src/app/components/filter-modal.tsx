"use client";

import { useState } from "react";

export default function FilterModal({ onClose }: { onClose: () => void }) {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("1000000");
  const [showModal, setShowModal] = useState(true);

  // State for dropdowns
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);

  // Selected brands
  const [selectedBrands, setSelectedBrands] = useState(["Prada"]);

  // Add new state for selected sizes and colors
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Available brands, sizes, and colors
  const brands = ["Gucci", "Prada", "Louis Vuitton", "Giancarlo petrigila"];
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const colors = ["Черный", "синий", "желтый", "красный", "белый", "зеленый"];

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Add toggle functions for sizes and colors
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setBrandInput("");
    setMinPrice("0");
    setMaxPrice("1000000");
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  // Apply filters
  const applyFilters = () => {
    console.log("Applying filters:", {
      searchQuery,
      selectedBrands,
      priceRange: { min: minPrice, max: maxPrice },
    });
    onClose();
  };

  // Helper function to format selected items display
  const formatSelectedItems = (items: string[], limit: number = 2) => {
    if (items.length === 0) return "";
    if (items.length <= limit) return `: ${items.join(", ")}`;
    return `: ${items.slice(0, limit).join(", ")} +${items.length - limit}`;
  };

  // Modified dropdown state handling
  const handleDropdownClick = (dropdown: 'brands' | 'sizes' | 'colors') => {
    setBrandsOpen(dropdown === 'brands' ? !brandsOpen : false);
    setSizesOpen(dropdown === 'sizes' ? !sizesOpen : false);
    setColorsOpen(dropdown === 'colors' ? !colorsOpen : false);
  };

  // Calculate if any dropdown is open
  const isAnyDropdownOpen = brandsOpen || sizesOpen || colorsOpen;

  // Modify the close button handler
  const handleClose = () => {
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="filter-modal">
        <div className="modal-header">
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="search-container">
          <div className="search-input">
            <span className="search-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9169 11.6669H12.2586L12.0252 11.4419C12.546 10.8369 12.9266 10.1242 13.1398 9.3549C13.3531 8.5856 13.3936 7.77868 13.2586 6.99189C12.8669 4.67522 10.9336 2.82522 8.60022 2.54189C7.7799 2.43811 6.94671 2.52337 6.16441 2.79113C5.38211 3.0589 4.67143 3.50207 4.08675 4.08675C3.50207 4.67143 3.0589 5.38211 2.79113 6.16441C2.52337 6.94671 2.43811 7.7799 2.54189 8.60022C2.82522 10.9336 4.67522 12.8669 6.99189 13.2586C7.77868 13.3936 8.5856 13.3531 9.3549 13.1398C10.1242 12.9266 10.8369 12.546 11.4419 12.0252L11.6669 12.2586V12.9169L15.2086 16.4586C15.5502 16.8002 16.1086 16.8002 16.4502 16.4586C16.7919 16.1169 16.7919 15.5586 16.4502 15.2169L12.9169 11.6669ZM7.91689 11.6669C5.84189 11.6669 4.16689 9.99189 4.16689 7.91689C4.16689 5.84189 5.84189 4.16689 7.91689 4.16689C9.99189 4.16689 11.6669 5.84189 11.6669 7.91689C11.6669 9.99189 9.99189 11.6669 7.91689 11.6669Z"
                  fill="#18191A"
                  fill-opacity="0.7"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Введите название"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-header-container">
            <div
              className="filter-header"
              onClick={() => handleDropdownClick('brands')}
            >
              <span className="filter-title">
                Бренды{formatSelectedItems(selectedBrands)}
              </span>
              <span className={`arrow ${brandsOpen ? "up" : "down"}`}>
                <svg
                  width="22"
                  height="11"
                  viewBox="0 0 22 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_23_1715)">
                    <path
                      d="M6.03172 8.75235L5.06005 7.77976L10.3556 2.48235C10.4405 2.39695 10.5414 2.32919 10.6525 2.28294C10.7637 2.2367 10.8829 2.21289 11.0033 2.21289C11.1236 2.21289 11.2428 2.2367 11.354 2.28294C11.4651 2.32919 11.566 2.39695 11.6509 2.48235L16.9492 7.77976L15.9776 8.75143L11.0046 3.77943L6.03172 8.75235Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_23_1715">
                      <rect
                        width="11"
                        height="22"
                        fill="white"
                        transform="matrix(0 -1 1 0 0 11)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
          </div>

          {brandsOpen && (
            <div className="filter-content brands-filter">
             
              <div className="brand-list">
                {brands
                  .filter((brand) =>
                    brand.toLowerCase().includes(brandInput.toLowerCase())
                  )
                  .map((brand) => (
                    <div
                      key={brand}
                      className={`brand-item ${
                        selectedBrands.includes(brand) ? "selected" : ""
                      }`}
                      onClick={() => toggleBrand(brand)}
                    >
                      <span>{brand}</span>
                      {selectedBrands.includes(brand) && (
                        <span className="checkmark">
                          <svg
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.2631 4.69818L6.33894 12.6223L2.70703 8.99044L3.63812 8.05935L6.33894 10.7536L13.332 3.76709L14.2631 4.69818Z"
                              fill="black"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-header-container">
            <div
              className="filter-header"
              onClick={() => handleDropdownClick('sizes')}
            >
              <span className="filter-title">
                {selectedSizes.length > 0 ? (
                  <span>Размеры : {selectedSizes.join(", ")}</span>
                ) : (
                  <span>Размеры {sizes.join(", ")}</span>
                )}
              </span>
              <span className={`arrow ${sizesOpen ? "up" : "down"}`}>
                <svg
                  width="22"
                  height="11"
                  viewBox="0 0 22 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_23_1715)">
                    <path
                      d="M6.03172 8.75235L5.06005 7.77976L10.3556 2.48235C10.4405 2.39695 10.5414 2.32919 10.6525 2.28294C10.7637 2.2367 10.8829 2.21289 11.0033 2.21289C11.1236 2.21289 11.2428 2.2367 11.354 2.28294C11.4651 2.32919 11.566 2.39695 11.6509 2.48235L16.9492 7.77976L15.9776 8.75143L11.0046 3.77943L6.03172 8.75235Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_23_1715">
                      <rect
                        width="11"
                        height="22"
                        fill="white"
                        transform="matrix(0 -1 1 0 0 11)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
          </div>

          {sizesOpen && (
            <div className="filter-content">
              <div className="options-list">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className={`option-item ${
                      selectedSizes.includes(size) ? "selected" : ""
                    }`}
                    onClick={() => toggleSize(size)}
                  >
                    <span>{size}</span>
                    {selectedSizes.includes(size) && (
                      <span className="checkmark">
                        {" "}
                        <svg
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.2631 4.69818L6.33894 12.6223L2.70703 8.99044L3.63812 8.05935L6.33894 10.7536L13.332 3.76709L14.2631 4.69818Z"
                            fill="black"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section price-filter">
          <div className="filter-title">от:</div>
          <div className="price-inputs">
            <input
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
            />
            <span className="price-currency">UZS</span>
          </div>

          <div className="filter-title price-to">до:</div>
          <div className="price-inputs">
            <input
              type="text"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
            />
            <span className="price-currency">UZS</span>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-header-container">
            <div
              className="filter-header"
              onClick={() => handleDropdownClick('colors')}
            >
              <span className="filter-title">
                {selectedColors.length > 0 ? (
                  <span>Цвета : {selectedColors.join(", ")}</span>
                ) : (
                  <span>Цвета {colors.join(", ")}</span>
                )}
              </span>
              <span className={`arrow ${colorsOpen ? "up" : "down"}`}>
                <svg
                  width="22"
                  height="11"
                  viewBox="0 0 22 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_23_1715)">
                    <path
                      d="M6.03172 8.75235L5.06005 7.77976L10.3556 2.48235C10.4405 2.39695 10.5414 2.32919 10.6525 2.28294C10.7637 2.2367 10.8829 2.21289 11.0033 2.21289C11.1236 2.21289 11.2428 2.2367 11.354 2.28294C11.4651 2.32919 11.566 2.39695 11.6509 2.48235L16.9492 7.77976L15.9776 8.75143L11.0046 3.77943L6.03172 8.75235Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_23_1715">
                      <rect
                        width="11"
                        height="22"
                        fill="white"
                        transform="matrix(0 -1 1 0 0 11)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
          </div>

          {colorsOpen && (
            <div className="filter-content">
              <div className="options-list">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`option-item ${
                      selectedColors.includes(color) ? "selected" : ""
                    }`}
                    onClick={() => toggleColor(color)}
                  >
                    <span>{color}</span>
                    {selectedColors.includes(color) && (
                      <span className="checkmark">
                        {" "}
                        <svg
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.2631 4.69818L6.33894 12.6223L2.70703 8.99044L3.63812 8.05935L6.33894 10.7536L13.332 3.76709L14.2631 4.69818Z"
                            fill="black"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-actions">
          <button className="apply-button" onClick={applyFilters}>
            Применить
          </button>
          <button className="reset-button" onClick={resetFilters}>
            Сбросить
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .filter-modal {
          background-color: #f9f5eb;
          width: 475px;
          max-width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          position: relative;
          height: ${isAnyDropdownOpen ? '560px' : 'auto'};
          min-height: 300px;
          transition: height 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #333;
        }

        .search-container {
          margin-bottom: 20px;
        }

        .search-input {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }

        .search-icon {
          margin-right: 10px;
          color: #999;
          margin-bottom: -10px;
        }

        .search-input input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          padding: 5px 0;
          width: 100%;
        }

        .filter-section {
          margin-bottom: 15px;
        }

        .filter-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 5px 0;
        }

        .filter-header {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          margin-right: 10px;
          font-family: var(--font-plus-jakarta);
        }

        .arrow {
          font-size: 12px;
          transition: transform 0.3s;
        }

        .arrow.up {
          transform: rotate(180deg);
        }

        .filter-content {
          margin-top: 10px;
          border: 1px solid #d4c9a8;
          overflow: hidden;
          width: 312px;
          height:179px;
          position: relative;
          left:140px;
        }

        .brand-input {
          padding: 8px;
          border-bottom: 1px solid #d4c9a8;
        }

        .brand-input input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
        }

        .brand-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .brand-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .brand-item:hover {
          background-color: #f0e9d8;
        }

        .brand-item.selected {
          background-color: rgba(193, 154, 91, 0.5);
        }

        .checkmark {
          color: #333;
          font-family: var(--font-plus-jakarta);
        }

        .price-filter {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }

        .price-input {
          width: 80px;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          padding: 5px 0;
        }

        .price-currency {
          color: #999;
          font-size: 14px;
          margin-left: 5px;
        }

        .price-to {
          margin-left: 10px;
        }

        .filter-actions {
          display: flex;
          justify-content: end;
          margin-top: 20px;
        }

        .apply-button {
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 1px;
          cursor: pointer;
          width: 125px;
          font-size: 14px;
          margin-right: 23px;
          transition: background-color 0.2s;
        }

        .apply-button:hover {
          background-color: #b89559;
        }

        .reset-button {
          background-color: transparent;
          color: #333;
          border: 1px solid rgba(193, 154, 91, 1);
          padding: 10px 20px;
          border-radius: 1px;
          cursor: pointer;
          outline: none;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .reset-button:hover {
          background-color: #f5f5f5;
        }

        .options-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .option-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          font-family: var(--font-plus-jakarta);
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .option-item:hover {
          background-color: #f0e9d8;
        }

        .option-item.selected {
          background-color: #e8dfc0;
        }
      `}</style>
    </div>
  );
}
