import type { FC, ReactNode, TouchEvent as ReactTouchEvent } from "react"
import { useCallback, useRef } from "react"

const SWIPE_MIN_DISTANCE = 50

interface SwipeSurfaceProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  children: ReactNode
}

export const SwipeSurface: FC<SwipeSurfaceProps> = ({ onSwipeLeft, onSwipeRight, children }) => {
  const touchStartRef = useRef<{ x: number, y: number } | null>(null)

  const handleTouchStart = useCallback((event: ReactTouchEvent) => {
    const touch = event.touches[0]
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }, [])

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent) => {
      if (!touchStartRef.current) return

      const touch = event.changedTouches[0]
      if (!touch) {
        touchStartRef.current = null
        return
      }

      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      touchStartRef.current = null

      if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return
      }

      if (deltaX < 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    },
    [onSwipeLeft, onSwipeRight],
  )

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  )
}
