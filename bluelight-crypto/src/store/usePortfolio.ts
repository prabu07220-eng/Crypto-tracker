import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Holding } from '@/types/coin'

interface PortfolioState {
  holdings: Holding[]
  addHolding: (holding: Omit<Holding, 'id'>) => void
  removeHolding: (id: string) => void
}

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],
      addHolding: (holding) =>
        set((s) => ({
          holdings: [...s.holdings, { ...holding, id: crypto.randomUUID() }],
        })),
      removeHolding: (id) =>
        set((s) => ({ holdings: s.holdings.filter((h) => h.id !== id) })),
    }),
    { name: 'bluelight:portfolio' }
  )
)
