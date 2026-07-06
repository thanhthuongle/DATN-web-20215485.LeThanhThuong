import { describe, it, expect } from 'vitest'
import { formatVND } from '~/utils/formatCurrency'

describe('formatVND', () => {
  it('định dạng số dương thành chuỗi tiền VND', () => {
    //   là non-breaking space mà Intl chèn giữa số và ký hiệu ₫
    expect(formatVND(1000)).toBe('1.000 ₫')
  })

  it('định dạng số 0 đúng', () => {
    expect(formatVND(0)).toBe('0 ₫')
  })

  it('định dạng số âm đúng', () => {
    expect(formatVND(-2500)).toBe('-2.500 ₫')
  })

  it('làm tròn phần thập phân (không hiển thị fraction digits)', () => {
    expect(formatVND(1999.99)).toBe('2.000 ₫')
  })

  it('định dạng số rất lớn với dấu chấm phân tách hàng nghìn', () => {
    expect(formatVND(1234567890)).toBe('1.234.567.890 ₫')
  })
})
