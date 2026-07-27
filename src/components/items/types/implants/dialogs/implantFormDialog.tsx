import type { UUID } from "node:crypto"

import type { FC } from "react"

import type { ItemDialogProps } from "#/components/items/dialogs/itemDialog.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ImplantFormFields } from "#/components/items/types/implants/forms/implantFormFields.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/items/types/implants/implantUtils.ts"
import { implantFieldMap, useImplantForm } from "#/lib/hooks/items/types/implants/forms/useImplantForm.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { ImplantData } from "#/system/gear/implantData.ts"

interface CyberwareFormDialogProps {
  implant?: ImplantData
  parentId?: UUID
}

export const ImplantFormDialog: FC<CyberwareFormDialogProps & Omit<ItemDialogProps, "form" | "title">> = ({
  implant,
  parentId,
  ...dialogProps
}) => {
  const title = implant ? "Edit Implant" : "Add Implant"

  const form = useImplantForm({
    implant,
    parentId,
    onSubmit: (implantData) => dialogProps.ctrl.close(implantData),
  })

  return (
    <ItemDialog
      {...dialogProps}
      form={form}
      title={title}
      getCost={(values) => getImplantEffectiveNuyenCost(values as ImplantData)}
      options={{
        equipable: { forced: true, enabled: false },
        hasRating: { forced: true },
        multiple: { forced: true, enabled: false },
        isSubItem: { forced: true, enabled: false },
        hasEffects: { forced: true },
      }}
      slots={{
        itemFields: () => <ImplantFormFields form={form} fields={implantFieldMap} />,
      }}
    />
  )
}

export type UseImplantFormProps = CyberwareFormDialogProps

export const useImplantFormDialog = () => useDialog<ImplantData, UseImplantFormProps | undefined>(
  (ctrl, props) => <ImplantFormDialog ctrl={ctrl} {...props} />,
)
