import { describe, it, expect, afterEach } from 'vitest'
import {
  slugify,
  formatPercentage,
  interceptorLoadingElements
} from '~/utils/formatters'

describe('slugify', () => {
  it('trả về chuỗi rỗng với giá trị falsy', () => {
    expect(slugify('')).toBe('')
    expect(slugify(null)).toBe('')
    expect(slugify(undefined)).toBe('')
    expect(slugify(0)).toBe('')
  })

  it('chuyển chữ hoa và khoảng trắng thành slug thường nối bằng gạch nối', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('loại bỏ dấu tiếng Việt', () => {
    expect(slugify('Tiếng Việt')).toBe('tieng-viet')
  })

  it('chuyển đ/Đ thành d', () => {
    expect(slugify('Đường phố')).toBe('duong-pho')
  })

  it('giữ lại chữ số', () => {
    expect(slugify('Product 123')).toBe('product-123')
  })

  it('loại bỏ ký tự đặc biệt', () => {
    expect(slugify('C++ & C#')).toBe('c-c')
  })

  it('gộp khoảng trắng và gạch nối liên tiếp thành một gạch nối', () => {
    expect(slugify('a   b')).toBe('a-b')
    expect(slugify('a - b')).toBe('a-b')
  })

  it('cắt khoảng trắng đầu/cuối', () => {
    expect(slugify('  hello  ')).toBe('hello')
  })

  it('ép kiểu số về chuỗi trước khi xử lý', () => {
    expect(slugify(123)).toBe('123')
  })
})

describe('formatPercentage', () => {
  it('trả về chuỗi "0" khi mẫu số bằng 0', () => {
    expect(formatPercentage(2, 5, 3, 0)).toBe('0')
  })

  it('tính phần trăm với số chữ số thập phân tối thiểu', () => {
    expect(formatPercentage(2, 5, 1, 4)).toBe(25)
  })

  it('làm tròn theo minFixed khi giá trị đủ lớn', () => {
    expect(formatPercentage(0, 2, 1, 3)).toBe(33)
  })

  it('tăng độ chính xác cho tới maxFixed khi giá trị rất nhỏ', () => {
    // 1/100000 * 100 = 0.001 -> cần 3 chữ số thập phân mới > 0
    expect(formatPercentage(2, 5, 1, 100000)).toBe(0.001)
  })

  it('trả về 0 khi tử số bằng 0 (không bao giờ > 0)', () => {
    expect(formatPercentage(2, 5, 0, 10)).toBe(0)
  })
})

describe('interceptorLoadingElements', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('khi calling=true: mờ, chặn tương tác, lưu nội dung gốc và gắn spinner', () => {
    document.body.innerHTML =
      '<div class="interceptor-loading">Submit</div>'
    const el = document.querySelector('.interceptor-loading')

    interceptorLoadingElements(true)

    expect(el.style.opacity).toBe('0.5')
    expect(el.style.pointerEvents).toBe('none')
    expect(el.dataset.originalContent).toBe('Submit')
    expect(el.innerHTML).toContain('@keyframes spin')
  })

  it('khi calling=false: khôi phục tương tác và nội dung gốc', () => {
    document.body.innerHTML =
      '<div class="interceptor-loading">Submit</div>'
    const el = document.querySelector('.interceptor-loading')

    interceptorLoadingElements(true)
    interceptorLoadingElements(false)

    expect(el.style.opacity).toBe('initial')
    expect(el.style.pointerEvents).toBe('initial')
    expect(el.innerHTML).toBe('Submit')
    expect(el.dataset.originalContent).toBeUndefined()
  })
})
