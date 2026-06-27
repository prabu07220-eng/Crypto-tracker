import { useMemo, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useMarkets } from '@/hooks/useMarkets'
import { usePortfolio } from '@/store/usePortfolio'
import { useSettings } from '@/store/useSettings'
import PageTransition from '@/components/PageTransition'
import Skeleton from '@/components/Skeleton'
import { formatPrice, formatCompact, formatPercent } from '@/utils/format'

const PIE_COLORS = ['#2F6FED', '#5C8EF5', '#1FA67A', '#E2614B', '#94A8C6', '#13294B', '#1E50B8', '#7BA8F9']

export default function Portfolio() {
  const currency = useSettings((s) => s.currency)
  const { data: coins = [], isLoading } = useMarkets(100)
  const { holdings, addHolding, removeHolding } = usePortfolio()

  const [coinId, setCoinId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [buyPrice, setBuyPrice] = useState('')

  const coinsById = useMemo(() => new Map(coins.map((c) => [c.id, c])), [coins])

  const rows = useMemo(
    () =>
      holdings.map((h) => {
        const live = coinsById.get(h.coinId)
        const currentPrice = live?.current_price ?? 0
        const value = currentPrice * h.quantity
        const cost = h.buyPrice * h.quantity
        const pnl = value - cost
        const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0
        return { ...h, currentPrice, value, cost, pnl, pnlPercent }
      }),
    [holdings, coinsById]
  )

  const totalValue = rows.reduce((sum, r) => sum + r.value, 0)
  const totalCost = rows.reduce((sum, r) => sum + r.cost, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  const pieData = rows
    .filter((r) => r.value > 0)
    .map((r) => ({ name: r.symbol.toUpperCase(), value: r.value }))

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const coin = coinsById.get(coinId)
    const qty = parseFloat(quantity)
    const price = parseFloat(buyPrice)
    if (!coin || !qty || !price || qty <= 0 || price <= 0) return

    addHolding({ coinId: coin.id, symbol: coin.symbol, name: coin.name, image: coin.image, quantity: qty, buyPrice: price })
    setCoinId('')
    setQuantity('')
    setBuyPrice('')
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink">Portfolio</h1>
          <p className="text-sm text-ink-faint mt-0.5">
            A simulated portfolio — holdings are stored locally in your browser, not a real account.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="neu-card p-4 sm:p-5 sm:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-1.5">Current value</p>
              <p className="num text-xl font-semibold text-ink">{formatPrice(totalValue, currency)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-1.5">Total P&amp;L</p>
              <p className={`num text-xl font-semibold ${totalPnl >= 0 ? 'text-up' : 'text-down'}`}>
                {formatPrice(totalPnl, currency)}{' '}
                <span className="text-sm">({formatPercent(totalPnlPercent)})</span>
              </p>
            </div>
          </div>

          <div className="neu-card p-4 sm:p-5 h-40">
            {pieData.length === 0 ? (
              <p className="text-xs text-ink-faint flex items-center justify-center h-full">No holdings yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={32} outerRadius={56} paddingAngle={2}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatPrice(v, currency)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <form onSubmit={handleAdd} className="neu-card p-4 sm:p-5 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px] uppercase tracking-wide text-ink-faint mb-1 block">Coin</label>
            <select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              className="w-full neu-inset rounded-lg px-3 py-2 text-sm text-ink outline-none"
            >
              <option value="">Select a coin</option>
              {coins.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="text-[11px] uppercase tracking-wide text-ink-faint mb-1 block">Quantity</label>
            <input
              type="number"
              step="any"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full neu-inset rounded-lg px-3 py-2 text-sm text-ink outline-none num"
              placeholder="0.00"
            />
          </div>
          <div className="w-32">
            <label className="text-[11px] uppercase tracking-wide text-ink-faint mb-1 block">Buy price</label>
            <input
              type="number"
              step="any"
              min="0"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full neu-inset rounded-lg px-3 py-2 text-sm text-ink outline-none num"
              placeholder="0.00"
            />
          </div>
          <button type="submit" className="neu-btn px-4 py-2 text-sm font-medium text-azure flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add holding
          </button>
        </form>

        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : rows.length > 0 ? (
          <div className="neu-card overflow-hidden">
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_36px] gap-3 px-4 sm:px-6 py-2.5 border-b border-surface text-[11px] uppercase tracking-wide text-ink-faint">
              <span>Coin</span>
              <span>Quantity</span>
              <span>Buy price</span>
              <span>Value</span>
              <span>P&amp;L</span>
              <span />
            </div>
            {rows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_36px] gap-3 items-center px-4 sm:px-6 py-3 border-b border-surface last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0 col-span-2 sm:col-span-1">
                  <img src={r.image} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-ink truncate">{r.name}</span>
                </div>
                <span className="num text-sm text-ink-dim">{r.quantity}</span>
                <span className="num text-sm text-ink-dim">{formatPrice(r.buyPrice, currency)}</span>
                <span className="num text-sm text-ink">{formatCompact(r.value, currency)}</span>
                <span className={`num text-sm font-medium ${r.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                  {formatPercent(r.pnlPercent)}
                </span>
                <button onClick={() => removeHolding(r.id)} aria-label="Remove holding" className="text-ink-faint hover:text-down justify-self-end">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="neu-card py-12 text-center text-sm text-ink-faint">
            No holdings yet — add one above to start tracking simulated P&amp;L.
          </div>
        )}
      </div>
    </PageTransition>
  )
}
