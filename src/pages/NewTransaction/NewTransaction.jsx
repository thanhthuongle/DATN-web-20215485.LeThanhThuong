import React, { useState } from 'react'
import { StyledBox } from '../Overview/Overview'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import CreateExpense from './CreateExpense'
import CreateIncome from './CreateIncome'
import CreateLend from './CreateLend'
import CreateBorrowing from './CreateBorrowing'
import CreateTransfer from './CreateTransfer'
import CreateContribution from './CreateContribution'
import { TRANSACTION_TYPES } from '~/utils/constants'

const transactionTypeLabels = {
  EXPENSE: 'Chi tiền',
  INCOME: 'Thu tiền',
  LEND: 'Cho vay',
  BORROWING: 'Đi vay',
  TRANSFER: 'Chuyển khoản',
  CONTRIBUTION: 'Đóng góp'
}

function NewTransaction() {
  // Lấy thông tin truyền vào khi tạo mới giao dịch
  const location = useLocation()
  const navigate = useNavigate()
  const transactionTypeDefault = location.state?.transactionTypeDefault

  const [transactionType, setTransactionType] = useState(transactionTypeDefault ?? TRANSACTION_TYPES.EXPENSE)

  const handleChangeTransactionType = (event) => {
    setTransactionType(event.target.value)
    navigate(location.pathname)
  }
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <StyledBox width={'100%'} >
        {/* select loại giao dịch */}
        <Box bgcolor={'#00aff0'} paddingY={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Box sx={{ width: 180 }}>
            <FormControl fullWidth>
              <Select
                labelId="transaction-type-select-label"
                id="transaction-type-select"
                value={transactionType}
                onChange={handleChangeTransactionType}
                sx={{
                  fontWeight: 'bold',
                  bgcolor: '#45c5f4',
                  borderRadius: '32px',
                  border: 'none',
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }}
              >
                <MenuItem value={TRANSACTION_TYPES.EXPENSE}>{transactionTypeLabels.EXPENSE}</MenuItem>
                <MenuItem value={TRANSACTION_TYPES.INCOME}>{transactionTypeLabels.INCOME}</MenuItem>
                <MenuItem value={TRANSACTION_TYPES.LOAN}>{transactionTypeLabels.LEND}</MenuItem>
                <MenuItem value={TRANSACTION_TYPES.BORROWING}>{transactionTypeLabels.BORROWING}</MenuItem>
                <MenuItem value={TRANSACTION_TYPES.TRANSFER}>{transactionTypeLabels.TRANSFER}</MenuItem>
                <MenuItem value={TRANSACTION_TYPES.CONTRIBUTION}>{transactionTypeLabels.CONTRIBUTION}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Nội dung chi tiết tạo giao dịch */}
        {transactionType == TRANSACTION_TYPES.EXPENSE && <CreateExpense /> }
        {transactionType == TRANSACTION_TYPES.INCOME && <CreateIncome /> }
        {transactionType == TRANSACTION_TYPES.LOAN && <CreateLend /> }
        {transactionType == TRANSACTION_TYPES.BORROWING && <CreateBorrowing /> }
        {transactionType == TRANSACTION_TYPES.TRANSFER && <CreateTransfer/> }
        {transactionType == TRANSACTION_TYPES.CONTRIBUTION && <CreateContribution /> }
      </StyledBox>
    </Box>
  )
}

export default NewTransaction