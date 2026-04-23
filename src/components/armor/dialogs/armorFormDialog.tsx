import type { FC } from "react"

import { ArmorFormFields } from "#/components/armor/forms/armorFormFields.tsx"
import { armorFieldMap, useArmorForm } from "#/components/armor/forms/useArmorForm.tsx"
import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
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
        multiple: { forced: false },
      }}
      slots={{
        itemFields: () => <ArmorFormFields form={form} fields={armorFieldMap} />,
      }}
    />
  )
}
