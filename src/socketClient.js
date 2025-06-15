// Cấu hình socket.io: https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
import { apiRoot } from './utils/constants.js'
export const socketInstance = io(apiRoot)
