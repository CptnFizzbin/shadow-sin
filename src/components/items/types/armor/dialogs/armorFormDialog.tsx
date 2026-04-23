import type { FC } from "react"

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
