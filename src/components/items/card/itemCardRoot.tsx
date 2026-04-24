import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC, MouseEvent, ReactElement, ReactNode } from "react"
import { Children, isValidElement } from "react"

import type { ItemCardActionType } from "#/components/items/card/itemCardAction.tsx"
import { ItemCardAction } from "#/components/items/card/itemCardAction.tsx"
import { ItemCardAddChildButton } from "#/components/items/card/itemCardAddChildButton.tsx"
import { ItemCardChildren } from "#/components/items/card/itemCardChildren.tsx"
import type { ItemCardMetaType } from "#/components/items/card/itemCardMeta.tsx"
import { ItemCardMeta } from "#/components/items/card/itemCardMeta.tsx"
import { ItemCardTitle } from "#/components/items/card/itemCardTitle.tsx"

interface ItemCardRootProps {
  onClick?: () => void
  children: ReactNode
}

interface MetaProps {
  type: ItemCardMetaType
  children: ReactNode
}

interface ActionProps {
  type: ItemCardActionType
  onClick?: () => void
  children: ReactNode
}

type MetaElement = ReactElement<MetaProps>
type ActionElement = ReactElement<ActionProps>

export const ItemCardRoot: FC<ItemCardRootProps> = ({ onClick, children }) => {
  const childArray = Children.toArray(children)

  const titleElement = childArray.find(
    (child): child is ReactElement => isValidElement(child) && child.type === ItemCardTitle,
  )

  const metaElements = childArray.filter(
    (child): child is MetaElement => isValidElement(child) && child.type === ItemCardMeta,
  )

  const actionElements = childArray.filter(
    (child): child is ActionElement => isValidElement(child) && child.type === ItemCardAction,
  )

  const childrenElement = childArray.find(
    (child): child is ReactElement => isValidElement(child) && child.type === ItemCardChildren,
  )

  const addChildButtonElement = childArray.find(
    (child): child is ReactElement => isValidElement(child) && child.type === ItemCardAddChildButton,
  )

  const costMetas = metaElements.filter((el) => el.props.type === "cost")
  const statMetas = metaElements.filter((el) => el.props.type === "stat")
  const sourceMetas = metaElements.filter((el) => el.props.type === "source")

  const iconActions = actionElements.filter((el) => el.props.type === "icon")
  const buttonActions = actionElements.filter((el) => el.props.type === "button")

  const handleRootClick = onClick
    ? (e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        if (target.closest("button, a, [role='button']")) return
        onClick()
      }
    : undefined

  const hasMiddleRow = statMetas.length > 0 || sourceMetas.length > 0

  return (
    <Stack
      direction="column"
      sx={{
        padding: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        ...(onClick && {
          "cursor": "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }),
      }}
      onClick={handleRootClick}
    >
      {/* Title row */}
      <Stack
        direction="row"
        sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        {titleElement}

        {costMetas.length > 0 && (
          <Stack
            direction="row"
            sx={{ gap: 0.5, alignItems: "center", ml: "auto" }}
          >
            {costMetas.map((el, index) => (
              <Box key={index}>{el.props.children}</Box>
            ))}
          </Stack>
        )}

        {iconActions.length > 0 && (
          <Stack direction="row" sx={{ gap: 0, alignItems: "center" }}>
            {iconActions.map((el, index) => (
              <Box key={index}>{el.props.children}</Box>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Meta rows */}
      {hasMiddleRow && (
        <Stack
          direction="row"
          sx={{ gap: 1, flexWrap: "wrap", pt: 0.5, alignItems: "center" }}
        >
          {statMetas.map((el, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
            >
              {el.props.children}
            </Box>
          ))}

          {sourceMetas.length > 0 && (
            <Stack
              direction="row"
              sx={{ gap: 0.5, alignItems: "center", ml: "auto" }}
            >
              {sourceMetas.map((el, index) => (
                <Box key={index}>{el.props.children}</Box>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      {/* Button action row */}
      {buttonActions.length > 0 && (
        <Stack direction="row" sx={{ gap: 1, pt: 1, flexWrap: "wrap" }}>
          {buttonActions.map((el, index) => (
            <Button
              key={index}
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                el.props.onClick?.()
              }}
              sx={{ flex: 1 }}
            >
              {el.props.children}
            </Button>
          ))}
        </Stack>
      )}

      {/* Children area */}
      {childrenElement}

      {/* Add child button */}
      {addChildButtonElement}
    </Stack>
  )
}
