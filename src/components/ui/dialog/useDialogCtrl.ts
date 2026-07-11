import { useState } from "react"

import { DialogCtrl } from "./dialogCtrl.ts"

export function useDialogCtrl<TReturn>() {
  const [ctrl] = useState(() => new DialogCtrl<TReturn>())
  return ctrl
}
