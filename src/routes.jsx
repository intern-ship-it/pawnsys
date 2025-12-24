import { createBrowserRouter, Navigate } from 'react-router'

// Layout
import MainLayout from '@/components/layout/MainLayout'

// Pages
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import CustomerList from '@/pages/customers/CustomerList'
import CustomerDetail from '@/pages/customers/CustomerDetail'
import CustomerCreate from '@/pages/customers/CustomerCreate'
import CustomerEdit from '@/pages/customers/CustomerEdit'
import PledgeList from '@/pages/pledges/PledgeList'
import NewPledge from '@/pages/pledges/NewPledge'
import PledgeDetail from '@/pages/pledges/PledgeDetail'
import RenewalScreen from '@/pages/renewals/RenewalScreen'
import RedemptionScreen from '@/pages/redemptions/RedemptionScreen'
import InventoryList from '@/pages/inventory/InventoryList'
import StockReconciliation from '@/pages/inventory/StockReconciliation'
import AuctionScreen from '@/pages/auctions/AuctionScreen'
import ReportsScreen from '@/pages/reports/ReportsScreen'
import SettingsScreen from './pages/settings/SettingsScreen'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // Customer routes
      { path: 'customers', element: <CustomerList /> },
      { path: 'customers/new', element: <CustomerCreate /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'customers/:id/edit', element: <CustomerEdit /> },

      // Pledge routes
      { path: 'pledges', element: <PledgeList /> },
      { path: 'pledges/new', element: <NewPledge /> },
      { path: 'pledges/:id', element: <PledgeDetail /> },

      // Transaction routes
      { path: 'renewals', element: <RenewalScreen /> },
      { path: 'redemptions', element: <RedemptionScreen /> },

      // Inventory routes
      { path: 'inventory', element: <InventoryList /> },
      { path: 'inventory/reconciliation', element: <StockReconciliation /> },

      // Auction routes
      { path: 'auctions', element: <AuctionScreen /> },

      // Reports routes
      { path: 'reports', element: <ReportsScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])