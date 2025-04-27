import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import ListItemIcon from '@mui/material/ListItemIcon'

const savingOpeningOptions = [
  {
    value: 'close',
    lable: 'Tất toán',
    startIcon: <AssignmentTurnedInIcon fontSize='small'/>
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
  }
]

const savingClosedOptions = [
  {
    value: 'watch',
    lable: 'Xem',
    startIcon: <TextSnippetIcon fontSize='small'/>
  }
]

const ITEM_HEIGHT = 48

export default function SavingMenu({ isClosed }) { // isActive= true or false
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const options = isClosed==true ? savingClosedOptions : savingOpeningOptions
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
