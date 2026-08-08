import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine, RiMore2Line } from "@remixicon/react"
import type { FC, KeyboardEvent, MouseEvent as ReactMouseEvent, PropsWithChildren, ReactNode } from "react"
import { useState } from "react"

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

/** An outline-style button pinned to the left edge of an `EntityCard`, spanning its full height. */
export interface EntityCardLeftAction {
  icon: ReactNode
  onClick: () => void
}

export interface EntityCardProps extends PropsWithChildren {
  entity: EntityData
  /** When provided, the whole card becomes tappable/keyboard-activatable and invokes this (e.g. navigate to the entity's details page). */
  onOpen?: () => void
  /** When provided, adds an "Edit" action to the actions menu (opened via the menu button). */
  onEdit?: () => void
  /** When provided, adds a "Remove" action to the actions menu (opened via the menu button). */
  onRemove?: () => void
  /** Outline-style button pinned to the left edge of the card, spanning its full height. */
  leftAction?: EntityCardLeftAction
}

/**
 * The card's outer frame — the one piece every EntityCard-based card renders unconditionally.
 * Auto-renders every field common to `EntityData` — name, rating, effects, source — the same
 * way `ItemDataCardRoot` auto-renders every field common to `ItemData`, so category tiers only
 * need to supply their own type-specific content as `children`. Finds its `Layout.*` regions
 * among `children` via `SlotManager` (same mechanism as `DataCard`) and renders whichever are
 * present in the fixed HeaderRow/BodyRow/FooterRow order, regardless of the order they were
 * passed in; any other child is ignored. `onEdit`/`onRemove` surface as items in a menu opened
 * by a dedicated menu button on the card's right edge (rather than a context menu or long-press
 * gesture), and `leftAction` renders a matching outline-style button on the left edge — both
 * buttons span the card's full height.
 */
const EntityCardRoot: FC<EntityCardProps> = ({
  entity,
  onOpen,
  onEdit,
  onRemove,
  leftAction,
  children,
}) => {
  const slots = new EntityCardSlotManager(children)
  const hasActions = !!(onEdit || onRemove)

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => setMenuAnchorEl(null)

  const handleLeftActionClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    leftAction?.onClick()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onOpen) return
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    onOpen()
  }

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        {leftAction && (
          <Button
            variant="outlined"
            aria-label="Action"
            onClick={handleLeftActionClick}
            sx={{ minWidth: 0, borderRadius: 0, paddingX: 1 }}
          >
            {leftAction.icon}
          </Button>
        )}

        <Box
          role={onOpen ? "button" : undefined}
          tabIndex={onOpen ? 0 : undefined}
          onClick={onOpen}
          onKeyDown={handleKeyDown}
          sx={{
            border: "1px solid",
            borderColor: "primary.dark",
            flexGrow: 1,
            minWidth: 0,
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
          <Button
            variant="outlined"
            aria-label="Actions menu"
            onClick={handleOpenMenu}
            sx={{ minWidth: 0, borderRadius: 0, paddingX: 1 }}
          >
            <RiMore2Line size={20} />
          </Button>
        )}
      </Stack>

      {hasActions && (
        <Menu
          open={menuAnchorEl !== null}
          anchorEl={menuAnchorEl}
          onClose={handleCloseMenu}
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
