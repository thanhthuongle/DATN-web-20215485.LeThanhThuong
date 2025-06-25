import { useEffect, useState } from 'react'
import { Box, Button, Chip, CircularProgress, Divider, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification, fetchUserNotificationsAPI, selectCurrentNotifications, updateUserNotificationsAPI } from '~/redux/notifications/notificationsSlice'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import GroupAddIcon from '@mui/icons-material/GroupAdd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSocketNotification } from '~/customHooks/useSocketNotification'

function Notifications() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState([])
  const [newNotification, setNewNotification] = useState(false)

  // lấy noti từ redux
  const notifications = useSelector(selectCurrentNotifications)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useSocketNotification({
    onNotification: (newNoti) => {
      // console.log('🚀 ~ Notifications ~ newNoti:', newNoti)
      dispatch(addNotification(newNoti))
      setNewNotification(true)
    }
  })

  // Lấy danh sách thông báo từ BE
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserNotificationsAPI())
      .then(res => {
        if (Array.isArray(res?.payload) && res?.payload?.length > 0) {
          const hasUnread = res.payload.some(notification => !notification?.isRead)
          setNewNotification(hasUnread)
        }
      })
  }, [dispatch])

  // Đánh dấu đã đọc thông báo
  const markReaded = (userNotificationId) => {
    setIsLoading((prev) => [...prev, userNotificationId])
    dispatch(updateUserNotificationsAPI({ isRead: true, userNotificationId }))
      // eslint-disable-next-line no-unused-vars
      .then(res => {
        // console.log('🚀 ~ markReaded ~ res:', res)
      })
      .finally(() => {
        setIsLoading((prev) => prev.filter(id => id !== userNotificationId))
      })
  }

  // Điều hướng nếu thông báo chứa link
  const handleClickNotification = (notification) => {
    if (notification?.notificationData?.link) {
      handleClose()
      if (!notification?.isRead) markReaded(notification?._id)
      navigate(notification?.notificationData?.link)
    }
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          // variant="none"
          // variant="dot"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            // color: 'white'
            // color: 'yellow'
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications?.length === 0) && <MenuItem sx={{ minWidth: 200 }}>Bạn chưa có thông báo nào.</MenuItem>}
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem
              onClick={() => handleClickNotification(notification)}
              sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: 'auto',
                '&:hover': {
                  backgroundColor: theme => theme.palette.action.hover
                },
                transition: 'background-color 0.2s ease',
                // backgroundColor: !notification.isRead ? '#fffbea' : 'white',
                borderLeft: !notification.isRead ? '4px solid #ffc107' : 'none'
              }}
            >
              <Box sx={{ width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification?.title}</strong></Box>
                  <Box>{notification?.message}</Box>
                </Box> */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupAddIcon fontSize="small" />
                      <strong>{notification?.notificationData?.title}</strong>
                    </Box>
                    <Box>
                      {/* Khi Status của thông báo này là chưa đọc */}
                      {!notification?.isRead &&
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            className="interceptor-loading"
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                            disabled={isLoading?.includes(notification?._id) ? true : false}
                            onClick={(e) => {
                              e.stopPropagation()
                              markReaded(notification?._id)
                            }}
                            sx={{
                              fontSize: '12px',
                              textTransform: 'none',
                              borderRadius: '12px'
                            }}
                          >
                            {isLoading?.includes(notification?._id) ? <CircularProgress size={18} thickness={5} /> : 'Đánh dấu đã đọc'}
                          </Button>
                        </Box>
                      }

                      {/* Khi Status của thông báo này là đã đọc */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                        {notification?.isRead &&
                            <Chip icon={<DoneAllIcon />} label="Đã đọc" color="success" size="small" />
                        }
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: 'pre-wrap', marginY: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: notification?.notificationData?.message }}
                  />
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification?.receiveAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== (notifications.length - 1) && <Divider />}
          </Box>
        )}
      </ Menu>
    </ Box>
  )
}

export default Notifications