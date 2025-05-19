import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import { StyledBox } from './Overview'
import VerticalBarChart from '~/component/Chart/VerticalBarChart'
import Stack from '@mui/material/Stack'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import { getIndividualTransactionAPI } from '~/apis'
import { createSearchParams } from 'react-router-dom'
import { TRANSACTION_TYPES } from '~/utils/constants'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import { cloneDeep } from 'lodash'
import { toast } from 'react-toastify'

const redTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.CONTRIBUTION]

const processTransactionByCategory = (transactions) => {
  const data = cloneDeep(transactions)
  const result = {
    expense: 0
  }
  const filterByCatergory = data.reduce((acc, item) => {
    const categoryId = item.categoryId
    if (!acc[categoryId]) acc[categoryId] = {
      amount: 0,
      categoryName: item.name
    }
    acc[categoryId].amount += Number(item.amount) || 0

    result.expense += Number(item.amount) || 0

    return acc
  }, {})

  const groupedByCategory = Object.entries(filterByCatergory).map(([categoryId, info]) => ({
    categoryId,
    ...info
  }))

  return {
    groupedByCategory,
    expense: result.expense
  }
}

function SpendingAnalysis() {
  const [startDate, setStartDate] = useState(moment().startOf('month'))
  const [endDate, setEndDate] = useState(moment().endOf('month'))
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)
  const [data, setData] = useState(null)

  const handleOnClickOk = () => {
    if (tempEndDate.isAfter(tempStartDate)) {
      setStartDate(tempStartDate)
      setEndDate(tempEndDate)
    } else {
      toast.warn('Tháng kết thúc phải lớn hơn hoặc bằng tháng bắt đầu.')
    }
  }

  const updateStateData = (res) => {
    setData({
      transactions: res,
      processedTransactionData: processTransactionByCategory(res)
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const params = {}
      params['q[fromDate]'] = startDate.toISOString()
      params['q[toDate]'] = endDate.toISOString()
      params['q[type'] = redTypes
      const searchPath = `?${createSearchParams(params)}`
      getIndividualTransactionAPI(searchPath).then(updateStateData)
    }

    fetchData()
  }, [endDate, startDate])

  if (!data) {
    return <PageLoadingSpinner caption={'Loading data...'} />
  }

  return (
    <StyledBox
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      width='100%'
    >
      <Box display={{ xs: 'block', sm: 'flex' }} gap={4}>
        <Typography variant='h6'>Phân tích chi tiêu</Typography>
        <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          <DatePicker
            disableFuture={true}
            format="MM/YYYY"
            label="Từ tháng"
            views={['year', 'month']}
            maxDate={tempEndDate}
            value={tempStartDate}
            onChange={(newValue) => {
              setTempStartDate(moment(newValue).startOf('month'))
            }}
          />
          <DatePicker
            disableFuture={false}
            format="MM/YYYY"
            label="Đến tháng"
            views={['year', 'month']}
            minDate={tempStartDate}
            value={tempEndDate}
            onChange={(newValue) => {
              setTempEndDate(moment(newValue).endOf('month'))
            }}
          />
        </Box>
        <Box alignContent='center' justifySelf='center'><Button variant='contained' onClick={handleOnClickOk}>OK</Button></Box>
      </ Box>
      <Grid container >
        <Box
          width={{ xs: '100%', sm: '70%' }}
          paddingRight={{ xs: 0, sm: 1 }}
        >
          <VerticalBarChart startTime={moment(startDate)} endTime={moment(endDate)} transactions={data.transactions}/>
        </Box>
        <Stack
          width={{ xs: '100%', sm: '30%' }}
          maxHeight='400px'
          overflow='auto'
        >
          {data.processedTransactionData.groupedByCategory.length == 0 && (
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
              <Typography>Không có giao dịch nào!</Typography>
            </Box>
          )}
          {data.processedTransactionData.groupedByCategory.map((item) => (
            <FinanceItem1
              key={item.categoryId}
              title={item.categoryName}
              description={`${((item.amount/data.processedTransactionData.expense)* 100).toFixed(1)}%`}
              logoSize={40}
              amount={item.amount}
              amountColor={'#e74c3c'} // #e74c3c
              amountDesc={item.amountDesc}
              sx={{
                borderTop: 1,
                borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
              }}
            />
          ))}
        </Stack>
      </Grid>
    </StyledBox>
  )
}

export default SpendingAnalysis