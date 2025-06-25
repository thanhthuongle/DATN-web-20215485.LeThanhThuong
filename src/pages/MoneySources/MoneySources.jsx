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
  // console.log('🚀 ~ MoneySources ~ MoneySourceData:', MoneySourceData)

  const refreshData = () => {
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
        <CreateAccount afterCreateNewAccount={refreshData} />
        <CreateSaving afterCreateSaving={refreshData} accountData={MoneySourceData?.accounts} />
        <CreateAccumulation afterCreateAccumulation={refreshData} />
      </Grid>

      {/* Ví tiền */}
      <WalletCard walletData={MoneySourceData.accounts} refreshData={refreshData}/>

      {/* Sổ tiết kiệm */}
      <SavingCard data={MoneySourceData.savings_accounts} accountData={MoneySourceData?.accounts} refreshData={refreshData}/>

      {/* Tích lũy */}
      <AccumulateCard data={MoneySourceData.accumulations} accountData={MoneySourceData?.accounts} refreshData={refreshData}/>
    </Box>
  )
}

export default MoneySources