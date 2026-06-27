import type { Currency } from '@/types/coin'

const CURRENCY_CODE: Record<Currency, string> = { usd: 'USD', inr: 'INR' }
const CURRENCY_SYMBOL: Record<Currency, string> = { usd: '$', inr: '₹' }

export function formatPrice(value: number | null | undefined, currency: Currency = 'usd'): string {
  if (value == null) return '—'
  const decimals = value >= 1 ? 2 : value >= 0.01 ? 4 : 6
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: CURRENCY_CODE[currency],
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCompact(value: number | null | undefined, currency: Currency = 'usd'): string {
  if (value == null) return '—'
  const symbol = CURRENCY_SYMBOL[currency]
  const units = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ]
  for (const unit of units) {
    if (Math.abs(value) >= unit.value) {
      return `${symbol}${(value / unit.value).toFixed(2)}${unit.suffix}`
    }
  }
  return `${symbol}${value.toFixed(2)}`
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatSupply(value: number | null | undefined, symbol = ''): string {
  if (value == null) return '—'
  const units = [
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ]
  for (const unit of units) {
    if (Math.abs(value) >= unit.value) {
      return `${(value / unit.value).toFixed(2)}${unit.suffix} ${symbol.toUpperCase()}`
    }
  }
  return `${value.toFixed(2)} ${symbol.toUpperCase()}`
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
