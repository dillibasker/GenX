import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#142035',
            color: '#F5F5F0',
            border: '1px solid #1E3050',
            fontFamily: 'Sora, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#2DB52D', secondary: '#142035' } },
          error: { iconTheme: { primary: '#FF4D4D', secondary: '#142035' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
