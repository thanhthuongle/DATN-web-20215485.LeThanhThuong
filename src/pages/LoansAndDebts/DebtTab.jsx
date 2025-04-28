import React, { useState } from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Button, Typography } from '@mui/material'
import { StyledBox } from '../Overview/Overview'
import { NumericFormat } from 'react-number-format'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MoneySourceItem1 from '../MoneySources/MoneySourceItem/MoneySourceItem1'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { toast } from 'react-toastify'
import { yellow, red } from '@mui/material/colors'

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

const BorderLinearProgress1 = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: red[600],
    ...theme.applyStyles('dark', {
      backgroundColor: red[500]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: yellow[700],
    ...theme.applyStyles('dark', {
      backgroundColor: yellow[500]
    })
  }
}))

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#27ae60',
    ...theme.applyStyles('dark', {
      backgroundColor: '#219150'
    })
  }
}))

// TODO: phân bổ có thể đi vay, hoặc chuyển từ số dư hiện tại để trả bớ nợ
function DebtTab({ totalBorrwed, paid, totalNegativeBalance, totalAllocated }) {
  const [time, setTime] = React.useState(timeOptions.ALL_TIME)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const handleChange = (event) => {
    // TODO: Gọi dữ liệu tương ứng với time
    setTime(event.target.value)
  }

  const handleOkClick = () => {
    if (!startDate && !endDate) toast.error('Cần chọn ít nhất một mốc thời gian')
    console.log('Start Date:', startDate)
    console.log('End Date:', endDate)
    // Gọi data tương ứng
  }

  return (
    <Box
      width={'100%'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      gap={2}
    >
      {/* Chọn thời gian */}
      <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
        <Box sx={{ width: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Thời gian</InputLabel>
            <Select
              labelId="time-select-label"
              id="time-select"
              value={time}
              label="Thời gian"
              onChange={handleChange}
            >
              <MenuItem value={timeOptions.LAST_30_DAYS}>{timeOptions.LAST_30_DAYS}</MenuItem>
              <MenuItem value={timeOptions.THIS_MONTH}>{timeOptions.THIS_MONTH}</MenuItem>
              <MenuItem value={timeOptions.LAST_MONTH}>{timeOptions.LAST_MONTH}</MenuItem>
              <MenuItem value={timeOptions.THIS_QUARTER}>{timeOptions.THIS_QUARTER}</MenuItem>
              <MenuItem value={timeOptions.LAST_QUARTER}>{timeOptions.LAST_QUARTER}</MenuItem>
              <MenuItem value={timeOptions.THIS_YEAR}>{timeOptions.THIS_YEAR}</MenuItem>
              <MenuItem value={timeOptions.LAST_YEAR}>{timeOptions.LAST_YEAR}</MenuItem>
              <MenuItem value={timeOptions.ALL_TIME}>{timeOptions.ALL_TIME}</MenuItem>
              <MenuItem value={timeOptions.CUSTOM}>{timeOptions.CUSTOM}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {time == timeOptions.CUSTOM &&
        <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          <Divider orientation="vertical" variant="middle" flexItem />
          <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Từ" maxDate={endDate} value={startDate} onChange={(newValue) => setStartDate(newValue)} />
          <DatePicker disableFuture={true} format="DD/MM/YYYY" label="Đến" minDate={startDate} value={endDate} onChange={(newValue) => setEndDate(newValue)} />
          <Button variant='contained' onClick={handleOkClick}>OK</Button>
        </Box>
        }
      </Box>

      {/* Tổng quan */}
      <StyledBox display={'flex'} flexDirection={'column'} gap={1}>
        <Typography
          component={'div'}
        > Cần phân bổ:
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            prefix="&nbsp;"
            suffix="&nbsp;₫"
            value={Math.max(Number(totalNegativeBalance) - Number(totalAllocated), 0)}
            // value={123456}
            style={{ color: '#e74c3c' }}
          />
        </Typography>
        <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
          <Typography
            component={'div'}
          > Đã phân bổ <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(totalAllocated)}
              // value={123456}
              style={{ color: '#ff9800' }}
            />
          </Typography>
          <Typography
            component={'div'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'end'}
          > Tổng âm nợ <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(totalNegativeBalance)}
              // value={6324243}
              style={{ color: '#e74c3c' }}
            />
          </Typography>
        </Box>
        <Box marginBottom={0.25}>
          <BorderLinearProgress1 variant="determinate" value={Math.min(totalAllocated/totalNegativeBalance, 1)*100} />
        </Box>
        <Box display={'flex'} justifyContent={'center'} marginTop={2}>
          <Button variant='contained'>Phân bổ âm nợ</Button>
        </Box>
      </StyledBox>
      <StyledBox display={'flex'} flexDirection={'column'} gap={1}>
        <Typography
          component={'div'}
        > Cần trả:
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            prefix="&nbsp;"
            suffix="&nbsp;₫"
            value={Math.max(Number(totalBorrwed) - Number(paid), 0)}
            // value={123456}
            style={{ color: '#e74c3c' }}
          />
        </Typography>
        <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
          <Typography
            component={'div'}
          > Đã trả <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(paid)}
              // value={123456}
              style={{ color: '#05bb51' }}
            />
          </Typography>
          <Typography
            component={'div'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'end'}
          > Tổng đi vay <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(totalBorrwed)}
              // value={6324243}
            />
          </Typography>
        </Box>
        <Box marginBottom={0.25}>
          <BorderLinearProgress variant="determinate" value={Math.min(paid/totalBorrwed, 1)*100} />
        </Box>
      </StyledBox>

      <Box>
        {/* Đang theo dõi */}
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="followingDebt-content"
            id="followingDebt-header"
            sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
          >
            <Typography component="span" fontWeight='bold'>Đang theo dõi</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {/* Danh sách các liên hệ đang theo dõi*/}
            {Array.from({ length: 5 }).map((_, index) =>
              <MoneySourceItem1
                title={`Tên liên hệ số ${index}`}
                amount={'12345678'}
                amountColor='#e74c3c'
                key={index}
                sx={{
                  borderTop: 1,
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                }}
                menuComponent={<Button variant='contained' sx={{ marginLeft: 2 }}>Trả nợ</Button>}
              />)}
          </AccordionDetails>
        </Accordion>

        {/* Đã hoàn thành */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="finishedDebt-content"
            id="finishedDebt-header"
            sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
          >
            <Typography component="span" fontWeight='bold'>Đã hoàn thành</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {/* Danh sách các liên hệ đã hoàn thành */}
            {Array.from({ length: 5 }).map((_, index) =>
              <MoneySourceItem1
                isActive={false}
                title={`Tên liên hệ số ${index}`}
                key={index}
                sx={{
                  borderTop: 1,
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                }}
                menuComponent={<KeyboardArrowRightIcon />}
              />)}
          </AccordionDetails>
        </Accordion>
      </Box>

    </Box>
  )
}

export default DebtTab