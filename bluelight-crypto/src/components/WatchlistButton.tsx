import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface WatchlistButtonProps {
  active: boolean
  onToggle: () => void
  size?: 'sm' | 'lg'
}

export default function WatchlistButton({ active, onToggle, size = 'sm' }: WatchlistButtonProps) {
  const dims = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
      className="p-1.5 rounded-lg hover:bg-surface transition-colors"
    >
      <Star className={`${dims} transition-colors ${active ? 'fill-azure text-azure' : 'fill-none text-ink-faint'}`} />
    </motion.button>
  )
}
