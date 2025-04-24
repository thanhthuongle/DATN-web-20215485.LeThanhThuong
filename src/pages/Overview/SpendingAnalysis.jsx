import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import { StyledBox } from './Overview'
import VerticalBarChart from '~/component/Chart/VerticalBarChart'
import Stack from '@mui/material/Stack'
import MonthRangePicker from '~/component/Picker/MonthRangePicker'

const items = Array.from({ length: 10 }, (_, i) => ({
  title: `Hạng mục ${i}`,
  description: '10%',
  amount: 123456,
  amountColor: '#e74c3c'
}))

function SpendingAnalysis() {
  return (
    <StyledBox
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      width='100%'
    >
      <Box display={{ xs: 'block', sm: 'flex' }} gap={4}>
        <Typography variant='h6'>Phân tích chi tiêu</Typography>
        < MonthRangePicker />
        <Box alignContent='center' justifySelf='center'><Button variant='contained'>OK</Button></Box>
      </ Box>
      <Grid container >
        <Box
          width={{ xs: '100%', sm: '70%' }}
          paddingRight={{ xs: 0, sm: 1 }}
        >
          <VerticalBarChart />
        </Box>
        <Stack
          width={{ xs: '100%', sm: '30%' }}
          maxHeight='400px'
          overflow='auto'
        >
          {items.map((item, index) => (
            <FinanceItem1
              key={index}
              title={item.title}
              description={item.description}
              logoSize={40}
              amount={item.amount}
              amountColor={item.amountColor}
              amountDesc={item.amountDesc}
              sx={{
                borderTop: 1,
                borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
              }}
            />
          ))}
          {/* <FinanceItem1
            title={'Hạng mục 1'}
            description={'mô tả hạng mục 1'}
            logoSize={40}
            amount={123456}
            amountColor={'#e74c3c'} // Thu: #27AE60 - Chi: #e74c3c
            amountDesc={'mô tả số tiền'}
            sx={{ borderTop: 1, borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'}}
          /> */}
        </Stack>
      </Grid>
    </StyledBox>
  )
}

export default SpendingAnalysis