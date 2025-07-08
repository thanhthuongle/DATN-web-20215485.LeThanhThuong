import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItemIcon from '@mui/material/ListItemIcon'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import UpdateTrustLevel from '../LoanPopup/UpdateTrustLevel'

const FollowingLoanOptions = [
  {
    value: 'collect',
    lable: 'Thu nợ',
    startIcon: <RequestQuoteIcon fontSize='small'/>
  },
  {
    value: 'updateTrustLevel',
    lable: 'Cập nhật mức uy tín',
    startIcon: <WorkspacePremiumIcon fontSize='small'/>
  }
]

const FinishedLoanOptions = [
  {
    value: 'view',
    lable: 'xem',
    startIcon: <RequestQuoteIcon fontSize='small'/>
  },
  {
    value: 'updateTrustLevel',
    lable: 'Cập nhật mức uy tín',
    startIcon: <WorkspacePremiumIcon fontSize='small'/>
  }
]

const ITEM_HEIGHT = 48

export default function LoanMenu({ isFinish, contact, refreshData }) { // isActive= true or false
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [openUpdateTrustLevelPopup, setOpenUpdateTrustLevelPopup] = React.useState(false)
  const open = Boolean(anchorEl)
  const options = isFinish==false ? FollowingLoanOptions : FinishedLoanOptions

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
    case 'view': {
      // console.log('collect')
      setAnchorEl(null)
      break
    }
    case 'collect': {
      // console.log('collect')
      setAnchorEl(null)
      break
    }
    case 'updateTrustLevel': {
      handleClose(event)
      setOpenUpdateTrustLevelPopup(true)
      // console.log('🚀 ~ handleSelected ~ updateTrustLevel:')
      break
    }
    default:
      handleClose(event)
      break
    }
    // handleClose(event)
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
        // onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 'auto'
            }
          }
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            // onMouseDown={(e) => e.stopPropagation()}
            // onMouseUp={(e) => e.stopPropagation()}
            onClick={(event) => handleSelected(option, event)}
          >
            <ListItemIcon>
              {option.startIcon}
            </ListItemIcon>
            {option.lable}
          </MenuItem>
        ))}
      </Menu>

      <UpdateTrustLevel
        isOpen={openUpdateTrustLevelPopup}
        onClose={() => { setOpenUpdateTrustLevelPopup(false) }}
        contact={contact}
        afterUpdate={refreshData}
      />
    </div>
  )
}
