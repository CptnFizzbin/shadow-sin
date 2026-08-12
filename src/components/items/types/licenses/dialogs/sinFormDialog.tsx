import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { SinRatingField } from "#/components/items/types/licenses/sinRatingField.tsx"
import { getRandomSinName, getSinCost } from "#/components/items/types/licenses/sinUtils.ts"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useSinForm } from "#/lib/hooks/items/types/licenses/forms/useSinForm.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinFormDialogProps {
  ctrl: AnyDialogCtrl
  onDelete?: () => void
  sin?: SinData
}

export const SinFormDialog: FC<SinFormDialogProps> = ({ ctrl, sin, onDelete }) => {
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
      onDelete={onDelete}
      getCost={(s) => getSinCost(s.rating === "real" ? "real" : Number(s.rating))}
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
