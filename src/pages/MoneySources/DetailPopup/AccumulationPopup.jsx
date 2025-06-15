import { Box, Button, Divider, LinearProgress, linearProgressClasses, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyledBox } from '~/pages/Overview/Overview'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import EventIcon from '@mui/icons-material/Event'
import moment from 'moment'
import { NumericFormat } from 'react-number-format'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { createSearchParams } from 'react-router-dom'
import { getIndividualTransactionAPI } from '~/apis'

const redTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.CONTRIBUTION]
const greenTypes = [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.BORROWING]
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

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
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
    backgroundColor: '#27ae60',
    ...theme.applyStyles('dark', {
      backgroundColor: '#219150'
    })
  }
}))

function AccumulationPopup({ accumulation, handleCancel }) {
  console.log('🚀 ~ AccumulationPopup ~ accumulation:', accumulation)
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)

  const updateStateData = (res) => {
    const processedData = processDataRaw(res)
    // console.log('🚀 ~ updateStateData ~ processedData:', processedData)
    setTransactionProcessedDatas(processedData)
  }

  const getTransactionData = async () => {
    // console.log('🚀 ~ getTransactionData ~ account?.transactionIds:', account?.transactionIds)
    if (!accumulation?.transactionIds || (Array.isArray(accumulation?.transactionIds) && accumulation?.transactionIds.length == 0)) {
      updateStateData([])
      return
    }
    const params = {}
    params['q[transactionIds]'] = accumulation?.transactionIds || []
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
        {/* Tên khoản tích lũy */}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>{accumulation?.accumulationName}</Typography>
        </Box>

        {/* THông tin cơ bản */}
        <StyledBox>
          <List disablePadding >
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary={ <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0.2 }}> Thời gian </Typography> }
                secondary={ <Typography variant="body1" color="text.primary"> {moment(accumulation.startDate).format('DD/MM/YYYY')}&nbsp;-&nbsp;{moment(accumulation.endDate).format('DD/MM/YYYY')} </Typography> }
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
                        value={Number(accumulation.targetBalance)}
                        style={{ fontWeight: '', maxWidth: '100%' }}
                      />
                    </Box>
                    <Box >
                      <BorderLinearProgress variant="determinate" value={Math.min(Number(accumulation.balance/accumulation.targetBalance*100), 100)} />
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <NumericFormat
                        displayType='text'
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        suffix="&nbsp;₫"
                        value={Number(accumulation.balance)}
                        style={{ fontWeight: '', maxWidth: '100%', color: '#27AE60' }}
                      />
                      {accumulation.isFinish == true ? (<Typography>Đã kết thúc</Typography>) : (
                        <Box display={'flex'} sx={{ opacity: 0.7 }}>
                          {Number(accumulation.balance) < Number(accumulation.targetBalance) && (
                            <>
                              <Typography>Cần thêm:&nbsp;</Typography>
                              <NumericFormat
                                displayType='text'
                                thousandSeparator="."
                                decimalSeparator=","
                                allowNegative={false}
                                suffix="&nbsp;₫"
                                value={Number(accumulation.targetBalance - accumulation.balance)}
                                style={{ fontWeight: '', maxWidth: '100%' }}
                              />
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </StyledBox>

        {/* Lịch sử giao dịch */}
        <Box>
          <Typography variant='h6' sx={{ marginY: 1, fontWeight: 'bold' }}>Lịch sử giao dịch</Typography>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            {!transactionProcessedDatas ? ( <PageLoadingSpinner caption={'Đang tải...'} sx={{ height: 'fit-content', paddingY: 1 }} /> )
              : (
                <>
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

export default AccumulationPopup