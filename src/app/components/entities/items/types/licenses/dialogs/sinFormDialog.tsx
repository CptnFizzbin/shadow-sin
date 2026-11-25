import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { SinRatingField } from "#app/components/entities/items/types/licenses/sinRatingField.tsx"
import type { SinData } from "#data/items/sinData.ts"
import { useSinForm } from "#forms/items/types/licenses/useSinForm.tsx"
import { getRandomSinName, getSinCost } from "#rules/items/sinUtils.ts"
import type { AnyDialogCtrl } from "#ui/dialog/dialogCtrl.ts"
import { useDialog } from "#ui/dialog/useDialog.tsx"

interface SinFormDialogProps {
  ctrl: AnyDialogCtrl
  onDelete?: () => void
  sin?: SinData
  wizard?: boolean
}

export const SinFormDialog: FC<SinFormDialogProps> = ({ ctrl, sin, onDelete, wizard }) => {
  const title = sin ? "Edit SIN" : "Create SIN"

  const form = useSinForm({
    sin,
    onSubmit: (sinData) => ctrl.close(sinData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      onDelete={onDelete}
      getCost={(s) => {
        const sinValues = s as SinData
        return getSinCost(sinValues.isReal, sinValues.rating ?? 0)
      }}
      ratingMax={6}
      onRandomizeName={getRandomSinName}
      slots={{
        rating: () => <SinRatingField form={form} />,
      }}
      options={{
        hasRating: { forced: true, enabled: false },
        showCost: { forced: true, enabled: false },
        showAvailability: { forced: true, enabled: false },
      }}
    />
  )
}

type UseSinFormDialogProps = Omit<SinFormDialogProps, "ctrl">

export const useSinFormDialog = () => useDialog<SinData, UseSinFormDialogProps | undefined>(
  (ctrl, props) => <SinFormDialog ctrl={ctrl} {...props} />,
)
