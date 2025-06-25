import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme.js'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/routes.jsx'
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình DateTimePicker
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

// Cấu hình moment với mẫu của tiếng Việt
import moment from 'moment'
import 'moment/dist/locale/vi'
moment.locale('vi')

// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// Cấu hình Redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

//Inject Store
import { injectStore } from '~/utils/authorizeAxios.js'
injectStore(store)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme} noSsr defaultMode="light">
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' },
              buttonOrder: ['confirm', 'cancel']
            }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              {/* <RouterProvider router={routes} /> */}
              <CssBaseline />
              <App />
              <ToastContainer position="bottom-left" theme="colored" />
            </LocalizationProvider>
          </ConfirmProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  // </StrictMode>
)
