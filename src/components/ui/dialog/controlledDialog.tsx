import type { ReactNode } from "react"

import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"

import type { ControlledDialogProps } from "./controlledDialogProps.ts"
import type { DialogRootProps } from "./dialogRoot.tsx"
import { DialogRoot } from "./dialogRoot.tsx"

type ControlledDialogOwnProps<TReturn> = ControlledDialogProps<TReturn> & {
  onClosed?: () => void
  children?: ReactNode
}

/**
 * Wraps `Dialog` and wires the ctrl lifecycle automatically.
 * Reads `ctrl.store` for the open state.
 *
 * @example Inline usage
 * ```tsx
 * const confirmCtrl = useMemo(() => new DialogCtrl<boolean>(), [])
 *
 * return (
 *   <>
 *     <Button onClick={() => confirmCtrl.open()}>Open</Button>
 *     <ControlledDialog ctrl={confirmCtrl} maxWidth="xs">
 *       <Dialog.Title>Are you sure?</Dialog.Title>
 *       <Dialog.Actions>
 *         <Button onClick={() => confirmCtrl.close(false)}>Cancel</Button>
 *         <Button onClick={() => confirmCtrl.close(true)}>Confirm</Button>
 *       </Dialog.Actions>
 *     </ControlledDialog>
 *   </>
 * )
 * ```
 */
export const ControlledDialog = <TReturn = void>({
  ctrl,
  onClose,
  onClosed,
  children,
  ...dialogProps
}: ControlledDialogOwnProps<TReturn> & Omit<DialogRootProps, "open" | "onClose" | "onClosed">) => {
  const isOpen = useSelector(ctrl.store, (state) => state.open)

  const handleClose =
    onClose === false
      ? undefined
      : () => {
          if (typeof onClose === "function") {
            onClose()
          } else {
            ctrl.close()
          }
        }

  return (
    <DialogRoot
      open={isOpen}
      onClose={handleClose}
      onClosed={onClosed}
      {...dialogProps}
    >
      {children}
    </DialogRoot>
  )
}
