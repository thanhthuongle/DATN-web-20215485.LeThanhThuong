import { Box, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyledBox } from './Overview'
import BarChart from '~/component/Chart/BarChart'
import CircleIcon from '@mui/icons-material/Circle'
import { NumericFormat } from 'react-number-format'
import Divider from '@mui/material/Divider'
import DoughnutChart from '~/component/Chart/DoughnutChart'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import moment from 'moment'
import { getIndividualTransactionAPI } from '~/apis'
import { TRANSACTION_TYPES } from '~/utils/constants'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import { createSearchParams } from 'react-router-dom'

const redTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.CONTRIBUTION, TRANSACTION_TYPES.REPAYMENT]
const greenTypes = [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.BORROWING, TRANSACTION_TYPES.COLLECT]

const timeOptions = {
  TODAY: 'Hôm nay',
  THIS_WEEK: 'Tuần này',
  THIS_MONTH: 'Tháng này',
  THIS_QUATER: 'Quý này',
  THIS_YEAR: 'Năm này'
}

const getSearchPathTimeRange = (timeOption) => {
  const timeRange = {
    TODAY: {
      fromDate: moment().startOf('day'),
      toDate: moment().endOf('day')
    },
    THIS_WEEK: {
      fromDate: moment().startOf('isoWeek'),
      toDate: moment().endOf('isoWeek')
    },
    THIS_MONTH: {
      fromDate: moment().startOf('month'),
      toDate: moment().endOf('month')
    },
    THIS_QUATER: {
      fromDate: moment().startOf('quarter'),
      toDate: moment().endOf('quarter')
    },
    THIS_YEAR: {
      fromDate: moment().startOf('year'),
      toDate: moment().endOf('year')
    }
  }

  const params = {}
  if (timeOption == timeOptions.TODAY) {
    params['q[fromDate]'] = timeRange.TODAY.fromDate.toISOString()
    params['q[toDate]'] = timeRange.TODAY.toDate.toISOString()
  } else if (timeOption == timeOptions.THIS_WEEK) {
    params['q[fromDate]'] = timeRange.THIS_WEEK.fromDate.toISOString()
    params['q[toDate]'] = timeRange.THIS_WEEK.toDate.toISOString()
  } else if (timeOption == timeOptions.THIS_MONTH) {
    params['q[fromDate]'] = timeRange.THIS_MONTH.fromDate.toISOString()
    params['q[toDate]'] = timeRange.THIS_MONTH.toDate.toISOString()
  } else if (timeOption == timeOptions.THIS_QUATER) {
    params['q[fromDate]'] = timeRange.THIS_QUATER.fromDate.toISOString()
    params['q[toDate]'] = timeRange.THIS_QUATER.toDate.toISOString()
  } else if (timeOption == timeOptions.THIS_YEAR) {
    params['q[fromDate]'] = timeRange.THIS_YEAR.fromDate.toISOString()
    params['q[toDate]'] = timeRange.THIS_YEAR.toDate.toISOString()
  }

  const searchPath = `?${createSearchParams(params)}`

  return searchPath
}

const processData = (data) => {
  const result = {
    expense: 0,
    income: 0
  }
  // const expenseTransaction = data.filter( item => redTypes.includes(item.type))
  const filterByCatergory = data.reduce((acc, item) => {
    if (redTypes.includes(item.type)) {
      const categoryId = item.categoryId
      if (!acc[categoryId]) acc[categoryId] = {
        amount: 0,
        categoryName: item.name
      }
      acc[categoryId].amount += Number(item.amount) || 0

      result.expense += Number(item.amount) || 0
    } else if (greenTypes.includes(item.type) || item?.name?.toLowerCase()?.startsWith('thu lãi')) {
      result.income += Number(item.amount) || 0
    }

    return acc
  }, {})

  const groupedByCategory = Object.entries(filterByCatergory).map(([categoryId, info]) => ({
    categoryId,
    ...info
  }))

  return {
    groupedByCategory,
    income: result.income,
    expense: result.expense
  }
}

function TransactionSummary() {
  const [data, setData] = useState(null)
  // console.log('🚀 ~ TransactionSummary ~ data:', data)
  const [time, setTime] = useState(timeOptions.THIS_MONTH)

  useEffect(() => {
    const fetchData = async () => {
      const searchPath = getSearchPathTimeRange(time)
      getIndividualTransactionAPI(searchPath).then(res => {
        // console.log('🚀 ~ getIndividualTransactionAPI ~ res:', res)
        setData(processData(res))
      })
    }

    fetchData()
  }, [time])

  if (!data) {
    return <PageLoadingSpinner caption={'Đang tải dữ liệu tổng quan chi tiêu...'}/>
  }

  return (
    <StyledBox width="100%" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box display='flex' alignItems='end' gap={{ xs: 4, sm: 5 }}>
        <Typography variant='h6'>Tình hình thu chi</Typography>
        <Box>
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="time-select-standard-label">Thời gian</InputLabel>
            <Select
              labelId="time-select-standard-label"
              id="time-select-standard"
              label="Thời gian"
              value={time}
              onChange={(e) => {
                const newValue = e.target.value
                setTime(newValue)
              }}
              defaultValue={timeOptions.THIS_MONTH}
            >
              <MenuItem value={timeOptions.TODAY}>Hôm nay</MenuItem>
              <MenuItem value={timeOptions.THIS_WEEK}>Tuần này</MenuItem>
              <MenuItem value={timeOptions.THIS_MONTH}>Tháng này</MenuItem>
              <MenuItem value={timeOptions.THIS_QUATER}>Quý này</MenuItem>
              <MenuItem value={timeOptions.THIS_YEAR}>Năm này</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {(data?.income == 0 && data?.expense == 0)
        ? (
          <Box
            display='flex'
            justifyContent='center'
            paddingY='32px'
          >
            Bạn chưa có giao dịch thu chi nào trong {time}.
          </Box>
        )
        : (
          <Grid
            width="100%"
            container
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box width={{ xs: '100%', sm: '50%' }} display='flex' sx={{ gap: 1 }}>
              <Box width='20%'>
                <BarChart income={data.income} expense={data.expense} />
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
                    value={data.income}
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
                    value={data.expense}
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
                      value={data.income-data.expense}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box width={{ xs: '100%', sm: '50%' }} display='flex' sx={{ paddingLeft: { xs: 0, sm: 8 }, paddingBottom: 1 }}>
              <DoughnutChart dataProp={data.groupedByCategory} />
            </Box>
          </Grid>
        )}
    </StyledBox>
  )
}

export default TransactionSummary
