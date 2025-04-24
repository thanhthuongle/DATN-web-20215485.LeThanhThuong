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
import { Link, useLocation, useParams } from 'react-router-dom'

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

const isMember = true
const isManager = true


function SideBar() {
  const location = useLocation() // TODO: Chuyển sang activeGroup của redux
  const { groupId } = useParams()

  const base = `/groups/${groupId}`

  const isActive = (path) => {
    return location?.pathname === path
  }

  return (
    <Stack direction="column" spacing={1}>
      <Link to={`${base}/overview`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/overview') ? 'active' : ''}>
          <SpaceDashboardIcon fontSize="small" />
          Tổng quan
        </SidebarItem>
      </Link>
      <Link to={`${base}/money-sources`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/money-sources') ? 'active' : ''}>
          <AccountBalanceWalletIcon fontSize="small" />
          Nguồn tiền
        </SidebarItem>
      </Link>
      <Link to={`${base}/budgets`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/budgets') ? 'active' : ''}>
          <FileCopyIcon fontSize="small" />
          Ngân sách
        </SidebarItem>
      </Link>
      <Link to={`${base}/loans-debts`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
      {(isMember && !isManager) &&
        <Link to={`${base}/spending-proposals`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <SidebarItem className={isActive('/spending-proposals') ? 'active' : ''}>
            <SvgIcon fontSize='small'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M29 20.52c0-4.62-3.78-5.14-6.82-5.56c-3.31-.46-5.18-.86-5.18-3.71c0-2.39 2.51-3.24 4.65-3.24c2.32 0 4.14.86 5.57 2.63l1.56-1.26C27.26 7.5 25.32 6.41 23 6.1V3h-2v3.02c-3.62.22-6 2.26-6 5.22c0 4.73 3.83 5.26 6.91 5.69c3.25.45 5.09.84 5.09 3.58c0 3.03-3.13 3.48-5 3.48c-3.43 0-4.88-.96-6.22-2.63l-1.56 1.26c1.77 2.19 3.73 3.17 6.78 3.34V29h2v-3.04c3.73-.3 6-2.33 6-5.44M3 11h8v2H3zm0 8h8v2H3zm2-4h8v2H5z"
                />
              </svg>
            </SvgIcon>
            Đề xuất chi tiêu
          </SidebarItem>
        </Link>
      }
      {(isManager) &&
        <Link to={`${base}/contribution-request`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <SidebarItem className={isActive('/contribution-request') ? 'active' : ''}>
            <RequestQuoteIcon fontSize="small" />
            Yêu cầu đóng góp
          </SidebarItem>
        </Link>
      }
      <Link to={`${base}/transaction-history`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <SidebarItem className={isActive('/transaction-history') ? 'active' : ''}>
          <HistoryIcon fontSize="small" />
          Lịch sử giao dịch
        </SidebarItem>
      </Link>
      {isManager &&
      <>
        <Divider sx={{ my: 1 }} />
        <Link to={`${base}/new-transaction`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <SidebarItem className={isActive('/new-transaction') ? 'active' : ''}>
            <LibraryAddIcon fontSize="small" />
            Tạo giao dịch
          </SidebarItem>
        </Link>
      </>
      }
      {(isMember || isManager) &&
      <>
        <Divider sx={{ my: 1 }} />
        <Link to={`${base}/group-info`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <SidebarItem className={isActive('/group-info') ? 'active' : ''}>
            <InfoIcon fontSize="small" />
            Thông tin nhóm
          </SidebarItem>
        </Link>
      </>
      }
    </Stack>
  )
}

export default SideBar