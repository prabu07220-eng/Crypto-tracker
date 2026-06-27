import { Moon, Sun, Trash2 } from 'lucide-react'
import { useSettings } from '@/store/useSettings'
import { useWatchlist } from '@/store/useWatchlist'
import { usePortfolio } from '@/store/usePortfolio'
import CurrencyToggle from '@/components/CurrencyToggle'
import PageTransition from '@/components/PageTransition'

const REFRESH_OPTIONS = [
  { ms: 15000, label: '15 seconds' },
  { ms: 30000, label: '30 seconds' },
  { ms: 45000, label: '45 seconds' },
  { ms: 60000, label: '1 minute' },
]

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-surface last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-faint mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { theme, toggleTheme, refreshInterval, setRefreshInterval } = useSettings()
  const watchlistIds = useWatchlist((s) => s.ids)
  const clearWatchlist = () => watchlistIds.forEach((id) => useWatchlist.getState().toggle(id))
  const holdings = usePortfolio((s) => s.holdings)
  const clearPortfolio = () => holdings.forEach((h) => usePortfolio.getState().removeHolding(h.id))

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink">Settings</h1>
          <p className="text-sm text-ink-faint mt-0.5">Preferences are saved to this browser.</p>
        </div>

        <div className="neu-card p-4 sm:p-5 divide-y divide-surface">
          <SettingRow label="Theme" description="Switch between light and dark surfaces.">
            <button
              onClick={toggleTheme}
              className="neu-btn flex items-center gap-2 px-3 py-2 text-sm text-ink"
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'light' ? 'Light' : 'Dark'}
            </button>
          </SettingRow>

          <SettingRow label="Currency" description="Used across the dashboard and coin pages.">
            <CurrencyToggle />
          </SettingRow>

          <SettingRow label="Refresh interval" description="How often live prices are refetched.">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="neu-inset rounded-lg px-3 py-2 text-sm text-ink outline-none"
            >
              {REFRESH_OPTIONS.map((opt) => (
                <option key={opt.ms} value={opt.ms}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingRow>
        </div>

        <div className="neu-card p-4 sm:p-5 divide-y divide-surface">
          <SettingRow label="Clear watchlist" description={`${watchlistIds.length} coin${watchlistIds.length === 1 ? '' : 's'} saved.`}>
            <button
              onClick={clearWatchlist}
              disabled={watchlistIds.length === 0}
              className="neu-btn flex items-center gap-2 px-3 py-2 text-sm text-down disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </SettingRow>

          <SettingRow label="Clear portfolio" description={`${holdings.length} holding${holdings.length === 1 ? '' : 's'} saved.`}>
            <button
              onClick={clearPortfolio}
              disabled={holdings.length === 0}
              className="neu-btn flex items-center gap-2 px-3 py-2 text-sm text-down disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </SettingRow>
        </div>
      </div>
    </PageTransition>
  )
}
