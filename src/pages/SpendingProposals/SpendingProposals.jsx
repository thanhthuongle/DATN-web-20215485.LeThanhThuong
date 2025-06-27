import React, { useState } from 'react'
import { Box } from '@mui/material'
import { StyledBox } from '../Overview/Overview'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import BarChart from '~/component/Chart/BarChart'
import Stack from '@mui/material/Stack'
import CircleIcon from '@mui/icons-material/Circle'
import { NumericFormat } from 'react-number-format'
import PieChart from '~/component/Chart/PieChart'
import moment from 'moment'
import MoneySourceItem1 from '../MoneySources/MoneySourceItem/MoneySourceItem1'
import Chip from '@mui/material/Chip'

const proposalStatus = {
  ALL: 'Tất cả',
  APPROVED: 'Đã phê duyệt',
  REJECTED: 'Đã từ chối',
  WAITTING: 'Chờ xem xét'
}

const proposalDatas = [0, 1, 2].map((dayIndex) => ({
  proposalTime: moment().subtract(dayIndex, 'days').toISOString(),
  proposals: Array.from({ length: 15 }, (_, i) => ({
    proposalId: `proposalId-${dayIndex}-${i}`,
    proposalCategory: `Hạng mục ${i%5}`,
    status: (i%7 == 0) ? proposalStatus.REJECTED : ((i%4 == 0) ? proposalStatus.WAITTING : proposalStatus.APPROVED),
    proposerName: `Tên người đề xuất ${i}`,
    amount: 12345
  }))
}))

function SpendingProposals() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [checkedTimeSearch, setCheckedTimeSearch] = useState(true)
  const [activeStatusButton, setActiveStatusButton] = useState(proposalStatus.ALL)

  const handleChangeTimeSearch = (event) => {
    setCheckedTimeSearch(event.target.checked)
  }

  const handleSubmitSearch = () => {
    if (!startDate && !endDate && checkedTimeSearch) toast.error('Cần chọn ít nhất một mốc thời gian')
    // console.log('Start Date:', startDate)
    // console.log('End Date:', endDate)
    // Gọi data tương ứng
  }

  const handleSelectStatusType = (statusSelected) => {
    // console.log('🚀 ~ handleSelectStatusType ~ statusSelected:', statusSelected)
    setActiveStatusButton(statusSelected)
    // TODO: Lọc data tương ứng
  }

  let income = 4374645
  let expense = 7459676
  const proposalExpense = {
    APPROVED: 16,
    REJECTED: 3,
    WAITING: 7
  }

  return (
    <Box
      width={'100%'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <Box
        width={'100%'}
        display={'flex'}
        flexDirection={'column'}
        maxWidth={1400}
        gap={2}
      >
        {/* Chọn thời gian & button tạo mới */}
        <Grid container spacing={2} width='100%' justifyContent="space-between">
          <StyledBox minWidth={{ xs: '100%', lg: '40%' }} display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={3} alignItems={'center'}>
              <Typography fontWeight={'bold'}>Thời gian</Typography>
              <Switch
                checked={checkedTimeSearch}
                onChange={handleChangeTimeSearch}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Box>
            <Divider />
            <Box display={'flex'} flexDirection={'column'} gap={3} alignItems={'center'}>
              <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
                <DatePicker disabled={!checkedTimeSearch} disableFuture={true} format="DD/MM/YYYY" label="Từ ngày" maxDate={endDate} value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                <DatePicker disabled={!checkedTimeSearch} disableFuture={true} format="DD/MM/YYYY" label="Đến ngày" minDate={startDate} value={endDate} onChange={(newValue) => setEndDate(newValue)} />
              </Box>
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Button variant='contained' onClick={handleSubmitSearch} sx={{ textTransform: 'none' }}>Tìm kiếm</Button>
              </Box>
            </Box>
          </StyledBox>

          <Box>
            <Button
              variant="outlined"
              startIcon={<LibraryAddIcon />}
              sx={{ paddingY: '12px' }}
            >
              Tạo đề xuất
            </Button>
          </Box>
        </Grid>

        {/* Tổng quan */}
        <StyledBox>
          <Typography fontWeight={'bold'}>Tổng quan</Typography>
          <Grid
            width="100%"
            container
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box width={{ xs: '100%', sm: '50%' }} display='flex' sx={{ gap: 1 }}>
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
                      allowNegative={false}
                      suffix="&nbsp;₫"
                      value={income-expense}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box width={{ xs: '100%', sm: '50%' }} display='flex' sx={{ paddingBottom: 1 }} justifyContent={'center'}>
              <PieChart dataProp={[proposalExpense?.APPROVED, proposalExpense?.REJECTED, proposalExpense?.WAITING]}/>
            </Box>
          </Grid>
        </StyledBox>

        {/* Nhóm nút bấm chọn loại trạng thái đề xuất */}
        <Box display={'flex'} bgcolor={'#bfd8f0'} paddingY={1} paddingX={2} borderRadius={'8px'} width={'fit-content'}>
          <Stack direction={'row'} gap={{ xs: 1, sm: 3 }} maxWidth={'500px'} >
            <Button
              variant='contained'
              onClick={() => handleSelectStatusType(proposalStatus.ALL)}
              sx={{ textTransform: 'none', bgcolor: '#0c77ec', opacity: activeStatusButton==proposalStatus.ALL ? 1 : 0.3 }}
            >Toàn bộ</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectStatusType(proposalStatus.APPROVED)}
              sx={{ textTransform: 'none', bgcolor: '#27ae60', opacity: activeStatusButton==proposalStatus.APPROVED ? 1 : 0.3 }}
            >{proposalStatus.APPROVED}</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectStatusType(proposalStatus.REJECTED)}
              sx={{ textTransform: 'none', bgcolor: '#f1c40f', opacity: activeStatusButton==proposalStatus.REJECTED ? 1 : 0.3 }}
            >{proposalStatus.REJECTED}</Button>
            <Button
              variant='contained'
              onClick={() => handleSelectStatusType(proposalStatus.WAITTING)}
              sx={{ textTransform: 'none', bgcolor: '#e74c3c', opacity: activeStatusButton==proposalStatus.WAITTING ? 1 : 0.3 }}
            >{proposalStatus.WAITTING}</Button>
          </Stack>
        </Box>

        {/* Danh sách các đề xuất */}
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          {proposalDatas?.map((proposalData, index) => (
            <StyledBox key={index}>
              <Typography fontWeight={'bold'}>{moment(proposalData?.proposalTime).format('LLLL')}</Typography>
              {proposalData?.proposals?.map((proposal) => (
                <MoneySourceItem1
                  key={proposal.proposalId}
                  title={proposal?.proposalCategory}
                  description={proposal?.proposerName}
                  amount={proposal?.amount}
                  amountColor={'#e74c3c'}
                  menuComponent={
                    <Chip
                      label={proposal.status}
                      variant="filled"
                      sx={{
                        minWidth: '105px',
                        marginLeft: 2,
                        fontWeight: 'bold',
                        color: (proposal.status == proposalStatus.APPROVED) ? '#27AE60' : (proposal.status == proposalStatus.REJECTED ? '#E74C3C' : '#F2B925'),
                        bgcolor: (proposal.status == proposalStatus.APPROVED) ? '#27AE6026' : (proposal.status == proposalStatus.REJECTED ? '#E74C3C26' : '#F2B92526')
                      }}
                    />
                  }
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

export default SpendingProposals
