import { useQuery } from '@tanstack/react-query'
import { fetchMarketChart } from '@/lib/api'
import { useSettings } from '@/store/useSettings'
import type { Timeframe } from '@/types/coin'

export function useMarketChart(id: string | undefined, timeframe: Timeframe) {
  const currency = useSettings((s) => s.currency)

  return useQuery({
    queryKey: ['marketChart', id, currency, timeframe],
    queryFn: () => fetchMarketChart(id as string, currency, timeframe),
    enabled: Boolean(id),
    staleTime: 60_000,
  })
}
