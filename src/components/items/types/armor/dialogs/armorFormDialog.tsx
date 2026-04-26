import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ArmorFormFields } from "#/components/items/types/armor/forms/armorFormFields.tsx"
import { armorFieldMap, useArmorForm } from "#/components/items/types/armor/forms/useArmorForm.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"

interface ArmorFormDialogProps {
  open: boolean
  armor?: ArmorData
  onClose: () => void
  onClosed?: () => void
  onSave: (armor: ArmorData) => void
}

export const ArmorFormDialog: FC<ArmorFormDialogProps> = ({
  open,
  armor,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = armor ? "Edit Armor" : "Add Armor"

  const form = useArmorForm({
    armor,
    onSubmit: onSave,
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      options={{
        equipable: { forced: true },
        hasEffects: { forced: true },
        multiple: { forced: true, enabled: false },
      }}
      slots={{
        itemFields: () => <ArmorFormFields form={form} fields={armorFieldMap} />,
      }}
    />
  )
}

export type UseArmorFormDialogProps = Omit<ArmorFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useArmorFormDialog = () => {
  const dialogApi = useDialogApi()
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseArmorFormDialogProps) => dialogApi.open<ArmorData>(
      (dialogProps) => (
        <CharacterSheetProvider store={sheetContext}>
          <ArmorFormDialog
            {...dialogProps}
            {...props}
            onSave={(armor) => dialogProps.onClose(armor)}
          />
        </CharacterSheetProvider>
      ),
    ),
  }
}
