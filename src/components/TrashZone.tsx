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
          'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-2 px-6 py-3',
          'rounded-xl border-2 border-dashed',
          'transition-all duration-200 ease-in-out',
          'select-none pointer-events-none',
          isActive
            ? 'border-red-400 bg-red-50 text-red-600 scale-105 shadow-lg'
            : 'border-gray-300 bg-white/80 text-gray-400',
        )}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        <span className="text-sm font-medium">
          {isActive ? 'Release to delete' : 'Drop here to delete'}
        </span>
      </div>
    )
  },
)
