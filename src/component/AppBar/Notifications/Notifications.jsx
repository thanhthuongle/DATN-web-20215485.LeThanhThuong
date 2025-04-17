import { useState } from 'react'
import { Box } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

function Notifications() {
  const [newNotification, setNewNotification] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const notifications = ''

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
        {(!notifications || notifications?.length === 0) && <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
      </ Menu>
    </ Box>
  )
}

export default Notifications