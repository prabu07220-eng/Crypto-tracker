import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistState {
  ids: string[]
  toggle: (coinId: string) => void
  isWatched: (coinId: string) => boolean
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (coinId) =>
        set((s) => ({
          ids: s.ids.includes(coinId) ? s.ids.filter((id) => id !== coinId) : [...s.ids, coinId],
        })),
      isWatched: (coinId) => get().ids.includes(coinId),
    }),
    { name: 'bluelight:watchlist' }
  )
)
