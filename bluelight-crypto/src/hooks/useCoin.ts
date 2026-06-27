import { useQuery } from '@tanstack/react-query'
import { fetchCoin } from '@/lib/api'
import { useSettings } from '@/store/useSettings'

export function useCoin(id: string | undefined) {
  const currency = useSettings((s) => s.currency)
  const refreshInterval = useSettings((s) => s.refreshInterval)

  return useQuery({
    queryKey: ['coin', id, currency],
    queryFn: () => fetchCoin(id as string, currency),
    enabled: Boolean(id),
    refetchInterval: refreshInterval,
  })
}
