import React, { useState } from 'react'
import { StyledBox } from '../Overview/Overview'
import Box from '@mui/material/Box'
import { useLocation } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import CreateExpense from './CreateExpense'
import CreateIncome from './CreateIncome'
import CreateLend from './CreateLend'
import CreateBorrowing from './CreateBorrowing'
import CreateTransfer from './CreateTransfer'
import CreateContribution from './CreateContribution'

const transactionTypes = {
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
  const transactionTypeDefault = location.state?.transactionTypeDefault

  const [transactionType, setTranactionType] = useState(transactionTypeDefault ?? transactionTypes.EXPENSE)

  const handleChangeTransactionType = (event) => {
    setTranactionType(event.target.value)
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
                <MenuItem value={transactionTypes.EXPENSE}>{transactionTypes.EXPENSE}</MenuItem>
                <MenuItem value={transactionTypes.INCOME}>{transactionTypes.INCOME}</MenuItem>
                <MenuItem value={transactionTypes.LEND}>{transactionTypes.LEND}</MenuItem>
                <MenuItem value={transactionTypes.BORROWING}>{transactionTypes.BORROWING}</MenuItem>
                <MenuItem value={transactionTypes.TRANSFER}>{transactionTypes.TRANSFER}</MenuItem>
                <MenuItem value={transactionTypes.CONTRIBUTION}>{transactionTypes.CONTRIBUTION}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Nội dung chi tiết tạo giao dịch */}
        {transactionType == transactionTypes.EXPENSE && <CreateExpense /> }
        {transactionType == transactionTypes.INCOME && <CreateIncome /> }
        {transactionType == transactionTypes.LEND && <CreateLend /> }
        {transactionType == transactionTypes.BORROWING && <CreateBorrowing /> }
        {transactionType == transactionTypes.TRANSFER && <CreateTransfer/> }
        {transactionType == transactionTypes.CONTRIBUTION && <CreateContribution /> }
      </StyledBox>
    </Box>
  )
}

export default NewTransaction