import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Đảm bảo DOM được dọn sạch giữa các test
afterEach(() => {
  cleanup()
})

// Mock react-toastify để test không cần render container và không in log
vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify')
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      warning: vi.fn()
    }
  }
})

// Stub các biến môi trường Vite mà code app đang dùng
vi.stubEnv('VITE_API_ROOT', 'http://localhost:8017')

// Mock window.matchMedia (MUI cần khi render trong jsdom)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  })
})

// jsdom chưa hỗ trợ scrollTo
window.scrollTo = vi.fn()
