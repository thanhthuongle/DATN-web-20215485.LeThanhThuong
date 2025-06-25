import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import LoanTab from './LoanTab'
import DebtTab from './DebtTab'
import { createSearchParams } from 'react-router-dom'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { getFullInfoIndividualTransactions, getIndividualDetailTransactions, getIndividualTransactionAPI } from '~/apis'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import moment from 'moment'

const TABS = {
  LOANS: 'loans',
  DEBTS: 'debts'
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

  const groupedArray = Object.entries(grouped).map(([keyValue, transactions]) => ({
    [key]: keyValue,
    totalAmount: totalAmount[keyValue],
    totalAmountWithReturn: totalAmountWithReturn[keyValue],
    totalReturn: totalReturn[keyValue],
    transactions
  }))

  return groupedArray
}

function LoansAndDebts() {
  const [activeTab, setActiveTab] = React.useState(TABS.LOANS)
  const [time, setTime] = React.useState(timeOptions.ALL_TIME)
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)
  const [data, setData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  // console.log('🚀 ~ LoansAndDebts ~ data:', data)

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue)
  }
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
      await getData({ startTime: timeRange.startDate, endTime: timeRange.endDate })
    }
  }
  const handleOkClickOk = async () => {
    if (!startDate && !endDate) {
      toast.error('Cần chọn ít nhất một mốc thời gian')
      return
    }
    await getData({ startTime: startDate, endTime: endDate })
  }

  const handleOnCollectOrRepay = async () => {
    await getData({ startTime: startDate, endTime: endDate })
  }

  const updateStateData = async (res) => {
    // console.log('🚀 ~ updateStateData ~ res:', res)
    let totalLoan = 0
    let totalBorrowing = 0
    let totalCollected = 0
    let totalPaid = 0
    let loanTransactions = res.filter(item => item.type == TRANSACTION_TYPES.LOAN)
    let borrowingTransactions = res.filter(item => item.type == TRANSACTION_TYPES.BORROWING)
    let collectionTransactions = res.filter(item => item.type == TRANSACTION_TYPES.COLLECT)
    let repaymentTransactions = res.filter(item => item.type == TRANSACTION_TYPES.REPAYMENT)

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

  const getData = async ({ startTime = null, endTime = null }) => {
    setIsLoading(true)

    const params = {}
    params['q[type]'] = [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING, TRANSACTION_TYPES.COLLECT, TRANSACTION_TYPES.REPAYMENT]
    if (startTime) params['q[fromDate]'] = startTime.toISOString()
    if (endTime) params['q[toDate]'] = endTime.toISOString()
    const searchPath = `?${createSearchParams(params)}`
    // const result = await getIndividualTransactionAPI(searchPath)
    getFullInfoIndividualTransactions(searchPath)
      .then(updateStateData)
      .finally(() => {
        setIsLoading(false)
      })
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const searchPath = `?${createSearchParams({ 'q[type]': [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING, TRANSACTION_TYPES.COLLECT, TRANSACTION_TYPES.REPAYMENT] })}`
      getFullInfoIndividualTransactions(searchPath)
        .then(updateStateData)
        .finally(() => {
          setIsLoading(false)
        })
    }

    fetchData()
  }, [])

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'center'
    }}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab} variant="fullWidth" sx={{ width: '100%' }} >
              <Tab label="Cho vay" value={TABS.LOANS} />
              <Tab label="Đi vay" value={TABS.DEBTS} />
            </TabList>
          </Box>
          {/* Chọn thời gian */}
          <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} flexDirection={{ xs: 'column', md: 'row' }} marginTop={3}>
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
            <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              <Divider orientation="vertical" variant="middle" flexItem />
              <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Từ" maxDate={endDate} value={startDate} onChange={(newValue) => setStartDate(newValue)} />
              <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Đến" minDate={startDate} value={endDate} onChange={(newValue) => setEndDate(newValue)} />
              <Button variant='contained' onClick={handleOkClickOk}>OK</Button>
            </Box>
            }
          </Box>
          {isLoading &&
            <PageLoadingSpinner caption={'Đang tải dữ liêu...'} sx={{ height: '', paddingTop: '20%' }} />
          }
          {!isLoading && data &&
          <>
            <TabPanel value={TABS.LOANS}>
              <LoanTab
                collected={data?.totalCollected}
                totalLoan={data?.totalLoan}
                transactiosGrouped={data?.loanGroupedTransactions}
                handleOnCollectOrRepay={handleOnCollectOrRepay}
              />
            </TabPanel>
            <TabPanel value={TABS.DEBTS}>
              <DebtTab
                paid={data?.totalPaid}
                totalBorrwed={data?.totalBorrowing}
                transactiosGrouped={data?.borrowingGroupedTransactions}
                handleOnCollectOrRepay={handleOnCollectOrRepay}
              />
            </TabPanel>
          </>
          }
        </TabContext>
      </Box>
    </Box>
  )
}

export default LoansAndDebts
