"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/shopContext"
import Title from "./Title"
import ProductItem from "./productItem"

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller)
    setBestSeller(bestProduct.slice(0, 5))
  }, [products])

  return (
    <div className="section-spacing py-10 px-4 sm:px-0">
      <div className="text-center mb-12">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p
          className="w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base font-light leading-relaxed mt-4"
          style={{ color: "var(--text-light)" }}
        >
          Discover our most loved products handpicked for their exceptional quality and design. Each piece represents
          our commitment to excellence and customer satisfaction.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {bestSeller.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default BestSeller
