import { useQuery } from '@tanstack/react-query'
import { fetchGlobal } from '@/lib/api'
import { useSettings } from '@/store/useSettings'

export function useGlobalStats() {
  const refreshInterval = useSettings((s) => s.refreshInterval)

  return useQuery({
    queryKey: ['global'],
    queryFn: fetchGlobal,
    refetchInterval: refreshInterval,
  })
}
