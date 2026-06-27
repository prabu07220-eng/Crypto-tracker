import axios from 'axios'
import type { Coin, GlobalStats, MarketChartPoint, Currency, Timeframe } from '@/types/coin'

const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
})

const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  '1d': 1,
  '7d': 7,
  '1m': 30,
  '1y': 365,
}

export async function fetchMarkets(currency: Currency, perPage = 60): Promise<Coin[]> {
  const { data } = await client.get<Coin[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage,
      page: 1,
      sparkline: true,
      price_change_percentage: '24h,7d',
    },
  })
  return data
}

export async function fetchCoin(id: string, currency: Currency): Promise<Coin | null> {
  const { data } = await client.get<Coin[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      ids: id,
      sparkline: true,
      price_change_percentage: '24h,7d',
    },
  })
  return data[0] ?? null
}

export async function fetchGlobal(): Promise<GlobalStats> {
  const { data } = await client.get('/global')
  return data.data
}

export async function fetchMarketChart(
  id: string,
  currency: Currency,
  timeframe: Timeframe
): Promise<MarketChartPoint[]> {
  const { data } = await client.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: currency, days: TIMEFRAME_DAYS[timeframe] },
  })
  const prices: [number, number][] = data.prices ?? []
  return prices.map(([timestamp, price]) => ({ timestamp, price }))
}
