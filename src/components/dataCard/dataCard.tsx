import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type {
  FC,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
} from "react"
import { Children, cloneElement, useRef, useState } from "react"

import { isElementType } from "#/lib/slotUtils.ts"

import { DataCardSlot } from "./dataCardSlot.tsx"

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
  const childArray = Children.toArray(children)

  const titleNode = childArray.find(isElementType(DataCardSlot.Title))
  const typeNode = childArray.find(isElementType(DataCardSlot.Type))
  const sourceNode = childArray.find(isElementType(DataCardSlot.Source))
  const availabilityNode = childArray.find(isElementType(DataCardSlot.Availability))
  const quantityNode = childArray.find(isElementType(DataCardSlot.Quantity))
  const costNode = childArray.find(isElementType(DataCardSlot.Cost))
  const ratingNode = childArray.find(isElementType(DataCardSlot.Rating))
  const statusIconNodes = childArray.filter(isElementType(DataCardSlot.StatusIcon))
  const statNodes = childArray.filter(isElementType(DataCardSlot.Stat))
  const subitemNodes = childArray.filter(isElementType(DataCardSlot.Subitem))
  const damageTrackNode = childArray.find(isElementType(DataCardSlot.DamageTrack))
  const footerNode = childArray.find(isElementType(DataCardSlot.Footer))
  const contentNode = childArray.find(isElementType(DataCardSlot.Content))
  const customQuickActionNodes = childArray.filter(isElementType(DataCardSlot.QuickAction))

  const hasStatRow = statNodes.length > 0 || Boolean(ratingNode) || Boolean(quantityNode)
  const hasBody = hasStatRow || Boolean(damageTrackNode) || subitemNodes.length > 0
  const hasFooterBand = Boolean(sourceNode) || Boolean(availabilityNode) || Boolean(costNode) || Boolean(footerNode)
  const hasQuickActions = customQuickActionNodes.length > 0 || Boolean(onEdit) || Boolean(onRemove)

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
            {typeNode}
            {titleNode}
          </Stack>

          {statusIconNodes.length > 0 && (
            <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0, alignItems: "center" }}>
              {statusIconNodes}
            </Stack>
          )}
        </Stack>

        {hasBody && (
          <Stack sx={{ p: 1, gap: 1 }}>
            {hasStatRow && (
              <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
                {statNodes}
                {ratingNode}
                {quantityNode}
              </Stack>
            )}

            {damageTrackNode}

            {subitemNodes.length > 0 && (
              <Stack
                sx={{
                  gap: 0.25,
                  paddingLeft: 1,
                  borderLeft: "2px solid",
                  borderColor: "secondary.dark",
                }}
              >
                {subitemNodes}
              </Stack>
            )}
          </Stack>
        )}

        {hasFooterBand && (
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
              {sourceNode}
              {availabilityNode}
            </Stack>

            <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexShrink: 0 }}>
              {costNode}
              {footerNode}
            </Stack>
          </Stack>
        )}
      </Box>

      {contentNode && (
        <Box sx={{ borderLeft: "4px solid", borderColor: "secondary.dark" }}>
          {contentNode}
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
          {customQuickActionNodes.map((node) => cloneElement(node, {
            onClick: () => {
              node.props.onClick()
              handleCloseMenu()
            },
          }))}

          {customQuickActionNodes.length > 0 && (onOpen || onRemove) && <Divider />}

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
