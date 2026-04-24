import type { FC, ReactNode } from "react"

import { ItemCardAction } from "#/components/items/card/itemCardAction.tsx"
import { ItemCardAddChildButton } from "#/components/items/card/itemCardAddChildButton.tsx"
import { ItemCardChildren } from "#/components/items/card/itemCardChildren.tsx"
import { ItemCardMeta } from "#/components/items/card/itemCardMeta.tsx"
import { ItemCardRoot } from "#/components/items/card/itemCardRoot.tsx"
import { ItemCardTitle } from "#/components/items/card/itemCardTitle.tsx"

interface ItemCardCompositeProps {
  onClick?: () => void
  children: ReactNode
}

interface ItemCardComponent extends FC<ItemCardCompositeProps> {
  Title: typeof ItemCardTitle
  Meta: typeof ItemCardMeta
  Action: typeof ItemCardAction
  Children: typeof ItemCardChildren
  AddChildButton: typeof ItemCardAddChildButton
}

const ItemCardBase: FC<ItemCardCompositeProps> = ({ onClick, children }) => (
  <ItemCardRoot onClick={onClick}>{children}</ItemCardRoot>
)

export const ItemCard = ItemCardBase as ItemCardComponent
ItemCard.Title = ItemCardTitle
ItemCard.Meta = ItemCardMeta
ItemCard.Action = ItemCardAction
ItemCard.Children = ItemCardChildren
ItemCard.AddChildButton = ItemCardAddChildButton
