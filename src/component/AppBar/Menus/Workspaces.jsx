import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import Divider from '@mui/material/Divider'
import ArchiveIcon from '@mui/icons-material/Archive'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

function Workspaces() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        color='white'
        sx={{ borderRadius: '8px', color: 'white' }}
        id="basic-button"
        aria-controls={open ? 'grouped-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
      >
        Options
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
        <MenuItem onClick={handleClose}>Tài chính cá nhân</MenuItem>
        <MenuItem onClick={handleClose}>Tài chính gia đình</MenuItem>
      </Menu>
    </div>
  )
}

export default Workspaces