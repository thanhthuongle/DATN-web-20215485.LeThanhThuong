import React from 'react'
import Box from '@mui/material/Box'
import FinanceOverview from './FinanceOverview'
import TransactionSummary from './TransactionSummary'
import SpendingAnalysis from './SpendingAnalysis'
import DebtTracking from './DebtTracking'
import RecentTransactions from './RecentTransactions'
import { styled } from '@mui/material'

export const StyledBox = styled(Box)(({ theme }) => ({
  borderWidth: '1px',
  borderRadius: '8px',
  borderStyle: 'solid',
  padding: '8px', // default (xs)
  // paddingRight: '8px', // default (xs)
  // paddingTop: '8px', // default (xs)
  // paddingBottom: '8px', // default (xs)
  [theme.breakpoints.up('sm')]: {
    padding: '16px'
  },
  borderColor: theme.palette.mode === 'light' ? '#ccc' : '#666',
  color: theme.palette.text.primary,
  '&:hover': {
    borderColor: theme.palette.mode === 'light' ? '#000' : '#fff'
  }
}))

function Overview() {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        {/* Tình hình tài chính */}
        <FinanceOverview
          totalAmount={123456}
          availableAmount={123456}
        />

        {/* Tình hình thu chi */}
        <TransactionSummary />

        {/* Phân tích chi tiêu */}
        <SpendingAnalysis />

        {/* Theo dõi vay nợ */}
        <DebtTracking />

        {/* Giao dịch gần đây */}
        <RecentTransactions />
      </Box>
    </Box>
  )
}

export default Overview