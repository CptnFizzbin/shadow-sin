import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import {
  weaponFieldMap,
  useWeaponForm,
} from "#/components/weapons/forms/useWeaponForm.tsx"
import { WeaponFormFields } from "#/components/weapons/forms/weaponFormFields.tsx"
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
