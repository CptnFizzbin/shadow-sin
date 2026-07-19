import Box from "@mui/material/Box"
import type { FC, ReactNode, TouchEvent as ReactTouchEvent } from "react"
import { useCallback, useRef } from "react"

import { isAnyOverlayOpen } from "./dialog/openOverlayTracker.ts"

const SWIPE_MIN_DISTANCE = 50

interface SwipeSurfaceProps {
  onSwipeRightToLeft?: () => void
  onSwipeLeftToRight?: () => void
  children: ReactNode
}

export const SwipeSurface: FC<SwipeSurfaceProps> = ({ onSwipeRightToLeft, onSwipeLeftToRight, children }) => {
  const touchStartRef = useRef<{ x: number, y: number } | null>(null)

  const handleTouchStart = useCallback((event: ReactTouchEvent) => {
    if (isAnyOverlayOpen()) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }, [])

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent) => {
      if (!touchStartRef.current) return

      if (isAnyOverlayOpen()) {
        touchStartRef.current = null
        return
      }

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
        onSwipeRightToLeft?.()
      } else {
        onSwipeLeftToRight?.()
      }
    },
    [onSwipeRightToLeft, onSwipeLeftToRight],
  )

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      sx={{ flexGrow: 1 }}
    >
      {children}
    </Box>
  )
}
