import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
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
import type { ItemData } from "#/system/itemData.ts"
import { isEquipped, isStashed } from "#/system/items/itemUtils.ts"

import { ItemCardSource } from "./itemCard.Source.tsx"
import { ItemCardSlot } from "./itemCardSlot.tsx"

export interface BasicItemCardProps {
  item: ItemData
  type?: ReactNode
  /** When provided, the whole card becomes tappable/keyboard-activatable and doubles as the "Edit" quick action. */
  onOpen?: () => void
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
 * Generic ItemCard body: renders the fields common to every `ItemData`
 * (name, source, equipped/stashed/wireless-off status, an Edit/Remove quick
 * action pair) plus whichever `ItemCardSlot.*` children are passed in for
 * item-type-specific content. Typed cards (e.g. `WeaponItemCard`) wrap this;
 * the `ItemCard` dispatcher falls back to this directly for item types
 * without a typed card.
 */
export const BasicItemCard: FC<BasicItemCardProps> = ({
  item,
  type,
  onOpen,
  onRemove,
  children,
}) => {
  const childArray = Children.toArray(children)

  const statNodes = childArray.filter(isElementType(ItemCardSlot.Stat))
  const subitemNodes = childArray.filter(isElementType(ItemCardSlot.Subitem))
  const damageTrackNode = childArray.find(isElementType(ItemCardSlot.DamageTrack))
  const footerNode = childArray.find(isElementType(ItemCardSlot.Footer))
  const customQuickActionNodes = childArray.filter(isElementType(ItemCardSlot.QuickAction))

  const hasSource = Boolean(item.source)
  const hasBody = statNodes.length > 0 || Boolean(damageTrackNode) || subitemNodes.length > 0
  const hasFooterBand = hasSource || Boolean(footerNode)
  const hasQuickActions = customQuickActionNodes.length > 0 || Boolean(onOpen) || Boolean(onRemove)

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
            {type && (
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                {type}
              </Typography>
            )}
            <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
          </Stack>

          <ItemCardSlot.StatusIcons
            equipped={isEquipped(item)}
            stashed={isStashed(item)}
            wirelessOff={item.wireless?.enabled === false}
          />
        </Stack>

        {hasBody && (
          <Stack sx={{ p: 1, gap: 1 }}>
            {statNodes.length > 0 && (
              <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
                {statNodes}
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
              gap: 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {hasSource && <ItemCardSource source={item.source} />}
            </Box>
            {footerNode}
          </Stack>
        )}
      </Box>

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

          {onOpen && (
            <ItemCardSlot.QuickAction
              label="Edit"
              icon={<RiEditLine size={16} />}
              onClick={() => {
                onOpen()
                handleCloseMenu()
              }}
            />
          )}

          {onRemove && (
            <ItemCardSlot.QuickAction
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
