import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { AnyDialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import {
  weaponFieldMap,
  useWeaponForm,
} from "#/components/items/types/weapons/forms/useWeaponForm.tsx"
import { WeaponFormFields } from "#/components/items/types/weapons/forms/weaponFormFields.tsx"
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

export type UseWeaponFormDialogProps = Omit<WeaponFormDialogProps, "ctrl">

export const useWeaponFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseWeaponFormDialogProps) => dialogApi.open<WeaponData>(
      (ctrl) => <WeaponFormDialog ctrl={ctrl} {...props} />,
    ),
  }
}
