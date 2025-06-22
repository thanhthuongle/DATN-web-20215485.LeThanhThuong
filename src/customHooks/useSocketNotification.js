/* eslint-disable no-console */
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { apiRoot } from '~/utils/constants'

export const useSocketNotification = ({ onNotification }) => {
  const socketRef = useRef(null)

  useEffect(() => {
    // Khởi tạo socket
    socketRef.current = io(apiRoot, {
      withCredentials: true,
      transports: ['websocket']
    })

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id)
    })

    socketRef.current.on('notification', (data) => {
      console.log('📥 Nhận thông báo:', data)
      if (onNotification) onNotification(data)
    })

    socketRef.current.on('disconnect', () => {
      console.log('🛑 Socket disconnected')
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])
}
