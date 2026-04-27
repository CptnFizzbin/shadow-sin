import { DialogActions } from "#/components/ui/dialog/dialogActions.tsx"
import { DialogContent } from "#/components/ui/dialog/dialogContent.tsx"
import type { DialogRootProps } from "#/components/ui/dialog/dialogRoot.tsx"
import { DialogRoot } from "#/components/ui/dialog/dialogRoot.tsx"
import { DialogTitle } from "#/components/ui/dialog/dialogTitle.tsx"

interface DialogComponent {
  <TReturn = void>(props: DialogRootProps<TReturn>): ReturnType<typeof DialogRoot<TReturn>>
  Title: typeof DialogTitle
  Content: typeof DialogContent
  Actions: typeof DialogActions
}

/**
 * Compound `Dialog` component that wraps MUI's `Dialog` and is compatible with
 * `DialogApiDialogProps` — `open`, `onClose`, and `onClosed` can be spread
 * directly onto it from a dialog opened via `DialogApi.open(...)`.
 *
 * Compose the dialog using the static slot components:
 * - `Dialog.Title` — header (wraps MUI `DialogTitle`)
 * - `Dialog.Content` — body (wraps MUI `DialogContent`)
 * - `Dialog.Actions` — footer buttons row (wraps MUI `DialogActions`)
 *
 * @example
 * ```tsx
 * const ConfirmDialog: FC<DialogApiDialogProps<boolean>> = (props) => (
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
export const Dialog = DialogRoot as DialogComponent
Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Actions = DialogActions

export type { DialogRootProps as DialogProps } from "#/components/ui/dialog/dialogRoot.tsx"
