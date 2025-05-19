import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import FinanceOverview from './FinanceOverview'
import TransactionSummary from './TransactionSummary'
import SpendingAnalysis from './SpendingAnalysis'
import DebtTracking from './DebtTracking'
import RecentTransactions from './RecentTransactions'
import { styled } from '@mui/material'
import { getIndividualMoneySourceAPI, getIndividualTransactionAPI } from '~/apis'
import { createSearchParams } from 'react-router-dom'
import { TRANSACTION_TYPES } from '~/utils/constants'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'

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
  const [moneySourceData, setMoneySourceData] = useState(null)
  // console.log('🚀 ~ Overview ~ moneySourceData:', moneySourceData)
  const [loanTransactionData, setLoanTransactionData] = useState(null)
  // console.log('🚀 ~ Overview ~ loanTransactionData:', loanTransactionData)
  const [borrowingTransactionData, setBorrowingTransactionData] = useState(null)
  // console.log('🚀 ~ Overview ~ borrowingTransactionData:', borrowingTransactionData)
  const [totalAmount, setTotalAmount] = useState(null)
  // console.log('🚀 ~ Overview ~ totalAmount:', totalAmount)

  // TODO: Lấy thêm giao dịch trả nợ và thu nợ về ghép vào rồi group theo contact nhá

  useEffect(() => {
    const fetchData = async () => {
      const moneySource = await getIndividualMoneySourceAPI()
      const loanTransaction = await getIndividualTransactionAPI(`?${createSearchParams({ 'q[type]': TRANSACTION_TYPES.LOAN })}`)
      const borrowingTransaction = await getIndividualTransactionAPI(`?${createSearchParams({ 'q[type]': TRANSACTION_TYPES.BORROWING })}`)
      let totalAmount = 0

      if (moneySource.accounts && Array.isArray(moneySource.accounts) && moneySource.accounts.length > 0) {
        totalAmount += moneySource.accounts.reduce((sum, item) => sum + item.balance, 0)
      }
      if (moneySource.savings_accounts && Array.isArray(moneySource.savings_accounts) && moneySource.savings_accounts.length > 0) {
        totalAmount += moneySource.savings_accounts.reduce((sum, item) => sum + item.balance, 0)
      }
      if (moneySource.accumulations && Array.isArray(moneySource.accumulations) && moneySource.accumulations.length > 0) {
        totalAmount += moneySource.accumulations.reduce((sum, item) => sum + item.balance, 0)
      }
      if (loanTransaction && Array.isArray(loanTransaction) && loanTransaction.length > 0) {
        totalAmount += loanTransaction.reduce((sum, item) => sum + item.amount, 0)
      }
      if (borrowingTransaction && Array.isArray(borrowingTransaction) && borrowingTransaction.length > 0) {
        totalAmount -= borrowingTransaction.reduce((sum, item) => sum + item.amount, 0)
      }

      setTotalAmount(totalAmount)
      setMoneySourceData(moneySource)
      setLoanTransactionData(loanTransaction)
      setBorrowingTransactionData(borrowingTransaction)
    }

    fetchData()
  }, [])

  if (!moneySourceData) {
    return <PageLoadingSpinner caption={'Loading data...'} />
  }

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
          totalAmount={totalAmount}
          availableAmount={0}
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