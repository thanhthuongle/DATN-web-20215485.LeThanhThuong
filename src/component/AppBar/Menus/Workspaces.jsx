import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'

function Workspaces() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const location = useLocation()
  const navigate = useNavigate()
  const workspaceOptions = [
    { value: 'TCCN', label: 'Tài chính cá nhân', target: '/' },
    { value: 'TCGD', label: 'Tài chính gia đình', target: '/groups' }
  ]
  const workspaceLable =
  location.pathname.startsWith('/groups')
    ? workspaceOptions[1].label
    : workspaceOptions[0].label
  //TODO: khi path bắt đầu với'/groups/:groupId' thì cần check familyName để hiển thị tên lên label

  const handleClose = (event) => {
    // console.log('🚀 ~ handleClose ~ event:', event.currentTarget.getAttribute('value'))
    const a = (event.currentTarget.getAttribute('value') === 'TCCN') ? 'Tài chính cá nhân' : 'Tài chính gia đình'
    if (a != workspaceLable) navigate(event.currentTarget.getAttribute('target'))
    setAnchorEl(null)
  }
  return (
    <Box>
      <Button
        color='white'
        sx={{
          borderRadius: '8px',
          color: 'white',
          minWidth: '195px'
        }}
        id="basic-button"
        aria-controls={open ? 'grouped-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
      >
        {workspaceLable}
      </Button>
      <Menu
        id="grouped-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {workspaceOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            target={option.target}
            selected={workspaceLable === option.label}
            onClick={handleClose}
          >{option.label}</MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default Workspaces