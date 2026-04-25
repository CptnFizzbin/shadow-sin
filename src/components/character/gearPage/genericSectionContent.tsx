import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

interface GenericSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
  itemLabel: string
  itemType?: ItemType
}

export const GenericSectionContent: FC<GenericSectionContentProps> = ({
  items,
  getChildren,
  itemLabel,
  itemType,
}) => {
  const gearStore = useGearStore()
  const sheetContext = useCharacterSheetContext()
  const dialogApi = useDialogApi()

  const openDialog = (item?: ItemData) => {
    dialogApi.open((injectedProps) => {
      return (
        <CharacterSheetProvider store={sheetContext}>
          <ItemFormDialog
            {...injectedProps}
            item={item}
            itemType={itemType}
            label={itemLabel}
            onSave={(savedItem) => {
              gearStore.save(savedItem)
              injectedProps.onClose()
            }}
          />
        </CharacterSheetProvider>
      )
    })
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {items.map((item) => (
        <GearViewItem
          key={item.id}
          item={item}
          subItems={getChildren(item.id)}
          onEdit={() => openDialog(item)}
          onRemove={() => gearStore.remove(item, { removeChildren: true })}
          getSubItemCallbacks={(subItemId) => {
            const subItem = getChildren(item.id).find((child) => child.id === subItemId)
            return {
              onEdit: subItem ? () => openDialog(subItem) : undefined,
              onRemove: subItem ? () => gearStore.remove(subItem) : undefined,
            }
          }}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => openDialog()}
        color="secondary"
        fullWidth
      >
        Add {itemLabel}
      </Button>
    </Stack>
  )
}
