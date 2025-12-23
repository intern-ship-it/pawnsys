import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { toggleSidebar } from '@/features/ui/uiSlice'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/formatters'
import {
  Menu,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react'

export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, role } = useAppSelector((state) => state.auth)
  const { goldPrice, sidebarCollapsed } = useAppSelector((state) => state.ui)
  
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  // Mock notifications
  const notifications = [
    { id: 1, type: 'warning', message: '3 pledges expiring today', time: '5 min ago' },
    { id: 2, type: 'info', message: 'Gold price updated', time: '1 hour ago' },
    { id: 3, type: 'success', message: 'Daily reconciliation complete', time: '2 hours ago' },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter current page
      console.log('Searching for:', searchQuery)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Calculate price change (mock)
  const priceChange = 1.50
  const priceChangePercent = 0.51
  const isPositive = priceChange >= 0

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16',
        'bg-white/80 backdrop-blur-md border-b border-zinc-200',
        'transition-all duration-300',
        sidebarCollapsed ? 'left-20' : 'left-64'
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title / Breadcrumb - Can be dynamic */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-zinc-800">Dashboard</h1>
          </div>
        </div>

        {/* Center Section - Gold Price Widget */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-xl">
          {/* Gold Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm">
            <span className="text-xs font-bold text-white">Au</span>
          </div>
          
          {/* Price Info */}
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-700/70 uppercase tracking-wide font-medium">
              Gold 916/g
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-zinc-800">
                {formatCurrency(goldPrice.price916)}
              </span>
              <div className={cn(
                'flex items-center text-xs font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                <span>{isPositive ? '+' : ''}{priceChangePercent}%</span>
              </div>
            </div>
          </div>
          
          {/* 999 Price */}
          <div className="pl-3 ml-3 border-l border-amber-200">
            <span className="text-[10px] text-amber-700/70 uppercase tracking-wide font-medium">
              999/g
            </span>
            <p className="text-sm font-semibold text-zinc-700">
              {formatCurrency(goldPrice.price999)}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-zinc-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <h3 className="font-semibold text-zinc-800">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 last:border-0"
                      >
                        <p className="text-sm text-zinc-700">{notif.message}</p>
                        <p className="text-xs text-zinc-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100">
                    <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-200 mx-1" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              {/* Avatar */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              
              {/* Name & Role */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-zinc-700 leading-tight">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-xs text-zinc-400 capitalize">{role || 'User'}</p>
              </div>
              
              <ChevronDown className="w-4 h-4 text-zinc-400 hidden lg:block" />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-zinc-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="font-medium text-zinc-800">{user?.name || 'Guest'}</p>
                    <p className="text-sm text-zinc-500">{user?.email || 'guest@pawnsys.com'}</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                      <User className="w-4 h-4 text-zinc-400" />
                      Profile
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                      <Settings className="w-4 h-4 text-zinc-400" />
                      Settings
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                      <HelpCircle className="w-4 h-4 text-zinc-400" />
                      Help & Support
                    </button>
                  </div>
                  
                  <div className="border-t border-zinc-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search pledges, customers, inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            
            {/* Quick Links */}
            <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
              <p className="text-xs text-zinc-500 mb-2">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { navigate('/pledges/new'); setSearchOpen(false); }}
                  className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                >
                  New Pledge
                </button>
                <button 
                  onClick={() => { navigate('/customers/new'); setSearchOpen(false); }}
                  className="px-3 py-1.5 text-sm bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200"
                >
                  Add Customer
                </button>
                <button 
                  onClick={() => { navigate('/renewals'); setSearchOpen(false); }}
                  className="px-3 py-1.5 text-sm bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200"
                >
                  Process Renewal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
