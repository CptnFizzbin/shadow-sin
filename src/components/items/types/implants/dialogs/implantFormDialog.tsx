import type { UUID } from "node:crypto"

import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import type { ItemDialogProps } from "#/components/items/dialogs/itemDialog.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ImplantFormFields } from "#/components/items/types/implants/forms/implantFormFields.tsx"
import { implantFieldMap, useImplantForm } from "#/components/items/types/implants/forms/useImplantForm.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/items/types/implants/implantUtils.ts"
import type { DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
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
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseImplantFormProps) => {
      const dialog = dialogApi.open<ImplantData>((dialogProps, ctrl) => {
        // The wrapper injects `open` at runtime; assert the type so the form
        // dialog receives it for the MUI Dialog animation.
        const injectedProps = dialogProps as DialogApiDialogProps & { open: boolean }
        return (
          <CharacterSheetProvider store={sheetContext}>
            <ImplantFormDialog {...injectedProps} {...props} onSave={ctrl.close} />
          </CharacterSheetProvider>
        )
      })

      return dialog
    },
  }
}
