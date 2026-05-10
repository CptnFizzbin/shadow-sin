import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { AnyDialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { useSinForm } from "#/components/items/types/licenses/forms/useSinForm.tsx"
import { getSinCost } from "#/components/items/types/licenses/sinUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinFormDialogProps {
  ctrl: AnyDialogCtrl
  onDelete?: () => void
  sin?: SinData
}

const SinFormDialog: FC<SinFormDialogProps> = ({ ctrl, sin, onDelete }) => {
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
      getCost={(s) => getSinCost(Number(s.rating))}
      ratingMax={6}
      options={{
        hasRating: { forced: true },
        showCost: { forced: true, enabled: false },
        showAvailability: { forced: true, enabled: false },
      }}
    />
  )
}

type UseSinFormDialogProps = Omit<SinFormDialogProps, "ctrl">

export const useSinFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseSinFormDialogProps) => dialogApi.open<SinData>(
      (ctrl) => <SinFormDialog ctrl={ctrl} {...props} />,
    ),
  }
}
