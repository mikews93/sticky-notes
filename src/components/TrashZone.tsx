import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TrashZoneProps {
  isActive: boolean
}

export const TrashZone = forwardRef<HTMLDivElement, TrashZoneProps>(
  function TrashZone({ isActive }, ref) {
    return (
      <div
        ref={ref}
        data-testid="trash-zone"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'flex items-center justify-center gap-3 py-5',
          'transition-[transform,opacity,background-color,border-color,box-shadow] duration-300 ease-out',
          'select-none pointer-events-none',
          isActive
            ? 'translate-y-0 animate-pulse-glow bg-red-900/70 text-red-200 border-t-2 border-red-500/50 shadow-[0_-4px_20px_rgba(220,38,38,0.2)]'
            : 'translate-y-full',
        )}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('transition-transform duration-300', isActive && 'scale-110')}
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        <span className="text-xs font-bold tracking-widest uppercase">
          {isActive ? 'Release to Delete' : 'Drop here to trash'}
        </span>
      </div>
    )
  },
)
