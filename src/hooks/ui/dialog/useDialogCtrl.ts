import { useEffect, useState } from "react"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"

export function useDialogCtrl<TReturn>() {
  const [ctrl] = useState(() => new DialogCtrl<TReturn>())
  useEffect(() => () => ctrl.dispose(), [ctrl])
  return ctrl
}
