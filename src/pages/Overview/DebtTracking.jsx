import React, { useEffect, useState } from 'react'
import { StyledBox } from './Overview'
import { Typography, Box, Button, Grid } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import Divider from '@mui/material/Divider'
import { replaceLastSegment } from '~/utils/pathUtils'
import { createSearchParams, Link, useLocation } from 'react-router-dom'
import { getFullInfoIndividualTransactions} from '~/apis'
import { TRANSACTION_TYPES } from '~/utils/constants'
import ContactItem from '../LoansAndDebts/ContactItem'
import { forEach } from 'lodash'

// const groupTransaction = (data, key) => {
//   let totalAmount = {}
//   const grouped = data.reduce((acc, transaction) => {
//     const keyValue = transaction.detailInfo?.[key]

//     if (!acc[keyValue]) {
//       acc[keyValue] = []
//     }
//     if (!totalAmount[keyValue]) totalAmount[keyValue] = 0

//     acc[keyValue].push(transaction)

//     totalAmount[keyValue] += transaction.amount
//     // TODO: Tính thêm khoản đã trả hoăc đã thu
//     return acc
//   }, {})

//   const groupedArray = Object.entries(grouped).map(([keyValue, transactions]) => ({
//     [key]: keyValue,
//     totalAmount: totalAmount[keyValue],
//     transactions
//   }))

//   return groupedArray
// }
const groupTransaction = (data, key) => {
  let addStatusData = []
  if (key == 'borrowerId') {
    const finishedCollectMap = new Map()
    // Tạo map loanTransactionId → collect transaction
    data.forEach(item => {
      if (item.type === TRANSACTION_TYPES.COLLECT && item.detailInfo?.loanTransactionId) {
        finishedCollectMap.set(item.detailInfo.loanTransactionId, item)
      }
    })

    // Gắn isFinish và finishedTransaction nếu có
    addStatusData = data.map(item => {
      if (item.type === TRANSACTION_TYPES.LOAN) {
        const relatedCollect = finishedCollectMap.get(item._id)
        if (relatedCollect) {
          return {
            ...item,
            isFinish: true,
            collectionTransaction: relatedCollect
          }
        } else {
          return {
            ...item,
            isFinish: false
          }
        }
      }
      return { ...item }
    })
  } else if (key == 'lenderId') {
    const finishedBorrowingIds = new Map()
    // Tạo map
    data.forEach(item => {
      if (item.type === TRANSACTION_TYPES.REPAYMENT && item.detailInfo?.borrowingTransactionId) {
        finishedBorrowingIds.set(item.detailInfo.borrowingTransactionId, item)
      }
    })

    // Gắn isFinish và finishedTransaction nếu có
    addStatusData = data.map(item => {
      if (item.type === TRANSACTION_TYPES.BORROWING) {
        const relatedBorrowing = finishedBorrowingIds.get(item._id)
        if (relatedBorrowing) {
          return {
            ...item,
            isFinish: true,
            borrowingTransaction: relatedBorrowing
          }
        } else {
          return {
            ...item,
            isFinish: false
          }
        }
      }
      return { ...item }
    })
  }

  let totalAmount = {}
  let totalAmountWithReturn = {}
  let totalReturn = {}
  const grouped = addStatusData.reduce((acc, transaction) => {
    const keyValue = transaction.detailInfo?.[key]

    if (!acc[keyValue]) {
      acc[keyValue] = []
    }
    if (!totalAmount[keyValue]) totalAmount[keyValue] = 0
    if (!totalAmountWithReturn[keyValue]) totalAmountWithReturn[keyValue] = 0
    if (!totalReturn[keyValue]) totalReturn[keyValue] = 0

    acc[keyValue].push(transaction)

    if (transaction.type == TRANSACTION_TYPES.LOAN || transaction.type == TRANSACTION_TYPES.BORROWING) {
      totalAmount[keyValue] += transaction.amount
      if (transaction?.isFinish == false) totalAmountWithReturn[keyValue] += transaction.amount
    }
    else totalReturn[keyValue] += transaction.amount
    return acc
  }, {})

  let groupedArray = Object.entries(grouped).map(([keyValue, transactions]) => {
    const sortedTransactions = transactions.sort((a, b) => new Date(b.transactionTime) - new Date(a.transactionTime))
    return {
      [key]: keyValue,
      totalAmount: totalAmount[keyValue],
      totalAmountWithReturn: totalAmountWithReturn[keyValue],
      totalReturn: totalReturn[keyValue],
      transactions: sortedTransactions
    }
  })
  groupedArray = groupedArray.sort((a, b) => b.totalAmount - a.totalAmount)
  // console.log('🚀 ~ groupedArray ~ groupedArray:', groupedArray)

  return groupedArray
}

function DebtTracking() {
  const location = useLocation()
  const [data, setData] = useState(null)
  console.log('🚀 ~ DebtTracking ~ data:', data)

  // const updateStateData = async (res) => {
  //   let totalLoan = 0
  //   let totalBorrowing = 0
  //   let loanTransactions = res.filter(item => item.type == TRANSACTION_TYPES.LOAN)
  //   let borrowingTransactions = res.filter(item => item.type == TRANSACTION_TYPES.BORROWING)

  //   const loanDetails = await getIndividualDetailTransactions({ type: TRANSACTION_TYPES.LOAN, transactionIds: loanTransactions.map(item => item._id) })
  //   const borrowingDetails = await getIndividualDetailTransactions({ type: TRANSACTION_TYPES.BORROWING, transactionIds: borrowingTransactions.map(item => item._id) })

  //   loanTransactions = loanTransactions.map(transaction => {
  //     totalLoan += transaction.amount
  //     const detail = loanDetails.find(d => d.transactionId.toString() === transaction._id.toString())
  //     return {
  //       ...transaction,
  //       detailInfo: detail || null
  //     }
  //   })
  //   borrowingTransactions = borrowingTransactions.map(transaction => {
  //     totalBorrowing += transaction.amount
  //     const detail = borrowingDetails.find(d => d.transactionId.toString() === transaction._id.toString())
  //     return {
  //       ...transaction,
  //       detailInfo: detail || null
  //     }
  //   })

  //   const loanGroupedTransactions = groupTransaction(loanTransactions, 'borrowerId')
  //   const borrowingGroupedTransactions = groupTransaction(borrowingTransactions, 'lenderId')

  //   setData({
  //     totalLoan,
  //     totalBorrowing,
  //     loanGroupedTransactions,
  //     borrowingGroupedTransactions
  //   })
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const searchPath = `?${createSearchParams({ 'q[type]': [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING] })}`
  //     // TODO: Lấy thêm giao dịch thu nợ và trả nợ
  //     getIndividualTransactionAPI(searchPath).then(updateStateData)
  //   }

  //   fetchData()
  // }, [])

  const updateStateData = async (res) => {
    // console.log('🚀 ~ updateStateData ~ res:', res)
    let totalLoan = 0
    let totalBorrowing = 0
    let totalCollected = 0
    let totalPaid = 0

    let loanTransactions = []
    let borrowingTransactions = []
    let collectionTransactions = []
    let repaymentTransactions = []

    res.forEach(item => {
      switch (item.type) {
      case TRANSACTION_TYPES.LOAN:
        totalLoan += item.amount
        loanTransactions.push(item)
        break

      case TRANSACTION_TYPES.BORROWING:
        totalBorrowing += item.amount
        borrowingTransactions.push(item)
        break

      case TRANSACTION_TYPES.COLLECT:
        totalCollected += item.amount
        collectionTransactions.push(item)
        break

      case TRANSACTION_TYPES.REPAYMENT:
        totalPaid += item.amount
        repaymentTransactions.push(item)
        break
      }
    })

    const loanGroupedTransactions = groupTransaction([...loanTransactions, ...collectionTransactions], 'borrowerId')
    const borrowingGroupedTransactions = groupTransaction([...borrowingTransactions, ...repaymentTransactions], 'lenderId')

    setData({
      totalLoan,
      totalBorrowing,
      totalCollected,
      totalPaid,
      loanGroupedTransactions,
      borrowingGroupedTransactions
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const searchPath = `?${createSearchParams({ 'q[type]': [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING, TRANSACTION_TYPES.COLLECT, TRANSACTION_TYPES.REPAYMENT] })}`
      getFullInfoIndividualTransactions(searchPath)
        .then(updateStateData)
        .finally(() => {})
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
                value={data?.totalBorrowing}
                style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
              />
            </Box>
            <Box
              width='100%'
              maxHeight='800px'
              overflow='auto'
            >
              {data.borrowingGroupedTransactions && Array.isArray(data.borrowingGroupedTransactions) && data.borrowingGroupedTransactions?.length > 0 ? (
                data.borrowingGroupedTransactions.map((item) => (
                  Number(item?.totalAmountWithReturn) > 0 &&
                  <ContactItem
                    key={item.lenderId}
                    contact={item?.transactions[0].detailInfo.lender}
                    viewMode='debt'
                    amount={item.totalAmountWithReturn}
                    amountColor='#e74c3c' // #e74c3c
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                  />
                ))
              ) : (
                <Typography align="center" sx={{ opacity: 0.6, mt: 2 }}>
                  Không có dữ liệu khoản đi vay nào.
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
                value={data?.totalLoan}
                style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
              />
            </Box>
            <Box
              width='100%'
              maxWidth='100%'
              maxHeight='800px'
              overflow='auto'
            >
              {data.loanGroupedTransactions && Array.isArray(data.loanGroupedTransactions) && data.loanGroupedTransactions?.length > 0 ? (
                data.loanGroupedTransactions.map((item) => (
                  Number(item?.totalAmountWithReturn) > 0 &&
                  <ContactItem
                    key={item.borrowerId}
                    contact={item?.transactions[0].detailInfo.borrower}
                    amount={item.totalAmountWithReturn}
                    amountColor='#27ae60' // #27ae60
                    viewMode='loan'
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                  />
                ))
              ) : (
                <Typography align="center" sx={{ opacity: 0.6, mt: 2 }}>
                  Không có dữ liệu khoản cho vay nào.
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