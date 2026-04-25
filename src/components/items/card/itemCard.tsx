import type { FC, ReactNode } from "react"

import { ItemCardAction } from "#/components/items/card/itemCardAction.tsx"
import { ItemCardAddChildButton } from "#/components/items/card/itemCardAddChildButton.tsx"
import { ItemCardChildren } from "#/components/items/card/itemCardChildren.tsx"
import { ItemCardMeta } from "#/components/items/card/itemCardMeta.tsx"
import type { ItemCardRootProps } from "#/components/items/card/itemCardRoot.tsx"
import { ItemCardRoot } from "#/components/items/card/itemCardRoot.tsx"
import { ItemCardTitle } from "#/components/items/card/itemCardTitle.tsx"

export interface ItemCardProps extends ItemCardRootProps {
  onClick?: () => void
  children: ReactNode
}

interface ItemCardComponent extends FC<ItemCardProps> {
  Title: typeof ItemCardTitle
  Meta: typeof ItemCardMeta
  Action: typeof ItemCardAction
  Children: typeof ItemCardChildren
  AddChildButton: typeof ItemCardAddChildButton
}

const ItemCardBase: FC<ItemCardProps> = ({ ...props }) => <ItemCardRoot {...props} />

export const ItemCard = ItemCardBase as ItemCardComponent
ItemCard.Title = ItemCardTitle
ItemCard.Meta = ItemCardMeta
ItemCard.Action = ItemCardAction
ItemCard.Children = ItemCardChildren
ItemCard.AddChildButton = ItemCardAddChildButton
