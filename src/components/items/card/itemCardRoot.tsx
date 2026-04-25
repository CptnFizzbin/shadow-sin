import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import type { SxProps } from "@mui/material/styles"
import type { FC, PropsWithChildren, ReactElement, ReactNode } from "react"
import { Children, isValidElement } from "react"

import { ItemCardAction } from "#/components/items/card/itemCardAction.tsx"
import { ItemCardAddChildButton } from "#/components/items/card/itemCardAddChildButton.tsx"
import { ItemCardChildren } from "#/components/items/card/itemCardChildren.tsx"
import { ItemCardMeta } from "#/components/items/card/itemCardMeta.tsx"
import { ItemCardTitle } from "#/components/items/card/itemCardTitle.tsx"

export interface ItemCardRootProps {
  onClick?: () => void
  children: ReactNode
  variant?: "borderless" | "outlined"
}

function isElementType<TProps>(type: FC<TProps>) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return isValidElement(item) && item.type === type
  }
}

export const ItemCardRoot: FC<ItemCardRootProps> = ({ onClick, children, variant = "outlined" }) => {
  const childArray = Children.toArray(children)

  const titleNode = childArray.find(isElementType(ItemCardTitle))
  const metaNodes = childArray.filter(isElementType(ItemCardMeta))
  const actionNodes = childArray.filter(isElementType(ItemCardAction))
  const childrenNode = childArray.find(isElementType(ItemCardChildren))
  const addChildButtonNode = childArray.find(isElementType(ItemCardAddChildButton))

  const costMetas = metaNodes.filter((el) => el.props.type === "cost")
  const statMetas = metaNodes.filter((el) => el.props.type === "stat")
  const sourceMetas = metaNodes.filter((el) => el.props.type === "source")

  const iconActions = actionNodes.filter((el) => el.props.type === "icon")
  const buttonActions = actionNodes.filter((el) => el.props.type === "button")

  const hasMiddleRow = statMetas.length > 0 || sourceMetas.length > 0

  const Wrapper: FC<PropsWithChildren<{ onClick?: () => void, sx: SxProps }>> = onClick ? ButtonBase : Box

  return (
    <Stack direction="column" sx={{ gap: 0 }}>
      <Wrapper
        onClick={onClick}
        sx={{
          padding: 1,
          border: variant === "outlined" ? "1px solid" : "none",
          borderColor: "primary.dark",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          textAlign: "left",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "baseline",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {titleNode}
          </Box>

          <Stack direction="row" sx={{ gap: 0.5 }}>
            {costMetas}
          </Stack>

          <Stack direction="row" sx={{ gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
            {iconActions}
          </Stack>
        </Stack>

        {hasMiddleRow && (
          <Stack
            direction="row"
            sx={{ gap: 0.5, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="row" sx={{ gap: 0.5 }}>
              {statMetas}
            </Stack>

            <Stack direction="row" sx={{ gap: 0.5 }}>
              {sourceMetas}
            </Stack>
          </Stack>
        )}
      </Wrapper>

      {buttonActions.length > 0 && (
        <Stack
          direction="row"
          sx={{ flexWrap: "wrap", border: "1px solid", borderColor: "divider" }}
          onClick={(e) => e.stopPropagation()}
        >
          {buttonActions}
        </Stack>
      )}

      {addChildButtonNode && (
        <Box sx={{
          borderLeft: "4px solid",
          borderColor: "secondary.dark",
        }}
        >
          {addChildButtonNode}
        </Box>
      )}

      {childrenNode}
    </Stack>
  )
}
