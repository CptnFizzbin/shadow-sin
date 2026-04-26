import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import {
  weaponFieldMap,
  useWeaponForm,
} from "#/components/items/types/weapons/forms/useWeaponForm.tsx"
import { WeaponFormFields } from "#/components/items/types/weapons/forms/weaponFormFields.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"

interface WeaponFormDialogProps {
  open: boolean
  weapon?: WeaponData
  onClose: () => void
  onClosed?: () => void
  onSave: (weapon: WeaponData) => void
}

export const WeaponFormDialog: FC<WeaponFormDialogProps> = ({
  open,
  weapon,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = weapon ? "Edit Weapon" : "Add Weapon"

  const form = useWeaponForm({
    weapon,
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
        hasRating: { enabled: true },
        multiple: { forced: true, enabled: false },
      }}
      slots={{
        itemFields: () => <WeaponFormFields form={form} fields={weaponFieldMap} />,
      }}
    />
  )
}

export type UseWeaponFormDialogProps = Omit<WeaponFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useWeaponFormDialog = () => {
  const dialogApi = useDialogApi()
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseWeaponFormDialogProps) => dialogApi.open<WeaponData>(
      (dialogProps) => (
        <CharacterSheetProvider store={sheetContext}>
          <WeaponFormDialog
            {...dialogProps}
            {...props}
            onSave={(weapon) => dialogProps.onClose(weapon)}
          />
        </CharacterSheetProvider>
      ),
    ),
  }
}
