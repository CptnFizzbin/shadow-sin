import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import type { FC, KeyboardEvent, ReactNode } from "react"
import { Children } from "react"

import { isElementType } from "#/lib/slotUtils.ts"

import type { ItemCardStatusIconsProps } from "./itemCard.StatusIcons.tsx"
import { ItemCardSlot } from "./itemCardSlot.tsx"

export interface BasicItemCardProps {
  name: ReactNode
  type?: ReactNode
  statusIcons?: ItemCardStatusIconsProps
  /** When provided, the whole card becomes tappable/keyboard-activatable and routes to a detail view. */
  onOpen?: () => void
  children?: ReactNode
}

/** Tinted top/bottom bands that bracket the stat/sub-item body. */
const bandSx = {
  paddingX: 1,
  paddingY: 0.75,
  bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
}

/**
 * Generic, no-smarts ItemCard body: renders name/type/status-icons plus
 * whichever `ItemCardSlot.*` children are passed in. Typed cards (e.g.
 * `WeaponItemCard`) wrap this to add item-type-specific slots; the `ItemCard`
 * dispatcher falls back to this directly for item types without a typed card.
 */
export const BasicItemCard: FC<BasicItemCardProps> = ({
  name,
  type,
  statusIcons,
  onOpen,
  children,
}) => {
  const childArray = Children.toArray(children)

  const statNodes = childArray.filter(isElementType(ItemCardSlot.Stat))
  const subitemNodes = childArray.filter(isElementType(ItemCardSlot.Subitem))
  const sourceNode = childArray.find(isElementType(ItemCardSlot.Source))
  const damageTrackNode = childArray.find(isElementType(ItemCardSlot.DamageTrack))
  const footerNode = childArray.find(isElementType(ItemCardSlot.Footer))

  const hasBody = statNodes.length > 0 || Boolean(damageTrackNode) || subitemNodes.length > 0
  const hasFooterBand = Boolean(sourceNode) || Boolean(footerNode)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onOpen) return
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    onOpen()
  }

  return (
    <Box
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
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
          <Typography sx={{ fontWeight: 500 }}>{name}</Typography>
        </Stack>

        {statusIcons && <ItemCardSlot.StatusIcons {...statusIcons} />}
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
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>{sourceNode}</Box>
          {footerNode}
        </Stack>
      )}
    </Box>
  )
}
