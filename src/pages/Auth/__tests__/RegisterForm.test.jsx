import { describe, it, expect } from 'vitest'
import {
  renderWithProviders,
  screen,
  userEvent
} from '~/test/renderWithProviders'
import RegisterForm from '~/pages/Auth/RegisterForm'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

describe('<RegisterForm />', () => {
  it('hiển thị đủ 3 trường và nút đăng ký', () => {
    renderWithProviders(<RegisterForm />)

    expect(screen.getByLabelText(/enter email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^enter password\.\.\./i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/enter password confirmation/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument()
  })

  it('báo lỗi bắt buộc khi submit form rỗng', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    await user.click(screen.getByRole('button', { name: /register/i }))

    // email và password đều bắt buộc
    const requiredErrors = await screen.findAllByText(FIELD_REQUIRED_MESSAGE)
    expect(requiredErrors.length).toBeGreaterThanOrEqual(2)
  })

  it('báo lỗi khi xác nhận mật khẩu không khớp', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    await user.type(screen.getByLabelText(/enter email/i), 'user@gmail.com')
    await user.type(
      screen.getByLabelText(/^enter password\.\.\./i),
      'abc12345'
    )
    await user.type(
      screen.getByLabelText(/enter password confirmation/i),
      'different1'
    )
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(
      await screen.findByText(/password confirmation must match password/i)
    ).toBeInTheDocument()
  })
})
