import { useMemo } from "react"

import { DialogCtrl } from "./api/dialogCtrl.ts"

/**
 * Creates a stable `DialogCtrl<TReturn>` for use with inline dialogs that need
 * access to React context (e.g. `CharacterSheetProvider`), since `DialogApi`
 * renders outside the provider tree.
 *
 * The ctrl is memoised for the lifetime of the component.
 *
 * @example
 * ```tsx
 * const confirmCtrl = useDialogCtrl<boolean>()
 *
 * const handleDelete = async () => {
 *   const { result } = confirmCtrl.open()
 *   if (await result) deleteItem()
 * }
 *
 * return (
 *   <>
 *     <Button onClick={handleDelete}>Delete</Button>
 *     <ConfirmDialog ctrl={confirmCtrl} title="Delete?" body="This cannot be undone." />
 *   </>
 * )
 * ```
 */
export const useDialogCtrl = <TReturn = void>(): DialogCtrl<TReturn> => {
  return useMemo(() => new DialogCtrl<TReturn>(), [])
}
