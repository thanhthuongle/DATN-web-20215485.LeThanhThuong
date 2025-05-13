import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 reqquest: 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// Tự động đính kèm cookie
authorizedAxiosInstance.defaults.withCredentials = true

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // chặn spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  return Promise.reject(error)
})

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // chặn spam click
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // chặn spam click
  interceptorLoadingElements(false)

  // Do something with response error
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance
