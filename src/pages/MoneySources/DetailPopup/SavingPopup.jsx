import { Box, Button, Divider, Typography } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { StyledBox } from '~/pages/Overview/Overview'
import { TRANSACTION_TYPES } from '~/utils/constants'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import EventIcon from '@mui/icons-material/Event'
import DateRangeIcon from '@mui/icons-material/DateRange'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { createSearchParams } from 'react-router-dom'
import { getIndividualTransactionAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import theme from '~/theme'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'

const redTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.CONTRIBUTION]
const greenTypes = [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.BORROWING]
const getColorForTransaction = (transactionTypeProp, transactionName) => {
  if (redTypes.includes(transactionTypeProp)) {
    return '#e74c3c'
  } else if (greenTypes.includes(transactionTypeProp) || transactionName.startsWith('Thu lãi')) {
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

function SavingPopup({ saving, handleCancel }) {
  // console.log('🚀 ~ SavingPopup ~ saving:', saving)
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)
  // console.log('🚀 ~ SavingPopup ~ transactionProcessedDatas:', transactionProcessedDatas)
  // console.log('kết thúc tại', moment('2025-05-31T17:00:00.000Z').add(saving.term, 'months').toISOString())

  const updateStateData = (res) => {
    const processedData = processDataRaw(res)
    // console.log('🚀 ~ updateStateData ~ processedData:', processedData)
    setTransactionProcessedDatas(processedData)
  }

  const getTransactionData = async () => {
    // console.log('🚀 ~ getTransactionData ~ account?.transactionIds:', account?.transactionIds)
    if (!saving?.transactionIds || (Array.isArray(saving?.transactionIds) && saving?.transactionIds.length == 0)) {
      updateStateData([])
      return
    }
    const params = {}
    // params['q[fromDate]'] = moment(saving.startDate).toISOString()
    params['q[transactionIds]'] = saving?.transactionIds || []
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
        {/* Tên sổ tiết kiệm */}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>{saving.savingsAccountName}</Typography>
        </Box>

        {/* Số dư hiện tại */}
        <StyledBox display={'flex'} justifyContent={'space-between'} paddingY={2} marginBottom={1}>
          <Typography>Số dư hiện tại</Typography>
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={true}
            decimalScale={0}
            allowLeadingZeros={false}
            suffix="&nbsp;₫"
            value={saving?.balance}
            style={{ fontWeight: 'bold', color: saving?.balance < 0 ? 'red' : '' }}
          />
        </StyledBox>

        {/* Thông tin cơ bản */}
        <StyledBox>
          <List disablePadding >
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary={ <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0.2 }}> Ngày gửi </Typography> }
                secondary={ <Typography variant="body1" color="text.primary"> {moment(saving.startDate).format('DD/MM/YYYY')} </Typography> }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText
                primary={ <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0.2 }}> Kỳ hạn </Typography> }
                secondary={ <Typography variant="body1" color="text.primary"> {saving.term}&nbsp;Tháng </Typography> }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <TrendingUpIcon/>
              </ListItemIcon>
              <ListItemText
                primary={ <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0.2 }}>lãi suất </Typography> }
                secondary={ <Typography variant="body1" color="text.primary"> {saving.rate}&nbsp;%/Năm </Typography> }
              />
            </ListItem>
          </List>
        </StyledBox>

        {/* Lịch sử giao dịch */}
        <Box
          sx={{
            borderWidth: '1px',
            borderStyle: 'solid',
            padding: '8px',
            borderRadius: '4px',
            [theme.breakpoints.up('sm')]: {
              padding: '16px'
            },
            borderColor: theme.palette.mode === 'light' ? '#ccc' : '#666'
          }}
        >
          <Box>
            <Typography>Lịch sử giao dịch</Typography>
            <Divider sx={{ marginBottom: 1 }} />
          </Box>
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
                            amountColor={getColorForTransaction(transaction?.type, transaction?.name)}
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

        {/* Số dư ban đầu */}
        <StyledBox display={'flex'} justifyContent={'space-between'} paddingY={2} marginTop={1}>
          <Typography>Số dư ban đầu</Typography>
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={true}
            decimalScale={0}
            allowLeadingZeros={false}
            suffix="&nbsp;₫"
            value={saving?.initBalance}
          />
        </StyledBox>

        <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={2}>
          <Button variant='outlined' onClick={handleCancel}>Đóng</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SavingPopup