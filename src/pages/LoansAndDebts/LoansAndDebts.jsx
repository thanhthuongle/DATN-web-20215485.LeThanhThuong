import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import LoanTab from './LoanTab'
import DebtTab from './DebtTab'

const TABS = {
  LOANS: 'loans',
  DEBTS: 'debts'
}

function LoansAndDebts() {
  const [activeTab, setActiveTab] = React.useState(TABS.LOANS)

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'center'
    }}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} variant="fullWidth" sx={{ width: '100%' }} >
              <Tab label="Cho vay" value={TABS.LOANS} />
              <Tab label="Đi vay" value={TABS.DEBTS} />
            </TabList>
          </Box>
          <TabPanel value={TABS.LOANS}><LoanTab collected={3123432} totalLoan={7638245} /></TabPanel>
          <TabPanel value={TABS.DEBTS}><DebtTab totalAllocated={10867385} totalNegativeBalance={32176023} paid={4563452} totalBorrwed={7690235} /></TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default LoansAndDebts
