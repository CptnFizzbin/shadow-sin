import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC, KeyboardEvent, ReactElement, ReactNode } from "react"
import { Children, isValidElement } from "react"

import { ItemCardDamageTrack } from "./itemCardDamageTrack.tsx"
import { ItemCardFooter } from "./itemCardFooter.tsx"
import { ItemCardSource } from "./itemCardSource.tsx"
import { ItemCardStat } from "./itemCardStat.tsx"
import type { ItemCardStatusIconsProps } from "./itemCardStatusIcons.tsx"
import { ItemCardStatusIcons } from "./itemCardStatusIcons.tsx"
import { ItemCardSubitem } from "./itemCardSubitem.tsx"

export interface ItemCardRootProps {
  name: ReactNode
  type?: ReactNode
  statusIcons?: ItemCardStatusIconsProps
  /** When provided, the whole card becomes tappable/keyboard-activatable and routes to a detail view. */
  onOpen?: () => void
  children: ReactNode
}

function isElementType<TProps>(elementType: FC<TProps>) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return isValidElement(item) && item.type === elementType
  }
}

export const ItemCardRoot: FC<ItemCardRootProps> = ({ name, type, statusIcons, onOpen, children }) => {
  const childArray = Children.toArray(children)

  const statNodes = childArray.filter(isElementType(ItemCardStat))
  const subitemNodes = childArray.filter(isElementType(ItemCardSubitem))
  const sourceNode = childArray.find(isElementType(ItemCardSource))
  const damageTrackNode = childArray.find(isElementType(ItemCardDamageTrack))
  const footerNode = childArray.find(isElementType(ItemCardFooter))

  const hasStatRow = statNodes.length > 0 || Boolean(sourceNode)

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
        padding: 1,
        border: "1px solid",
        borderColor: "primary.dark",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        width: "100%",
        textAlign: "left",
        ...(onOpen && {
          "cursor": "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }),
      }}
    >
      <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between", gap: 0.5 }}>
        <Stack sx={{ gap: 0, minWidth: 0 }}>
          {type && (
            <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
              {type}
            </Typography>
          )}
          <Typography sx={{ fontWeight: 500 }}>{name}</Typography>
        </Stack>

        {statusIcons && <ItemCardStatusIcons {...statusIcons} />}
      </Stack>

      {hasStatRow && (
        <Stack
          direction="row"
          sx={{ gap: 0.5, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}
        >
          <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
            {statNodes}
          </Stack>

          {sourceNode}
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

      {footerNode}
    </Box>
  )
}
