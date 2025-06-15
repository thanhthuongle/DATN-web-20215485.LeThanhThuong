import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { apiRoot } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

export const fetchUserNotificationsAPI = createAsyncThunk(
  'notifications/fetchUserNotificationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${apiRoot}/notifications`)
    // Note: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)
export const updateUserNotificationsAPI = createAsyncThunk(
  'notifications/updateUserNotificationsAPI',
  async ({ isRead, userNotificationId }) => {
    const response = await authorizedAxiosInstance.put(`${apiRoot}/notifications/${userNotificationId}`, { isRead })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingNotification = action.payload
      state.currentNotifications.unshift(incomingNotification)
    }
  },
  extraReducers: (builder) => {
    builder.addCase (fetchUserNotificationsAPI.fulfilled, (state, action) => {
      let incomingNotifications = action.payload
      state.currentNotifications = Array.isArray(incomingNotifications)? incomingNotifications.reverse():[]
    })
    builder.addCase (updateUserNotificationsAPI.fulfilled, (state, action) => {
      const incomingNotifications = action.payload
      const getNotification = state.currentNotifications.find(i => i._id === incomingNotifications._id)
      getNotification.isRead = incomingNotifications.isRead
    })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

export const notificationsReducer = notificationsSlice.reducer
