import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import ThemeProvider from './context/ThemeContext.jsx' // ✅ Import ThemeProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider> {/* ✅ Wrap App in ThemeProvider */}
        <App />
      </ThemeProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
