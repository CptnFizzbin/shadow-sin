import type { UUID } from "node:crypto"

import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { ItemDialogProps } from "#/components/items/dialogs/itemDialog.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ImplantFormFields } from "#/components/items/types/implants/forms/implantFormFields.tsx"
import { implantFieldMap, useImplantForm } from "#/components/items/types/implants/forms/useImplantForm.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/items/types/implants/implantUtils.ts"
import { dialogApi } from "#/components/ui/dialogs/dialogApi.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"

interface CyberwareFormDialogProps {
  implant?: ImplantData
  parentId?: UUID
  onSave: (implant: ImplantData) => void
}

export const ImplantFormDialog: FC<CyberwareFormDialogProps & Omit<ItemDialogProps, "form" | "title">> = ({
  implant,
  parentId,
  onSave,
  ...dialogProps
}) => {
  const title = implant ? "Edit Implant" : "Add Implant"

  const form = useImplantForm({
    implant,
    parentId,
    onSubmit: onSave,
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

export type UseImplantFormProps = Omit<CyberwareFormDialogProps, "onSave">

export const useImplantFormDialog = () => {
  const dialogApi = useDialogApi()
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseImplantFormProps) => {
      const dialog = dialogApi.open<ImplantData>((dialogProps) => (
        <CharacterSheetProvider store={sheetContext}>
          <ImplantFormDialog {...dialogProps} {...props} onSave={dialog.close} />
        </CharacterSheetProvider>
      ))

      return dialog
    },
  }
}
