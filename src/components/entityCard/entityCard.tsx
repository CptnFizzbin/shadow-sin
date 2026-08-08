import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { FC, KeyboardEvent, MouseEvent as ReactMouseEvent, PropsWithChildren, TouchEvent as ReactTouchEvent } from "react"
import { useRef, useState } from "react"

import type { EntityData } from "#/system/entityData.ts"

import { EntityCardElements } from "./entityCardElements.tsx"
import { EntityCardLayout } from "./entityCardLayout.tsx"
import { EntityCardSlotManager } from "./entityCardSlotManager.ts"

export type { CardElementActionProps } from "./elements/cardElementAction.tsx"
export type { CardElementEffectsProps } from "./elements/cardElementEffects.tsx"
export type { CardElementRatingProps } from "./elements/cardElementRating.tsx"
export type { CardElementSourceProps } from "./elements/cardElementSource.tsx"
export type { CardElementStatProps, CardElementStatType } from "./elements/cardElementStat.tsx"
export type { CardElementTitleProps } from "./elements/cardElementTitle.tsx"
export type { BodyRowProps } from "./layout/cardLayoutBodyRow.tsx"
export type { FooterRowProps } from "./layout/cardLayoutFooterRow.tsx"
export type { HeaderRowProps } from "./layout/cardLayoutHeaderRow.tsx"

export interface EntityCardProps extends PropsWithChildren {
  entity: EntityData
  /** When provided, the whole card becomes tappable/keyboard-activatable and invokes this (e.g. navigate to the entity's details page). */
  onOpen?: () => void
  /** When provided, adds an "Edit" action (long-press/right-click menu). */
  onEdit?: () => void
  /** When provided, adds a "Remove" action (long-press/right-click menu). */
  onRemove?: () => void
}

const LONG_PRESS_MS = 500
const LONG_PRESS_MOVE_TOLERANCE_PX = 10

interface MenuPosition {
  mouseX: number
  mouseY: number
}

/**
 * The card's outer frame — the one piece every EntityCard-based card renders unconditionally.
 * Auto-renders every field common to `EntityData` — name, rating, effects, source — the same
 * way `ItemDataCardRoot` auto-renders every field common to `ItemData`, so category tiers only
 * need to supply their own type-specific content as `children`. Finds its `Layout.*` regions
 * among `children` via `SlotManager` (same mechanism as `DataCard`) and renders whichever are
 * present in the fixed HeaderRow/BodyRow/FooterRow order, regardless of the order they were
 * passed in; any other child is ignored. Interaction affordances mirror `DataCard`'s exactly
 * (same tap/long-press/right-click behavior) so a typed card migrating off `DataCard` doesn't
 * change behavior for its callers.
 */
const EntityCardRoot: FC<EntityCardProps> = ({
  entity,
  onOpen,
  onEdit,
  onRemove,
  children,
}) => {
  const slots = new EntityCardSlotManager(children)
  const hasActions = !!(onEdit || onRemove)

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
    if (!hasActions) return
    event.preventDefault()
    setMenuPosition({ mouseX: event.clientX + 2, mouseY: event.clientY - 6 })
  }

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!hasActions) return
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
          sx={{
            paddingX: 1,
            paddingY: 0.75,
            borderBottom: "1px solid",
            borderColor: "divider",
            gap: 0.5,
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <EntityCardLayout.HeaderRow sx={{ justifyContent: "space-between" }}>
            <EntityCardElements.Title title={entity.name} />
          </EntityCardLayout.HeaderRow>

          {slots.headerRows}
        </Stack>

        <Stack sx={{ padding: 1, gap: 0.5 }}>
          <EntityCardLayout.BodyRow sx={{ flexWrap: "wrap" }}>
            <EntityCardElements.Rating value={entity.rating} />
          </EntityCardLayout.BodyRow>

          <EntityCardElements.Effects effects={entity.effects} />

          {slots.bodyRows}
        </Stack>

        <Stack
          sx={{
            paddingX: 1,
            paddingY: 0.75,
            gap: 0.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <EntityCardLayout.FooterRow sx={{ justifyContent: "space-between" }}>
            <EntityCardElements.Source source={entity.source} />
          </EntityCardLayout.FooterRow>

          {slots.footerRows}
        </Stack>
      </Box>

      {hasActions && (
        <Menu
          open={menuPosition !== null}
          onClose={handleCloseMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined
          }
          slotProps={{ paper: { onClick: (event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation() } }}
        >
          {onEdit && (
            <MenuItem
              onClick={() => {
                onEdit()
                handleCloseMenu()
              }}
            >
              <ListItemIcon><RiEditLine size={16} /></ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          )}

          {onEdit && onRemove && <Divider />}

          {onRemove && (
            <MenuItem
              onClick={() => {
                onRemove()
                handleCloseMenu()
              }}
            >
              <ListItemIcon><RiDeleteBinLine size={16} /></ListItemIcon>
              <ListItemText>Remove</ListItemText>
            </MenuItem>
          )}
        </Menu>
      )}
    </>
  )
}

EntityCardRoot.displayName = "EntityCard"

/**
 * Top compound-component tier from ADR-0010, replacing `DataCard`. Mirrors `DataCard =
 * Object.assign(DataCardComponent, DataCardSlotProvider)`: `EntityCardRoot` is the renderable outer
 * frame, and category tiers (`ItemCard`, `SpiritCard`, `SpellCard`, `PowerCard`, ...) assemble
 * these elements plus their own via `Object.assign`, reusing rather than duplicating them.
 */
export const EntityCard = Object.assign(
  EntityCardRoot,
  EntityCardElements,
  { Layout: EntityCardLayout },
)
