import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme.js'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/routes.jsx'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme} noSsr defaultMode="light">
      <RouterProvider router={routes} />
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </ThemeProvider>
  </StrictMode>
)
