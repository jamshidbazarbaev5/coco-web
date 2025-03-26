"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import i18n from "../i18/config";
import FilterModal from "./filter-modal";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    setIsSearchOpen(false);
    
  }, [i18n.language]);

  // Add effect to update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        setCartItemsCount(cartItems.length);
      } else {
        setCartItemsCount(0);
      }
    };

    // Initial count
    updateCartCount();

    // Listen for storage changes (for cross-tab sync)
    window.addEventListener('storage', updateCartCount);
    
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleRedirect = (path: string) => {
    // setIsSearchOpen(false);
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      // Home is active only when we're at the root or language root
      return pathname === '/' || pathname === `/${i18n.language}`;
    }
    // For other paths, check if the pathname includes the specified path
    return pathname.includes(path);
  };

  return (
    <>
      <header className="header">
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="#18191A"/>
          </svg>
        </button>
        {isSearchOpen && <FilterModal onClose={() => setIsSearchOpen(false)} />}
        <div className="logo">
          <Link href={`/${i18n.language}`}>
            <svg
              width="113"
              height="27"
              viewBox="0 0 113 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.0386 0H22.3347C22.3347 2.48521 22.869 5.52071 23.9375 9.10651H22.869C21.9786 6.5503 20.6607 4.52663 18.9154 3.0355C17.1702 1.54438 15.2825 0.816569 13.2523 0.852071C9.97545 0.95858 7.60688 2.39645 6.14657 5.16568C4.68625 7.7929 4.29445 10.8639 4.97119 14.3787C5.54107 17.6095 6.89453 20.1834 9.03158 22.1006C11.2043 24.0178 13.6262 24.9053 16.2976 24.7633C18.6127 24.6213 20.821 23.645 22.9224 21.8343L23.617 22.6331C22.406 23.9112 20.8744 24.9586 19.0223 25.7751C17.2058 26.5917 15.3893 27 13.5728 27C9.76174 27 6.57398 25.7396 4.00951 23.2189C1.44505 20.6982 0.109397 17.5385 0.00254412 13.7396C-0.0330735 11.8225 0.305293 9.95858 1.01764 8.14793C1.72999 6.30178 2.79852 4.72189 4.22322 3.40828C6.64521 1.13609 9.58366 0 13.0386 0Z"
                fill="#18191A"
              />
              <path
                d="M44.1698 25.5089C46.4493 24.8698 48.0877 23.1657 49.085 20.3965C50.0823 17.5917 50.1357 14.5385 49.2453 11.2367C48.3549 7.93491 46.7699 5.32544 44.4904 3.40828C42.2464 1.49113 39.9847 0.852072 37.7052 1.49112C35.3901 2.05917 33.7339 3.74556 32.7366 6.5503C31.7749 9.31953 31.7215 12.355 32.5763 15.6568C33.5023 18.9941 35.0873 21.6213 37.3312 23.5385C39.5751 25.4556 41.8547 26.1124 44.1698 25.5089ZM50.5275 23.0592C47.8918 25.6864 44.7041 27 40.9642 27C37.2244 27 34.0188 25.6864 31.3475 23.0592C28.7118 20.3965 27.3939 17.2012 27.3939 13.4734C27.3939 9.74556 28.7118 6.56805 31.3475 3.94083C34.0188 1.31361 37.2244 0 40.9642 0C44.7041 0 47.8918 1.31361 50.5275 3.94083C53.1632 6.56805 54.4811 9.74556 54.4811 13.4734C54.4811 17.2012 53.1632 20.3965 50.5275 23.0592Z"
                fill="#18191A"
              />
              <path
                d="M71.2127 0H80.5088C80.5088 2.48521 81.0431 5.52071 82.1116 9.10651H81.0431C80.1527 6.5503 78.8348 4.52663 77.0896 3.0355C75.3443 1.54438 73.4566 0.816569 71.4264 0.852071C68.1496 0.95858 65.781 2.39645 64.3207 5.16568C62.8604 7.7929 62.4686 10.8639 63.1453 14.3787C63.7152 17.6095 65.0686 20.1834 67.2057 22.1006C69.3784 24.0178 71.8004 24.9053 74.4717 24.7633C76.7868 24.6213 78.9951 23.645 81.0965 21.8343L81.7911 22.6331C80.5801 23.9112 79.0485 24.9586 77.1964 25.7751C75.3799 26.5917 73.5634 27 71.7469 27C67.9359 27 64.7481 25.7396 62.1836 23.2189C59.6192 20.6982 58.2835 17.5385 58.1767 13.7396C58.141 11.8225 58.4794 9.95858 59.1918 8.14793C59.9041 6.30178 60.9726 4.72189 62.3973 3.40828C64.8193 1.13609 67.7578 0 71.2127 0Z"
                fill="#18191A"
              />
              <path
                d="M102.344 25.5089C104.623 24.8698 106.262 23.1657 107.259 20.3965C108.256 17.5917 108.31 14.5385 107.419 11.2367C106.529 7.93491 104.944 5.32544 102.664 3.40828C100.421 1.49113 98.1589 0.852072 95.8793 1.49112C93.5642 2.05917 91.908 3.74556 90.9107 6.5503C89.949 9.31953 89.8956 12.355 90.7504 15.6568C91.6765 18.9941 93.2614 21.6213 95.5053 23.5385C97.7493 25.4556 100.029 26.1124 102.344 25.5089ZM108.702 23.0592C106.066 25.6864 102.878 27 99.1383 27C95.3985 27 92.1929 25.6864 89.5216 23.0592C86.8859 20.3965 85.5681 17.2012 85.5681 13.4734C85.5681 9.74556 86.8859 6.56805 89.5216 3.94083C92.1929 1.31361 95.3985 0 99.1383 0C102.878 0 106.066 1.31361 108.702 3.94083C111.337 6.56805 112.655 9.74556 112.655 13.4734C112.655 17.2012 111.337 20.3965 108.702 23.0592Z"
                fill="#18191A"
              />
            </svg>
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li className={isActive('/') ? 'active' : ''}>
              <Link href={`/${i18n.language}`}>{t('header.home')}</Link>
            </li>
            <li className={isActive('/categories') ? 'active' : ''}>
              <Link href={`/${i18n.language}/categories`}>{t('header.catalog')}</Link>
            </li>
            <li className={isActive('/about') ? 'active' : ''}>
              <Link href={`/${i18n.language}/about`}>{t('header.about')}</Link>
            </li>
            <li className={isActive('/sales') ? 'active' : ''}>
              <Link href={`/${i18n.language}/sales`}>{t('header.sale')}</Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="icon-button cart desktop-only" onClick={() => handleRedirect(`/${i18n.language}/cart`)}>
            <div className="cart-icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 18C17.5304 18 18.0391 18.2107 18.4142 18.5858C18.7893 18.9609 19 19.4696 19 20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22C16.4696 22 15.9609 21.7893 15.5858 21.4142C15.2107 21.0391 15 20.5304 15 20C15 18.89 15.89 18 17 18ZM1 2H4.27L5.21 4H20C20.2652 4 20.5196 4.10536 20.7071 4.29289C20.8946 4.48043 21 4.73478 21 5C21 5.17 20.95 5.34 20.88 5.5L17.3 11.97C16.96 12.58 16.3 13 15.55 13H8.1L7.2 14.63L7.17 14.75C7.17 14.8163 7.19634 14.8799 7.24322 14.9268C7.29011 14.9737 7.3537 15 7.42 15H19V17H7C6.46957 17 5.96086 16.7893 5.58579 16.4142C5.21071 16.0391 5 15.5304 5 15C5 14.65 5.09 14.32 5.24 14.04L6.6 11.59L3 4H1V2ZM7 18C7.53043 18 8.03914 18.2107 8.41421 18.5858C8.78929 18.9609 9 19.4696 9 20C9 20.5304 8.78929 21.0391 8.41421 21.4142C8.03914 21.7893 7.53043 22 7 22C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20C5 18.89 5.89 18 7 18ZM16 11L18.78 6H6.14L8.5 11H16Z"
                  fill="#18191A"
                />
              </svg>
              <span className="cart-items-count">{cartItemsCount}</span>
            </div>
          </button>
          <button className="icon-button search mobile-only" onClick={() => setIsFilterModalOpen(true)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5005 14H14.7105L14.4305 13.73C15.0554 13.0039 15.5122 12.1487 15.768 11.2256C16.0239 10.3024 16.0725 9.33413 15.9105 8.38998C15.4405 5.60998 13.1205 3.38997 10.3205 3.04997C9.33608 2.92544 8.33625 3.02775 7.39749 3.34906C6.45872 3.67038 5.60591 4.20219 4.90429 4.90381C4.20268 5.60542 3.67087 6.45824 3.34955 7.397C3.02823 8.33576 2.92593 9.33559 3.05046 10.32C3.39046 13.12 5.61046 15.44 8.39046 15.91C9.33462 16.072 10.3029 16.0234 11.2261 15.7675C12.1492 15.5117 13.0044 15.0549 13.7305 14.43L14.0005 14.71V15.5L18.2505 19.75C18.6605 20.16 19.3305 20.16 19.7405 19.75C20.1505 19.34 20.1505 18.67 19.7405 18.26L15.5005 14ZM9.50046 14C7.01046 14 5.00046 11.99 5.00046 9.49997C5.00046 7.00997 7.01046 4.99997 9.50046 4.99997C11.9905 4.99997 14.0005 7.00997 14.0005 9.49997C14.0005 11.99 11.9905 14 9.50046 14Z"
                fill="#18191A"
              />
            </svg>
          </button>
          <button className="icon-button phone">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.0004 16.9201V19.9201C22.0016 20.1986 21.9445 20.4743 21.8329 20.7294C21.7214 20.9846 21.5577 21.2137 21.3525 21.402C21.1473 21.5902 20.905 21.7336 20.6412 21.8228C20.3773 21.912 20.0978 21.9452 19.8204 21.9201C16.7433 21.5854 13.7876 20.5339 11.1904 18.8501C8.77425 17.3148 6.72576 15.2663 5.19042 12.8501C3.50074 10.2411 2.44903 7.27101 2.12042 4.1801C2.09543 3.90356 2.1283 3.62486 2.21692 3.36172C2.30555 3.09859 2.44799 2.85679 2.63519 2.65172C2.82238 2.44665 3.05023 2.28281 3.30421 2.17062C3.5582 2.05843 3.83276 2.00036 4.11042 2.0001H7.11042C7.59573 1.99532 8.06621 2.16718 8.43418 2.48363C8.80215 2.80008 9.0425 3.23954 9.11042 3.7201C9.23671 4.68023 9.47154 5.62293 9.81042 6.5301C9.94497 6.88802 9.97408 7.27701 9.89433 7.65098C9.81457 8.02494 9.62928 8.36821 9.36042 8.6401L8.09042 9.9101C9.51398 12.4136 11.5869 14.4865 14.0904 15.9101L15.3604 14.6401C15.6323 14.3712 15.9756 14.1859 16.3495 14.1062C16.7235 14.0264 17.1125 14.0556 17.4704 14.1901C18.3776 14.529 19.3203 14.7638 20.2804 14.8901C20.7662 14.9586 21.2098 15.2033 21.527 15.5776C21.8441 15.9519 22.0126 16.4297 22.0004 16.9201Z"
                stroke="#18191A"
                strokeWidth="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <LanguageSelector />
        </div>
      </header>

      {isFilterModalOpen && (
        <FilterModal onClose={() => setIsFilterModalOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <Link href="/">
              {/* ... logo SVG ... */}
            </Link>
          </div>
          <button 
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#18191A"/>
            </svg>
          </button>
        </div>
        <nav>
          <ul>
            <li className={isActive('/') ? 'active' : ''}>
              <Link href={`/${i18n.language}`} onClick={() => setIsMobileMenuOpen(false)}>{t('header.home')}</Link>
            </li>
            <li className={isActive('/categories') ? 'active' : ''}>
              <Link href={`/${i18n.language}/categories`} onClick={() => setIsMobileMenuOpen(false)}>{t('header.catalog')}</Link>
            </li>
            <li className={isActive('/about') ? 'active' : ''}>
              <Link href={`/${i18n.language}/about`} onClick={() => setIsMobileMenuOpen(false)}>{t('header.about')}</Link>
            </li>
            <li className={isActive('/sales') ? 'active' : ''}>
              <Link href={`/${i18n.language}/sales`} onClick={() => setIsMobileMenuOpen(false)}>{t('header.sale')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}