"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/shopContext"
import Title from "./Title"
import ProductItem from "./productItem"

const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 10))
  }, [products])

  return (
    <div className="section-spacing py-10 px-4 sm:px-0">
      <div className="text-center mb-12">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p
          className="w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base font-light leading-relaxed mt-4"
          style={{ color: "var(--text-light)" }}
        >
          Explore our newest arrivals featuring the latest trends and timeless classics. Updated regularly to bring you
          fresh styles and premium quality products.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {latestProducts.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
