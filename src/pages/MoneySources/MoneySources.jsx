import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import WalletCard from './WalletCard'
import SavingCard from './SavingCard'
import AccumulateCard from './AccumulateCard'
import { getIndividualMoneySourceAPI } from '~/apis'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import CreateAccount from './Create/CreateAccount'
import CreateAccumulation from './Create/CreateAccumulation'
import CreateSaving from './Create/CreateSaving'

function MoneySources() {
  const [MoneySourceData, setMoneySourceData] = useState(null)
  console.log('🚀 ~ MoneySources ~ MoneySourceData:', MoneySourceData)

  const afterCreateNew = () => {
    getIndividualMoneySourceAPI().then( (res) => {
      setMoneySourceData(res)
    })
  }

  useEffect(() => {
    getIndividualMoneySourceAPI().then( (res) => {
      setMoneySourceData(res)
    })
  }, [])

  if (!MoneySourceData) {
    return <PageLoadingSpinner caption={'Loading data...'} />
  }
  return (
    <Box
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      gap={2}
    >
      <Grid container width='90%' justifyContent='space-between' spacing={2}>
        {/* <Button variant='contained'>Thêm ví viền</Button> */}
        <CreateAccount afterCreateNewAccount={afterCreateNew} />
        <CreateSaving afterCreateSaving={afterCreateNew} />
        <CreateAccumulation afterCreateAccumulation={afterCreateNew} />
      </Grid>

      {/* Ví tiền */}
      <WalletCard data={MoneySourceData.accounts} />

      {/* Sổ tiết kiệm */}
      <SavingCard data={MoneySourceData.savings_accounts} />

      {/* Tích lũy */}
      <AccumulateCard data={MoneySourceData.accumulations} />
    </Box>
  )
}

export default MoneySources