import React from 'react'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import SvgIcon from '@mui/material/SvgIcon'
import HistoryIcon from '@mui/icons-material/History'
import InfoIcon from '@mui/icons-material/Info'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Link, useLocation } from 'react-router-dom'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

const WORKSPACE = {
  TCCN: 'TCCN',
  TCGD: 'TCGD'
}

const SIDEBAR_ITEM_LISTS = {
  OVERVIEW: 'Tổng quan',
  MONEY_SOURCES: 'Nguồn tiền',
  BUDGETS: 'Ngân sách',
  LOANS_DEBTS: 'Theo dõi vay nợ',
  SPENDING_PROPOSALS: 'Đề xuất chi tiêu',
  CONTRIBUTION_REQUESTS: 'Yêu cầu đóng góp',
  TRANSACTION_HISTORY: 'Lịch sử giao dịch',
  NEW_TRANSACTION: 'Tạo giao dịch',
  GROUP_INFO: 'Thông tin nhóm'
}


function SideBar() {
  const location = useLocation()

  const isActive = (path) => {
    return location?.pathname === path
  }

  return (
    <Stack direction="column" spacing={1}>
      <Link to='/overview' style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/overview') ? 'active' : ''}>
          <SpaceDashboardIcon fontSize="small" />
          Tổng quan
        </SidebarItem>
      </Link>
      <Link to='/new-transaction' style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/new-transaction') ? 'active' : ''}>
          <LibraryAddIcon fontSize="small" />
          Tạo giao dịch
        </SidebarItem>
      </Link>
      <Divider sx={{ my: 1 }} />
      <Link to='/money-sources' style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/money-sources') ? 'active' : ''}>
          <AccountBalanceWalletIcon fontSize="small" />
          Nguồn tiền
        </SidebarItem>
      </Link>
      <Link to='/budgets' style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/budgets') ? 'active' : ''}>
          <FileCopyIcon fontSize="small" />
          Ngân sách
        </SidebarItem>
      </Link>
      <Link to='/loans-debts' style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/loans-debts') ? 'active' : ''}>
          <SvgIcon fontSize='small'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M8 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8m9 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6M4.25 13A2.25 2.25 0 0 0 2 15.25v.25S2 20 8 20c1.238 0 2.22-.192 3-.495V15.5c0-1.064.665-1.972 1.601-2.334A2.2 2.2 0 0 0 11.75 13zM12 15.5a1.5 1.5 0 0 1 1.5-1.5h8a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-8a1.5 1.5 0 0 1-1.5-1.5zm1 .5v1a2 2 0 0 0 2-2h-1a1 1 0 0 1-1 1m9 1v-1a1 1 0 0 1-1-1h-1a2 2 0 0 0 2 2m-2 3h1a1 1 0 0 1 1-1v-1a2 2 0 0 0-2 2m-7-2v1a1 1 0 0 1 1 1h1a2 2 0 0 0-2-2m4.5 1.25a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5"
              />
            </svg>
          </SvgIcon>
          Theo dõi vay nợ
        </SidebarItem>
      </Link>
      <>
        <Divider sx={{ my: 1 }} />
        <Link to='/transaction-history' style={{ textDecoration: 'none', color: 'inherit' }}>
          <SidebarItem className={isActive('/transaction-history') ? 'active' : ''}>
            <HistoryIcon fontSize="small" />
            Lịch sử giao dịch
          </SidebarItem>
        </Link>
      </>
    </Stack>
  )
}

export default SideBar