import Box from '@mui/material/Box'
import React from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import WalletCard from './WalletCard'
import SavingCard from './SavingCard'
import AccumulateCard from './AccumulateCard'

function MoneySources() {
  return (
    <Box
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      gap={2}
    >
      <Grid container width='90%' justifyContent='space-between' spacing={2}>
        <Button variant='contained'>Thêm ví viền</Button>
        <Button variant='contained'>Thêm Sổ tiết kiệm</Button>
        <Button variant='contained'>Thêm tích lũy</Button>
      </Grid>

      {/* Ví tiền */}
      <WalletCard />

      {/* Sổ tiết kiệm */}
      <SavingCard />

      {/* Tích lũy */}
      <AccumulateCard />
    </Box>
  )
}

export default MoneySources