"use client"

import { useState } from "react"

export default function FilterModal() {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState("")
  const [brandInput, setBrandInput] = useState("Gucci")
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("1000000")
  const [showModal, setShowModal] = useState(true)

  // State for dropdowns
  const [brandsOpen, setBrandsOpen] = useState(true)
  const [sizesOpen, setSizesOpen] = useState(false)
  const [colorsOpen, setColorsOpen] = useState(false)

  // Selected brands
  const [selectedBrands, setSelectedBrands] = useState(["Prada"])

  // Add new state for selected sizes and colors
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  // Available brands, sizes, and colors
  const brands = ["Gucci", "Prada", "Louis Vuitton", "Giancarlo petrigila"]
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"]
  const colors = ["Черный", "синий", "желтый", "красный", "белый", "зеленый"]

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  // Add toggle functions for sizes and colors
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setBrandInput("")
    setMinPrice("0")
    setMaxPrice("1000000")
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
  }

  // Apply filters
  const applyFilters = () => {
    // Here you would typically handle the filter application logic
    console.log("Applying filters:", {
      searchQuery,
      selectedBrands,
      priceRange: { min: minPrice, max: maxPrice },
    })
    setShowModal(false)
  }

  // Helper function to format selected items display
  const formatSelectedItems = (items: string[], limit: number = 2) => {
    if (items.length === 0) return "";
    if (items.length <= limit) return `: ${items.join(", ")}`;
    return `: ${items.slice(0, limit).join(", ")} +${items.length - limit}`;
  }

  if (!showModal) return null

  return (
    <div className="modal-overlay">
      <div className="filter-modal">
        <div className="modal-header">
          <button className="close-button" onClick={() => setShowModal(false)}>
            ×
          </button>
        </div>

        <div className="search-container">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Введите название"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-header" onClick={() => setBrandsOpen(!brandsOpen)}>
            <span className="filter-title">
              Бренды{formatSelectedItems(selectedBrands)}
            </span>
            <span className={`arrow ${brandsOpen ? "up" : "down"}`}>▼</span>
          </div>

          {brandsOpen && (
            <div className="filter-content brands-filter">
              <div className="brand-input">
                <input
                  type="text"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  placeholder="Search brands"
                />
              </div>
              <div className="brand-list">
                {brands
                  .filter((brand) => brand.toLowerCase().includes(brandInput.toLowerCase()))
                  .map((brand) => (
                    <div
                      key={brand}
                      className={`brand-item ${selectedBrands.includes(brand) ? "selected" : ""}`}
                      onClick={() => toggleBrand(brand)}
                    >
                      <span>{brand}</span>
                      {selectedBrands.includes(brand) && <span className="checkmark">✓</span>}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-header" onClick={() => setSizesOpen(!sizesOpen)}>
            <span className="filter-title">
              Размеры{formatSelectedItems(selectedSizes)}
            </span>
            <span className={`arrow ${sizesOpen ? "up" : "down"}`}>▼</span>
          </div>
          
          {sizesOpen && (
            <div className="filter-content">
              <div className="options-list">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className={`option-item ${selectedSizes.includes(size) ? "selected" : ""}`}
                    onClick={() => toggleSize(size)}
                  >
                    <span>{size}</span>
                    {selectedSizes.includes(size) && <span className="checkmark">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section price-filter">
          <div className="filter-title">от:</div>
          <div className="price-inputs">
            <input type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="price-input" />
            <span className="price-currency">UZS</span>
          </div>

          <div className="filter-title price-to">до:</div>
          <div className="price-inputs">
            <input type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="price-input" />
            <span className="price-currency">UZS</span>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-header" onClick={() => setColorsOpen(!colorsOpen)}>
            <span className="filter-title">
              Цвета{formatSelectedItems(selectedColors)}
            </span>
            <span className={`arrow ${colorsOpen ? "up" : "down"}`}>▼</span>
          </div>
          
          {colorsOpen && (
            <div className="filter-content">
              <div className="options-list">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`option-item ${selectedColors.includes(color) ? "selected" : ""}`}
                    onClick={() => toggleColor(color)}
                  >
                    <span>{color}</span>
                    {selectedColors.includes(color) && <span className="checkmark">✓</span>}
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
          width: 350px;
          max-width: 90%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          position: relative;
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
        
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 5px 0;
        }
        
        .filter-title {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          margin-right: 10px;
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
          border-radius: 4px;
          overflow: hidden;
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
          background-color: #e8dfc0;
        }
        
        .checkmark {
          color: #333;
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
          justify-content: space-between;
          margin-top: 20px;
        }
        
        .apply-button {
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .apply-button:hover {
          background-color: #b89559;
        }
        
        .reset-button {
          background-color: white;
          color: #333;
          border: 1px solid #ccc;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
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
  )
}

