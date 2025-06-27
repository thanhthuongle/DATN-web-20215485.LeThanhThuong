import React, { useEffect, useState } from 'react'
import { StyledBox } from './Overview'
import { Typography, Box, Button, Grid } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import Divider from '@mui/material/Divider'
import { replaceLastSegment } from '~/utils/pathUtils'
import { createSearchParams, Link, useLocation } from 'react-router-dom'
import { getIndividualDetailTransactions, getIndividualTransactionAPI } from '~/apis'
import { TRANSACTION_TYPES } from '~/utils/constants'

const groupTransaction = (data, key) => {
  let totalAmount = {}
  const grouped = data.reduce((acc, transaction) => {
    const keyValue = transaction.detailInfo?.[key]

    if (!acc[keyValue]) {
      acc[keyValue] = []
    }
    if (!totalAmount[keyValue]) totalAmount[keyValue] = 0

    acc[keyValue].push(transaction)

    totalAmount[keyValue] += transaction.amount
    // TODO: Tính thêm khoản đã trả hoăc đã thu
    return acc
  }, {})

  const groupedArray = Object.entries(grouped).map(([keyValue, transactions]) => ({
    [key]: keyValue,
    totalAmount: totalAmount[keyValue],
    transactions
  }))

  return groupedArray
}

function DebtTracking() {
  const location = useLocation()
  const [data, setData] = useState(null)
  // console.log('🚀 ~ DebtTracking ~ data:', data)

  const updateStateData = async (res) => {
    let totalLoan = 0
    let totalBorrowing = 0
    let loanTransactions = res.filter(item => item.type == TRANSACTION_TYPES.LOAN)
    let borrowingTransactions = res.filter(item => item.type == TRANSACTION_TYPES.BORROWING)

    const loanDetails = await getIndividualDetailTransactions({ type: TRANSACTION_TYPES.LOAN, transactionIds: loanTransactions.map(item => item._id) })
    const borrowingDetails = await getIndividualDetailTransactions({ type: TRANSACTION_TYPES.BORROWING, transactionIds: borrowingTransactions.map(item => item._id) })

    loanTransactions = loanTransactions.map(transaction => {
      totalLoan += transaction.amount
      const detail = loanDetails.find(d => d.transactionId.toString() === transaction._id.toString())
      return {
        ...transaction,
        detailInfo: detail || null
      }
    })
    borrowingTransactions = borrowingTransactions.map(transaction => {
      totalBorrowing += transaction.amount
      const detail = borrowingDetails.find(d => d.transactionId.toString() === transaction._id.toString())
      return {
        ...transaction,
        detailInfo: detail || null
      }
    })

    const loanGroupedTransactions = groupTransaction(loanTransactions, 'borrowerId')
    const borrowingGroupedTransactions = groupTransaction(borrowingTransactions, 'lenderId')

    setData({
      totalLoan,
      totalBorrowing,
      loanGroupedTransactions,
      borrowingGroupedTransactions
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const searchPath = `?${createSearchParams({ 'q[type]': [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING] })}`
      // TODO: Lấy thêm giao dịch thu nợ và trả nợ
      getIndividualTransactionAPI(searchPath).then(updateStateData)
    }

    fetchData()
  }, [])

  if (!data) {
    return <></>
  }
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
                suffix="&nbsp;₫"
                value={data.totalLoan}
                style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
              />
            </Box>
            <Box
              width='100%'
              maxHeight='800px'
              overflow='auto'
            >
              {data.loanGroupedTransactions && Array.isArray(data.loanGroupedTransactions) && data.loanGroupedTransactions?.length > 0 ? (
                data.loanGroupedTransactions.map((item) => (
                  <FinanceItem1
                    key={item.borrowerId}
                    title={item?.transactions[0].detailInfo.borrower.name}
                    amount={item.totalAmount}
                    amountColor={'#27ae60'} // #27ae60
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
                suffix="&nbsp;₫"
                value={data.totalBorrowing}
                style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
              />
            </Box>
            <Box
              width='100%'
              maxWidth='100%'
              maxHeight='800px'
              overflow='auto'
            >
              {data.borrowingGroupedTransactions && Array.isArray(data.borrowingGroupedTransactions) && data.borrowingGroupedTransactions?.length > 0 ? (
                data.borrowingGroupedTransactions.map((item) => (
                  <FinanceItem1
                    key={item.lenderId}
                    title={item?.transactions[0].detailInfo.lender.name}
                    amount={item.totalAmount}
                    amountColor={'#e74c3c'} // #e74c3c
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