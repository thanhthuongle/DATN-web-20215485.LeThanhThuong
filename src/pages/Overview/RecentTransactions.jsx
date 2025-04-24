import React from 'react'
import { StyledBox } from './Overview'
import { Divider, Grid, Typography, Box, Button } from '@mui/material'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import moment from 'moment'
import { Link, useLocation } from 'react-router-dom'
import { replaceLastSegment } from '~/utils/pathUtils'

const historyLists = Array.from({ length: 21 }, (_, i) => ({
  category: `Hạng mục ${i}`,
  date: moment(new Date()).format('DD/MM/YYYY'),
  amount: 12345678,
  amountColor: ((i+1)%4==0) ? '#27ae60': '#e74c3c'
}))

function RecentTransactions() {
  const location = useLocation()
  return (
    <StyledBox
      width='100%'
      gap={2}
      display={'flex'}
      flexDirection={'column'}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <Typography variant="h6">Giao dịch gần đây</Typography>
        <Button
          component={Link}
          to={replaceLastSegment(location?.pathname, 'transaction-history')}
          sx={{
            textTransform: 'none',
            p: 0,
            textDecoration: 'none'
          }}
        >
          <Typography variant="body1">Xem tất cả</Typography>
        </Button>
      </Box>
      {historyLists && historyLists?.length > 0 ? (
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 5.9 }}>
            {historyLists.slice(0, Math.ceil(historyLists.length / 2)).map((history, index) => (
              <FinanceItem1
                key={index}
                title={history.category}
                description={history.date}
                amount={history.amount}
                amountColor={history.amountColor}
                sx={{
                  borderTop: 1,
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                }}
              />
            ))}
          </Grid>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' }
            }}
          />

          <Grid size={{ xs: 12, sm: 5.9 }}>
            {historyLists.slice(Math.ceil(historyLists.length / 2)).map((history, index) => (
              <FinanceItem1
                key={index}
                title={history.category}
                description={history.date}
                amount={history.amount}
                amountColor={history.amountColor}
                sx={{
                  borderTop: 1,
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                }}
              />
            ))}
          </Grid>
        </Grid>
      ) : (
        <Typography align="center" sx={{ opacity: 0.6, mt: 2 }}>
          Bạn chưa có giao dịch nào gần đây!
        </Typography>
      )}
    </StyledBox>
  )
}

export default RecentTransactions