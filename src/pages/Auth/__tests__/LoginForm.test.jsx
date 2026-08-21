import { describe, it, expect } from 'vitest'
import {
  renderWithProviders,
  screen,
  userEvent
} from '~/test/renderWithProviders'
import LoginForm from '~/pages/Auth/LoginForm'
import {
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE
} from '~/utils/validators'

describe('<LoginForm />', () => {
  it('hiển thị các trường và nút đăng nhập', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText(/enter email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/enter password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^login$/i })
    ).toBeInTheDocument()
    // Khối tài khoản demo hiển thị khi không có query registeredEmail/verifiedEmail
    expect(screen.getByText(/tài khoản demo/i)).toBeInTheDocument()
  })

  it('báo lỗi bắt buộc khi submit form rỗng', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.click(screen.getByRole('button', { name: /^login$/i }))

    const requiredErrors = await screen.findAllByText(FIELD_REQUIRED_MESSAGE)
    expect(requiredErrors).toHaveLength(2)
  })

  it('báo lỗi định dạng khi email/mật khẩu không hợp lệ', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/enter email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/enter password/i), 'abc')
    await user.click(screen.getByRole('button', { name: /^login$/i }))

    expect(await screen.findByText(EMAIL_RULE_MESSAGE)).toBeInTheDocument()
    expect(await screen.findByText(PASSWORD_RULE_MESSAGE)).toBeInTheDocument()
  })

  it('hiển thị thông báo khi có query registeredEmail', () => {
    renderWithProviders(<LoginForm />, {
      routerEntries: ['/login?registeredEmail=test@gmail.com']
    })

    expect(screen.getByText(/test@gmail.com/i)).toBeInTheDocument()
    // Khối demo bị ẩn khi đã có registeredEmail
    expect(screen.queryByText(/tài khoản demo/i)).not.toBeInTheDocument()
  })
})
