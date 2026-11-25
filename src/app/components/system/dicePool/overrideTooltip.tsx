import ClickAwayListener from "@mui/material/ClickAwayListener"
import Tooltip from "@mui/material/Tooltip"
import type { FC, KeyboardEvent, MouseEvent, ReactElement } from "react"
import { cloneElement, useState } from "react"

import type { OverrideReason } from "#/system/formulas/gameEffects/effectTagStacking.ts"

import { describeOverride } from "./overriddenNote.tsx"

interface OverrideTooltipProps {
  /** Why the row is overridden; without one, `children` renders with no tooltip. */
  reason: OverrideReason | undefined
  /**
   * The struck-through row: a single element that accepts a ref (as MUI components do). It's made
   * focusable and tappable to show the tooltip.
   */
  children: ReactElement<Record<string, unknown>>
}

/**
 * Explains why a struck-through dice group or Modifier doesn't count. Shows while hovered or
 * focused, and stays shown after a tap or click — so it works on touch screens — until a tap
 * elsewhere. The tap doesn't reach the dice pool around it, which would otherwise collapse.
 */
export const OverrideTooltip: FC<OverrideTooltipProps> = ({ reason, children }) => {
  const [isHovered, setIsHovered] = useState(false)
  // Kept apart from hover: on a touch screen the tap is followed by hover and focus changes that
  // would otherwise close the tooltip straight away.
  const [isPinned, setIsPinned] = useState(false)

  if (!reason) return children

  const pin = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation()
    setIsPinned(true)
  }

  return (
    <ClickAwayListener onClickAway={() => setIsPinned(false)}>
      <Tooltip
        title={describeOverride(reason)}
        open={isHovered || isPinned}
        onOpen={() => setIsHovered(true)}
        onClose={() => setIsHovered(false)}
        disableTouchListener
        describeChild
        arrow
      >
        {cloneElement(children, {
          role: "button",
          tabIndex: 0,
          onClick: pin,
          onKeyDown: (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsPinned(false)
            if (event.key !== "Enter" && event.key !== " ") return
            event.preventDefault()
            pin(event)
          },
        })}
      </Tooltip>
    </ClickAwayListener>
  )
}
