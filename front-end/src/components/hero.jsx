"use client"
import { assets } from "../assets/frontend_assets/assets"
import { useContext } from "react"
import { ThemeContext } from "../context/themeContext"

const Hero = () => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className="flex flex-col sm:flex-row min-h-screen sm:min-h-96">
      {/* Hero Left Side */}
      <div
        className="w-full sm:w-1/2 flex items-center justify-center py-20 sm:py-0 px-4 sm:px-10"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 md:w-14 h-[1px]" style={{ backgroundColor: "var(--accent-dark)" }}></div>
            <p className="font-light text-xs md:text-sm tracking-widest" style={{ color: "var(--text-secondary)" }}>
              NEW COLLECTION
            </p>
          </div>
          <h1
            className="prata-regular text-4xl sm:text-5xl lg:text-6xl leading-tight mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Discover Premium Quality
          </h1>
          <div className="flex items-center gap-3">
            <p className="font-medium text-sm md:text-base tracking-widest" style={{ color: "var(--text-secondary)" }}>
              SHOP NOW
            </p>
            <div className="w-10 md:w-12 h-[1px]" style={{ backgroundColor: "var(--accent-dark)" }}></div>
          </div>
        </div>
      </div>

      {/* Hero Right Side - Image */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition duration-700"
          src={assets.hero_img || "/placeholder.svg"}
          alt="Hero Banner"
        />
      </div>
    </div>
  )
}

export default Hero
