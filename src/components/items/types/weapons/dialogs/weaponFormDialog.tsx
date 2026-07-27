import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { WeaponFormFields } from "#/components/items/types/weapons/forms/weaponFormFields.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useWeaponForm, weaponFieldMap } from "#/lib/hooks/items/types/weapons/forms/useWeaponForm.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"

interface WeaponFormDialogProps {
  ctrl: AnyDialogCtrl
  weapon?: WeaponData
}

export const WeaponFormDialog: FC<WeaponFormDialogProps> = ({ ctrl, weapon }) => {
  const title = weapon ? "Edit Weapon" : "Add Weapon"

  const form = useWeaponForm({
    weapon,
    onSubmit: (weaponData) => ctrl.close(weaponData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
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

type UseWeaponFormDialogProps = Omit<WeaponFormDialogProps, "ctrl">

export const useWeaponFormDialog = () => useDialog<WeaponData, UseWeaponFormDialogProps | undefined>(
  (ctrl, props) => <WeaponFormDialog ctrl={ctrl} {...props} />,
)
