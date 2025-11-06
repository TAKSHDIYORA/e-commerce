"use client"

import { useContext } from "react"
import { assets } from "../assets/frontend_assets/assets"
import { ThemeContext } from "../context/themeContext"

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <footer style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
      <div className="px-4 sm:px-8 py-16">
        <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-16 mb-12">
          {/* Brand Column */}
          <div>
            <img src={assets.logo || "/placeholder.svg"} className="mb-6 w-28 sm:w-32" alt="Logo" />
            <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ color: "var(--text-light)" }}>
              Elevate your style with our curated collection of premium products. We're committed to delivering
              exceptional quality and outstanding customer service.
            </p>
          </div>

          {/* Company Column */}
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider mb-6" style={{ color: "var(--text-primary)" }}>
              Company
            </p>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm font-light">
              <li className="cursor-pointer hover:opacity-60 transition">Home</li>
              <li className="cursor-pointer hover:opacity-60 transition">About Us</li>
              <li className="cursor-pointer hover:opacity-60 transition">Delivery</li>
              <li className="cursor-pointer hover:opacity-60 transition">Privacy Policy</li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider mb-6" style={{ color: "var(--text-primary)" }}>
              Support
            </p>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm font-light">
              <li className="cursor-pointer hover:opacity-60 transition">Help Center</li>
              <li className="cursor-pointer hover:opacity-60 transition">Track Order</li>
              <li className="cursor-pointer hover:opacity-60 transition">Returns</li>
              <li className="cursor-pointer hover:opacity-60 transition">FAQ</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider mb-6" style={{ color: "var(--text-primary)" }}>
              Get In Touch
            </p>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm font-light">
              <li className="hover:opacity-60 transition">+1 (212) 456-7890</li>
              <li className="hover:opacity-60 transition">support@forever.com</li>
              <li className="hover:opacity-60 transition">Mon - Fri: 9AM - 6PM EST</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8" style={{ borderTopColor: "var(--border-color)", borderTopWidth: "1px" }}></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-light" style={{ color: "var(--text-muted)" }}>
            © 2025 Forever.com - All Rights Reserved. Designed for modern living.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
