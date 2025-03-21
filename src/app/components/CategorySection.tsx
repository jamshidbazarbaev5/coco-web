import Image from "next/image"
import Link from "next/link"

export default function CategorySection() {
  const categories = [
    { name: "Cross body bags", image: "/sumka.jpeg" },
    { name: "Cross body bags", image: "/2.jpeg" },
    { name: "Cross body bags", image: "/3.jpeg" },
    { name: "Cross body bags", image: "/2.jpeg" },
    { name: "Cross body bags", image: "/3.jpeg" },
    { name: "Cross body bags", image: "/sumka.jpeg" },
    { name: "Cross body bags", image: "/2.jpeg" },
    { name: "Cross body bags", image: "/sumka.jpeg" },
    { name: "Cross body bags", image: "/2.jpeg" },
    { name: "Cross body bags", image: "/3.jpeg" },
   
    
  ]

  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((category, index) => (
          <Link
            href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            key={index}
            className="category-item"
          >
            <div className="category-image">
              <Image 
                src={category.image || "/placeholder.svg"} 
                alt={category.name} 
                width={158} 
                height={210}
                className="category-img" 
              />
            </div>
            <h3 className="category-name">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

