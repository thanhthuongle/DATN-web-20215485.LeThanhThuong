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
import { useLocation, useNavigate } from 'react-router-dom'
import { replaceLastSegment } from '~/utils/pathUtils'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import { Box } from '@mui/material'
import { toast } from 'react-toastify'
import { blockIndividualAccountAPI, unblockIndividualAccountAPI } from '~/apis'

const walletActiveOptions = [
  {
    value: 'transfer',
    lable: 'Chuyển khoản',
    startIcon: <SyncAltIcon fontSize='small'/>
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

export default function WalletMenu({ isActive, account, afterCreateNew }) { // isActive= true or false
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const options = isActive==true ? walletActiveOptions : walletInActiveOptions

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const confirm = useConfirm()
  const submitInActiveAccount= (account) => {
    confirm({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockIcon sx={{ color: 'warning.dark' }} /> Ngưng sử dụng tài khoản
      </Box>,
      description: `Bạn có chắc chắn ngưng sử dụng ${account?.accountName}`,
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(() => {

      // Gọi API...
      toast.promise(
        blockIndividualAccountAPI(account?._id),
        { pending: 'Đang ngưng sử dụng...' }
      ).then(res => {
        if (!res.error) {
          toast.success(`Ngưng sử dụng ${account?.accountName} thành công!`)
          afterCreateNew()
        }
      })
    }).catch(() => {})
  }
  const submitReActiveAccount= (account) => {
    confirm({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockOpenIcon sx={{ color: 'info.light' }} /> Tái sử dụng tài khoản
      </Box>,
      description: `Bạn có chắc chắn muốn tái sử dụng ${account?.accountName}`,
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(() => {

      // Gọi API...
      toast.promise(
        unblockIndividualAccountAPI(account?._id),
        { pending: 'Đang tái sử dụng...' }
      ).then(res => {
        if (!res.error) {
          toast.success(`Tái sử dụng ${account?.accountName} thành công!`)
          afterCreateNew()
        }
      })
    }).catch(() => {})
  }

  const handleSelected = (optionSelected, event) => {
    // console.log('🚀 ~ handleSelected ~ optionSelected:', optionSelected.value)
    switch (optionSelected.value) {
    case 'transfer': {
      navigate(replaceLastSegment(location?.pathname, `new-transaction?moneyFromId=${account?._id}`), { state: { transactionTypeDefault: TRANSACTION_TYPES.TRANSFER } })
      break
    }
    case 'inActive': {
      submitInActiveAccount(account)
      break
    }
    case 'reActivate': {
      submitReActiveAccount(account)
      break
    }
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
    </div>
  )
}
