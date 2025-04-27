import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemIcon from '@mui/material/ListItemIcon'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'

const accumulateFollowingOptions = [
  {
    value: 'deposit',
    lable: 'Gửi vào',
    startIcon: <AssignmentReturnedIcon fontSize='small'/>
  },
  {
    value: 'use',
    lable: 'Sử dụng',
    startIcon: <AssignmentReturnIcon fontSize='small'/>
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
    value: 'finish',
    lable: 'Kết thúc',
    startIcon: <AssignmentTurnedInIcon fontSize='small'/>
  }
]

const accumulateFinishedgOptions = [
  {
    value: 'watch',
    lable: 'Xem',
    startIcon: <TextSnippetIcon fontSize='small'/>
  },
  {
    value: 'use', // khi kết thúc nhưng vẫn còn số dư chưa dùng hết
    lable: 'Sử dụng',
    startIcon: <AssignmentReturnIcon fontSize='small'/>
  }
]

const ITEM_HEIGHT = 48

export default function AccumulateMenu({ isFinished }) { // isFinished = true or false
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const options = isFinished==true ? accumulateFinishedgOptions : accumulateFollowingOptions
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
