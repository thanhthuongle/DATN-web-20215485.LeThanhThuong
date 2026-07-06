import { describe, it, expect } from 'vitest'
import {
  userReducer,
  selectCurrentUser,
  loginUserAPI,
  logoutUserAPI,
  updateUserAPI
} from '~/redux/user/userSlice'

const initialState = { currentUser: null }

describe('userReducer', () => {
  it('trả về state khởi tạo', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('loginUserAPI.fulfilled lưu currentUser từ payload', () => {
    const user = { _id: 'u1', email: 'a@b.com' }
    const state = userReducer(
      initialState,
      loginUserAPI.fulfilled(user, 'reqId', {})
    )
    expect(state.currentUser).toEqual(user)
  })

  it('updateUserAPI.fulfilled cập nhật currentUser', () => {
    const previous = { currentUser: { _id: 'u1', displayName: 'Old' } }
    const updated = { _id: 'u1', displayName: 'New' }
    const state = userReducer(
      previous,
      updateUserAPI.fulfilled(updated, 'reqId', {})
    )
    expect(state.currentUser).toEqual(updated)
  })

  it('logoutUserAPI.fulfilled xoá currentUser về null', () => {
    const previous = { currentUser: { _id: 'u1' } }
    const state = userReducer(
      previous,
      logoutUserAPI.fulfilled({ loggedOut: true }, 'reqId', true)
    )
    expect(state.currentUser).toBeNull()
  })
})

describe('selectCurrentUser', () => {
  it('lấy currentUser từ root state', () => {
    const user = { _id: 'u1' }
    expect(selectCurrentUser({ user: { currentUser: user } })).toEqual(user)
  })
})
