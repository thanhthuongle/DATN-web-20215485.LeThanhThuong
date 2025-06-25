import { Box, Button, Divider, LinearProgress, linearProgressClasses, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyledBox } from '~/pages/Overview/Overview'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { NumericFormat } from 'react-number-format'
import moment from 'moment'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { createSearchParams } from 'react-router-dom'
import { getIndividualTransactionAPI } from '~/apis'

const redTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.CONTRIBUTION, TRANSACTION_TYPES.REPAYMENT]
const greenTypes = [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.BORROWING, TRANSACTION_TYPES.COLLECT]
const getColorForTransaction = (transactionTypeProp) => {
  if (redTypes.includes(transactionTypeProp)) {
    return '#e74c3c'
  } else if (greenTypes.includes(transactionTypeProp)) {
    return '#27ae60'
  } else {
    return 'text.primary'
  }
}

function processDataRaw(transactions) {
  const result = {
    byDate: {}
  }

  transactions.forEach((transaction) => {
    const dateKey = moment(transaction.transactionTime).format('YYYY-MM-DD')
    if (!result.byDate[dateKey]) { result.byDate[dateKey] = [] }
    result.byDate[dateKey].push(transaction)

  })

  const groupedByDate = Object.entries(result.byDate).map(([date, transactions]) => ({
    transactionTime: moment(date).toISOString(),
    transactions
  }))


  return {
    groupedByDate
  }
}

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'backgroundColorLight' && prop !== 'backgroundColorDark'
})(({ theme, backgroundColorLight, backgroundColorDark }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: backgroundColorLight,
    ...theme.applyStyles('dark', {
      backgroundColor: backgroundColorDark
    })
  }
}))

function BudgetPopup({ commonData, budget, handleCancel }) {
  console.log('🚀 ~ BudgetPopup ~ budget:', budget)
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)

  const updateStateData = (res) => {
    const processedData = processDataRaw(res)
    // console.log('🚀 ~ updateStateData ~ processedData:', processedData)
    setTransactionProcessedDatas(processedData)
  }

  const getTransactionData = async () => {
    // console.log('🚀 ~ getTransactionData ~ account?.transactionIds:', account?.transactionIds)
    if (!budget?.transactionIds || (Array.isArray(budget?.transactionIds) && budget?.transactionIds.length == 0)) {
      updateStateData([])
      return
    }
    const params = {}
    params['q[transactionIds]'] = budget?.transactionIds || []
    const searchPath = `?${createSearchParams(params)}`
    getIndividualTransactionAPI(searchPath).then(updateStateData)
  }

  useEffect(() => {
    getTransactionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {/* Tên hạng mục lập ngân sách*/}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>{budget?.categoryName}</Typography>
        </Box>

        {/* Thông tin cơ bản */}
        <StyledBox>
          <List disablePadding >
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText
                primary={ <Typography variant="body1" color="text.primary"> {moment(commonData.startTime).format('DD/MM/YYYY')}&nbsp;-&nbsp;{moment(commonData.endTime).format('DD/MM/YYYY')} </Typography> }
                secondary={ <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0.2 }}>
                  {moment().isAfter(moment(commonData.endTime)) ? 'Đã kết thúc' : `Còn lại: ${moment(commonData.endTime).diff(moment(), 'days')} ngày`}
                </Typography> }
              />
            </ListItem>
            <Divider sx={{ marginY: 1 }} />
            <ListItem disablePadding>
              <ListItemText
                primary={
                  <Box display={'flex'} flexDirection={'column'} gap={1.5}>
                    <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
                      <NumericFormat
                        displayType='text'
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        suffix="&nbsp;₫"
                        value={Number(budget.amount)}
                        style={{ fontWeight: '', maxWidth: '100%' }}
                      />
                    </Box>
                    <Box >
                      {Number(budget.spent) > Number(budget.amount)
                        ? ( <BorderLinearProgress variant="determinate" backgroundColorLight='#e74c3c' backgroundColorDark='#e74c3c' value={100} /> )
                        : ( <BorderLinearProgress variant="determinate" backgroundColorLight='#27ae60' backgroundColorDark='#219150' value={Math.min(Number(budget.spent/budget.amount*100), 100)} /> )
                      }
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <NumericFormat
                        displayType='text'
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        prefix='Đã chi:&nbsp;'
                        suffix="&nbsp;₫"
                        value={Number(budget.spent)}
                        style={{ fontWeight: '', maxWidth: '100%' }}
                      />
                      {budget.spent > budget.amount ? (<Typography sx={{ color: '#e74c3c' }}>Bội chi: {budget.spent-budget.amount}</Typography>) : (
                        <Box display={'flex'} sx={{ opacity: 0.7 }}>
                          <Typography>Còn lại:&nbsp;</Typography>
                          <NumericFormat
                            displayType='text'
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            suffix="&nbsp;₫"
                            value={Number(budget.amount-budget.spent)}
                            style={{ fontWeight: '', maxWidth: '100%' }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </StyledBox>

        {/* Danh sách giao dịch */}
        <Box>
          <Typography variant='h6' sx={{ marginY: 1, fontWeight: 'bold' }}>Danh sách giao dịch</Typography>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            {!transactionProcessedDatas ? ( <PageLoadingSpinner caption={'Đang tải...'} sx={{ height: 'fit-content', paddingY: 1 }} /> )
              : (
                <>
                  {Array.isArray(transactionProcessedDatas?.groupedByDate) && transactionProcessedDatas?.groupedByDate.length == 0 && (
                    <Box display={'flex'} justifyContent={'center'} paddingY={1}>
                      <Typography>Chưa có giao dịch nào!</Typography>
                    </Box>
                  )}
                  {transactionProcessedDatas?.groupedByDate?.map((transactionData, index) => (
                    <StyledBox key={index}>
                      <Typography fontWeight={'bold'}>{moment(transactionData?.transactionTime).format('dddd, LL')}</Typography>
                      {transactionData?.transactions?.map((transaction) => (
                        <Box
                          key={transaction._id}
                          // onClick={() => handleOpenModal(transaction)}
                        >
                          <FinanceItem1
                            // key={transaction._id}
                            title={transaction?.name}
                            description={transaction?.description}
                            amount={transaction?.amount}
                            amountColor={getColorForTransaction(transaction?.type)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              },
                              transition: 'background-color 0.2s',
                              borderTop: 1,
                              borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                            }}
                          />
                        </Box>
                      ))}
                    </StyledBox>
                  ))}
                </>
              )
            }
          </Box>
        </Box>

        <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={2}>
          <Button variant='outlined' onClick={handleCancel}>Đóng</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default BudgetPopup