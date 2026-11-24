import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiCheckboxBlankLine, RiCheckboxFill, RiDeleteBinLine, RiEditLine, RiMore2Line } from "@remixicon/react"
import type { FC, KeyboardEvent, MouseEvent as ReactMouseEvent, PropsWithChildren, ReactNode } from "react"
import { useState } from "react"

import type { EntityData } from "#/system/model/entities/entityData.ts"
import { isCredential } from "#/system/model/entities/entityTraits.ts"

import { EntityCardElements } from "./entityCardElements.tsx"
import EntityCardLayout from "./entityCardLayout.tsx"
import { EntityCardSlotManager } from "./entityCardSlotManager.ts"

export type { CardElementActionProps } from "#/components/ui/cards/entityCard/elements/cardElementAction.tsx"
export type { CardElementEffectsProps } from "#/components/ui/cards/entityCard/elements/cardElementEffects.tsx"
export type { CardElementRatingProps } from "#/components/ui/cards/entityCard/elements/cardElementRating.tsx"
export type { CardElementSourceProps } from "#/components/ui/cards/entityCard/elements/cardElementSource.tsx"
export type {
  CardElementStatProps,
  CardElementStatType,
} from "#/components/ui/cards/entityCard/elements/cardElementStat.tsx"
export type { CardElementTitleProps } from "#/components/ui/cards/entityCard/elements/cardElementTitle.tsx"
export type { BodyRowProps } from "#/components/ui/cards/entityCard/layout/bodyRow.tsx"
export type { FooterLeftProps } from "#/components/ui/cards/entityCard/layout/footerLeft.tsx"
export type { FooterRightProps } from "#/components/ui/cards/entityCard/layout/footerRight.tsx"
export type { FooterRowProps } from "#/components/ui/cards/entityCard/layout/footerRow.tsx"
export type { HeaderRowProps } from "#/components/ui/cards/entityCard/layout/headerRow.tsx"
export type { TitleRightProps } from "#/components/ui/cards/entityCard/layout/titleRight.tsx"

/** An outline-style button pinned to the left edge of an `EntityCard`, spanning its full height. */
export interface EntityCardLeftAction {
  /** Accessible name of the button; defaults to "Action". */
  label?: string
  icon: ReactNode
  onClick: () => void
}

/** Puts an `EntityCard` in selection mode, as one of several picked for a bulk action. */
export interface EntityCardSelection {
  selected: boolean
  onToggle: () => void
}

export interface EntityCardProps extends PropsWithChildren {
  entity: EntityData
  /** When provided, the whole card becomes tappable/keyboard-activatable and invokes this (e.g. navigate to the entity's details page). */
  onOpen?: () => void
  /** When provided, adds an "Edit" action to the actions menu (opened via the menu button). */
  onEdit?: () => void
  /** When provided, adds a "Remove" action to the actions menu (opened via the menu button). */
  onRemove?: () => void
  /**
   * When provided, the menu button calls this instead of opening the card's own actions menu, so
   * a caller can show its actions somewhere else (e.g. a dialog).
   */
  onOpenActions?: () => void
  /** Outline-style button pinned to the left edge of the card, spanning its full height. */
  leftAction?: EntityCardLeftAction
  /**
   * Extra entries for the actions menu, rendered only while it is open and listed before Edit and
   * Remove. Receives a callback that closes the menu.
   */
  menuActions?: (closeMenu: () => void) => ReactNode
  /**
   * Whether a card with nothing below its title may put its footer on the title's row, as a
   * single compact line. Defaults to `true`.
   */
  allowCompact?: boolean
  /**
   * When provided, the card is in selection mode: tapping anywhere on it calls `onToggle`, a
   * checkbox replaces `leftAction`, and the actions menu button is hidden. `onOpen` is ignored.
   */
  selection?: EntityCardSelection
}

/** An Entity implementing `Credential` (a SIN/Licence) shows "Real" instead of its (absent)
 *  numeric rating when `isReal` is `true`; every other Entity just shows its plain `rating`. */
function getRatingDisplay(entity: EntityData): string | number | undefined {
  if (isCredential(entity) && entity.isReal) return "Real"
  return entity.rating
}

/**
 * The card's outer frame — the one piece every EntityCard-based card renders unconditionally.
 * Auto-renders every field common to `EntityData` — name, rating, effects, source — the same
 * way `ItemCard` auto-renders every field common to `ItemData`, so category tiers only
 * need to supply their own type-specific content as `children`. Recognizes `Layout.*` regions
 * among `children` and renders whichever are present in the fixed HeaderRow/BodyRow/FooterRow
 * order, regardless of the order they were passed in; any other child is ignored. A card with no
 * header rows below its title, body rows, or extra footer rows renders its footer on the title's
 * row instead, as a single compact line, unless `allowCompact` is `false`. `onEdit`/`onRemove`
 * surface as items in a menu opened by a dedicated menu button on the card's right edge (or the
 * button calls `onOpenActions` instead, when given), and `leftAction` renders a matching
 * outline-style button on the left edge — both buttons span the card's full height. In selection
 * mode (`selection`) the card becomes a single checkbox instead, with no menu or left action.
 */
const EntityCardRoot: FC<EntityCardProps> = ({
  entity,
  onOpen,
  onEdit,
  onRemove,
  onOpenActions,
  leftAction,
  menuActions,
  allowCompact = true,
  selection,
  children,
}) => {
  const slots = new EntityCardSlotManager(children)
  const hasMenu = !selection && !onOpenActions && !!(onEdit || onRemove)
  const hasActions = !selection && (!!onOpenActions || hasMenu)
  const onActivate = selection ? selection.onToggle : onOpen
  // A card with nothing but its title line and footer fits both on a single row.
  const isCompact = allowCompact
    && slots.layout.headerRows.length === 0
    && slots.layout.bodyRows.length === 0
    && slots.layout.footerRows.length === 0
  const hasFooter = !!(
    slots.layout.footerRows.length >= 1
    || slots.layout.footerLeft.length >= 1
    || slots.layout.footerRight.length >= 1
    || entity.source
  )

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (onOpenActions) onOpenActions()
    else setMenuAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => setMenuAnchorEl(null)

  const handleLeftActionClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    leftAction?.onClick()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onActivate) return
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    onActivate()
  }

  return (
    <>
      <Stack direction="row" sx={{ width: "100%", gap: 0 }}>
        {selection && (
          <Box
            aria-hidden
            onClick={selection.onToggle}
            sx={{
              display: "flex",
              minWidth: 42,
              justifyContent: "center",
              padding: 1,
              border: "1px solid",
              borderRight: "none",
              borderColor: selection.selected ? "secondary.main" : "primary.dark",
              color: selection.selected ? "secondary.main" : "text.secondary",
              cursor: "pointer",
            }}
          >
            {selection.selected ? <RiCheckboxFill size={20} /> : <RiCheckboxBlankLine size={20} />}
          </Box>
        )}

        {leftAction && !selection && (
          <Button
            variant="outlined"
            aria-label={leftAction.label ?? "Action"}
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
          role={selection ? "checkbox" : (onOpen ? "button" : undefined)}
          aria-checked={selection?.selected}
          aria-label={selection ? `Select ${entity.name}` : undefined}
          tabIndex={onActivate ? 0 : undefined}
          onClick={onActivate}
          onKeyDown={handleKeyDown}
          sx={{
            border: "1px solid",
            borderColor: selection?.selected ? "secondary.main" : "primary.dark",
            flexGrow: 1,
            minWidth: 0,
            textAlign: "left",
            ...(onActivate && {
              "cursor": "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }),
            ...(selection?.selected && { bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.08)" }),
            // Selecting makes the whole card one tap target, so controls inside it (e.g. a damage
            // track) mustn't swallow the tap and change the Entity instead.
            ...(selection && { "& button, & [role=button]": { pointerEvents: "none" } }),
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
            <EntityCardLayout.HeaderRow data-card-row="header" sx={{ justifyContent: "space-between" }}>
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <EntityCardElements.Title title={entity.name} />

                {slots.layout.titleRight}
              </Stack>

              <Stack direction="row" sx={{ justifyItems: "flex-end", alignItems: "center" }}>
                {isCompact && (
                  <>
                    <EntityCardElements.Source source={entity.source} />
                    {slots.layout.footerLeft}
                    {slots.layout.footerRight}
                  </>
                )}

                {slots.layout.topRight}

                <EntityCardElements.Rating value={getRatingDisplay(entity)} />
              </Stack>
            </EntityCardLayout.HeaderRow>

            {slots.layout.headerRows}
          </Stack>

          {slots.layout.bodyRows.length >= 1 && (
            <Stack sx={{ padding: 1, gap: 0.5 }}>
              {slots.layout.bodyRows}
            </Stack>
          )}

          {hasFooter && !isCompact && (
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

      {hasMenu && (
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
          {menuAnchorEl !== null && menuActions?.(handleCloseMenu)}

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
