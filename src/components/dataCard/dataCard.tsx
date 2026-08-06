import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { FC, KeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode, TouchEvent as ReactTouchEvent } from "react"
import { cloneElement, useRef, useState } from "react"

import { DataCardSlot, DataCardSlotManager } from "./dataCardSlot.tsx"

export interface BasicDataCardProps {
  /** When provided, the whole card becomes tappable/keyboard-activatable and navigates to the item's details page. */
  onOpen?: () => void
  /** When provided, adds an "Edit" quick action (long-press/right-click menu) that opens the item's edit dialog. */
  onEdit?: () => void
  /** When provided, adds a "Remove" quick action. */
  onRemove?: () => void
  children?: ReactNode
}

/** Tinted top/bottom bands that bracket the stat/sub-item body. */
const bandSx = {
  paddingX: 1,
  paddingY: 0.75,
  bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
}

const LONG_PRESS_MS = 500
const LONG_PRESS_MOVE_TOLERANCE_PX = 10

interface MenuPosition {
  mouseX: number
  mouseY: number
}

/**
 * Fully generic card body, with no knowledge of any particular domain shape.
 * Every piece of content — title, type, source, stats, status icons, etc. —
 * arrives as a `DataCard.*` slot child; typed wrappers (`ItemDataCardRoot`
 * for `ItemData`, or a domain's own `*DataCard` directly, e.g.
 * `SpiritDataCard`) decide which slots to populate from their own data.
 */
const DataCardComponent: FC<BasicDataCardProps> = ({
  onOpen,
  onEdit,
  onRemove,
  children,
}) => {
  const slots = new DataCardSlotManager(children)
  const hasQuickActions = !!(slots.quickActions.length > 0 || onEdit || onRemove)

  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const touchStartRef = useRef<{ x: number, y: number } | null>(null)
  const suppressNextClickRef = useRef(false)

  const handleCloseMenu = () => setMenuPosition(null)

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current === undefined) return
    clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = undefined
  }

  const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!hasQuickActions) return
    event.preventDefault()
    setMenuPosition({ mouseX: event.clientX + 2, mouseY: event.clientY - 6 })
  }

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!hasQuickActions) return
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    clearLongPressTimer()
    longPressTimerRef.current = setTimeout(() => {
      suppressNextClickRef.current = true
      setMenuPosition({ mouseX: touch.clientX, mouseY: touch.clientY })
    }, LONG_PRESS_MS)
  }

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return
    const touch = event.touches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    if (Math.hypot(dx, dy) > LONG_PRESS_MOVE_TOLERANCE_PX) clearLongPressTimer()
  }

  const handleTouchEnd = () => {
    clearLongPressTimer()
    touchStartRef.current = null
  }

  const handleClick = () => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }
    onOpen?.()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onOpen) return
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    onOpen()
  }

  return (
    <>
      <Box
        role={onOpen ? "button" : undefined}
        tabIndex={onOpen ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        sx={{
          border: "1px solid",
          borderColor: "primary.dark",
          width: "100%",
          textAlign: "left",
          ...(onOpen && {
            "cursor": "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }),
        }}
      >
        <Stack
          direction="row"
          sx={{ ...bandSx, alignItems: "flex-start", justifyContent: "space-between", gap: 0.5 }}
        >
          <Stack sx={{ gap: 0, minWidth: 0 }}>
            {slots.type}
            {slots.title}
          </Stack>

          {slots.statusIcons.length > 0 && (
            <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0, alignItems: "center" }}>
              {slots.statusIcons}
            </Stack>
          )}
        </Stack>

        {slots.hasBody && (
          <Stack sx={{ p: 1, gap: 1 }}>
            {slots.hasStatRow && (
              <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
                {slots.stats}
                {slots.rating}
                {slots.quantity}
              </Stack>
            )}

            {slots.damageTrack}

            {slots.subitems.length > 0 && (
              <Stack
                sx={{
                  gap: 0.25,
                  paddingLeft: 1,
                  borderLeft: "2px solid",
                  borderColor: "secondary.dark",
                }}
              >
                {slots.subitems}
              </Stack>
            )}
          </Stack>
        )}

        {slots.hasFooterBand && (
          <Stack
            direction="row"
            sx={{
              ...bandSx,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" sx={{ gap: 1, alignItems: "center", minWidth: 0 }}>
              {slots.source}
              {slots.availability}
            </Stack>

            <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexShrink: 0 }}>
              {slots.cost}
              {slots.footer}
            </Stack>
          </Stack>
        )}
      </Box>

      {slots.content && (
        <Box sx={{ borderLeft: "4px solid", borderColor: "secondary.dark" }}>
          {slots.content}
        </Box>
      )}

      {hasQuickActions && (
        <Menu
          open={menuPosition !== null}
          onClose={handleCloseMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined
          }
          slotProps={{ paper: { onClick: (event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation() } }}
        >
          {slots.quickActions.map((node) => cloneElement(node, {
            onClick: () => {
              node.props.onClick()
              handleCloseMenu()
            },
          }))}

          {slots.quickActions.length > 0 && (onOpen || onRemove) && <Divider />}

          {onEdit && (
            <DataCardSlot.QuickAction
              label="Edit"
              icon={<RiEditLine size={16} />}
              onClick={() => {
                onEdit()
                handleCloseMenu()
              }}
            />
          )}

          {onRemove && (
            <DataCardSlot.QuickAction
              label="Remove"
              icon={<RiDeleteBinLine size={16} />}
              onClick={() => {
                onRemove()
                handleCloseMenu()
              }}
            />
          )}
        </Menu>
      )}
    </>
  )
}

/** `DataCard.Title`, `DataCard.Stat`, etc. — see `dataCardSlot.tsx` for the slot components themselves. */
export const DataCard = Object.assign(DataCardComponent, DataCardSlot)
