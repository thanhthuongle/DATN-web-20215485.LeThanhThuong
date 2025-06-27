import React, { useState } from 'react'
import Box from '@mui/material/Box'
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
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'

function ContributionRequest() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [checkedTimeSearch, setCheckedTimeSearch] = useState(true)

  const handleChangeTimeSearch = (event) => {
    setCheckedTimeSearch(event.target.checked)
  }

  const handleSubmitSearch = () => {
    if (!startDate && !endDate && checkedTimeSearch) toast.error('Cần chọn ít nhất một mốc thời gian')
    // console.log('Start Date:', startDate)
    // console.log('End Date:', endDate)
    // Gọi data tương ứng
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
              Tạo yêu cầu
            </Button>
          </Box>
        </Grid>

        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>Danh sách yêu cầu đóng góp</Typography>
          <Box>
            {/* Đang theo dõi */}
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="followingContributionRequest-content"
                id="followingContributionRequest-header"
                sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
              >
                <Typography component="span" fontWeight='bold'>Đang theo dõi</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                {/* Danh sách các khoản đóng góp đang theo dõi*/}
                {Array.from({ length: 5 }).map((_, index) =>
                  <FinanceItem1
                    title={`Tên khoản đóng góp số ${index}`}
                    description={`Mô tả khoản đóng góp ${index}`}
                    amount={'12345678'}
                    amountColor='#27ae60'
                    key={index}
                    sx={{
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                  />)}
              </AccordionDetails>
            </Accordion>

            {/* Dừng đóng góp */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="finishedLoan-content"
                id="finishedLoan-header"
                sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
              >
                <Typography component="span" fontWeight='bold'>Dừng đóng góp</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                {/* Danh sách các khoản đã dừng đóng góp */}
                {Array.from({ length: 5 }).map((_, index) =>
                  <FinanceItem1
                    title={`Tên khoản đóng góp số ${index}`}
                    description={`Mô tả khoản đóng góp ${index}`}
                    amount={'125678'}
                    amountColor='#27ae60'
                    key={index}
                    sx={{
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                  />)}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </ Box>
    </ Box>
  )
}

export default ContributionRequest