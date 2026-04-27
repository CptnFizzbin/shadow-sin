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
 * Compound `Dialog` component wrapping MUI's dialog family with a consistent
 * look and only functional props exposed. Dialogs are always full-width;
 * use `maxWidth` to control the maximum size (default `"sm"`).
 *
 * Compatible with `DialogApiDialogProps` — spread the props injected by
 * `DialogApi.open(...)` directly onto the component.
 *
 * Slot components:
 * - `Dialog.Title` — header text
 * - `Dialog.Content` — scrollable body (accepts `dividers` prop)
 * - `Dialog.Actions` — footer button row
 *
 * See `docs/ui/dialog.md` for detailed examples.
 */
export const Dialog = DialogRoot as DialogComponent
Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Actions = DialogActions

export type { DialogRootProps as DialogProps } from "#/components/ui/dialog/dialogRoot.tsx"
