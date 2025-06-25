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

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // interceptorLoadingElements(false)

  return response
}, (error) => {
  // interceptorLoadingElements(false)

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
