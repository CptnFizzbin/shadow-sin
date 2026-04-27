import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog"
import MuiDialog from "@mui/material/Dialog"
import type { FC } from "react"

import type { DialogApiDialogProps } from "#/components/dialogs/api/dialogApiDialog.ts"

/**
 * Props for the compound `Dialog` root.
 *
 * Designed to be drop-in compatible with {@link DialogApiDialogProps}: spread
 * the props injected by `DialogApi.open(...)` directly onto this component and
 * the `open` / close-animation lifecycle is wired up automatically.
 *
 * @example
 * ```tsx
 * const MyDialog: FC<DialogApiDialogProps<boolean>> = (props) => (
 *   <Dialog {...props} fullWidth maxWidth="xs">
 *     <Dialog.Title>Are you sure?</Dialog.Title>
 *     <Dialog.Content>This cannot be undone.</Dialog.Content>
 *     <Dialog.Actions>
 *       <Button onClick={() => props.onClose(false)}>Cancel</Button>
 *       <Button onClick={() => props.onClose(true)}>Confirm</Button>
 *     </Dialog.Actions>
 *   </Dialog>
 * )
 * ```
 */
export interface DialogRootProps<TReturn = void>
  extends Omit<MuiDialogProps, "open" | "onClose">, Partial<DialogApiDialogProps<TReturn>> {
  /** Whether the dialog is open. */
  open: boolean
}

export const DialogRoot = <TReturn = void>({
  open,
  onClose,
  onClosed,
  slotProps,
  children,
  ...rest
}: DialogRootProps<TReturn>) => {
  const handleClose: MuiDialogProps["onClose"] = () => {
    onClose?.()
  }

  type TransitionSlotProps = NonNullable<NonNullable<MuiDialogProps["slotProps"]>["transition"]>
  const transitionSlotProps = slotProps?.transition as TransitionSlotProps | undefined
  const callerOnExited = (transitionSlotProps && "onExited" in transitionSlotProps)
    ? transitionSlotProps.onExited
    : undefined

  const mergedSlotProps: MuiDialogProps["slotProps"] = {
    ...slotProps,
    transition: {
      ...transitionSlotProps,
      onExited: (node) => {
        // Preserve any caller-provided onExited (e.g. form.reset()) before signalling onClosed.
        callerOnExited?.(node)
        onClosed?.()
      },
    },
  }

  return (
    <MuiDialog
      open={open}
      onClose={onClose ? handleClose : undefined}
      slotProps={mergedSlotProps}
      {...rest}
    >
      {children}
    </MuiDialog>
  )
}

;(DialogRoot as FC).displayName = "Dialog"
