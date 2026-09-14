import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ArmorFormFields } from "#/components/items/types/armor/forms/armorFormFields.tsx"
import { GearFormLicenseSection } from "#/components/items/types/licenses/gearFormLicenseSection.tsx"
import { armorFieldMap, useArmorForm } from "#/hooks/items/types/armor/useArmorForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
        equipable: { forced: true },
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
