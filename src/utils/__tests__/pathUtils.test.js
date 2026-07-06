import { describe, it, expect } from 'vitest'
import { replaceLastSegment } from '~/utils/pathUtils'

describe('replaceLastSegment', () => {
  it('thay thế phân đoạn cuối của đường dẫn', () => {
    expect(replaceLastSegment('/boards/123', '456')).toBe('/boards/456')
  })

  it('hoạt động với đường dẫn không có dấu / ở đầu', () => {
    expect(replaceLastSegment('a/b/c', 'x')).toBe('a/b/x')
  })

  it('thay thế toàn bộ khi chỉ có một phân đoạn', () => {
    expect(replaceLastSegment('abc', 'x')).toBe('x')
  })

  it('thay phân đoạn rỗng khi đường dẫn kết thúc bằng /', () => {
    expect(replaceLastSegment('/a/b/', 'x')).toBe('/a/b/x')
  })

  it('giữ nguyên các phân đoạn phía trước', () => {
    expect(replaceLastSegment('https://site.com/api/v1/users', 'boards')).toBe(
      'https://site.com/api/v1/boards'
    )
  })
})
