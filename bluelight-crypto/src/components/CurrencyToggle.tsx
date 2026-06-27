import { useSettings } from '@/store/useSettings'

interface CurrencyToggleProps {
  variant?: 'light' | 'dark'
  className?: string
}

export default function CurrencyToggle({ variant = 'light', className = '' }: CurrencyToggleProps) {
  const currency = useSettings((s) => s.currency)
  const setCurrency = useSettings((s) => s.setCurrency)

  const wrapperClass = variant === 'dark' ? 'bg-white/10' : 'neu-inset'
  const inactiveClass = variant === 'dark' ? 'text-white/60 hover:text-white' : 'text-ink-dim hover:text-ink'

  return (
    <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${wrapperClass} ${className}`}>
      {(['usd', 'inr'] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            currency === c ? 'bg-azure text-white' : inactiveClass
          }`}
        >
          {c.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
