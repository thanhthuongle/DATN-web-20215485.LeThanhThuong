import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Typography } from '@mui/material'

const menuMemberOptions = [
  {
    value: 'appoint_manager',
    lable: 'Chỉ định làm quản lý',
    startIcon: <AssignmentTurnedInIcon fontSize='small'/>
  },
  {
    value: 'delete',
    lable: 'Xóa khỏi gia đình',
    startIcon: <DeleteIcon fontSize='small' sx={{ color: 'red' }}/>
  }
]
const menuManagerOptions = [
  {
    value: 'remove_manager',
    lable: 'Hủy quyền quản lý',
    startIcon: <EditIcon fontSize='small'/>
  },
  {
    value: 'delete',
    lable: 'Xóa khỏi gia đình',
    startIcon: <DeleteIcon fontSize='small' sx={{ color: 'red' }}/>
  }
]

const ITEM_HEIGHT = 48

export default function MemberMenu({ isManager }) { // isManager= true or false
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const options = isManager==true ? menuManagerOptions : menuMemberOptions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelected = (optionSelected) => {
    // console.log('🚀 ~ handleSelected ~ optionSelected:', optionSelected.value)
    //TODO: Xử lý với các lựa chọn tương ứng
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ padding: 0 }}
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
              maxHeight: ITEM_HEIGHT * 4.5
            }
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} onClick={() => handleSelected(option)}>
            <ListItemIcon>
              {option.startIcon}
            </ListItemIcon>
            {option.value === 'delete' &&
              <Typography sx={{ color: 'red' }}>{option.lable}</Typography>
            }
            {option.value != 'delete' &&
              <Typography>{option.lable}</Typography>
            }
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
