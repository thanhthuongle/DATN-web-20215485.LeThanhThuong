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
import { getIndividualDetailTransactions, getIndividualTransactionAPI } from '~/apis'
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

function LoansAndDebts() {
  const [activeTab, setActiveTab] = React.useState(TABS.LOANS)
  const [time, setTime] = React.useState(timeOptions.ALL_TIME)
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)
  const [data, setData] = React.useState(null)
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

  const updateStateData = async (res) => {
    let totalLoan = 0
    let totalBorrowing = 0
    // TODO: lấy avf tính toán thêm collected và paid
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

  const getData = async ({ startTime = null, endTime = null }) => {
    const params = {}
    params['q[type'] = [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING]
    if (startTime) params['q[fromDate]'] = startTime.toISOString()
    if (endTime) params['q[toDate]'] = endTime.toISOString()
    const searchPath = `?${createSearchParams(params)}`
    const result = await getIndividualTransactionAPI(searchPath)
    // TODO: Lấy thêm giao dịch thu nợ và trả nợ => check khoản vay, khoản cho vay đã hoàn thành => thêm trường isFinish,collection or payment từ các giao dịch thu và trả nợ vào các khoản vay cho vay tương ứng, nhớ là ko xóa chúng đi vì cần dùng để render lịch sử giao dịch
    updateStateData(result)
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const searchPath = `?${createSearchParams({ 'q[type]': [TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.BORROWING] })}`
      // TODO: Lấy thêm giao dịch thu nợ và trả nợ
      getIndividualTransactionAPI(searchPath).then(updateStateData)
    }

    fetchData()
  }, [])

  if (!data) {
    return <PageLoadingSpinner caption={'Loanding data...'} />
  }

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
          <TabPanel value={TABS.LOANS}><LoanTab collected={0} totalLoan={data.totalLoan} transactiosGrouped={data.loanGroupedTransactions} /></TabPanel>
          <TabPanel value={TABS.DEBTS}><DebtTab paid={0} totalBorrwed={data.totalBorrowing} transactiosGrouped={data.borrowingGroupedTransactions} /></TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default LoansAndDebts
