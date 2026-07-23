import type { FC, ReactNode } from "react"

import { ItemCardAction } from "./itemCardAction.tsx"
import { ItemCardAddChildButton } from "./itemCardAddChildButton.tsx"
import { ItemCardChildren } from "./itemCardChildren.tsx"
import { ItemCardMeta } from "./itemCardMeta.tsx"
import type { ItemCardRootProps } from "./itemCardRoot.tsx"
import { ItemCardRoot } from "./itemCardRoot.tsx"
import { ItemCardTitle } from "./itemCardTitle.tsx"

export interface ItemCardProps extends ItemCardRootProps {
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
