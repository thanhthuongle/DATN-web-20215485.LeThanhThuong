import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { apiRoot } from '~/utils/constants'

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/users/register`, data)
  toast.success ('Tài khoản đã được tạo thành công! Vui lòng xxacs thực tài khoản trước khi đăng nhập!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${apiRoot}/users/verify`, data)
  toast.success ('Tài khoản đã xác thực thành công! Bây giờ bạn có thể đăng nhập và sủ dụng dịch vụ của website!', { theme: 'colored' })
  return response.data
}
export const loginUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/users/login`, data)
  return response.data
}

export const logoutUserAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${apiRoot}/users/logout`)
  toast.success ('Đăng xuất thành công!', { theme: 'colored' })
  return response.data
}

export const updateUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${apiRoot}/users/update`, data)
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/users/refresh_token`)
  return response.data
}
