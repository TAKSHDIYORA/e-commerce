import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import ShopContextProvider from "./context/shopContext"
import { ThemeProvider } from "./context/themeContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
