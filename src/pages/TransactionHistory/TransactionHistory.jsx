import React, { useState } from 'react'
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

const categoryLists = ['Hạng mục 1(10%)', 'Hạng mục 2(15%)', 'Hạng mục 3(35%)']
const percentageLists = [10, 15, 75]
const colorLists = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)'
]

const transactionHistoryType = {
  ALL: 'Toàn bộ',
  INCOME: 'Tiền vào',
  EXPENSE: 'Tiền ra'
}

const transactionType = {
  EXPENSE: 'Chi tiền',
  INCOME: 'Thu tiền',
  LEND: 'Cho vay',
  BORROWING: 'Đi vay',
  TRANSFER: 'Chuyển khoản',
  CONTRIBUTION: 'Đóng góp'
}

const transactionDatas = [0, 1, 2].map((dayIndex) => ({
  transactionTime: moment().subtract(dayIndex, 'days').toISOString(),
  transactions: Array.from({ length: 15 }, (_, i) => ({
    transactionId: `transactionId-${dayIndex}-${i}`,
    type: (i%7 == 0) ? transactionType.TRANSFER : ((i%4 == 0) ? transactionType.INCOME : transactionType.EXPENSE),
    transactionName: `Tên của giao dịch ${i}`,
    description: `mô tả giao dịch ${i}`,
    amount: 12345
  }))
}))

function TransactionHistory() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [activeButton, setActiveButton] = useState(transactionHistoryType.ALL)

  let income = 4374645
  let expense = 7459676

  const getColorForTransaction = (transactionTypeProp) => {
    const redTypes = [transactionType.EXPENSE, transactionType.LEND, transactionType.CONTRIBUTION]
    const greenTypes = [transactionType.INCOME, transactionType.BORROWING]
    if (redTypes.includes(transactionTypeProp)) {
      return '#e74c3c'
    } else if (greenTypes.includes(transactionTypeProp)) {
      return '#27ae60'
    } else {
      return 'text.primary'
    }
  }

  const handleOkClick = () => {
    if (!startDate && !endDate) toast.error('Cần chọn ít nhất một mốc thời gian')
    console.log('Start Date:', startDate)
    console.log('End Date:', endDate)
    // Gọi data tương ứng
  }
  const handleSelectTransactionType = (transactionTypeSelected) => {
    console.log('🚀 ~ handleSelectTransactionType ~ transactionTypeSelected:', transactionTypeSelected)
    setActiveButton(transactionTypeSelected)
    // TODO: Gọi data tương ứng
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
              <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Từ ngày" maxDate={endDate} value={startDate} onChange={(newValue) => setStartDate(newValue)} />
              <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Đến ngày" minDate={startDate} value={endDate} onChange={(newValue) => setEndDate(newValue)} />
            </Box>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Button variant='contained' onClick={handleOkClick} sx={{ textTransform: 'none' }}>Tìm kiếm</Button>
            </Box>
          </StyledBox>
        </Box>

        {/* Biểu đồ cột thu chi */}
        <StyledBox display='flex' sx={{ gap: 1 }}>
          <Box width='20%'>
            <BarChart income={income} expense={expense} />
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
                value={income}
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
                value={expense}
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
                  value={income-expense}
                />
              </Box>
            </Box>
          </Stack>
        </StyledBox>

        {/* Biểu đồ tròn hạng mục chi */}
        <StyledBox display='flex' sx={{ paddingBottom: 1 }}>
          <DoughnutChart
            categoryLists={categoryLists}
            percentageLists={percentageLists}
            colorLists={colorLists}
          />
        </StyledBox>
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      <Box flex={1} display={'flex'} flexDirection={'column'} gap={2}>
        {/* Nhóm nút bấm loại giao dịch */}
        <Box display={'flex'} justifyContent={'center'} bgcolor={'#bfd8f0'} padding={1} borderRadius={'8px'}>
          <Stack direction={'row'} justifyContent={'space-between'} maxWidth={'500px'} width={'100%'}>
            <Button
              variant='contained'
              onClick={() => handleSelectTransactionType(transactionHistoryType.ALL)}
              sx={{ textTransform: 'none', opacity: activeButton==transactionHistoryType.ALL ? 1 : 0.6 }}
            >Toàn bộ</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectTransactionType(transactionHistoryType.INCOME)}
              sx={{ textTransform: 'none', opacity: activeButton==transactionHistoryType.INCOME ? 1 : 0.6 }}
            >Tiền vào</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectTransactionType(transactionHistoryType.EXPENSE)}
              sx={{ textTransform: 'none', opacity: activeButton==transactionHistoryType.EXPENSE ? 1 : 0.6 }}
            >Tiền ra</Button>
          </Stack>
        </Box>

        {/* Danh sách lịch sử giao dịch */}
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          {transactionDatas?.map((transactionData, index) => (
            <StyledBox key={index}>
              <Typography fontWeight={'bold'}>{moment(transactionData?.transactionTime).format('LLLL')}</Typography>
              {transactionData?.transactions?.map((transaction) => (
                <FinanceItem1
                  key={transaction.transactionId}
                  title={transaction?.transactionName}
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