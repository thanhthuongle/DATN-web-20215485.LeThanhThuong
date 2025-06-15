import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { userReducer } from './user/userSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

// Cấu hình persist
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whilelist: ['user']
}

const reducers = combineReducers({
  user: userReducer,
  notifications: notificationsReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning error was implement redux-persist
  // https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
