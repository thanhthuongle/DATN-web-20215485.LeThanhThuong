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

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/users/refresh_token`)
  return response.data
}

/** Transaction */
export const createIndividualTransactionAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/transactions/individual`, data)
  return response.data
}
export const getIndividualTransactionAPI = async (searchPath) => {
  const url = searchPath
    ? `${apiRoot}/transactions/individual${searchPath}`
    : `${apiRoot}/transactions/individual`

  const response = await authorizedAxiosInstance.get(url)
  return response.data
}
export const getIndividualRecentTransactions = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/transactions/individual/recentTransactions`)
  return response.data
}
export const getIndividualDetailTransactions = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/transactions/individual/detailTransactions`, data)
  return response.data
}

/** category */
export const getIndividualCategoryAPI = async (searchPath) => {
  const url = searchPath
    ? `${apiRoot}/categories/individual${searchPath}`
    : `${apiRoot}/categories/individual`
  const response = await authorizedAxiosInstance.get(url)
  return response.data
}

/** money_source */
export const getIndividualMoneySourceAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/moneySources/individual`)
  return response.data
}

/** account */
export const getIndividualAccountAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/accounts/individual`)
  return response.data
}

export const createIndividualAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/accounts/individual`, data)
  return response.data
}

/** contact */
export const getIndividualContactAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/contacts/individual`)
  return response.data
}
export const createIndividualContactAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/contacts/individual`, data)
  return response.data
}

/** bank */
export const getBankInfo = async (bankId) => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/banks/${bankId}`)
  return response.data
}

export const getBanks = async () => {
  const response = await authorizedAxiosInstance.get(`${apiRoot}/banks`)
  return response.data
}

/** accumulation */
export const createIndividualAccumulationAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/accumulations/individual`, data)
  return response.data
}

/** Saving */
export const createIndividualSavingAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${apiRoot}/savings/individual`, data)
  return response.data
}
