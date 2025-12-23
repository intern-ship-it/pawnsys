import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setCustomers } from '@/features/customers/customersSlice'
import { setPledges } from '@/features/pledges/pledgesSlice'
import { setItems } from '@/features/inventory/inventorySlice'
import { getStorageItem, STORAGE_KEYS } from '@/utils/localStorage'
import { formatCurrency, formatDate, formatCurrencyShort } from '@/utils/formatters'
import { calculateDaysRemaining } from '@/utils/calculations'
import { cn } from '@/lib/utils'
import PageWrapper from '@/components/layout/PageWrapper'
import {
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
} from '@/components/common'
import {
  FileText,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Wallet,
  ArrowRight,
  Calendar,
  DollarSign,
  Gavel,
  BarChart3,
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, role } = useAppSelector((state) => state.auth)
  const { goldPrice } = useAppSelector((state) => state.ui)
  const { pledges } = useAppSelector((state) => state.pledges)
  const { customers } = useAppSelector((state) => state.customers)
  
  const [stats, setStats] = useState({
    totalPledges: 0,
    activePledges: 0,
    totalCustomers: 0,
    totalValue: 0,
    expiringToday: 0,
    expiringSoon: 0,
    defaulted: 0,
  })

  // Load data on mount
  useEffect(() => {
    const storedCustomers = getStorageItem(STORAGE_KEYS.CUSTOMERS, [])
    const storedPledges = getStorageItem(STORAGE_KEYS.PLEDGES, [])
    const storedInventory = getStorageItem(STORAGE_KEYS.INVENTORY, [])
    
    dispatch(setCustomers(storedCustomers))
    dispatch(setPledges(storedPledges))
    dispatch(setItems(storedInventory))
    
    // Calculate stats
    const activePledges = storedPledges.filter(p => p.status === 'active' || p.status === 'expiring')
    const expiringToday = storedPledges.filter(p => {
      const days = calculateDaysRemaining(p.maturityDate)
      return days === 0
    })
    const expiringSoon = storedPledges.filter(p => {
      const days = calculateDaysRemaining(p.maturityDate)
      return days > 0 && days <= 7
    })
    const defaulted = storedPledges.filter(p => p.status === 'defaulted')
    const totalValue = activePledges.reduce((sum, p) => sum + p.principalAmount, 0)
    
    setStats({
      totalPledges: storedPledges.length,
      activePledges: activePledges.length,
      totalCustomers: storedCustomers.length,
      totalValue,
      expiringToday: expiringToday.length,
      expiringSoon: expiringSoon.length,
      defaulted: defaulted.length,
    })
  }, [dispatch])

  // Get recent pledges
  const recentPledges = pledges.slice(0, 5)

  // Alert items (expiring and defaulted)
  const alertItems = pledges.filter(p => {
    const days = calculateDaysRemaining(p.maturityDate)
    return p.status === 'expiring' || p.status === 'defaulted' || days <= 7
  }).slice(0, 5)

  // Quick action cards
  const quickActions = [
    {
      title: 'New Pledge',
      description: 'Create a new pledge transaction',
      icon: Plus,
      color: 'amber',
      path: '/pledges/new',
    },
    {
      title: 'Renewal',
      description: 'Process pledge renewals',
      icon: RefreshCw,
      color: 'blue',
      path: '/renewals',
    },
    {
      title: 'Redemption',
      description: 'Process item redemptions',
      icon: Wallet,
      color: 'emerald',
      path: '/redemptions',
    },
    {
      title: 'Reports',
      description: 'View and export reports',
      icon: BarChart3,
      color: 'purple',
      path: '/reports',
    },
  ]

  // Table columns for recent pledges
  const pledgeColumns = [
    {
      key: 'id',
      label: 'Pledge ID',
      render: (value) => (
        <span className="font-mono text-xs font-medium text-zinc-800">{value}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
    },
    {
      key: 'principalAmount',
      label: 'Amount',
      render: (value) => (
        <span className="font-semibold text-zinc-800">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'maturityDate',
      label: 'Maturity',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge.Status status={value} />,
    },
  ]

  return (
    <PageWrapper
      title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'User'}!`}
      subtitle={formatDate(new Date(), 'long')}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Pledges"
          value={stats.activePledges}
          icon={FileText}
          trend="up"
          trendValue="+12%"
          trendLabel="vs last month"
          onClick={() => navigate('/pledges')}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend="up"
          trendValue="+5"
          trendLabel="new this week"
          onClick={() => navigate('/customers')}
        />
        <StatCard
          title="Portfolio Value"
          value={formatCurrencyShort(stats.totalValue)}
          icon={DollarSign}
          variant="amber"
        />
        <StatCard
          title="Pending Auctions"
          value={stats.defaulted}
          icon={Gavel}
          variant={stats.defaulted > 0 ? 'danger' : 'default'}
          onClick={() => navigate('/auctions')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card padding="lg">
            <Card.Header
              title="Quick Actions"
              subtitle="Frequently used operations"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                const colorClasses = {
                  amber: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
                  blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
                  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
                  purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
                }
                
                return (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className={cn(
                      'flex flex-col items-center p-4 rounded-xl border transition-all',
                      colorClasses[action.color]
                    )}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">{action.title}</span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Recent Pledges */}
          <Card padding="lg">
            <Card.Header
              title="Recent Pledges"
              subtitle="Latest transactions"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={ArrowRight}
                  onClick={() => navigate('/pledges')}
                >
                  View All
                </Button>
              }
            />
            <DataTable
              columns={pledgeColumns}
              data={recentPledges}
              pagination={false}
              onRowClick={(row) => navigate(`/pledges/${row.id}`)}
              emptyMessage="No pledges found"
            />
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Gold Price Card */}
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 text-white">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="font-bold text-sm">Au</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Gold Price</p>
                    <p className="text-[10px] text-white/60">Live Market Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+0.51%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/70 text-xs">916 (22K)</p>
                    <p className="text-2xl font-bold">{formatCurrency(goldPrice.price916)}</p>
                  </div>
                  <p className="text-white/70 text-xs">per gram</p>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                  <div>
                    <p className="text-white/70 text-xs">999 (24K)</p>
                    <p className="text-lg font-semibold">{formatCurrency(goldPrice.price999)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">750 (18K)</p>
                    <p className="text-lg font-semibold">{formatCurrency(243)}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-white/50 mt-4">
                Last updated: {formatDate(goldPrice.lastUpdated, 'datetime')}
              </p>
            </div>
          </Card>

          {/* Alerts Card */}
          <Card padding="lg">
            <Card.Header
              title="Alerts & Reminders"
              icon={AlertTriangle}
            />
            <div className="space-y-3">
              {/* Expiring Today */}
              {stats.expiringToday > 0 && (
                <div
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => navigate('/pledges?filter=expiring-today')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800">Expiring Today</p>
                      <p className="text-xs text-red-600">{stats.expiringToday} pledge(s)</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-red-400" />
                </div>
              )}

              {/* Expiring Soon */}
              {stats.expiringSoon > 0 && (
                <div
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => navigate('/pledges?filter=expiring-soon')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800">Expiring Soon</p>
                      <p className="text-xs text-amber-600">{stats.expiringSoon} pledge(s) in 7 days</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              )}

              {/* Defaulted */}
              {stats.defaulted > 0 && (
                <div
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 border border-zinc-200 cursor-pointer hover:bg-zinc-200 transition-colors"
                  onClick={() => navigate('/auctions')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center">
                      <Gavel className="w-4 h-4 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-800">Ready for Auction</p>
                      <p className="text-xs text-zinc-600">{stats.defaulted} item(s)</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              )}

              {/* No Alerts */}
              {stats.expiringToday === 0 && stats.expiringSoon === 0 && stats.defaulted === 0 && (
                <div className="text-center py-6 text-zinc-500">
                  <p className="text-sm">No alerts at this time</p>
                </div>
              )}
            </div>
          </Card>

          {/* Today's Summary */}
          <Card padding="lg">
            <Card.Header title="Today's Summary" />
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">New Pledges</span>
                <span className="font-semibold text-zinc-800">3</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">Renewals</span>
                <span className="font-semibold text-zinc-800">5</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">Redemptions</span>
                <span className="font-semibold text-zinc-800">2</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-zinc-600">Total Collection</span>
                <span className="font-bold text-emerald-600">{formatCurrency(15250)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}

// Helper function to get greeting based on time
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}
