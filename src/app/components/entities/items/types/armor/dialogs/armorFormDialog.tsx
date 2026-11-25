import type { FC } from "react"

import { ItemDialog } from "#/app/components/entities/items/dialogs/itemDialog.tsx"
import { ArmorFormFields } from "#/app/components/entities/items/types/armor/forms/armorFormFields.tsx"
import { GearFormLicenseSection } from "#/app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ArmorData } from "#/data/items/armorData.ts"
import type { AnyDialogCtrl } from "#/forms/dialog/dialogCtrl.ts"
import { useDialog } from "#/forms/dialog/useDialog.tsx"
import { armorFieldMap, useArmorForm } from "#/forms/items/types/armor/useArmorForm.tsx"

interface ArmorFormDialogProps {
  ctrl: AnyDialogCtrl
  armor?: ArmorData
  wizard?: boolean
  parentId?: UUID
}

export const ArmorFormDialog: FC<ArmorFormDialogProps> = ({ ctrl, armor, wizard, parentId }) => {
  const title = armor ? "Edit Armor" : "Add Armor"

  const form = useArmorForm({
    armor,
    parentId,
    onSubmit: (armorData) => ctrl.close(armorData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      options={{
        hasEffects: { forced: true },
        multiple: { forced: true, enabled: false },
        isSubItem: parentId ? { forced: true } : undefined,
      }}
      slots={{
        itemFields: () => (
          <>
            <ArmorFormFields form={form} fields={armorFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseArmorFormDialogProps = Omit<ArmorFormDialogProps, "ctrl">

export const useArmorFormDialog = () => useDialog<ArmorData, UseArmorFormDialogProps | undefined>(
  (ctrl, props) => <ArmorFormDialog ctrl={ctrl} {...props} />,
)
