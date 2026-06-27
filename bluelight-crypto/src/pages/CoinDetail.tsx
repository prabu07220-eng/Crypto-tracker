import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCoin } from '@/hooks/useCoin'
import { useMarketChart } from '@/hooks/useMarketChart'
import { useWatchlist } from '@/store/useWatchlist'
import { useSettings } from '@/store/useSettings'
import PriceChart from '@/components/PriceChart'
import WatchlistButton from '@/components/WatchlistButton'
import CurrencyToggle from '@/components/CurrencyToggle'
import Skeleton from '@/components/Skeleton'
import PageTransition from '@/components/PageTransition'
import { formatPrice, formatPercent, formatCompact, formatSupply, formatDate } from '@/utils/format'
import type { Timeframe } from '@/types/coin'

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-surface last:border-0">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="num text-sm text-ink">{value}</span>
    </div>
  )
}

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>()
  const currency = useSettings((s) => s.currency)
  const [timeframe, setTimeframe] = useState<Timeframe>('7d')

  const { data: coin, isLoading: coinLoading, isError } = useCoin(id)
  const { data: chartData = [], isLoading: chartLoading } = useMarketChart(id, timeframe)

  const isWatched = useWatchlist((s) => (id ? s.isWatched(id) : false))
  const toggle = useWatchlist((s) => s.toggle)

  if (isError || (!coinLoading && !coin)) {
    return (
      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-azure mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
          <div className="neu-card px-4 py-3 text-sm text-down">Couldn't find that coin.</div>
        </div>
      </PageTransition>
    )
  }

  const positive = (coin?.price_change_percentage_24h ?? 0) >= 0

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-azure">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        {coinLoading || !coin ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={coin.image} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold text-ink">{coin.name}</h1>
                    <span className="text-xs text-ink-faint uppercase">{coin.symbol}</span>
                  </div>
                  <p className="text-[11px] text-ink-faint">Rank #{coin.market_cap_rank ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyToggle />
                <WatchlistButton active={isWatched} onToggle={() => id && toggle(id)} size="lg" />
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="num text-2xl sm:text-3xl font-semibold text-ink">
                {formatPrice(coin.current_price, currency)}
              </span>
              <span className={`num text-sm font-medium ${positive ? 'text-up' : 'text-down'}`}>
                {formatPercent(coin.price_change_percentage_24h)} (24h)
              </span>
            </div>

            <div className="neu-card p-4 sm:p-5">
              <PriceChart
                data={chartData}
                positive={positive}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                isLoading={chartLoading}
              />
            </div>

            <div className="neu-card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <div>
                <StatRow label="Market cap" value={formatCompact(coin.market_cap, currency)} />
                <StatRow label="24h volume" value={formatCompact(coin.total_volume, currency)} />
                <StatRow label="24h high" value={formatPrice(coin.high_24h, currency)} />
                <StatRow label="24h low" value={formatPrice(coin.low_24h, currency)} />
              </div>
              <div>
                <StatRow label="Circulating supply" value={formatSupply(coin.circulating_supply, coin.symbol)} />
                <StatRow label="All-time high" value={formatPrice(coin.ath, currency)} />
                <StatRow label="From ATH" value={formatPercent(coin.ath_change_percentage)} />
                <StatRow label="ATH reached" value={formatDate(coin.ath_date)} />
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}
