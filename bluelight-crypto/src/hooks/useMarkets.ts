import { useQuery } from '@tanstack/react-query'
import { fetchMarkets } from '@/lib/api'
import { useSettings } from '@/store/useSettings'

export function useMarkets(perPage = 60) {
  const currency = useSettings((s) => s.currency)
  const refreshInterval = useSettings((s) => s.refreshInterval)

  return useQuery({
    queryKey: ['markets', currency, perPage],
    queryFn: () => fetchMarkets(currency, perPage),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
  })
}
