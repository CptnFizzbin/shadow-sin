import type { FC } from "react"

import type { ItemDialogProps } from "#/app/components/entities/items/dialogs/itemDialog.tsx"
import { ItemDialog } from "#/app/components/entities/items/dialogs/itemDialog.tsx"
import { ImplantFormFields } from "#/app/components/entities/items/types/implants/forms/implantFormFields.tsx"
import { ImplantTypeFieldGroup } from "#/app/components/entities/items/types/implants/forms/implantTypeFieldGroup.tsx"
import { GearFormLicenseSection } from "#/app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ImplantData } from "#/data/items/implantData.ts"
import { useDialog } from "#/forms/dialog/useDialog.tsx"
import { implantFieldMap, useImplantForm } from "#/forms/items/types/implants/useImplantForm.tsx"
import { getImplantEffectiveNuyenCost } from "#/rules/items/implantUtils.ts"

interface CyberwareFormDialogProps {
  implant?: ImplantData
  parentId?: UUID
  wizard?: boolean
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
        hasRating: { forced: true },
        multiple: { forced: true, enabled: false },
        isSubItem: { forced: true, enabled: false },
        hasEffects: { forced: true },
      }}
      slots={{
        afterName: () => <ImplantTypeFieldGroup form={form} fields={implantFieldMap} />,
        itemFields: () => (
          <>
            <ImplantFormFields form={form} fields={implantFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

export type UseImplantFormProps = CyberwareFormDialogProps

export const useImplantFormDialog = () => useDialog<ImplantData, UseImplantFormProps | undefined>(
  (ctrl, props) => <ImplantFormDialog ctrl={ctrl} {...props} />,
)
