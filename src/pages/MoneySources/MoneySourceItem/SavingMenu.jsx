import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ListItemIcon from '@mui/material/ListItemIcon'
import CloseSavingPopup from '../MenuOptionPopup/CloseSavingPopup'

const savingOpeningOptions = [
  {
    value: 'close',
    lable: 'Tất toán',
    startIcon: <AssignmentTurnedInIcon fontSize='small'/>
  }
  // {
  //   value: 'edit',
  //   lable: 'Chỉnh sửa',
  //   startIcon: <EditIcon fontSize='small'/>
  // },
  // {
  //   value: 'delete',
  //   lable: 'Xóa',
  //   startIcon: <DeleteIcon fontSize='small'/>
  // }
]

const savingClosedOptions = [
  // {
  //   value: 'watch',
  //   lable: 'Xem',
  //   startIcon: <TextSnippetIcon fontSize='small'/>
  // }
]

const ITEM_HEIGHT = 48

export default function SavingMenu({ isClosed, saving, accountData, refreshData }) { // isActive= true or false
  // console.log('🚀 ~ SavingMenu ~ saving:', saving)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const options = isClosed==true ? savingClosedOptions : savingOpeningOptions
  const [isClosePopupOpen, setClosePopupOpen] = React.useState(false)

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null)
  }


  const handleSelected = (optionSelected, event) => {
    // console.log('🚀 ~ handleSelected ~ optionSelected:', optionSelected.value)
    switch (optionSelected.value) {
    case 'close': {
      setClosePopupOpen(true)
      break
    }
    default:
      break
    }
    handleClose(event)
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
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
        onClick={(e) => e.stopPropagation()}
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
          <MenuItem
            key={option.value}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(event) => handleSelected(option, event)}
          >
            <ListItemIcon>
              {option.startIcon}
            </ListItemIcon>
            {option.lable}
          </MenuItem>
        ))}
      </Menu>

      <CloseSavingPopup
        saving={saving}
        accountData={accountData}
        isOpen={isClosePopupOpen}
        onClick={(event) => event.stopPropagation()}
        onClose={() => {
          // event.stopPropagation()
          setClosePopupOpen(false)
        }}
        afterCloseSaving={refreshData}
      />
    </div>
  )
}
