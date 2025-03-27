export default function StructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "COCO",
      "image": "https://coco20.uz/store-image.jpg",
      "@id": "https://coco20.uz",
      "url": "https://coco20.uz",
      "telephone": "+998 XX XXX XX XX",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Your Street Address",
        "addressLocality": "Tashkent",
        "addressRegion": "Tashkent",
        "postalCode": "100XXX",
        "addressCountry": "UZ"
      },
     
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "10:00",
        "closes": "20:00"
      },
      "sameAs": [
        "https://facebook.com/your-facebook",
        "https://instagram.com/your-instagram",
        "https://telegram.me/your-telegram"
      ]
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  }