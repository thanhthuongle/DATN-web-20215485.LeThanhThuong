import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
// import GroupProtectedRoute from './GroupProtectedRoute'

const DefaultLayout = lazy(() => import('~/layout/DefaultLayout'))
// const GroupLayout = lazy(() => import('~/layout/GroupLayout'))
const Settinglayout = lazy(() => import('~/layout/Settinglayout'))

const Budgets = lazy(() => import('~/pages/Budgets/Budgets'))
const LoansAndDebts = lazy(() => import('~/pages/LoansAndDebts/LoansAndDebts'))
const MoneySources = lazy(() => import('~/pages/MoneySources/MoneySources'))
const NewTransaction = lazy(() => import('~/pages/NewTransaction/NewTransaction'))
const Overview = lazy(() => import('~/pages/Overview/Overview'))
const TransactionHistory = lazy(() => import('~/pages/TransactionHistory/TransactionHistory'))
const Auth = lazy(() => import('~/pages/Auth/Auth'))
const AccountVerification = lazy(() => import('~/pages/Auth/AccountVerification'))
const NotFound = lazy(() => import('~/pages/404/NotFound'))
const Settings = lazy(() => import('~/pages/Settings/Settings'))
// const ContributionRequest = lazy(() => import('~/pages/ContributionRequest/ContributionRequest'))
// const GroupInfo = lazy(() => import('~/pages/GroupInfo/GroupInfo'))
// const SpendingProposals = lazy(() => import('~/pages/SpendingProposals/SpendingProposals'))
// const GroupLists = lazy(() => import('~/pages/GroupLists/GroupLists'))

// import DefaultLayout from '~/layout/DefaultLayout'
// // import GroupLayout from '~/layout/GroupLayout'
// import Settinglayout from '~/layout/Settinglayout'

// import Budgets from '~/pages/Budgets/Budgets'
// // import ContributionRequest from '~/pages/ContributionRequest/ContributionRequest'
// // import GroupInfo from '~/pages/GroupInfo/GroupInfo'
// import LoansAndDebts from '~/pages/LoansAndDebts/LoansAndDebts'
// import MoneySources from '~/pages/MoneySources/MoneySources'
// import NewTransaction from '~/pages/NewTransaction/NewTransaction'
// import Overview from '~/pages/Overview/Overview'
// // import SpendingProposals from '~/pages/SpendingProposals/SpendingProposals'
// import TransactionHistory from '~/pages/TransactionHistory/TransactionHistory'
// // import GroupLists from '~/pages/GroupLists/GroupLists'
// import Auth from '~/pages/Auth/Auth'
// import AccountVerification from '~/pages/Auth/AccountVerification'
// import NotFound from '~/pages/404/NotFound'
// import Settings from '~/pages/Settings/Settings'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DefaultLayout workspace={'TCCN'}/>,
        // Component: DefaultLayout,
        children: [
          { index: true, element: <Navigate to='/overview' replace /> },
          { path: 'overview', Component: Overview },
          { path: 'money-sources', Component: MoneySources },
          { path: 'budgets', Component: Budgets },
          { path: 'loans-debts', Component: LoansAndDebts },
          { path: 'transaction-history', Component: TransactionHistory },
          { path: 'new-transaction', Component: NewTransaction }
        ]
      },
      // {
      //   path: '/groups',
      //   // Component: Settinglayout,
      //   element: <Settinglayout workspace={'TCGD'} />,
      //   children: [
      //     { index: true, Component: GroupLists }
      //   ]
      // },
      // {
      //   path: '/groups/:groupId',
      //   element: <GroupLayout workspace={'TCGD'} />,
      //   children : [
      //     { index: true, element: <Navigate to='overview' replace /> },
      //     { path: 'overview', Component: Overview },
      //     { path: 'money-sources', Component: MoneySources },
      //     { path: 'budgets', Component: Budgets },
      //     { path: 'loans-debts', Component: LoansAndDebts },
      //     { path: 'spending-proposals', Component: SpendingProposals },
      //     { path: 'contribution-request', Component: ContributionRequest },
      //     { path: 'transaction-history', Component: TransactionHistory },
      //     { path: 'new-transaction', Component: NewTransaction },
      //     { path: 'group-info', Component: GroupInfo }
      //   ]
      // },
      {
        path:'/settings',
        element: <Settinglayout workspace={'SETTING'} />,
        children: [
          { index: true, element: <Navigate to='account' replace={true} /> },
          { path: 'account', Component: Settings },
          { path: 'security', Component: Settings },
          { path: 'setting', Component: Settings }
        ]
      }
    ]
  },
  // Các route không cần đăng nhập
  {
    path: '/login',
    Component: Auth
  },
  {
    path: '/register',
    Component: Auth
  },
  {
    path: '/account/verification',
    Component: AccountVerification
  },
  {
    path: '/404',
    Component: NotFound
  },
  {
    path: '*',
    element: <Navigate to='/404' replace />
  }
])

export default routes
