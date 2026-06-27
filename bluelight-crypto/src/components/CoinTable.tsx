import { useMemo, useState } from 'react'
import { Search, X, Inbox } from 'lucide-react'
import CoinRow, { ROW_GRID } from './CoinRow'
import Skeleton from './Skeleton'
import { useWatchlist } from '@/store/useWatchlist'
import type { Coin } from '@/types/coin'

type Filter = 'all' | 'watchlist' | 'gainers' | 'losers'
type SortKey = 'market_cap' | 'price' | 'change' | 'name'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'gainers', label: 'Gainers' },
  { key: 'losers', label: 'Losers' },
]

export default function CoinTable({ coins, isLoading }: { coins: Coin[]; isLoading: boolean }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('market_cap')
  const watchlistIds = useWatchlist((s) => s.ids)

  const visible = useMemo(() => {
    let list = [...coins]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
    }

    if (filter === 'watchlist') {
      list = list.filter((c) => watchlistIds.includes(c.id))
    } else if (filter === 'gainers') {
      list = list.filter((c) => (c.price_change_percentage_24h ?? 0) > 0)
    } else if (filter === 'losers') {
      list = list.filter((c) => (c.price_change_percentage_24h ?? 0) < 0)
    }

    switch (sortKey) {
      case 'price':
        list.sort((a, b) => b.current_price - a.current_price)
        break
      case 'change':
        list.sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => (a.market_cap_rank ?? 9999) - (b.market_cap_rank ?? 9999))
    }

    return list
  }, [coins, search, filter, sortKey, watchlistIds])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coin or symbol"
            aria-label="Search coins"
            className="w-full neu-inset rounded-lg pl-9 pr-9 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:shadow-neu-sm transition-shadow"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 neu-flat p-1 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f.key ? 'bg-azure text-white' : 'text-ink-dim hover:text-ink'
              }`}
            >
              {f.label}
              {f.key === 'watchlist' && watchlistIds.length > 0 && (
                <span className="ml-1.5 num text-[10px]">{watchlistIds.length}</span>
              )}
            </button>
          ))}
        </div>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="Sort coins"
          className="neu-flat px-3 py-2 text-xs text-ink-dim outline-none sm:ml-auto"
        >
          <option value="market_cap">Sort: Market cap</option>
          <option value="price">Sort: Price</option>
          <option value="change">Sort: 24h change</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {isLoading ? (
        <div className="neu-card overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-surface last:border-0">
              <Skeleton className="w-7 h-7 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <Skeleton className="h-3 w-16 hidden sm:block" />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="neu-card py-16 flex flex-col items-center text-center gap-2">
          <Inbox className="w-8 h-8 text-ink-faint" />
          <p className="text-sm text-ink-dim">No coins match this view.</p>
          <p className="text-xs text-ink-faint">Try a different search term or filter.</p>
        </div>
      ) : (
        <div className="neu-card overflow-hidden">
          <div className={`hidden sm:grid ${ROW_GRID} gap-3 px-4 sm:px-6 py-2.5 border-b border-surface text-[11px] uppercase tracking-wide text-ink-faint`}>
            <span>#</span>
            <span>Coin</span>
            <span>Price</span>
            <span>24h</span>
            <span>7d trend</span>
            <span>Market cap</span>
            <span />
          </div>
          <div>
            {visible.map((coin, i) => (
              <CoinRow key={coin.id} coin={coin} rank={coin.market_cap_rank ?? i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
