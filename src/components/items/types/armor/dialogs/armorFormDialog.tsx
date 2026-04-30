import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { AnyDialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ArmorFormFields } from "#/components/items/types/armor/forms/armorFormFields.tsx"
import { armorFieldMap, useArmorForm } from "#/components/items/types/armor/forms/useArmorForm.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"

interface ArmorFormDialogProps {
  ctrl: AnyDialogCtrl
  armor?: ArmorData
}

export const ArmorFormDialog: FC<ArmorFormDialogProps> = ({ ctrl, armor }) => {
  const title = armor ? "Edit Armor" : "Add Armor"

  const form = useArmorForm({
    armor,
    onSubmit: (armorData) => ctrl.close(armorData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
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

type UseArmorFormDialogProps = Omit<ArmorFormDialogProps, "ctrl">

export const useArmorFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseArmorFormDialogProps) => dialogApi.open<ArmorData>(
      (ctrl) => <ArmorFormDialog ctrl={ctrl} {...props} />,
    ),
  }
}
