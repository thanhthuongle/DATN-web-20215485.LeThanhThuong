import React from 'react'
import { Box, Typography } from '@mui/material'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import Workspaces from './Menus/Workspaces'
import Notifications from './Notifications/Notifications'
import ModeSelect from '~/component/ModeSelect/ModeSelect'
import Profile from './Menus/Profile'

function AppBar(props) {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.QLTC.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        backgroundColor:(theme) => (
          (props?.workspace === 'TCGD')
            ? theme.palette.mode === 'dark' ? '#114528' : '#2bae66'
            : theme.palette.mode === 'dark' ? '#1565c0' : '#08284C'
        ), // tài chính gia đình:light: #2bae66- dark: #114528, tài chính cá nhân: light: #1565c0 - dark: #08284C
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MonetizationOnIcon sx={{ color: 'white' }}/>
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} > QLTC </Typography>
          </Box>
        </Box>
      </Box>

      <Workspaces />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Notifications />
        <ModeSelect />
        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
