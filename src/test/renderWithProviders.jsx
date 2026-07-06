/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ConfirmProvider } from 'material-ui-confirm'
import { userReducer } from '~/redux/user/userSlice'
import { notificationsReducer } from '~/redux/notifications/notificationsSlice'

// Theme tối giản, đủ cho MUI render trong test (không cần persist như store thật)
const testTheme = createTheme()

const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationsReducer
})

export function setupTestStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
  })
}

/**
 * Render component với đầy đủ providers mà app dùng:
 * Redux store, Router, MUI Theme, ConfirmProvider.
 *
 * @param {React.ReactElement} ui  Component cần render
 * @param {Object} options
 * @param {Object} [options.preloadedState]  State khởi tạo cho Redux store
 * @param {Object} [options.store]           Truyền store có sẵn (override preloadedState)
 * @param {string[]} [options.routerEntries] Lịch sử route ban đầu cho MemoryRouter
 * @returns Kết quả của render() + store để test có thể dispatch / inspect
 */
export function renderWithProviders(
  ui,
  {
    preloadedState,
    store = setupTestStore(preloadedState),
    routerEntries = ['/'],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={routerEntries}>
          <ThemeProvider theme={testTheme}>
            <CssBaseline />
            <ConfirmProvider>{children}</ConfirmProvider>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export tiện gọi từ một chỗ
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
