import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { createSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getIndividualTransactionAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import { StyledBox } from '~/pages/Overview/Overview'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'

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
    byDate: {},
    income: 0,
    expense: 0
  }

  transactions.forEach((transaction) => {
    const dateKey = moment(transaction.transactionTime).format('YYYY-MM-DD')

    if (!result.byDate[dateKey]) { result.byDate[dateKey] = [] }
    result.byDate[dateKey].push(transaction)

    // Cộng income / expense
    if (redTypes.includes(transaction.type)) { result.expense += Number(transaction.amount) || 0 }
    else if (greenTypes.includes(transaction.type)) { result.income += Number(transaction.amount) || 0 }
  })

  const groupedByDate = Object.entries(result.byDate).map(([date, transactions]) => ({
    transactionTime: moment(date).toISOString(),
    transactions
  }))


  return {
    groupedByDate,
    income: result.income,
    expense: result.expense
  }
}

const timeOptions = {
  LAST_30_DAYS: '30 ngày gần nhất',
  THIS_MONTH: 'Tháng này',
  LAST_MONTH: 'Tháng trước',
  THIS_QUARTER: 'Quý này',
  LAST_QUARTER: 'Quý trước',
  THIS_YEAR: 'Năm này',
  LAST_YEAR: 'Năm trước',
  ALL_TIME: 'Toàn bộ thời gian',
  CUSTOM: 'Tùy chọn'
}

const getTimeRange = (option) => {
  switch (option) {
  case timeOptions.LAST_30_DAYS:
    return {
      startDate: moment().subtract(30, 'days').startOf('day'),
      endDate: moment().endOf('day')
    }

  case timeOptions.THIS_MONTH:
    return {
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    }

  case timeOptions.LAST_MONTH:
    return {
      startDate: moment().subtract(1, 'month').startOf('month'),
      endDate: moment().subtract(1, 'month').endOf('month')
    }

  case timeOptions.THIS_QUARTER:
    return {
      startDate: moment().startOf('quarter'),
      endDate: moment().endOf('quarter')
    }

  case timeOptions.LAST_QUARTER:
    return {
      startDate: moment().subtract(1, 'quarter').startOf('quarter'),
      endDate: moment().subtract(1, 'quarter').endOf('quarter')
    }

  case timeOptions.THIS_YEAR:
    return {
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year')
    }

  case timeOptions.LAST_YEAR:
    return {
      startDate: moment().subtract(1, 'year').startOf('year'),
      endDate: moment().subtract(1, 'year').endOf('year')
    }

  default:
    return {
      startDate: null,
      endDate: null
    }
  }
}

function AccountPopup({ account, handleCancel }) {
  const [time, setTime] = React.useState(timeOptions.ALL_TIME)
  // console.log('🚀 ~ AccountPopup ~ account:', account)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)

  const handleChangeTime = async (event) => {
    const newTime = event.target.value
    setTime(newTime)
    if (newTime === timeOptions.CUSTOM) {
      setStartDate(null)
      setEndDate(null)
    } else {
      const timeRange = getTimeRange(newTime)
      setStartDate(timeRange.startDate)
      setEndDate(timeRange.endDate)
      await getTransactionData({ startTime: timeRange.startDate, endTime: timeRange.endDate })
    }
  }
  const handleOkClickOk = async () => {
    if (!startDate && !endDate) {
      toast.error('Cần chọn ít nhất một mốc thời gian')
      return
    }
    await getTransactionData({ startTime: startDate, endTime: endDate })
  }

  const updateStateData = (res) => {
    const processedData = processDataRaw(res)
    // console.log('🚀 ~ updateStateData ~ processedData:', processedData)
    setTransactionProcessedDatas(processedData)
  }

  const getTransactionData = async ({ startTime = null, endTime = null }) => {
    // console.log('🚀 ~ getTransactionData ~ account?.transactionIds:', account?.transactionIds)
    if (!account?.transactionIds || (Array.isArray(account?.transactionIds) && account?.transactionIds.length == 0)) {
      updateStateData([])
      return
    }
    const params = {}
    if (startTime) params['q[fromDate]'] = startTime.toISOString()
    if (endTime) params['q[toDate]'] = endTime.toISOString()
    params['q[transactionIds]'] = account?.transactionIds || []
    const searchPath = `?${createSearchParams(params)}`
    getIndividualTransactionAPI(searchPath).then(updateStateData)
  }

  useEffect(() => {
    getTransactionData({})
  }, [])

  if (!transactionProcessedDatas) {
    return (
      <Box>
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography>Lịch sử giao dịch của&nbsp;</Typography>
          <Typography fontWeight={'bold'}>{account.accountName}</Typography>
        </Box>
        <PageLoadingSpinner caption={`Đang tải lịch sử giao dịch của "${account.accountName}"`} sx={{ height: '100px' }}/>
        <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={2}>
          <Button variant='outlined' onClick={handleCancel}>Đóng</Button>
        </Box>
      </Box>
    )
  }
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'} gap={1}>
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography>Lịch sử giao dịch của&nbsp;</Typography>
          <Typography fontWeight={'bold'}>{account.accountName}</Typography>
        </Box>

        {/* Chọn thời gian */}
        <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} flexDirection={'row'} marginTop={1}>
          <Box sx={{ width: 200 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Thời gian</InputLabel>
              <Select
                labelId="time-select-label"
                id="time-select"
                value={time}
                label="Thời gian"
                onChange={handleChangeTime}
              >
                {Object.entries(timeOptions).map(([key, value]) => (
                  <MenuItem key={key} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {time == timeOptions.CUSTOM &&
          <Box>
            <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Từ" maxDate={endDate} value={startDate} onChange={(newValue) => setStartDate(newValue)} />
              <Divider orientation="vertical" variant="middle" flexItem />
              <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Đến" minDate={startDate} value={endDate} onChange={(newValue) => setEndDate(newValue)} />
            </Box>
            <Box display={'flex'} justifyContent={'center'} marginTop={1}>
              <Button variant='contained' onClick={handleOkClickOk} sx={{ paddingX: 5 }} className='interceptor-loading'>OK</Button>
            </Box>
          </Box>
          }
        </Box>
        {(Array.isArray(transactionProcessedDatas?.groupedByDate) && transactionProcessedDatas?.groupedByDate.length === 0)
          ? (
            <Typography
              component={Box}
              display={'flex'}
              justifyContent={'center'}
              sx={{ width: '100%', paddingY: 4 }}
            >Tài khoản chưa có giao dịch nào!</Typography>
          )
          : (
            <Box display={'flex'} flexDirection={'column'} gap={1}>
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
                  value={account?.balance}
                  style={{ fontWeight: 'bold', color: account?.balance < 0 ? 'red' : '' }}
                />
              </StyledBox>

              <StyledBox display={'flex'} justifyContent={'space-evenly'}>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Tổng thu</Typography>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={0}
                    allowLeadingZeros={false}
                    suffix="&nbsp;₫"
                    value={transactionProcessedDatas.income}
                    style={{ color: '#27ae60', fontWeight: 'bold' }} // #27ae60
                  />
                </Box>
                <Divider orientation="vertical" variant="fullWidth" flexItem />
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Tổng chi</Typography>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={0}
                    allowLeadingZeros={false}
                    suffix="&nbsp;₫"
                    value={transactionProcessedDatas.expense}
                    style={{ color: '#e74c3c', fontWeight: 'bold' }} // #e74c3c
                  />
                </Box>
              </StyledBox>

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
                  value={account?.initBalance}
                />
              </StyledBox>
            </ Box>
          )
        }
      </Box>
      <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={2}>
        <Button variant='outlined' onClick={handleCancel}>Đóng</Button>
      </Box>
    </Box>
  )
}

export default AccountPopup