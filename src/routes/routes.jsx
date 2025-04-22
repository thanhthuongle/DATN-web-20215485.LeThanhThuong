import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import GroupProtectedRoute from './GroupProtectedRoute'

const DefaultLayout = lazy(() => import('~/layout/DefaultLayout'))
const GroupLayout = lazy(() => import('~/layout/GroupLayout'))
const Settinglayout = lazy(() => import('~/layout/Settinglayout'))

const Budgets = lazy(() => import('~/pages/Budgets/Budgets'))
const ContributionRequest = lazy(() => import('~/pages/ContributionRequest/ContributionRequest'))
const GroupInfo = lazy(() => import('~/pages/GroupInfo/GroupInfo'))
const LoansAndDebts = lazy(() => import('~/pages/LoansAndDebts/LoansAndDebts'))
const MoneySources = lazy(() => import('~/pages/MoneySources/MoneySources'))
const NewTransaction = lazy(() => import('~/pages/NewTransaction/NewTransaction'))
const Overview = lazy(() => import('~/pages/Overview/Overview'))
const SpendingProposals = lazy(() => import('~/pages/SpendingProposals/SpendingProposals'))
const TransactionHistory = lazy(() => import('~/pages/TransactionHistory/TransactionHistory'))
const GroupLists = lazy(() => import('~/pages/GroupLists/GroupLists'))
const Auth = lazy(() => import('~/pages/Auth/Auth'))
const NotFound = lazy(() => import('~/pages/404/NotFound'))
const Settings = lazy(() => import('~/pages/Settings/Settings'))

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
      {
        path: '/groups',
        // Component: Settinglayout,
        element: <Settinglayout workspace={'TCGD'} />,
        children: [
          { index: true, Component: GroupLists }
        ]
      },
      {
        path: '/groups/:groupId',
        element: <GroupProtectedRoute />,
        children : [
          {
            path: '',
            element: <GroupLayout workspace={'TCGD'} />,
            // Component: GroupLayout, //TODO: check user có thuộc nhóm này hay ko?
            children: [
              { index: true, element: <Navigate to='overview' replace /> },
              { path: 'overview', Component: Overview },
              { path: 'money-sources', Component: MoneySources },
              { path: 'budgets', Component: Budgets },
              { path: 'loans-debts', Component: LoansAndDebts },
              { path: 'spending-proposals', Component: SpendingProposals },
              { path: 'contribution-request', Component: ContributionRequest },
              { path: 'transaction-history', Component: TransactionHistory },
              { path: 'new-transaction', Component: NewTransaction },
              { path: 'group-info', Component: GroupInfo }
            ]
          }
        ]
      },
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
    Component: Auth
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
