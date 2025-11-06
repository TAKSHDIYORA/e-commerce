"use client"

import { useContext } from "react"
import { ShopContext } from "../context/shopContext"
import { Link } from "react-router-dom"
import { ThemeContext } from "../context/themeContext"

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <Link to={`/product/${id}`} className="product-card block" style={{ color: "var(--text-secondary)" }}>
      <div className="product-image bg-gray-100 mb-3">
        <img
          className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
          src={image[0] || "/placeholder.svg"}
          alt={name}
        />
      </div>
      <p className="text-sm font-light mb-1 text-truncate-2 min-h-8" style={{ color: "var(--text-primary)" }}>
        {name}
      </p>
      <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {currency}
        {price}
      </p>
    </Link>
  )
}

export default ProductItem
