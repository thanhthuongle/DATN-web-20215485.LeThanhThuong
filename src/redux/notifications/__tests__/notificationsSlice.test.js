import { describe, it, expect } from 'vitest'
import {
  notificationsReducer,
  selectCurrentNotifications,
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification,
  fetchUserNotificationsAPI,
  updateUserNotificationsAPI
} from '~/redux/notifications/notificationsSlice'

const initialState = { currentNotifications: null }

describe('notificationsReducer - reducers đồng bộ', () => {
  it('trả về state khởi tạo', () => {
    expect(notificationsReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    )
  })

  it('updateCurrentNotifications ghi đè danh sách', () => {
    const list = [{ _id: 'n1' }, { _id: 'n2' }]
    const state = notificationsReducer(
      initialState,
      updateCurrentNotifications(list)
    )
    expect(state.currentNotifications).toEqual(list)
  })

  it('clearCurrentNotifications đặt lại về null', () => {
    const previous = { currentNotifications: [{ _id: 'n1' }] }
    const state = notificationsReducer(previous, clearCurrentNotifications())
    expect(state.currentNotifications).toBeNull()
  })

  it('addNotification chèn thông báo mới lên đầu danh sách', () => {
    const previous = { currentNotifications: [{ _id: 'n1' }] }
    const incoming = { _id: 'n2' }
    const state = notificationsReducer(previous, addNotification(incoming))
    expect(state.currentNotifications).toEqual([{ _id: 'n2' }, { _id: 'n1' }])
  })
})

describe('notificationsReducer - extraReducers', () => {
  it('fetch fulfilled đảo ngược mảng payload', () => {
    const payload = [{ _id: 'n1' }, { _id: 'n2' }, { _id: 'n3' }]
    const state = notificationsReducer(
      initialState,
      fetchUserNotificationsAPI.fulfilled(payload, 'reqId')
    )
    expect(state.currentNotifications).toEqual([
      { _id: 'n3' },
      { _id: 'n2' },
      { _id: 'n1' }
    ])
  })

  it('fetch fulfilled trả về mảng rỗng khi payload không phải mảng', () => {
    const state = notificationsReducer(
      initialState,
      fetchUserNotificationsAPI.fulfilled(null, 'reqId')
    )
    expect(state.currentNotifications).toEqual([])
  })

  it('update fulfilled cập nhật isRead của đúng thông báo', () => {
    const previous = {
      currentNotifications: [
        { _id: 'n1', isRead: false },
        { _id: 'n2', isRead: false }
      ]
    }
    const payload = { _id: 'n2', isRead: true }
    const state = notificationsReducer(
      previous,
      updateUserNotificationsAPI.fulfilled(payload, 'reqId', {
        isRead: true,
        userNotificationId: 'n2'
      })
    )
    expect(state.currentNotifications.find((n) => n._id === 'n2').isRead).toBe(
      true
    )
    expect(state.currentNotifications.find((n) => n._id === 'n1').isRead).toBe(
      false
    )
  })
})

describe('selectCurrentNotifications', () => {
  it('lấy currentNotifications từ root state', () => {
    const list = [{ _id: 'n1' }]
    expect(
      selectCurrentNotifications({
        notifications: { currentNotifications: list }
      })
    ).toEqual(list)
  })
})
