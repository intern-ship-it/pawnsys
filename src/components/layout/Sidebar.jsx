import { NavLink, useLocation } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleSidebarCollapse } from '@/features/ui/uiSlice'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  RefreshCw,
  Wallet,
  Package,
  Gavel,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ClipboardCheck,
} from 'lucide-react'

const menuItems = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'TRANSACTIONS',
    items: [
      { name: 'New Pledge', path: '/pledges/new', icon: FileText, highlight: true },
      { name: 'All Pledges', path: '/pledges', icon: FileText },
      { name: 'Renewals', path: '/renewals', icon: RefreshCw },
      { name: 'Redemptions', path: '/redemptions', icon: Wallet },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Customers', path: '/customers', icon: Users },
      { name: 'Inventory', path: '/inventory', icon: Package },
      { name: 'Reconciliation', path: '/inventory/reconciliation', icon: ClipboardCheck },
      { name: 'Auctions', path: '/auctions', icon: Gavel },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      { name: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
]

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)
  const { user, role } = useAppSelector((state) => state.auth)

  const handleToggleCollapse = () => {
    dispatch(toggleSidebarCollapse())
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900',
        'border-r border-zinc-700/50',
        'flex flex-col',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-700/50">
        <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center w-full')}>
          {/* Logo Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20">
            <span className="text-lg font-bold text-zinc-900">PS</span>
          </div>
          {/* Logo Text */}
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight">PawnSys</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Pajak Kedai</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {/* Section Title */}
            {!sidebarCollapsed && (
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {/* Menu Items */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                          'group relative',
                          isActive
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50',
                          item.highlight && !isActive && 'border border-amber-500/30 bg-amber-500/5',
                          sidebarCollapsed && 'justify-center px-2'
                        )
                      }
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
                      )}

                      {/* Icon */}
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-amber-500' : 'text-zinc-400 group-hover:text-white',
                          item.highlight && !isActive && 'text-amber-500/70'
                        )}
                      />

                      {/* Label */}
                      {!sidebarCollapsed && (
                        <span className={cn(
                          'text-sm font-medium',
                          item.highlight && !isActive && 'text-amber-500/90'
                        )}>
                          {item.name}
                        </span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-zinc-700">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section - User & Collapse Toggle */}
      <div className="border-t border-zinc-700/50 p-3">
        {/* User Info */}
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 mb-3',
          sidebarCollapsed && 'justify-center'
        )}>
          {/* Avatar */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-900 font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-zinc-400 capitalize">
                {role || 'No Role'}
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={handleToggleCollapse}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-lg',
            'text-zinc-400 hover:text-white hover:bg-zinc-700/50',
            'transition-all duration-200'
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
