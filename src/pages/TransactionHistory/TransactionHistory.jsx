import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { StyledBox } from '../Overview/Overview'
import BarChart from '~/component/Chart/BarChart'
import Stack from '@mui/material/Stack'
import CircleIcon from '@mui/icons-material/Circle'
import { NumericFormat } from 'react-number-format'
import DoughnutChart from '~/component/Chart/DoughnutChart'
import moment from 'moment'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { getIndividualTransactionAPI } from '~/apis'
import { createSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'

const transactionHistoryType = {
  ALL: 'Toàn bộ',
  INCOME: 'Tiền vào',
  EXPENSE: 'Tiền ra'
}

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
    byCategory: {},
    income: 0,
    expense: 0
  }

  transactions.forEach((transaction) => {
    const dateKey = moment(transaction.transactionTime).format('YYYY-MM-DD')
    const categoryKey = transaction.categoryId

    if (!result.byDate[dateKey]) { result.byDate[dateKey] = [] }
    result.byDate[dateKey].push(transaction)

    if (redTypes.includes(transaction.type)) {
      if (!result.byCategory[categoryKey])
        result.byCategory[categoryKey] = {
          amount: 0,
          categoryName: transaction.name
        }

      result.byCategory[categoryKey].amount += Number(transaction.amount) || 0
    }

    // Cộng income / expense
    if (redTypes.includes(transaction.type)) { result.expense += Number(transaction.amount) || 0 }
    else if (greenTypes.includes(transaction.type)) { result.income += Number(transaction.amount) || 0 }
  })

  const groupedByDate = Object.entries(result.byDate).map(([date, transactions]) => ({
    transactionTime: moment(date).toISOString(),
    transactions
  }))

  const groupedByCategory = Object.entries(result.byCategory).map(([categoryId, info]) => ({
    categoryId,
    ...info
  }))

  return {
    groupedByDate,
    groupedByCategory,
    income: result.income,
    expense: result.expense
  }
}

function TransactionHistory() {
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)
  const [startDate, setStartDate] = useState(moment().subtract(1, 'month'))
  const [endDate, setEndDate] = useState(moment())
  const [activeButton, setActiveButton] = useState(transactionHistoryType.ALL)

  const handleOkClick = () => {
    if (!startDate && !endDate) toast.error('Cần chọn ít nhất một mốc thời gian')
    getTransactionData()
  }
  const handleSelectTransactionType = (transactionTypeSelected) => {
    // console.log('🚀 ~ handleSelectTransactionType ~ transactionTypeSelected:', transactionTypeSelected)
    setActiveButton(transactionTypeSelected)
  }

  const updateStateData = (res) => {
    // console.log('🚀 ~ updateStateData ~ res:', res)
    const processedData = processDataRaw(res)
    console.log('🚀 ~ updateStateData ~ processDataRaw(res):', processedData)
    setTransactionProcessedDatas(processedData)
  }

  const getTransactionData = () => {
    let transactionTypeFilter = ''
    if (activeButton == transactionHistoryType.EXPENSE) transactionTypeFilter = redTypes
    else if (activeButton == transactionHistoryType.INCOME) transactionTypeFilter = greenTypes
    const params = {}
    if (transactionTypeFilter) params['q[type]'] = transactionTypeFilter
    if (startDate) params['q[fromDate]'] = startDate.toISOString()
    if (endDate) params['q[toDate]'] = endDate.toISOString()
    const searchPath = `?${createSearchParams(params)}`
    getIndividualTransactionAPI(searchPath).then(updateStateData)
  }

  useEffect(() => {
    getTransactionData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton])

  if (!transactionProcessedDatas) {
    return <PageLoadingSpinner caption='Loading data...' />
  }
  return (
    <Box
      width={'100%'}
      display={{ md: 'flex' }}
      gap={3}
    >
      <Box display={'flex'} flexDirection={'column'} gap={3} maxWidth={{ md: '40%' }}>
        {/* Chọn thời gian */}
        <Box>
          <Typography variant='h6' fontWeight={'bold'} sx={{ marginBottom: 1 }}>Lịch sử giao dịch</Typography>
          <StyledBox display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              <DatePicker
                disableFuture={true}
                format="DD/MM/YYYY"
                label="Từ ngày"
                maxDate={endDate}
                value={startDate}
                onChange={(newValue) => {
                  const startDate = moment(newValue).startOf('day')
                  setStartDate(startDate)
                }}
              />
              <DatePicker
                disableFuture={true}
                format="DD/MM/YYYY"
                label="Đến ngày"
                minDate={startDate}
                value={endDate}
                onChange={(newValue) => {
                  const endDate = moment.min(newValue.clone().endOf('day'), moment())
                  setEndDate(endDate)
                }}
              />
            </Box>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Button variant='contained' onClick={handleOkClick} sx={{ textTransform: 'none' }}>Tìm kiếm</Button>
            </Box>
          </StyledBox>
        </Box>

        {/* Biểu đồ cột thu chi */}
        <StyledBox display='flex' sx={{ gap: 1 }}>
          <Box width='20%'>
            <BarChart income={transactionProcessedDatas?.income} expense={transactionProcessedDatas?.expense} />
          </Box>
          <Stack width='80%' spacing={2} sx={{ justifyContent: 'end', pb: 1 }}>
            <Box color='#27AE60' display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' alignItems='center' gap={0.5}>
                <CircleIcon
                  color='inherit'
                  fontSize='small'
                  sx={{
                    width: '12px',
                    height: '12px'
                  }}
                />
                <Typography color='text.primary'>Thu</Typography>
              </Box>
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                suffix="&nbsp;₫"
                value={transactionProcessedDatas?.income}
              />
            </Box>
            <Box color='#E74C3C' display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' alignItems='center' gap={0.5}>
                <CircleIcon
                  color='inherit'
                  fontSize='small'
                  sx={{
                    width: '12px',
                    height: '12px'
                  }}
                />
                <Typography color='text.primary'>Chi</Typography>
              </Box>
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                suffix="&nbsp;₫"
                value={transactionProcessedDatas?.expense}
              />
            </Box>
            <Box>
              <Divider />
              <Box display='flex' justifyContent='end' paddingTop='8px'>
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={true}
                  suffix="&nbsp;₫"
                  value={transactionProcessedDatas?.income-transactionProcessedDatas?.expense}
                />
              </Box>
            </Box>
          </Stack>
        </StyledBox>

        {/* Biểu đồ tròn hạng mục chi */}
        <StyledBox display='flex' sx={{ paddingBottom: 1 }}>
          <DoughnutChart dataProp={transactionProcessedDatas.groupedByCategory} />
        </StyledBox>
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      <Box flex={1} display={'flex'} flexDirection={'column'} gap={2}>
        {/* Nhóm nút bấm loại giao dịch */}
        <Box display={'flex'} justifyContent={'center'} bgcolor={'#bddfff'} padding={1} borderRadius={'8px'}>
          <Stack direction={'row'} justifyContent={'space-between'} maxWidth={'500px'} width={'100%'}>
            <Button
              variant='contained'
              onClick={() => handleSelectTransactionType(transactionHistoryType.ALL)}
              sx={{ textTransform: 'none', opacity: activeButton==transactionHistoryType.ALL ? 1 : 0.4 }}
            >Toàn bộ</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectTransactionType(transactionHistoryType.INCOME)}
              sx={{ textTransform: 'none', opacity: activeButton==transactionHistoryType.INCOME ? 1 : 0.4 }}
            >Tiền vào</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectTransactionType(transactionHistoryType.EXPENSE)}
              sx={{ textTransform: 'none', opacity: activeButton==transactionHistoryType.EXPENSE ? 1 : 0.4 }}
            >Tiền ra</Button>
          </Stack>
        </Box>

        {/* Danh sách lịch sử giao dịch */}
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          {(Array.isArray(transactionProcessedDatas?.groupedByDate) && transactionProcessedDatas?.groupedByDate.length === 0) && (
            <Typography
              component={Box}
              display={'flex'}
              justifyContent={'center'}
              sx={{ width: '100%', marginTop: 2 }}
            >Bạn chưa có giao nào!</Typography>
          )}
          {transactionProcessedDatas?.groupedByDate?.map((transactionData, index) => (
            <StyledBox key={index}>
              <Typography fontWeight={'bold'}>{moment(transactionData?.transactionTime).format('dddd, LL')}</Typography>
              {transactionData?.transactions?.map((transaction) => (
                <FinanceItem1
                  key={transaction._id}
                  title={transaction?.name}
                  description={transaction?.description}
                  amount={transaction?.amount}
                  amountColor={getColorForTransaction(transaction?.type)}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                />
              ))}
            </StyledBox>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default TransactionHistory