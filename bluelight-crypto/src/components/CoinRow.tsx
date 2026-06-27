import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sparkline from './Sparkline'
import WatchlistButton from './WatchlistButton'
import { formatPrice, formatPercent, formatCompact } from '@/utils/format'
import { useWatchlist } from '@/store/useWatchlist'
import { useSettings } from '@/store/useSettings'
import type { Coin } from '@/types/coin'

export const ROW_GRID = 'grid-cols-[32px_2.4fr_1fr_0.9fr_1.1fr_1fr_36px]'

export default function CoinRow({ coin, rank }: { coin: Coin; rank: number }) {
  const navigate = useNavigate()
  const currency = useSettings((s) => s.currency)
  const isWatched = useWatchlist((s) => s.isWatched(coin.id))
  const toggle = useWatchlist((s) => s.toggle)

  const positive = (coin.price_change_percentage_24h ?? 0) >= 0
  const sparklineData = coin.sparkline_in_7d?.price ?? []

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="group cursor-pointer border-b border-surface last:border-0 hover:bg-surface/60 transition-colors"
    >
      <div className={`hidden sm:grid ${ROW_GRID} gap-3 items-center px-4 sm:px-6 py-3`}>
        <span className="num text-xs text-ink-faint">{rank}</span>

        <div className="flex items-center gap-3 min-w-0">
          <img src={coin.image} alt="" className="w-7 h-7 rounded-full shrink-0" loading="lazy" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{coin.name}</p>
            <p className="text-xs text-ink-faint uppercase">{coin.symbol}</p>
          </div>
        </div>

        <span className="num text-sm text-ink">{formatPrice(coin.current_price, currency)}</span>

        <span className={`num text-sm font-medium ${positive ? 'text-up' : 'text-down'}`}>
          {formatPercent(coin.price_change_percentage_24h)}
        </span>

        <Sparkline data={sparklineData} positive={positive} width={110} height={32} />

        <span className="num text-sm text-ink-dim">{formatCompact(coin.market_cap, currency)}</span>

        <WatchlistButton active={isWatched} onToggle={() => toggle(coin.id)} />
      </div>

      <div className="sm:hidden flex items-center gap-3 px-4 py-3">
        <img src={coin.image} alt="" className="w-8 h-8 rounded-full shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink truncate">{coin.name}</p>
            <span className="num text-sm text-ink">{formatPrice(coin.current_price, currency)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-xs text-ink-faint uppercase">{coin.symbol}</p>
            <span className={`num text-xs font-medium ${positive ? 'text-up' : 'text-down'}`}>
              {formatPercent(coin.price_change_percentage_24h)}
            </span>
          </div>
        </div>
        <WatchlistButton active={isWatched} onToggle={() => toggle(coin.id)} />
      </div>
    </motion.div>
  )
}
