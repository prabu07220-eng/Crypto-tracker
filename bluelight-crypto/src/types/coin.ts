export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  sparkline_in_7d?: { price: number[] }
}

export interface GlobalStats {
  active_cryptocurrencies: number
  total_market_cap: Record<string, number>
  total_volume: Record<string, number>
  market_cap_percentage: Record<string, number>
  market_cap_change_percentage_24h_usd: number
}

export interface MarketChartPoint {
  timestamp: number
  price: number
}

export type Currency = 'usd' | 'inr'

export type Timeframe = '1d' | '7d' | '1m' | '1y'

export interface Holding {
  id: string
  coinId: string
  symbol: string
  name: string
  image: string
  quantity: number
  buyPrice: number
}
