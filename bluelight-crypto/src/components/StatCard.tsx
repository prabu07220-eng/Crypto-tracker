interface StatCardProps {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
}

export default function StatCard({ label, value, delta, deltaPositive }: StatCardProps) {
  return (
    <div className="neu-card px-4 sm:px-5 py-4">
      <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-1.5">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="num text-lg sm:text-xl font-semibold text-ink">{value}</p>
        {delta && (
          <span className={`num text-xs font-medium ${deltaPositive ? 'text-up' : 'text-down'}`}>{delta}</span>
        )}
      </div>
    </div>
  )
}
