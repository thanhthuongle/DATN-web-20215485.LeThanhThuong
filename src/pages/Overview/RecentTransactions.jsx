import React, { useEffect, useState } from 'react'
import { StyledBox } from './Overview'
import { Divider, Grid, Typography, Box, Button } from '@mui/material'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import { Link, useLocation } from 'react-router-dom'
import { replaceLastSegment } from '~/utils/pathUtils'
import { getIndividualRecentTransactions } from '~/apis'
import { TRANSACTION_TYPES } from '~/utils/constants'

const redTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.CONTRIBUTION, TRANSACTION_TYPES.REPAYMENT]
const greenTypes = [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.BORROWING, TRANSACTION_TYPES.COLLECT]

function RecentTransactions() {
  const location = useLocation()
  const [recentTransactions, setRecentTransactions] = useState(null)
  // console.log('🚀 ~ RecentTransactions ~ recentTransactions:', recentTransactions)

  useEffect(() => {
    const fetchData = async () => {
      getIndividualRecentTransactions().then((res) => {
        setRecentTransactions(res)
      })
    }
    fetchData()
  }, [])

  if (!recentTransactions) {
    return <></>
  }
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
      {recentTransactions && Array.isArray(recentTransactions) && recentTransactions.length > 0 ? (
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 5.8 }}>
            {recentTransactions.slice(0, Math.ceil(recentTransactions.length / 2)).map((item) => (
              <FinanceItem1
                logo={item?.category?.icon}
                key={item._id}
                title={item.name}
                description={item?.description}
                amount={item.amount}
                amountColor={ redTypes.includes(item.type) ? '#e74c3c' : (greenTypes.includes(item.type) ? '#27ae60' : '')} // #e74c3c, #27ae60
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

          <Grid size={{ xs: 12, sm: 5.8 }}>
            {recentTransactions.slice(Math.ceil(recentTransactions.length / 2)).map((item) => (
              <FinanceItem1
                logo={item?.category?.icon}
                key={item._id}
                title={item.name}
                description={item?.description}
                amount={item.amount}
                amountColor={ redTypes.includes(item.type) ? '#e74c3c' : (greenTypes.includes(item.type) ? '#27ae60' : '')} // #e74c3c, #27ae60
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