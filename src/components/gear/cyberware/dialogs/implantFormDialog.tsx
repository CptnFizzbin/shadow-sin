import type { UUID } from "node:crypto"

import type { FC } from "react"

import { ImplantFormFields } from "#/components/gear/cyberware/forms/implantFormFields.tsx"
import { implantFieldMap, useImplantForm } from "#/components/gear/cyberware/forms/useImplantForm.tsx"
import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import type { ItemForm } from "#/components/gear/forms/useItemForm.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/gear/implantUtils.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"

interface CyberwareFormDialogProps {
  open: boolean
  implant?: ImplantData
  parentId?: UUID
  onClose: () => void
  onClosed?: () => void
  onSave: (implant: ImplantData) => void
}

export const ImplantFormDialog: FC<CyberwareFormDialogProps> = ({
  open,
  implant,
  parentId,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = implant ? "Edit Implant" : "Add Implant"

  const form = useImplantForm({
    implant,
    parentId,
    onSubmit: onSave,
  })

  return (
    <ItemDialog
      form={form as unknown as ItemForm}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      computeTotalCost={(values) => getImplantEffectiveNuyenCost(values as ImplantData)}
      options={{
        equipable: { forced: true },
        hasEffects: { forced: true },
      }}
      slots={{
        itemFields: () => <ImplantFormFields form={form} fields={implantFieldMap} />,
      }}
    />
  )
}
