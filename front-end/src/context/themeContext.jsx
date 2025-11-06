"use client"

import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark-theme")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark-theme")
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev
      localStorage.setItem("theme", newTheme ? "dark" : "light")
      if (newTheme) {
        document.documentElement.classList.add("dark-theme")
      } else {
        document.documentElement.classList.remove("dark-theme")
      }
      return newTheme
    })
  }

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}
