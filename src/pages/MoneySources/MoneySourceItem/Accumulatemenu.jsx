import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItemIcon from '@mui/material/ListItemIcon'
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import DepositAccumulationPopup from '../MenuOptionPopup/DepositAccumulationPopup'
import UseAccumulationPopup from '../MenuOptionPopup/UseAccumulationPopup'
import FinishAccumulationPopup from '../MenuOptionPopup/FinishAccumulationPopup'

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
  // {
  //   value: 'edit',
  //   lable: 'Chỉnh sửa',
  //   startIcon: <EditIcon fontSize='small'/>
  // },
  // {
  //   value: 'delete',
  //   lable: 'Xóa',
  //   startIcon: <DeleteIcon fontSize='small'/>
  // },
  {
    value: 'finish',
    lable: 'Kết thúc',
    startIcon: <AssignmentTurnedInIcon fontSize='small'/>
  }
]

const accumulateFinishedgOptions = [
  // {
  //   value: 'watch',
  //   lable: 'Xem',
  //   startIcon: <TextSnippetIcon fontSize='small'/>
  // },
  // {
  //   value: 'use', // khi kết thúc ck số tiền về tài khoản reset số dư về 0 nếu còn
  //   lable: 'Sử dụng',
  //   startIcon: <AssignmentReturnIcon fontSize='small'/>
  // }
]

const ITEM_HEIGHT = 48

export default function AccumulateMenu({ isFinished, accumulation, accountData, refreshData }) { // isFinished = true or false
  // console.log('🚀 ~ AccumulateMenu ~ accumulation:', accumulation)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [isDepositPopupOpen, setDepositPopupOpen] = useState(false)
  const [isUsePopupOpen, setUsePopupOpen] = useState(false)
  const [isFinishPopupOpen, setFinishPopupOpen] = useState(false)

  const options = isFinished==true ? accumulateFinishedgOptions : accumulateFollowingOptions
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
    event.stopPropagation()
    switch (optionSelected.value) {
    case 'deposit':
      setDepositPopupOpen(true)
      break
    case 'use':
      setUsePopupOpen(true)
      break
    case 'finish':
      setFinishPopupOpen(true)
      break
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

      <DepositAccumulationPopup
        accumulation={accumulation}
        accountData={accountData}
        isOpen={isDepositPopupOpen}
        onClick={(event) => event.stopPropagation()}
        onClose={() => {
          // event.stopPropagation()
          setDepositPopupOpen(false)
        }}
        refreshData={refreshData}
      />

      <UseAccumulationPopup
        accumulation={accumulation}
        isOpen={isUsePopupOpen}
        onClick={(event) => event.stopPropagation()}
        onClose={() => {
          // event.stopPropagation()
          setUsePopupOpen(false)
        }}
        refreshData={refreshData}
      />

      <FinishAccumulationPopup
        accumulation={accumulation}
        accountData={accountData}
        isOpen={isFinishPopupOpen}
        onClick={(event) => event.stopPropagation()}
        onClose={() => {
          // event.stopPropagation()
          setFinishPopupOpen(false)
        }}
        refreshData={refreshData}
      />
    </div>
  )
}
