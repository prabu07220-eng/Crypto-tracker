import { useMarkets } from '@/hooks/useMarkets'
import { useGlobalStats } from '@/hooks/useGlobalStats'
import { useSettings } from '@/store/useSettings'
import StatCard from '@/components/StatCard'
import CoinTable from '@/components/CoinTable'
import Skeleton from '@/components/Skeleton'
import PageTransition from '@/components/PageTransition'
import { formatCompact, formatPercent } from '@/utils/format'

export default function Dashboard() {
  const currency = useSettings((s) => s.currency)
  const { data: coins = [], isLoading: coinsLoading, isError } = useMarkets(60)
  const { data: global, isLoading: globalLoading } = useGlobalStats()

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink">Market overview</h1>
          <p className="text-sm text-ink-faint mt-0.5">Live prices across the top cryptocurrencies by market cap.</p>
        </div>

        {isError && (
          <div className="neu-card px-4 py-3 text-sm text-down">
            Could not reach the market data feed. It will retry automatically.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {globalLoading || !global ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[72px]" />)
          ) : (
            <>
              <StatCard
                label="Market cap"
                value={formatCompact(global.total_market_cap?.[currency], currency)}
                delta={formatPercent(global.market_cap_change_percentage_24h_usd)}
                deltaPositive={global.market_cap_change_percentage_24h_usd >= 0}
              />
              <StatCard label="24h volume" value={formatCompact(global.total_volume?.[currency], currency)} />
              <StatCard label="BTC dominance" value={`${global.market_cap_percentage?.btc?.toFixed(1)}%`} />
              <StatCard label="Active coins" value={global.active_cryptocurrencies?.toLocaleString('en-US')} />
            </>
          )}
        </div>

        <CoinTable coins={coins} isLoading={coinsLoading} />
      </div>
    </PageTransition>
  )
}
