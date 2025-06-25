import axios from 'axios'
import { toast } from 'react-toastify'
// import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = _mainStore => { axiosReduxStore = _mainStore }

let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 reqquest: 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true


// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // chặn spam click
  // interceptorLoadingElements(true)

  return config
}, (error) => {
  return Promise.reject(error)
})


// Khởi tạo một cái promise cho việc gọi api refresh_token để gọi lại api bị lỗi sau khi refresh_token hoàn tất
let refreshTokenPromise = null

let isShowingNetworkError = false

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // interceptorLoadingElements(false)

  return response
}, (error) => {
  // interceptorLoadingElements(false)
  const config = error.config

  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Đảm bảo 1 thời điểm chỉ gọi lại api 1 lần trong if else
    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => { return data?.accessToken })
        .catch((_error) => {
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => { refreshTokenPromise = null })
    }

    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Retry nếu là lỗi mạng
  const shouldRetry = !error.response && (error.code === 'ECONNABORTED' || error.message === 'Network Error')
  const maxRetries = 3
  if (shouldRetry && (!config._retryCount || config._retryCount < maxRetries)) {
    config._retryCount = (config._retryCount || 0) + 1
    console.log('Thực hiện gọi lại API tự động khi lỗi mạng lần thứ ', config._retryCount)
    const retryDelay = 1000 * config._retryCount
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(authorizedAxiosInstance(config))
      }, retryDelay)
    })
  }

  //Gom lỗi mạng thành 1 thông báo duy nhất
  if (shouldRetry) {
    if (!isShowingNetworkError) {
      let errorMessage = error?.message
      if (error.response?.data?.message) {
        errorMessage = error.response?.data?.message
      }
      isShowingNetworkError = true
      toast.error(errorMessage)
      // toast.error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối Internet.', { theme: 'colored' })
      setTimeout(() => {
        isShowingNetworkError = false
      }, 5000) // sau 5s mới cho phép hiện lại
    }

    return Promise.reject(error)
  }

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
