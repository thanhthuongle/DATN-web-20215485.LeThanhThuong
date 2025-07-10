
import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItemIcon from '@mui/material/ListItemIcon'
import WarningIcon from '@mui/icons-material/Warning'
import CancelIcon from '@mui/icons-material/Cancel'
import { Box } from '@mui/material'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { TRUST_LEVEL_LOAN } from '~/utils/constants'
import { updateTrustLevelLoan } from '~/apis'

const FollowingLoanOptions = [
  {
    value: 'normal',
    lable: 'Nợ bình thường',
    startIcon: <WarningIcon fontSize='small'/>
  },
  {
    value: 'warning',
    lable: 'Nợ khó thu',
    startIcon: <WarningIcon fontSize='small'/>
  },
  {
    value: 'bad',
    lable: 'Không thể thu',
    startIcon: <CancelIcon fontSize='small'/>
  }
]

const FinishedLoanOptions = []

const ITEM_HEIGHT = 48

export default function ContactLoanListMenu({ isFinish = false, loanTransaction, refreshData }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  let options = isFinish==false ? FollowingLoanOptions : FinishedLoanOptions
  options = options.filter((item) => item?.value != loanTransaction?.detailInfo?.trustLevel)

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const confirm = useConfirm()
  const submitMarkWarningLoan= (transaction) => {
    confirm({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon sx={{ color: 'darkorange' }} /> Đánh dấu khoản cho vay khó thu
      </Box>,
      description: <>
        Bạn có chắc chắn muốn đánh dấu khoản <strong>{transaction?.amount}&nbsp;₫</strong> cho <strong>{transaction?.detailInfo?.borrower?.name}</strong> vay là <strong>khoản cho vay khó thu</strong> không?
      </>,
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(() => {
      // console.log('🚀 ~ submitMarkWarningLoan ~ transaction:', transaction)
      const updateData = {
        transactionId: transaction?._id,
        trustLevel: TRUST_LEVEL_LOAN.WARNING
      }
      // console.log('🚀 ~ submitMarkWarningLoan ~ updateData:', updateData)
      // Gọi API...
      toast.promise(
        updateTrustLevelLoan(updateData),
        { pending: 'Đang xử lý...' }
      ).then(res => {
        if (!res.error) {
          toast.success('Đánh dấu khoản cho vay khó thu thành công')
          refreshData()
        }
      })
    }).catch(() => {})
  }

  const submitMarkBadLoan= (transaction) => {
    confirm({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CancelIcon sx={{ color: 'red' }} /> Đánh dấu khoản cho vay không thể thu
      </Box>,
      description: <>
        Bạn có chắc chắn muốn đánh dấu khoản <strong>{transaction?.amount}&nbsp;₫</strong> cho <strong>{transaction?.detailInfo?.borrower?.name}</strong> vay là <strong>khoản cho vay không thể thu</strong> không?
      </>,
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(() => {
      // console.log('🚀 ~ submitMarkBadLoan ~ transaction:', transaction)
      const updateData = {
        transactionId: transaction?._id,
        trustLevel: TRUST_LEVEL_LOAN.BAD
      }
      // console.log('🚀 ~ submitMarkBadLoan ~ updateData:', updateData)
      // Gọi API...
      toast.promise(
        updateTrustLevelLoan(updateData),
        { pending: 'Đang xử lý...' }
      ).then(res => {
        if (!res.error) {
          toast.success('Đánh dấu khoản cho vay không thể thu thành công')
          refreshData()
        }
      })
    }).catch(() => {})
  }

  const submitMarkNormalLoan= (transaction) => {
    confirm({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon sx={{ color: 'darkorange' }} /> Đánh dấu khoản cho vay bình thường
      </Box>,
      description: <>
        Bạn có chắc chắn muốn đánh dấu khoản <strong>{transaction?.amount}&nbsp;₫</strong> cho <strong>{transaction?.detailInfo?.borrower?.name}</strong> vay là <strong>khoản cho vay bình thường</strong> không?
      </>,
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(() => {
      // console.log('🚀 ~ submitMarkNormalLoan ~ transaction:', transaction)
      const updateData = {
        transactionId: transaction?._id,
        trustLevel: TRUST_LEVEL_LOAN.NORMAL
      }
      // console.log('🚀 ~ submitMarkNormalLoan ~ updateData:', updateData)
      // Gọi API...
      toast.promise(
        updateTrustLevelLoan(updateData),
        { pending: 'Đang xử lý...' }
      ).then(res => {
        if (!res.error) {
          toast.success('Đánh dấu khoản cho vay bình thường thành công')
          refreshData()
        }
      })
    }).catch(() => {})
  }

  const handleSelected = (optionSelected, event) => {
    switch (optionSelected.value) {
    case 'normal': {
      submitMarkNormalLoan(loanTransaction)
      setAnchorEl(null)
      break
    }
    case 'warning': {
      submitMarkWarningLoan(loanTransaction)
      setAnchorEl(null)
      break
    }
    case 'bad': {
      submitMarkBadLoan(loanTransaction)
      setAnchorEl(null)
      break
    }
    default:
      break
    }
    handleClose(event)
  }

  if (isFinish) return null

  return (
    <Box>
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
              width: 'auto'
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
    </Box>
  )
}
