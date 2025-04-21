import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import { Link, useLocation } from 'react-router-dom'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'
import SettingTab from './SettingTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security',
  SETTING: 'setting'
}
const base = 'settings/'
const TABS_URL = {
  ACCOUNT: `${base}${TABS.ACCOUNT}`,
  SECURITY: `${base}${TABS.SECURITY}`,
  SETTING: `${base}${TABS.SETTING}`
}

function Settings() {
  const location = useLocation()
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS_URL.SETTING))
      return TABS.SETTING
    else if (location.pathname.includes(TABS_URL.SECURITY))
      return TABS.SECURITY
    return TABS.ACCOUNT
  }

  // State lưu trữ giá trị tab nào đang active
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  // https://mui.com/material-ui/react-tabs
  const handleChangeTab = (event, selectedTab) => {  }

  useEffect(() => {
    setActiveTab(getDefaultTab())
  }, [location])

  return (
    <TabContext value={activeTab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChangeTab}>
          <Tab
            label="Account"
            value={TABS.ACCOUNT}
            icon={<PersonIcon />}
            iconPosition="start"
            component={Link}
            to="/settings/account" />
          <Tab
            label="Security"
            value={TABS.SECURITY}
            icon={<SecurityIcon />}
            iconPosition="start"
            component={Link}
            to="/settings/security" />
          <Tab
            label="Setting"
            value={TABS.SETTING}
            icon={<SettingsIcon />}
            iconPosition="start"
            component={Link}
            to="/settings/setting" />
        </TabList>
      </Box>
      <TabPanel value={TABS.ACCOUNT}><AccountTab /></TabPanel>
      <TabPanel value={TABS.SECURITY}><SecurityTab /></TabPanel>
      <TabPanel value={TABS.SETTING}><SettingTab /></TabPanel>
    </TabContext>
  )
}

export default Settings
