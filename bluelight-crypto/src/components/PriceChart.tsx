import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useSettings } from '@/store/useSettings'
import { formatPrice } from '@/utils/format'
import Skeleton from './Skeleton'
import type { MarketChartPoint, Timeframe } from '@/types/coin'

const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: '1d', label: '1D' },
  { key: '7d', label: '7D' },
  { key: '1m', label: '1M' },
  { key: '1y', label: '1Y' },
]

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  const currency = useSettings((s) => s.currency)
  if (!active || !payload?.length) return null
  return (
    <div className="neu-flat px-2.5 py-1.5 text-xs num text-ink">{formatPrice(payload[0].value, currency)}</div>
  )
}

interface PriceChartProps {
  data: MarketChartPoint[]
  positive: boolean
  timeframe: Timeframe
  onTimeframeChange: (t: Timeframe) => void
  isLoading: boolean
}

export default function PriceChart({ data, positive, timeframe, onTimeframeChange, isLoading }: PriceChartProps) {
  const stroke = positive ? '#1FA67A' : '#E2614B'
  const chartData = data.map((p, i) => ({ i, price: p.price }))

  return (
    <div>
      <div className="flex items-center gap-1 neu-flat p-1 w-fit mb-3">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.key}
            onClick={() => onTimeframeChange(tf.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              timeframe === tf.key ? 'bg-azure text-white' : 'text-ink-dim hover:text-ink'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="h-64">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="i" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="price" stroke={stroke} strokeWidth={2} fill="url(#price-fill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
