import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import type { FC, PropsWithChildren } from "react"

import type { EntityData } from "#/system/entityData.ts"

import { EntityCardElements } from "./entityCardElements.tsx"
import { EntityCardLayout } from "./entityCardLayout.tsx"
import { EntityCardSlotManager } from "./entityCardSlotManager.ts"

export type { CardElementActionProps } from "./elements/cardElementAction.tsx"
export type { CardElementEffectsProps } from "./elements/cardElementEffect.tsx"
export type { CardElementRatingProps } from "./elements/cardElementRating.tsx"
export type { CardElementSourceProps } from "./elements/cardElementSource.tsx"
export type { CardElementStatProps, CardElementStatType } from "./elements/cardElementStat.tsx"
export type { CardElementTitleProps } from "./elements/cardElementTitle.tsx"
export type { BodyRowProps } from "./layout/bodyRow.tsx"
export type { FooterRowProps } from "./layout/footerRow.tsx"
export type { HeaderRowProps } from "./layout/headerRow.tsx"

export interface EntityCardProps extends PropsWithChildren {
  entity: EntityData
}

/**
 * The card's outer frame — the one piece every EntityCard-based card renders unconditionally.
 * Finds its `Layout.*` regions among `children` via `SlotsProvider` (same mechanism as
 * `DataCard`) and renders whichever are present in the fixed HeaderRow/BodyRow/FooterRow order,
 * regardless of the order they were passed in; any other child is ignored. Category tiers
 * (`ItemCard`, `SpiritCard`, ...) compose their own content inside those regions. Interaction
 * affordances (open/edit/remove, long-press menu, ...) are a category-tier concern, not this
 * foundation's — kept out until a real consumer needs them.
 */
const EntityCardRoot: FC<EntityCardProps> = ({
  entity,
  children,
}) => {
  const slots = new EntityCardSlotManager(children)

  return (
    <Box sx={{ border: "1px solid", borderColor: "primary.dark", width: "100%", textAlign: "left" }}>
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

          <EntityCardElements.Source source={entity.source} />
        </EntityCardLayout.HeaderRow>

        {slots.headerRows}
      </Stack>

      <Stack sx={{ gap: 0.5 }}>
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
        {slots.footerRows}
      </Stack>
    </Box>
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
