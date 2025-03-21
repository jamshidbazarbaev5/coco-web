import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section 
      className="category-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div 
        className="category-grid"
        variants={containerVariants}
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <Link
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
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
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

