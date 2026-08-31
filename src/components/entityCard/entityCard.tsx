import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine, RiMore2Line } from "@remixicon/react"
import type { FC, KeyboardEvent, MouseEvent as ReactMouseEvent, PropsWithChildren, ReactNode } from "react"
import { useState } from "react"

import type { EntityData } from "#/system/entityData.ts"

import { EntityCardElements } from "./entityCardElements.tsx"
import EntityCardLayout from "./entityCardLayout.tsx"
import { EntityCardSlotManager } from "./entityCardSlotManager.ts"

export type { CardElementActionProps } from "./elements/cardElementAction.tsx"
export type { CardElementEffectsProps } from "./elements/cardElementEffects.tsx"
export type { CardElementRatingProps } from "./elements/cardElementRating.tsx"
export type { CardElementSourceProps } from "./elements/cardElementSource.tsx"
export type { CardElementStatProps, CardElementStatType } from "./elements/cardElementStat.tsx"
export type { CardElementTitleProps } from "./elements/cardElementTitle.tsx"
export type { BodyRowProps } from "./layout/bodyRow.tsx"
export type { FooterLeftProps } from "./layout/footerLeft.tsx"
export type { FooterRightProps } from "./layout/footerRight.tsx"
export type { FooterRowProps } from "./layout/footerRow.tsx"
export type { HeaderRowProps } from "./layout/headerRow.tsx"
export type { TitleRightProps } from "./layout/titleRight.tsx"

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
  /**
   * Overrides `entity.rating` for display when a category's rating isn't a plain number (e.g. a
   * Real SIN/Licence shows "Real" instead of a number it no longer carries).
   */
  rating?: string | number
}

/**
 * The card's outer frame — the one piece every EntityCard-based card renders unconditionally.
 * Auto-renders every field common to `EntityData` — name, rating, effects, source — the same
 * way `ItemCard` auto-renders every field common to `ItemData`, so category tiers only
 * need to supply their own type-specific content as `children`. Recognizes `Layout.*` regions
 * among `children` and renders whichever are present in the fixed HeaderRow/BodyRow/FooterRow
 * order, regardless of the order they were passed in; any other child is ignored. `onEdit`/
 * `onRemove` surface as items in a menu opened by a dedicated menu button on the card's right
 * edge (rather than a context menu or long-press gesture), and `leftAction` renders a matching
 * outline-style button on the left edge — both buttons span the card's full height.
 */
const EntityCardRoot: FC<EntityCardProps> = ({
  entity,
  onOpen,
  onEdit,
  onRemove,
  leftAction,
  rating,
  children,
}) => {
  const slots = new EntityCardSlotManager(children)
  const hasActions = !!(onEdit || onRemove)
  const hasFooter = !!(
    slots.layout.footerRows.length >= 1
    || slots.layout.footerLeft.length >= 1
    || slots.layout.footerRight.length >= 1
    || entity.source
  )

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
      <Stack direction="row" sx={{ width: "100%", gap: 0 }}>
        {leftAction && (
          <Button
            variant="outlined"
            aria-label="Action"
            onClick={handleLeftActionClick}
            sx={{
              minWidth: 42,
              alignItems: "flex-start",
              borderRight: "none",
              padding: 1,
            }}
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
              gap: 0.5,
              bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <EntityCardLayout.HeaderRow sx={{ justifyContent: "space-between" }}>
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <EntityCardElements.Title title={entity.name} />

                {slots.layout.titleRight}
              </Stack>

              <Stack direction="row" sx={{ justifyItems: "flex-end", alignItems: "center" }}>
                {slots.layout.topRight}

                <EntityCardElements.Rating value={rating ?? entity.rating} />
              </Stack>
            </EntityCardLayout.HeaderRow>

            {slots.layout.headerRows}
          </Stack>

          {slots.layout.bodyRows.length >= 1 && (
            <Stack sx={{ padding: 1, gap: 0.5 }}>
              {slots.layout.bodyRows}
            </Stack>
          )}

          {hasFooter && (
            <Stack
              sx={{
                paddingX: 1,
                paddingY: 0.75,
                gap: 0.5,
                bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <EntityCardLayout.FooterRow sx={{ justifyContent: "space-between" }}>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <EntityCardElements.Source source={entity.source} />

                  {slots.layout.footerLeft}
                </Stack>

                <Stack direction="row" sx={{ alignItems: "center" }}>
                  {slots.layout.footerRight}
                </Stack>
              </EntityCardLayout.FooterRow>

              {slots.layout.footerRows}
            </Stack>
          )}
        </Box>

        {hasActions && (
          <Button
            variant="outlined"
            aria-label="Actions menu"
            onClick={handleOpenMenu}
            sx={{
              minWidth: 42,
              borderLeft: "none",
              padding: 1,
              alignItems: "flex-start",
            }}
          >
            <RiMore2Line size={20} />
          </Button>
        )}
      </Stack>

      {hasActions && (
        <Menu
          open={menuAnchorEl !== null}
          anchorEl={menuAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={handleCloseMenu}
          slotProps={{
            list: {
              sx: { padding: 0 },
            },
          }}
        >
          {slots.actions}

          {onEdit && (
            <EntityCard.Action
              icon={<RiEditLine size={16} />}
              label="Edit"
              onClick={() => {
                onEdit()
                handleCloseMenu()
              }}
            />
          )}

          {onRemove && (
            <EntityCard.Action
              icon={<RiDeleteBinLine size={16} />}
              label="Remove"
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

EntityCardRoot.displayName = "EntityCard"

/**
 * Top compound-component tier for entity cards (ADR-0010). `EntityCardRoot` is the renderable
 * outer frame, and category tiers (`ItemCard`, `SpiritCard`, `SpellCard`, `PowerCard`, ...)
 * assemble these elements plus their own via `Object.assign`, reusing rather than duplicating
 * them.
 */
export const EntityCard = Object.assign(
  EntityCardRoot,
  EntityCardElements,
  { Layout: EntityCardLayout },
)
