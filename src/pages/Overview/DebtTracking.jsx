import React from 'react'
import { StyledBox } from './Overview'
import { Typography, Box, Button, Grid } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import moment from 'moment'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import Divider from '@mui/material/Divider'
import { replaceLastSegment } from '~/utils/pathUtils'
import { Link, useLocation } from 'react-router-dom'

const loanLists = Array.from({ length: 10 }, (_, i) => ({
  contact: `Contact cho vay drfhgdfhfghjfghgdf ${i}`,
  repaymentDate: `ngày trả: ${moment(new Date()).format('DD/MM/YYYY')}`,
  amount: '123456754'
}))

const debtLists = Array.from({ length: 10 }, (_, i) => ({
  contact: `Contact vay ${i}`,
  repaymentDate: `ngày trả: ${moment(new Date()).format('DD/MM/YYYY')}`,
  amount: 1234567
}))

function DebtTracking() {
  const location = useLocation()
  return (
    <StyledBox
      width='100%'
      gap={2}
      display={'flex'}
      flexDirection={'column'}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <Typography variant="h6">Theo dõi vay nợ</Typography>
        <Button
          component={Link}
          to={replaceLastSegment(location?.pathname, 'loans-debts')}
          sx={{
            textTransform: 'none',
            p: 0,
            textDecoration: 'none'
          }}
        >
          <Typography variant="body1">Xem tất cả</Typography>
        </Button>
      </Box>

      <Box
        sx={{
          borderTop: 1,
          borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
        }}
        width='100%'
        paddingTop={2}
      >
        <Grid container>
          {/* Khoản vay */}
          <Box
            width={{ xs: '100%', sm:'49%' }}
            paddingX='2%'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Typography fontWeight='bold'>Khoản vay</Typography>
            <Box
              display='flex'
              width='100%'
              sx={{
                borderBottom: 1,
                borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
              }}
              paddingTop={2}
            >
              <Typography width='50%' display='flex' justifyContent='center'>Tổng</Typography>
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                suffix=" ₫"
                value={1234567}
                style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
              />
            </Box>
            <Box
              width='100%'
              maxHeight='800px'
              overflow='auto'
            >
              {loanLists && loanLists?.length > 0 ? (
                loanLists.map((loan, index) => (
                  <FinanceItem1
                    key={index}
                    title={loan?.contact}
                    description={loan.repaymentDate}
                    amount={loan.amount}
                    amountColor={'#27ae60'}
                    amountDesc={'dhsabydwaegifbniewuhbfuigewuifbiugidgfidg'}
                    sx={{
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                  />
                ))
              ) : (
                <Typography align="center" sx={{ opacity: 0.6, mt: 2 }}>
                  Không có dữ liệu khoản vay nào.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Divider */}
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' }
            }}
          />

          {/* Cho vay */}
          <Box
            width={{ xs: '100%', sm:'49%' }}
            paddingX='2%'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Typography fontWeight='bold'>Cho vay</Typography>
            <Box
              display='flex'
              width='100%'
              sx={{
                borderBottom: 1,
                borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
              }}
              paddingTop={2}
            >
              <Typography width='50%' display='flex' justifyContent='center'>Tổng</Typography>
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                suffix=" ₫"
                value={1234567}
                style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
              />
            </Box>
            <Box
              width='100%'
              maxWidth='100%'
              maxHeight='800px'
              overflow='auto'
            >
              {debtLists && debtLists?.length > 0 ? (
                debtLists.map((loan, index) => (
                  <FinanceItem1
                    key={index}
                    title={loan?.contact}
                    description={loan.repaymentDate}
                    amount={loan.amount}
                    amountColor={'#e74c3c'}
                    sx={{
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                  />
                ))
              ) : (
                <Typography align="center" sx={{ opacity: 0.6, mt: 2 }}>
                  Không có dữ liệu cho vay nào.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
    </StyledBox>
  )
}

export default DebtTracking