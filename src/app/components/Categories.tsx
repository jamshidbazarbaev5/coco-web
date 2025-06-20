"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FilterModal from "./filter-modal";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import i18n from "../i18/config";
import { t } from "i18next";

interface Category {
  id: number;
  name_uz: string;
  name_ru: string;
  image: string;
}

interface Size {
  id: number;
  name_uz: string;
  name_ru: string;
}

interface Product {
  id: number;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  description_ru: string;
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

interface ProductAttribute {
  image: null;
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

interface ColorVariant {
  id: number;
  color_code: string;
  color_name_ru: string;
  color_name_uz: string;
  image: string;
  quantity: number;
}

// Update CartItem interface
interface CartItem {
  product: number;
  product_variant: number; // Added this field
  size: number;
  quantity: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
  selected_color?: number; 
}

interface Filters {
  title_ru__icontains: string;
  title_uz__icontains: string;
  price__lt: string;
  price__gt: string;
  brand: string;
  color: string;
  size: string;
  category: string;
  [key: string]: string; 
}

export default function CatalogPage() {
  // Add new state for selected colors
  const [selectedColors, setSelectedColors] = useState<{[key: number]: number}>({});

  // Add state for brands
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [activeFilter, setActiveFilter] = useState("Все");

  // Add state for sizes
  const [sizes, setSizes] = useState<Size[]>([]);

  // Add state for filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextProductsPage, setNextProductsPage] = useState<string | null>(null);

  // Add new state for storing loaded pages
  const [loadedPages, setLoadedPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    title_ru__icontains: "",
    title_uz__icontains: "",
    price__lt: "",
    price__gt: "",
    brand: "",
    color: "",
    size: "",
    category: "",
  });

  const [currentFilterData, setCurrentFilterData] = useState({
    searchQuery: "",
    selectedBrands: [] as { id: number; name: string }[],
    selectedSizes: [] as Size[],
    selectedColors: [] as string[],
    selectedCategory: null as Category | null,
    priceRange: { min: "0", max: "1000000" },
  });

  const router = useRouter();

  const STORAGE_KEY_PREFIX = 'categoryPage_';
  const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  // Utility functions for cache management
  const getStorageKey = () => {
    const currentUrl = window.location.pathname + window.location.search;
    return `${STORAGE_KEY_PREFIX}${currentUrl}`;
  };

  const saveToCache = (data: any) => {
    const storageKey = getStorageKey();
    const cacheData = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(storageKey, JSON.stringify(cacheData));
  };

  const loadFromCache = () => {
    const storageKey = getStorageKey();
    const cachedData = localStorage.getItem(storageKey);
    
    if (!cachedData) return null;

    const { timestamp, data } = JSON.parse(cachedData);
    
    // Check if cache has expired
    if (Date.now() - timestamp > CACHE_EXPIRY_TIME) {
      localStorage.removeItem(storageKey);
      return null;
    }

    return data;
  };

  const clearCache = () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  };

  const getCatalogTitle = () => {
    return i18n.language === "uz" ? "Bizning katalog" : "Наш каталог";
  };

  const getAvailabilityText = (quantity: number | null) => {
    console.log('Getting availability text for quantity:', quantity, typeof quantity);
    
    if (quantity === null) {
      console.log('Quantity is null, returning pre-order status');
      return i18n.language === "uz" ? "Oldindan buyurtman berish" : "Предзаказ";
    }
    
    if (quantity === 0) {
      console.log('Quantity is 0, returning sold out status');
      return i18n.language === "uz" ? " Sotib bo'lingan" : "Распродано";
    }
    
    console.log('Quantity is greater than 0, returning in stock status');
    return i18n.language === "uz" ? ` Sotuvda bor (mavjud)` : `Есть в наличии`;
  };

  // Utility functions
  const getNoResultsMessage = () => {
    return i18n.language === "uz" ? "Hech qanday mahsulot topilmadi" : "Товары не найдены";
  };

  const getNoResultsDescription = () => {
    return i18n.language === "uz"
      ? "Boshqa parametrlar bilan qidirishga harakat qiling"
      : "Попробуйте поиск с другими параметрами";
  };

  const getClearText = () => {
    return i18n.language === "uz" ? "Filtrni tozalash" : "Очистить фильтр";
  };

  const getAllFilterText = () => {
    return i18n.language === "uz" ? "Hammasi" : "Все";
  };

  const getTranslatedCategoryName = (category: any) => {
    return i18n.language === "uz" ? category.name_uz : category.name_ru;
  };

  // Add helper functions for price formatting
  const formatPrice = (price: string | number) => {
    // Remove any non-digit characters and convert to string
    const numStr = price.toString().replace(/\D/g, '');
    
    // Split into groups of 3 from the right and join with spaces
    const formattedNum = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    // Return formatted price with 'uzs' suffix
    return `${formattedNum} uzs`;
  };

  const unformatPrice = (formattedPrice: string | number) => {
    // Remove all spaces and non-digit characters
    return formattedPrice.toString().replace(/\s/g, '').replace(/\D/g, '');
  };

  const [currentFilterDataLocal, setCurrentFilterDataLocal] = useState(() => {
    const storedData = sessionStorage.getItem(getStorageKey());
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const now = new Date().getTime();
      
      // Check if the cached data is still valid
      if (now - parsedData.timestamp < CACHE_EXPIRY_TIME) {
        return {
          ...parsedData.filters,
          selectedBrands: parsedData.filters.brand ? [{ id: Number(parsedData.filters.brand), name: "" }] : [],
          selectedSizes: parsedData.filters.size ? [{ id: Number(parsedData.filters.size), name_uz: "", name_ru: "" }] : [],
          selectedColors: parsedData.filters.color ? [parsedData.filters.color] : [],
          selectedCategory: null,
          priceRange: { min: parsedData.filters.price__gt || "0", max: parsedData.filters.price__lt || "1000000" },
        };
      }
    }

    return {
      searchQuery: "",
      selectedBrands: [] as { id: number; name: string }[],
      selectedSizes: [] as Size[],
      selectedColors: [] as string[],
      selectedCategory: null as Category | null,
      priceRange: { min: "0", max: "1000000" },
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoriesData = await fetchAllCategories();
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilters: Filters = {
          title_ru__icontains: "",
          title_uz__icontains: "",
          price__lt: "",
          price__gt: "",
          brand: "",
          color: "",
          size: "",
          category: "",
        };

        const newFilterData = {
          searchQuery: "",
          selectedBrands: [] as { id: number; name: string }[],
          selectedSizes: [] as Size[],
          selectedColors: [] as string[],
          selectedCategory: null as Category | null,
          priceRange: { min: "0", max: "1000000" },
        };

        const categoryParam = urlParams.get('category');
        if (categoryParam) {
          const matchedCategory = categoriesData.find((cat: any) => 
            cat.name_uz === categoryParam || cat.name_ru === categoryParam
          );
          
          if (matchedCategory) {
            urlFilters.category = categoryParam;
            newFilterData.selectedCategory = {
              id: matchedCategory.id,
              name_uz: matchedCategory.name_uz,
              name_ru: matchedCategory.name_ru,
              image: matchedCategory.image
            };
          }
        }

        urlParams.forEach((value, key) => {
          if (key in urlFilters && key !== 'category') {
            urlFilters[key] = value;
          }
        });

        setFilters(urlFilters);
        setCurrentFilterData(newFilterData);

        const formattedCategories: Category[] = categoriesData.map((category: any) => ({
          id: category.id,
          name_uz: category.name_uz,
          name_ru: category.name_ru,
          image: category.image,
        }));
        setCategories(formattedCategories);

        const [brandsResponse, sizesResponse] = await Promise.all([
          fetch("https://coco20.uz/api/v1/brands/crud/brand/"),
          fetch("https://coco20.uz/api/v1/products/crud/size/"),
        ]);

        const [brandsData, sizesData] = await Promise.all([
          brandsResponse.json(),
          sizesResponse.json(),
        ]);

        const allSizes = sizesData.results as Size[];
        setSizes(allSizes);

        const sizeId = urlFilters.size;
        if (sizeId) {
          const selectedSize = allSizes.find((s: Size) => s.id.toString() === sizeId);
          if (selectedSize) {
            setCurrentFilterData((prev) => ({
              ...prev,
              selectedSizes: [selectedSize],
            }));
          }
        }

        const filteredBrands = brandsData.results.filter(
          (brand: any) => brand.name !== "Все" && brand.name !== "Hammasi"
        );

        const formattedBrands = [{ id: 0, name: getAllFilterText() }, ...filteredBrands];

        setBrands(formattedBrands);

        if (!activeFilter || activeFilter === "Все" || activeFilter === "Hammasi") {
          setActiveFilter(getAllFilterText());
        }

        await fetchProducts(urlFilters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  const fetchAllCategories = async () => {
    let allCategories: any = [];
    let nextUrl = "https://coco20.uz/api/v1/brands/crud/category/?page=1";

    while (nextUrl) {
      const categoriesResponse = await fetch(nextUrl);
      const categoriesData = await categoriesResponse.json();
      allCategories = [...allCategories, ...categoriesData.results];
      nextUrl = categoriesData.next;
    }

    return allCategories;
  };

  // Modify the fetchProducts function
  const fetchProducts = async (currentFilters: Filters) => {
    try {
      const storageKey = getStorageKey();
      const cachedData = localStorage.getItem(storageKey);
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        
        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_EXPIRY_TIME) {
          setProducts(data.products);
          setNextProductsPage(data.nextPage);
          setLoadedPages(data.loadedPages);
          setLoading(false);
          
          // Restore scroll position
          setTimeout(() => {
            window.scrollTo(0, data.scrollPosition || 0);
          }, 100);
          
          return;
        } else {
          localStorage.removeItem(storageKey);
        }
      }

      let queryParams = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const productsUrl = `https://coco20.uz/api/v1/products/list/?${queryParams.toString()}`;
      const productsResponse = await fetch(productsUrl);
      const productsData = await productsResponse.json();

      setNextProductsPage(productsData.next);
      setLoadedPages(1);

      const formattedProducts = productsData.results.map((product: Product) => {
        const firstAvailableVariant = product.product_attributes[0] || {};
        return {
          id: product.id,
          brand: product.brand_details.id,
          brandName: product.brand_details.name,
          name: i18n.language === "uz" ? product.title_uz : product.title_ru,
          description: i18n.language === "uz" ? product.description_uz : product.description_ru,
          price: formatPrice(firstAvailableVariant.price || "0"),
          availability: getAvailabilityText(firstAvailableVariant.quantity),
          image: firstAvailableVariant.attribute_images?.[0]?.image || "/placeholder.svg",
          on_sale: firstAvailableVariant.on_sale || false,
          new_price: firstAvailableVariant.new_price,
          product_variant: firstAvailableVariant.id,
          sizes: firstAvailableVariant.sizes || [],
          product_attributes: product.product_attributes || []
        };
      });

      setProducts(formattedProducts);

      // Save to cache with timestamp
      localStorage.setItem(storageKey, JSON.stringify({
        timestamp: Date.now(),
        data: {
          products: formattedProducts,
          nextPage: productsData.next,
          loadedPages: 1,
          filters: currentFilters,
          scrollPosition: 0
        }
      }));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!brands.length || !sizes.length) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters: any = {};
    const newFilterData = {
      searchQuery: "",
      selectedBrands: [] as { id: number; name: string }[],
      selectedSizes: [] as Size[],
      selectedColors: [] as string[],
      selectedCategory: null as Category | null,
      priceRange: { min: "0", max: "1000000" },
    };

    urlParams.forEach((value, key) => {
      urlFilters[key] = value;

      switch (key) {
        case "brand":
          const selectedBrand = brands.find((b) => b.id.toString() === value);
          if (selectedBrand) {
            setActiveFilter(selectedBrand.name);
            newFilterData.selectedBrands = [selectedBrand];
          }
          break;
        case "size":
          const selectedSize = sizes.find((s) => s.id.toString() === value);
          if (selectedSize) {
            newFilterData.selectedSizes = [selectedSize];
          }
          break;
        case "color":
          newFilterData.selectedColors = [value];
          break;
        case "price__gt":
          newFilterData.priceRange.min = value;
          break;
        case "price__lt":
          newFilterData.priceRange.max = value;
          break;
        case "title_ru__icontains":
        case "title_uz__icontains":
          newFilterData.searchQuery = value;
          break;
      }
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      ...urlFilters,
    }));

    setCurrentFilterData(newFilterData);
  }, [i18n.language, brands, sizes]);

  useEffect(() => {
    if (!brands.length) return; 

    setLoading(true);
    fetchProducts(filters).finally(() => setLoading(false));
  }, [filters, i18n.language]);

  // Modify the loadMoreProducts function 
  const loadMoreProducts = async () => {
    if (!nextProductsPage || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const response = await fetch(nextProductsPage);
      const data = await response.json();

      const newProducts = data.results.map((product: Product) => {
        const firstAvailableVariant = product.product_attributes[0] || {};
        return {
          id: product.id,
          brand: product.brand_details.id,
          brandName: product.brand_details.name,
          name: i18n.language === "uz" ? product.title_uz : product.title_ru,
          description: i18n.language === "uz" ? product.description_uz : product.description_ru,
          price: formatPrice(firstAvailableVariant.price || "0"),
          availability: getAvailabilityText(firstAvailableVariant.quantity),
          image: firstAvailableVariant.attribute_images?.[0]?.image || "/placeholder.svg",
          on_sale: firstAvailableVariant.on_sale || false,
          new_price: firstAvailableVariant.new_price,
          product_variant: firstAvailableVariant.id,
          sizes: firstAvailableVariant.sizes || [],
          product_attributes: product.product_attributes || []
        };
      });

      const updatedProducts = [...products, ...newProducts];
      setProducts(updatedProducts);
      setNextProductsPage(data.next);
      const newLoadedPages = loadedPages + 1;
      setLoadedPages(newLoadedPages);

      // Save complete state to cache
      const currentState = {
        products: updatedProducts,
        nextPage: data.next,
        loadedPages: newLoadedPages,
        filters,
        scrollPosition: window.scrollY || 0
      };

      // Update both localStorage and sessionStorage
      saveToCache(currentState);
      const currentUrl = window.location.pathname + window.location.search;
      sessionStorage.setItem(`categoryState_${currentUrl}`, JSON.stringify(currentState));

    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Add useEffect to restore state on component mount
  useEffect(() => {
    const currentUrl = window.location.pathname + window.location.search;
    const savedSessionState = sessionStorage.getItem(`categoryState_${currentUrl}`);
    const savedLocalState = loadFromCache();
    
    let stateToRestore = null;

    // Check which state is more recent if both exist
    if (savedSessionState && savedLocalState) {
      const sessionState = JSON.parse(savedSessionState);
      if (sessionState.loadedPages > savedLocalState.loadedPages) {
        stateToRestore = sessionState;
      } else {
        stateToRestore = savedLocalState;
      }
    } else {
      stateToRestore = savedSessionState ? JSON.parse(savedSessionState) : savedLocalState;
    }

    if (stateToRestore && JSON.stringify(stateToRestore.filters) === JSON.stringify(filters)) {
      setProducts(stateToRestore.products);
      setNextProductsPage(stateToRestore.nextPage);
      setLoadedPages(stateToRestore.loadedPages);
      setLoading(false);
        
      // Restore scroll position after a short delay
      setTimeout(() => {
        window.scrollTo(0, stateToRestore.scrollPosition || 0);
      }, 100);
    }
  }, [filters]);

  // Add new state for scroll position
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Add scroll position saving
  useEffect(() => {
    const handleScroll = () => {
      if (!loading && !isLoadingMore) {
        setSavedScrollPosition(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, isLoadingMore]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showMobileCart, setShowMobileCart] = useState(false);

  const handleAddToCart = (product: any) => {
    const selectedVariantId = selectedColors[product.id];
    const selectedVariant = product.product_attributes.find((attr: any) => attr.id === selectedVariantId) 
      || product.product_attributes[0];

    const cartItem: CartItem = {
      product: product.id,
      product_variant: selectedVariant.id,
      size: selectedVariant.sizes[0],
      quantity: 1,
      name: brandNameFromId(product.brand),
      description: product.name,
      price: selectedVariant.price,
      stock: selectedVariant.quantity,
      image: selectedVariant.attribute_images[0]?.image || "/placeholder.svg",
      selected_color: selectedVariant.id 
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItemIndex = existingCart.findIndex(
      (item: CartItem) =>
        item.product === product.id &&
        item.product_variant === product.product_variant &&
        item.size === product.sizes[0]
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex] = {
        ...existingCart[existingItemIndex],
        selected_color: selectedVariant.id 
      };
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    if (window.innerWidth > 768) {
      setShowConfirmation(true);
    } else {
      setShowMobileCart(true);
      setTimeout(() => setShowMobileCart(false), 5000);
    }
  };

  const handleColorSelect = (e: React.MouseEvent, productId: number, variantId: number) => {
    e.stopPropagation();
    setSelectedColors(prev => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const brandNameFromId = (brandId: number): string => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  const handleProductClick = (productId: number) => {
    router.push(`/${i18n.language}/details/${productId}`);
  };

  const handleFilterApply = (filterData: any) => {
    setCurrentFilterData(filterData);

    const newFilters = {
      ...filters, // Keep existing filters (like category)
      title_ru__icontains: "",
      title_uz__icontains: "",
      price__lt: "",
      price__gt: "",
      brand: "",
      color: "",
      size: "",
    };

    if (filterData.searchQuery) {
      if (i18n.language === "ru") {
        newFilters.title_ru__icontains = filterData.searchQuery;
      } else {
        newFilters.title_uz__icontains = filterData.searchQuery;
      }
    }

    if (filterData.selectedBrands?.length > 0) {
      newFilters.brand = filterData.selectedBrands[0].id.toString();
      setActiveFilter(filterData.selectedBrands[0].name);
    } else {
      setActiveFilter(getAllFilterText());
    }

    if (filterData.selectedSizes?.length > 0) {
      newFilters.size = filterData.selectedSizes[0].id.toString();
    }

    if (filterData.selectedColors?.length > 0) {
      newFilters.color = filterData.selectedColors[0];
    }

    if (filterData.priceRange?.min !== "0") {
      newFilters.price__gt = filterData.priceRange.min;
    }

    if (filterData.priceRange?.max !== "1000000") {
      newFilters.price__lt = filterData.priceRange.max;
    }

    setFilters(newFilters);

    setShowFilterModal(false);

    updateURL(newFilters);
  };
  const handleBrandFilterClick = (brand: { id: number; name: string }) => {
    setActiveFilter(brand.name);

    if (brand.id === 0) {
      setFilters({ ...filters, brand: "" });
      setCurrentFilterData({
        ...currentFilterData,
        selectedBrands: [],
      });
    } else {
      setFilters({ ...filters, brand: brand.id.toString() });
      setCurrentFilterData({
        ...currentFilterData,
        selectedBrands: [brand],
      });
    }

    const newFilters =
      brand.id === 0 ? { ...filters, brand: "" } : { ...filters, brand: brand.id.toString() };
    updateURL(newFilters);
  };

  const handleCategoryClick = (category: Category) => {
    const categoryName = i18n.language === "uz" ? category.name_uz : category.name_ru;
    const newFilters = { ...filters, category: categoryName };
    setFilters(newFilters);
    setCurrentFilterData(prev => ({
      ...prev,
      selectedCategory: category
    }));
    updateURL(newFilters);
  };

  // Active filters display component
  const ActiveFilters = () => {
    const activeFilters = [];

    if (currentFilterData.searchQuery) {
      activeFilters.push({
        type: "search",
        label: currentFilterData.searchQuery
      });
    }

    if (currentFilterData.selectedBrands.length > 0) {
      activeFilters.push({
        type: "brand",
        label: currentFilterData.selectedBrands.map(b => b.name).join(", ")
      });
    }

    if (currentFilterData.selectedSizes.length > 0) {
      activeFilters.push({
        type: "size",
        label: currentFilterData.selectedSizes.map(s => 
          i18n.language === "uz" ? s.name_uz : s.name_ru
        ).join(", ")
      });
    }

    if (currentFilterData.selectedColors.length > 0) {
      activeFilters.push({
        type: "color",
        label: currentFilterData.selectedColors.join(", ")
      });
    }

    if (
      currentFilterData.priceRange.min !== "0" ||
      currentFilterData.priceRange.max !== "1000000"
    ) {
      activeFilters.push({
        type: "price",
        label: `${formatPrice(currentFilterData.priceRange.min)} - ${formatPrice(currentFilterData.priceRange.max)}`
      });
    }

    if (currentFilterData.selectedCategory) {
      activeFilters.push({
        type: "category",
        label: i18n.language === "uz" 
          ? currentFilterData.selectedCategory.name_uz 
          : currentFilterData.selectedCategory.name_ru
      });
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="active-filters">
        {activeFilters.map((filter, index) => (
          <div key={index} className="filter-tag">
            <span>{filter.label}</span>
            <button
              className="remove-filter"
              onClick={() => removeFilter(filter.type)}
            >
              ×
            </button>
          </div>
        ))}
        {activeFilters.length > 1 && (
          <button className="clear-filters" onClick={clearAllFilters}>
            {i18n.language === "uz" ? "Hammasi o'chirish" : "Очистить все"}
          </button>
        )}
      </div>
    );
  };

  const getActiveFiltersDisplay = () => {
    const activeFilters = [];

    if (currentFilterData.searchQuery) {
      activeFilters.push({
        type: "search",
        label: `"${currentFilterData.searchQuery}"`,
      });
    }

    if (currentFilterData.selectedBrands.length > 0) {
      currentFilterData.selectedBrands.forEach((brand) => {
        activeFilters.push({
          type: "brand",
          label: brand.name,
        });
      });
    }

    if (currentFilterData.selectedSizes.length > 0) {
      currentFilterData.selectedSizes.forEach((size) => {
        activeFilters.push({
          type: "size",
          label: i18n.language === "uz" ? size.name_uz : size.name_ru,
        });
      });
    }

    if (currentFilterData.selectedColors.length > 0) {
      currentFilterData.selectedColors.forEach((color) => {
        activeFilters.push({
          type: "color",
          label: color,
        });
      });
    }

    if (
      currentFilterData.priceRange.min !== "0" ||
      currentFilterData.priceRange.max !== "1000000"
    ) {
      activeFilters.push({
        type: "price",
        label: `${formatPrice(currentFilterData.priceRange.min)} - ${formatPrice(
          currentFilterData.priceRange.max
        )}`,
      });
    }

    if (currentFilterData.selectedCategory) {
      activeFilters.push({
        type: "category",
        label: i18n.language === "uz" 
          ? currentFilterData.selectedCategory.name_uz 
          : currentFilterData.selectedCategory.name_ru
      });
    }

    return activeFilters;
  };

  const clearAllFilters = () => {
    setActiveFilter(getAllFilterText());
    setFilters({
      title_ru__icontains: "",
      title_uz__icontains: "",
      price__lt: "",
      price__gt: "",
      brand: "",
      color: "",
      size: "",
      category: "",
    });
    setCurrentFilterData({
      searchQuery: "",
      selectedBrands: [],
      selectedSizes: [],
      selectedColors: [],
      selectedCategory: null,
      priceRange: { min: "0", max: "1000000" },
    });
    router.push(`/${i18n.language}/categories`);
  };

  const removeFilter = (filterType: string) => {
    const newFilters = { ...filters };
    const newFilterData = { ...currentFilterData };
  
    switch (filterType) {
      case "brand":
        setActiveFilter(getAllFilterText());
        newFilters.brand = "";
        newFilterData.selectedBrands = [];
        break;
      case "category":
        newFilters.category = "";
        newFilterData.selectedCategory = null;
        break;
      case "search":
        newFilters.title_ru__icontains = "";
        newFilters.title_uz__icontains = "";
        newFilterData.searchQuery = "";
        break;
      case "price":
        newFilters.price__gt = "";
        newFilters.price__lt = "";
        newFilterData.priceRange = { min: "0", max: "1000000" };
        break;
      case "color":
        newFilters.color = "";
        newFilterData.selectedColors = [];
        break;
      case "size":
        newFilters.size = "";
        newFilterData.selectedSizes = [];
        break;
    }
  
    setFilters(newFilters);
    setCurrentFilterData(newFilterData);
  
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
  
    const newPath = queryParams.toString() 
      ? `/${i18n.language}/categories?${queryParams.toString()}`
      : `/${i18n.language}/categories`;
  
    router.push(newPath);
  };

  const updateURL = (newFilters: any) => {
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });

    const newPath = queryParams.toString()
      ? `/${i18n.language}/categories?${queryParams.toString()}`
      : `/${i18n.language}/categories`;

    router.push(newPath);
  };

  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setShowFloatingCart(true);
      } else if (currentScrollY < lastScrollY || currentScrollY < 200) {
        setShowFloatingCart(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const getNoImageText = () => {
    return i18n.language === "uz" ? "Rasm yo'q" : "Нет фото";
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1 className="catalog-title">{getCatalogTitle()}</h1>
        <button className="filter-button" onClick={() => setShowFilterModal(true)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7H21M6 12H18M10 17H14"
              stroke="#333333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Active filters display */}
      <ActiveFilters />

      {/* Brand filters */}
      <div className="brand-filters">
        {brands.map((brand) => (
          <button
            key={brand.id}
            className={`brand-filter ${activeFilter === brand.name ? "active" : ""}`}
            onClick={() => handleBrandFilterClick(brand)}
          >
            {brand.name}
          </button>
        ))}
      </div>

      {/* Add Filter Modal with onApply handler and initialFilters */}
      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={handleFilterApply}
          initialFilters={currentFilterData}
        />
      )}

      <div className="categories-container">
        {categories.map((category) => (
          <div
            className={`category-item ${
              filters.category === (i18n.language === "uz" ? category.name_uz : category.name_ru) 
                ? "active-category" 
                : ""
            }`}
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: "pointer" }}
          >
            <div className="category-image-container">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={i18n.language === "uz" ? category.name_uz : category.name_ru}
                  width={150}
                  height={150}
                  className="category-image"
                />
              ) : (
                <div className="no-image">{getNoImageText()}</div>
              )}
            </div>
            <p className="category-name">
              {i18n.language === "uz" ? category.name_uz : category.name_ru}
            </p>
          </div>
        ))}
      </div>

      {/* Loading indicator - only show when loading and no products */}
      {loading ? (
        <div className={`loading-container ${products.length > 0 ? "loading-overlay" : ""}`}>
          <div className="loading-spinner"></div>
          <p>{i18n.language === "uz" ? "Yuklanmoqda..." : "Загрузка..."}</p>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            // Products grid
            <div className="products-grid">
              {products.map((product:any) => {
                console.log('Rendering product:', product);
                console.log('Product attributes:', product.product_attributes);
                
                return (
                  <div
                    className="product-card"
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-image-container">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image">{getNoImageText()}</div>
                      )}
                    </div>
                    <div className="product-details">
                      {/* Only show name if it exists */}
                      {product.name && (
                        <h3 className="product-brand">{product.name}</h3>
                      )}
                      {/* Only show brand name if it exists */}
                      {product.brandName && (
                        <p className="product-name">{product.brandName}</p>
                      )}
                      <p className="product-price">{product.price}</p>
                      <p className="product-availability">
                        {console.log('Rendering availability:', product.availability)}
                        {product.availability}
                      </p>
                      
                      {/* Only show color variants if they exist */}
                      {product.product_attributes && product.product_attributes.length > 0 && (
                        <div className="color-variants">
                          {console.log('Before mapping attributes:', product.product_attributes)}
                          {product.product_attributes.map((attr:any) => {
                            console.log('Processing attribute:', attr);
                        return (
                              <button
                                key={attr.id}
                                className={`color-circle ${selectedColors[product.id] === attr.id ? 'selected' : ''}`}
                                style={{ backgroundColor: attr.color_code }}
                                onClick={(e) => handleColorSelect(e, product.id, attr.id)}
                                aria-label={`Color ${i18n.language === 'uz' ? attr.color_name_uz : attr.color_name_ru}`}
                              />
                            );
                          })}
                        </div>
                      )}

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
                );
              })}
            </div>
          ) : (
            // No results message
            <div className="no-results">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#C9A66B"
                />
              </svg>
              <h2>{getNoResultsMessage()}</h2>
              <p>{getNoResultsDescription()}</p>
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                {getClearText()}
              </button>
            </div>
          )}

          {/* Load more button */}
          {nextProductsPage && products.length > 0 && (
            <div className="load-more-container">
              <button
                className="load-more-button"
                onClick={loadMoreProducts}
                disabled={isLoadingMore}
              >
                {isLoadingMore
                  ? i18n.language === "uz"
                    ? "Yuklanmoqda..."
                    : "Загрузка..."
                  : i18n.language === "uz"
                  ? "Ko'proq ko'rsatish"
                  : "Показать еще"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          messageRu="Товар успешно добавлен в корзину"
          messageUz="Mahsulot muvaffaqiyatli savatga qo'shildi"
          onClose={() => setShowConfirmation(false)}
        />
      )}

      {/* Add Mobile Cart Notification */}
      {showMobileCart && (
        <div className="mobile-cart-notification">
          <div className="notification-content">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="#fff"
              />
            </svg>
            <span>
              {i18n.language === "uz"
                ? "Mahsulot savatga qo'shildi"
                : "Товар добавлен в корзину"}
            </span>
          </div>
          <button
            className="view-cart-button"
            onClick={() => router.push(`/${i18n.language}/cart`)}
          >
            {i18n.language === "uz" ? "Savatni ko'rish" : "Перейти в корзину"}
          </button>
        </div>
      )}

      {/* Add Floating Cart Button */}
      {showFloatingCart && (
        <button
          className="floating-cart-button"
          onClick={() => router.push(`/${i18n.language}/cart`)}
        >
          <div className="cart-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.8337 19.0002C19.4525 19.0002 20.046 19.246 20.4836 19.6836C20.9212 20.1212 21.167 20.7147 21.167 21.3335C21.167 21.9523 20.9212 22.5458 20.4836 22.9834C20.046 23.421 19.4525 23.6668 18.8337 23.6668C18.2148 23.6668 17.6213 23.421 17.1837 22.9834C16.7462 22.5458 16.5003 21.9523 16.5003 21.3335C16.5003 20.0385 17.5387 19.0002 18.8337 19.0002ZM0.166992 0.333496H3.98199L5.07866 2.66683H22.3337C22.6431 2.66683 22.9398 2.78975 23.1586 3.00854C23.3774 3.22733 23.5003 3.52408 23.5003 3.8335C23.5003 4.03183 23.442 4.23016 23.3603 4.41683L19.1837 11.9652C18.787 12.6768 18.017 13.1668 17.142 13.1668H8.45033L7.40032 15.0685L7.36533 15.2085C7.36533 15.2859 7.39605 15.36 7.45075 15.4147C7.50545 15.4694 7.57964 15.5002 7.65699 15.5002H21.167V17.8335H7.16699C6.54815 17.8335 5.95466 17.5877 5.51708 17.1501C5.07949 16.7125 4.83366 16.119 4.83366 15.5002C4.83366 15.0918 4.93866 14.7068 5.11366 14.3802L6.70033 11.5218L2.50033 2.66683H0.166992V0.333496ZM7.16699 19.0002C7.78583 19.0002 8.37932 19.246 8.81691 19.6836C9.25449 20.1212 9.50033 20.7147 9.50033 21.3335C9.50033 21.9523 9.25449 22.5458 8.81691 22.9834C8.37932 23.421 7.78583 23.6668 7.16699 23.6668C6.54815 23.6668 5.95466 23.421 5.51708 22.9834C5.07949 22.5458 4.83366 21.9523 4.83366 21.3335C4.83366 20.0385 5.87199 19.0002 7.16699 19.0002ZM17.667 10.8335L20.9103 5.00016H6.16366L8.91699 10.8335H17.667Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          <span>{i18n.language === "uz" ? "Savat" : "Корзина"}</span>
        </button>
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
          max-width: 1422px;
          margin: 0 auto;
          padding: 20px;
          background: #fcf9ea;
        }

        .catalog-title {
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 30px;
          color: #000;
        }

        /* Brand filters */
        .brand-filters {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }

        .brand-filters::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }

        .brand-filter {
          background: none;
          border: none;
          padding: 8px 0;
          margin-right: 10px;
          font-size: 14px;
          cursor: pointer;
          color: #666;
          white-space: nowrap;
        }

        .brand-filter.active {
          color: #000;
          border-bottom: 2px solid #000;
          padding:10px 0;
        }

        .filter-button {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Categories */
        .categories-container {
          display: flex;
          overflow-x: auto;
          gap: 15px;
          margin-bottom: 40px;
          padding-bottom: 10px;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .categories-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }

        .category-image-container {
          width: 100px;
          height: 100px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-name {
          font-size: 12px;
          text-align: center;
          color: #333;
        }

        /* Products grid - Updated for mobile */
        .products-grid {
          display: grid;
          gap: 20px;
        }

        /* Mobile styles */
        @media (max-width: 575px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 576px) and (max-width: 991px) {
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
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
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

        .product-details {
          padding: 15px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-height: 180px; /* Set minimum height for details section */
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
          min-height: 20px; /* Set fixed height for availability text */
        }

        .color-variants {
          display: flex;
          gap: 8px;
          margin: 8px 0;
          overflow-x: auto;
          padding: 4px 0; /* Changed padding to top/bottom only */
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          max-width: 100%;
          position: relative; /* Added position relative */
          min-height: 28px; /* Added minimum height to accommodate selected state */
        }

        .color-circle {
          min-width: 20px; /* Ensure minimum width */
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #ddd;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          flex-shrink: 0; /* Prevent circle from becoming oval */
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
          pointer-events: none; /* Ensure it doesn't interfere with scrolling */
          animation: pulse 1s ease-out;
        }

        .add-to-cart-button {
          width: 100%;
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 14px;
          margin-top: auto; /* Push button to bottom */
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        /* Active filters */
              .active-filters {     margin-bottom: 20px;
          padding: 10px 0;
          background-color: #f5f5f5;
          border-radius: 4px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          background-color: #e0e0e0;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 12px;
          margin-right: 8px;
        }

        .remove-filter {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          margin-left: 5px;
          font-size: 14px;
          font-weight: bold;
          padding: 0 4px;
          margin-top: -3px;
        }

        .remove-filter:hover {
          color: #000;
        }

        .clear-filters {
          background: none;
          border: none;
          color: #666;
          text-decoration: underline;
          cursor: pointer;
          font-size: 12px;
        }

        .clear-filters:hover {
          color: #000;
        }

        .active-category {
          border-bottom: 2px solid #000;
        }

        /* Loading indicator */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          min-height: 200px; /* Add minimum height */
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 1000;
          backdrop-filter: blur(2px); /* Add subtle blur effect */
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .load-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 30px 0;
        }

        .load-more-button {
          background-color: #fff;
          border: 1px solid #000;
          color: #000;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .load-more-button:hover {
          background-color: #000;
          color: #fff;
        }

        .load-more-button:disabled {
          background-color: #f5f5f5;
          border-color: #ddd;
          color: #999;
          cursor: not-allowed;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background-color: #f8f8f6;
          border-radius: 8px;
          margin: 40px 0;
        }

        .no-results svg {
          margin-bottom: 24px;
          opacity: 0.8;
        }

        .no-results h2 {
          color: #333333;
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 12px;
          font-family: var(--font-plus-jakarta);
        }

        .no-results p {
          color: #666666;
          font-size: 16px;
          margin-bottom: 24px;
          font-family: var(--font-plus-jakarta);
        }

        .clear-filters-btn {
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-family: var(--font-plus-jakarta);
        }

        .clear-filters-btn:hover {
          background-color: #b89559;
        }

        @media (max-width: 768px) {
          .no-results {
            padding: 40px 16px;
          }

          .no-results h2 {
            font-size: 20px;
          }

          .no-results p {
            font-size: 14px;
          }
        }

        /* Mobile Cart Notification Styles */
        .mobile-cart-notification {
          position: fixed;
          bottom: 80px; /* Increased to prevent overlap with floating cart button */
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 400px;
          background-color: #333;
          color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .notification-content svg {
          flex-shrink: 0;
        }

        .notification-content span {
          font-size: 14px;
          font-weight: 500;
        }

        .view-cart-button {
          width: 100%;
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .view-cart-button:hover {
          background-color: #b89559;
        }

        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        /* Floating Cart Button Styles */
        .floating-cart-button {
          position: fixed;
          bottom: 20px;
          left: 78%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #c9a66b;
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          animation: slideUpButton 0.3s ease-out;
        }

        .floating-cart-button:hover {
          background-color: #b89559;
          transform: translateX(-50%) scale(1.05);
        }

        .cart-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-cart-button span {
          font-size: 14px;
          font-weight: 500;
        }

        @keyframes slideUpButton {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        /* Hide floating cart button on desktop */
        @media (min-width: 769px) {
          .floating-cart-button {
            display: none;
          }
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          color: #666;
          font-size: 14px;
          text-align: center;
        }

        .add-to-cart-button {
          width: 100%;
          background-color: #c9a66b;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 14px;
          margin-top: auto; /* Push button to bottom */
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-to-cart-button:hover {
          background-color: #b89559;
        }

        .cart-button {
          display: none;
        }

        .color-variants {
          display: flex;
          gap: 8px;
          margin: 8px 0;
          overflow-x: auto;
          padding: 4px 0; /* Changed padding to top/bottom only */
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          max-width: 100%;
          position: relative; /* Added position relative */
          min-height: 28px; /* Added minimum height to accommodate selected state */
        }

        .color-circle {
          min-width: 20px; /* Ensure minimum width */
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #ddd;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          flex-shrink: 0; /* Prevent circle from becoming oval */
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
          pointer-events: none; /* Ensure it doesn't interfere with scrolling */
          animation: pulse 1s ease-out;
        }

        .color-circle:hover {
          transform: scale(1.1);
        }

        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .catalog-title {
          font-size: 24px;
          font-weight: 400;
          color: #000;
          margin: 0; /* Remove margin from title */
        }

        .filter-button {
          margin-left: 15px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .brand-filters {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        @media (max-width: 768px) {
          .catalog-header {
            position: relative; /* Changed from sticky to relative */
            background-color: transparent; /* Remove background */
            z-index: 1; /* Lower z-index */
            padding: 15px 0;
          }

          .catalog-title {
            font-size: 20px;
          }

          .brand-filters {
            margin-top: 0;
          }

          /* Hide filter button on mobile when menu is open */
          .mobile-menu.open .filter-button {
            display: none;
          }

          /* Ensure mobile menu appears above other content */
          .mobile-menu {
            z-index: 1000;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: white;
            overflow-y: auto;
          }
        }

        @media (max-width: 575px) {
          .color-variants {
            padding-bottom: 4px;
            gap: 6px;
          }
          
          .color-circle {
            min-width: 20px; /* Ensure minimum width for touch targets */
          }
        }
      `}</style>
    </div>
  );
}
