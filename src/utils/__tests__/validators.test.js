import { describe, it, expect } from 'vitest'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  LIMIT_COMMON_FILE_SIZE,
  singleFileValidator
} from '~/utils/validators'

describe('EMAIL_RULE', () => {
  it('chấp nhận email hợp lệ', () => {
    expect(EMAIL_RULE.test('example@domain.com')).toBe(true)
    expect(EMAIL_RULE.test('a@b.co')).toBe(true)
  })

  it('từ chối email thiếu @ hoặc thiếu dấu chấm miền', () => {
    expect(EMAIL_RULE.test('example.com')).toBe(false)
    expect(EMAIL_RULE.test('a@bc')).toBe(false)
  })

  it('từ chối email có khoảng trắng', () => {
    expect(EMAIL_RULE.test('a b@domain.com')).toBe(false)
  })
})

describe('PASSWORD_RULE', () => {
  it('chấp nhận mật khẩu có chữ, số và đủ 8 ký tự', () => {
    expect(PASSWORD_RULE.test('abc12345')).toBe(true)
  })

  it('từ chối mật khẩu thiếu chữ cái', () => {
    expect(PASSWORD_RULE.test('12345678')).toBe(false)
  })

  it('từ chối mật khẩu thiếu chữ số', () => {
    expect(PASSWORD_RULE.test('abcdefgh')).toBe(false)
  })

  it('từ chối mật khẩu ngắn hơn 8 ký tự', () => {
    expect(PASSWORD_RULE.test('abc123')).toBe(false)
  })
})

describe('singleFileValidator', () => {
  const validFile = { name: 'avatar.png', size: 1024, type: 'image/png' }

  it('báo lỗi khi không có file hoặc thiếu thuộc tính', () => {
    expect(singleFileValidator(null)).toBe('File cannot be blank.')
    expect(singleFileValidator({ name: 'a.png', type: 'image/png' })).toBe(
      'File cannot be blank.'
    )
    expect(
      singleFileValidator({ name: '', size: 10, type: 'image/png' })
    ).toBe('File cannot be blank.')
  })

  it('báo lỗi khi vượt quá dung lượng cho phép', () => {
    expect(
      singleFileValidator({
        ...validFile,
        size: LIMIT_COMMON_FILE_SIZE + 1
      })
    ).toBe('Maximum file size exceeded. (10MB)')
  })

  it('báo lỗi khi định dạng không được hỗ trợ', () => {
    expect(
      singleFileValidator({ ...validFile, type: 'application/pdf' })
    ).toBe('File type is invalid. Only accept jpg, jpeg and png')
  })

  it('trả về null với file hợp lệ', () => {
    expect(singleFileValidator(validFile)).toBeNull()
    expect(
      singleFileValidator({ ...validFile, size: LIMIT_COMMON_FILE_SIZE })
    ).toBeNull()
  })
})
