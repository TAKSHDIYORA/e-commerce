"use client"

import { useContext, useEffect, useState } from "react"
import { assets } from "../assets/frontend_assets/assets"
import { Link, NavLink } from "react-router-dom"
import { ShopContext } from "../context/shopContext"
import { ThemeContext } from "../context/themeContext"
import ThemeToggle from "./ThemeToggle"
import axios from "axios"

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const email = localStorage.getItem("email")

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    saveCartToDB,
    logOut,
    status,
    setStatus,
    backendUrl,
  } = useContext(ShopContext)
  const { isDarkMode } = useContext(ThemeContext)

  useEffect(() => {
    if (token) {
      setStatus("log-Out")
      fetchNotifications()
    }
  }, [token])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/notification/get`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (res.data.success) {
        setNotifications(res.data.notifications)
      }
    } catch (error) {
      console.log("Error fetching notifications:", error.message)
    }
  }

  const handleDownload = (url) => {
    const link = document.createElement("a")
    link.href = url
    link.download = url
    link.click()
  }

  const handleRemoveNotification = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/notification/delete`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.data.success) {
        setNotifications(notifications.filter((n) => n._id !== id))
      }
    } catch (error) {
      console.log("Error removing notification:", error.message)
    }
  }

  return (
    <div
      className={`flex items-center justify-between py-4 px-4 sm:px-0 font-medium sticky top-0 z-50 transition-all ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottomColor: "var(--border-color)",
        borderBottomWidth: scrolled ? "1px" : "0px",
      }}
    >
      <Link to="/">
        <img src={assets.logo || "/placeholder.svg"} className="w-32 sm:w-36" alt="Logo" />
      </Link>

      {/* Center Navigation */}
      <ul className="hidden sm:flex gap-8 text-sm font-light tracking-wide" style={{ color: "var(--text-secondary)" }}>
        <NavLink to="/" className="hover:opacity-60 transition">
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className="hover:opacity-60 transition">
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className="hover:opacity-60 transition">
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className="hover:opacity-60 transition">
          <p>CONTACT</p>
        </NavLink>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon || "/placeholder.svg"}
          className="w-4 sm:w-5 cursor-pointer hover:opacity-60 transition"
          alt="Search"
        />

        <ThemeToggle />

        {/* Notification */}
        <div className="relative">
          <img
            onClick={() => setShowNotifications(!showNotifications)}
            src={assets.bell_icon || "/placeholder.svg"}
            className="w-4 sm:w-5 cursor-pointer hover:opacity-60 transition"
            alt="Notifications"
          />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-sm border shadow-lg z-20"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            >
              <div
                className="p-4 text-xs font-semibold uppercase tracking-wide border-b"
                style={{ color: "var(--text-secondary)", borderBottomColor: "var(--border-color)" }}
              >
                Notifications
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="p-4 border-b flex flex-col gap-2 hover:bg-opacity-50 transition"
                      style={{ borderBottomColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}
                    >
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {n.message}
                      </p>
                      {n.invoicePdf && (
                        <div className="flex justify-between items-center mt-2 text-xs gap-2">
                          <a
                            href={n.invoicePdf}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Invoice
                          </a>
                          <button
                            onClick={() => handleDownload(n.invoicePdf)}
                            className="text-white px-3 py-1 rounded text-xs hover:opacity-80 transition"
                            style={{ backgroundColor: "var(--accent-dark)", color: isDarkMode ? "#000" : "#fff" }}
                          >
                            Download
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveNotification(n._id)}
                        className="self-end text-red-500 text-xs hover:underline transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm" style={{ color: "var(--text-light)" }}>
                    No notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="group relative">
          <img
            className="w-4 sm:w-5 cursor-pointer hover:opacity-60 transition"
            src={assets.profile_icon || "/placeholder.svg"}
            alt="Profile"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div
              className="flex flex-col gap-3 w-40 py-4 px-6 rounded-sm text-sm"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Link to="/profile" className="hover:opacity-60 transition">
                <p style={{ color: "var(--text-secondary)" }}>My Profile</p>
              </Link>
              <p
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:opacity-60 transition"
                style={{ color: "var(--text-secondary)" }}
              >
                Orders
              </p>
              <Link to="/login">
                <p
                  onClick={async (e) => {
                    e.preventDefault()
                    await logOut()
                  }}
                  className="cursor-pointer hover:opacity-60 transition"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {status}
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon || "/placeholder.svg"}
            className="w-4 sm:w-5 min-w-4 cursor-pointer hover:opacity-60 transition"
            alt="Cart"
          />
          <p
            className="absolute right-[-8px] bottom-[-8px] w-5 text-center leading-5 text-[9px] font-semibold rounded-full"
            style={{ backgroundColor: "var(--accent-dark)", color: isDarkMode ? "#000" : "#fff" }}
          >
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon || "/placeholder.svg"}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden transition-all ${visible ? "w-full" : "w-0"} `}
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="flex flex-col" style={{ color: "var(--text-secondary)" }}>
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-4 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon || "/placeholder.svg"} alt="Close" />
            <p className="text-sm font-medium">BACK</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border text-sm"
            style={{ borderBottomColor: "var(--border-color)" }}
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border text-sm"
            style={{ borderBottomColor: "var(--border-color)" }}
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border text-sm"
            style={{ borderBottomColor: "var(--border-color)" }}
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border text-sm"
            style={{ borderBottomColor: "var(--border-color)" }}
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
