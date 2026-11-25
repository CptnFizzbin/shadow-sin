import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { GearFormLicenseSection } from "#app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { WeaponFormFields } from "#app/components/entities/items/types/weapons/forms/weaponFormFields.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import type { WeaponData, WeaponType } from "#data/items/weaponData.ts"
import { useWeaponForm, weaponFieldMap } from "#forms/items/types/weapons/useWeaponForm.tsx"
import type { AnyDialogCtrl } from "#ui/dialog/dialogCtrl.ts"
import { useDialog } from "#ui/dialog/useDialog.tsx"

interface WeaponFormDialogProps {
  ctrl: AnyDialogCtrl
  weapon?: WeaponData
  weaponType?: WeaponType
  wizard?: boolean
  parentId?: UUID
}

export const WeaponFormDialog: FC<WeaponFormDialogProps> = ({ ctrl, weapon, weaponType, wizard, parentId }) => {
  const title = weapon ? "Edit Weapon" : "Add Weapon"

  const form = useWeaponForm({
    weapon,
    weaponType,
    parentId,
    onSubmit: (weaponData) => ctrl.close(weaponData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      options={{
        hasRating: { enabled: true },
        multiple: { forced: true, enabled: false },
        isSubItem: parentId ? { forced: true } : undefined,
      }}
      slots={{
        itemFields: () => (
          <>
            <WeaponFormFields form={form} fields={weaponFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseWeaponFormDialogProps = Omit<WeaponFormDialogProps, "ctrl">

export const useWeaponFormDialog = () => useDialog<WeaponData, UseWeaponFormDialogProps | undefined>(
  (ctrl, props) => <WeaponFormDialog ctrl={ctrl} {...props} />,
)
