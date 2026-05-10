import Stack from "@mui/material/Stack"
import type { ReactNode } from "react"

import type { ItemData } from "#/system/itemData.ts"

import { GearSectionAddButton } from "./gearSectionAddButton.tsx"
import { GearViewItem } from "./gearViewItem.tsx"

interface SubItemCallbacks {
  onEdit?: () => void
  onRemove?: () => void
}

interface ItemCallbacks extends SubItemCallbacks {
  getSubItemCallbacks?: (subItemId: string) => SubItemCallbacks
}

interface AddAction {
  label: string
  onClick: () => void
}

interface GearSectionContentScaffoldProps<TItem extends ItemData> {
  items: TItem[]
  getSubItems: (item: TItem) => ItemData[]
  getItemCallbacks: (item: TItem) => ItemCallbacks
  renderItemAction?: (item: TItem) => ReactNode
  addAction?: AddAction
}

export function GearSectionContentScaffold<TItem extends ItemData>({
  items,
  getSubItems,
  getItemCallbacks,
  renderItemAction,
  addAction,
}: GearSectionContentScaffoldProps<TItem>) {
  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => {
        const itemCallbacks = getItemCallbacks(item)

        return (
          <Stack key={item.id} sx={{ gap: 1 }}>
            <GearViewItem
              item={item}
              subItems={getSubItems(item)}
              onEdit={itemCallbacks.onEdit}
              onRemove={itemCallbacks.onRemove}
              getSubItemCallbacks={itemCallbacks.getSubItemCallbacks}
            />
            {renderItemAction?.(item)}
          </Stack>
        )
      })}

      {addAction && (
        <GearSectionAddButton label={addAction.label} onClick={addAction.onClick} />
      )}
    </Stack>
  )
}
