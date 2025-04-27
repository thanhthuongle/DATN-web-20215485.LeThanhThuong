import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ListItemIcon from '@mui/material/ListItemIcon'

const walletActiveOptions = [
  {
    value: 'transfer',
    lable: 'Chuyển khoản',
    startIcon: <SyncAltIcon fontSize='small'/>
  },
  {
    value: 'edit',
    lable: 'Chỉnh sửa',
    startIcon: <EditIcon fontSize='small'/>
  },
  {
    value: 'delete',
    lable: 'Xóa',
    startIcon: <DeleteIcon fontSize='small'/>
  },
  {
    value: 'inActive',
    lable: 'Ngưng sử dụng',
    startIcon: <LockIcon fontSize='small'/>
  }
]

const walletInActiveOptions = [
  {
    value: 'reActivate',
    lable: 'Sử dụng lại',
    startIcon: <LockOpenIcon fontSize='small'/>
  }
]

const ITEM_HEIGHT = 48

export default function WalletMenu({ isActive }) { // isActive= true or false
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const options = isActive==true ? walletActiveOptions : walletInActiveOptions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelected = (optionSelected) => {
    console.log('🚀 ~ handleSelected ~ optionSelected:', optionSelected.value)
    //TODO: Xử lý với các lựa chọn tương ứng
    handleClose()
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch'
            }
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} onClick={() => handleSelected(option)}>
            <ListItemIcon>
              {option.startIcon}
            </ListItemIcon>
            {option.lable}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
