import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, Settings as SettingsIcon } from 'lucide-react'
import CurrencyToggle from './CurrencyToggle'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/portfolio', label: 'Portfolio', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Header() {
  return (
    <header className="bg-surface-deep text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-azure flex items-center justify-center text-white text-xs font-bold">
            B
          </span>
          <span className="font-semibold tracking-tight text-sm sm:text-base hidden sm:inline">BlueLight</span>
        </NavLink>

        <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive ? 'bg-azure text-white' : 'text-white/70 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <CurrencyToggle variant="dark" className="shrink-0" />
      </div>
    </header>
  )
}
