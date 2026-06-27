import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/types/coin'

interface SettingsState {
  theme: 'light' | 'dark'
  currency: Currency
  refreshInterval: number
  toggleTheme: () => void
  setCurrency: (currency: Currency) => void
  setRefreshInterval: (ms: number) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      currency: 'usd',
      refreshInterval: 45000,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setCurrency: (currency) => set({ currency }),
      setRefreshInterval: (ms) => set({ refreshInterval: ms }),
    }),
    { name: 'bluelight:settings' }
  )
)
