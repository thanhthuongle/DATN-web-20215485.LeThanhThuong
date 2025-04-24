import { Box, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
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

const categoryLists = ['Hạng mục 1(10%)', 'Hạng mục 2(15%)', 'Hạng mục 3(35%)']
const percentageLists = [10, 15, 75]
const colorLists = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)'
]

function TransactionSummary() {
  let income = 10
  let expense = 7

  if (income == 0 && expense == 0) {
    return (
      <StyledBox width="100%" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h6'>Tình hình thu chi</Typography>
        <Box
          display='flex'
          justifyContent='center'
          paddingY='32px'
        >
          Bạn chưa có giao dịch thu chi nào.
        </Box>
      </StyledBox>
    )
  }
  return (
    <StyledBox width="100%" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box display='flex' alignItems='end' gap={{ xs: 4, sm: 5 }}>
        <Typography variant='h6'>Tình hình thu chi</Typography>
        <Box>
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Thời gian</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              defaultValue='30'
            >
              <MenuItem value='10'>Hôm nay</MenuItem>
              <MenuItem value='20'>Tuần này</MenuItem>
              <MenuItem value='30'>Tháng này</MenuItem>
              <MenuItem value='40'>Quý này</MenuItem>
              <MenuItem value='50'>Năm này</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
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
                suffix=" ₫"
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
                suffix=" ₫"
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
                  suffix=" ₫"
                  value={income-expense}
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box width={{ xs: '100%', sm: '50%' }} display='flex' sx={{ paddingLeft: { xs: 0, sm: 8 }, paddingBottom: 1 }}>
          <DoughnutChart
            categoryLists={categoryLists}
            percentageLists={percentageLists}
            colorLists={colorLists}
          />
        </Box>
      </Grid>
    </StyledBox>
  )
}

export default TransactionSummary
