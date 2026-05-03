# Dialog

**Location:** `src/components/ui/dialog/dialog.tsx`
**Import:** `import { Dialog } from "#/components/ui/dialog/dialog.tsx"`

A compound modal dialog that wraps MUI's dialog family and enforces a
consistent look across the application. Dialogs are always full-width;
use `maxWidth` to control how wide they can grow.

## Slots

| Slot             | Description                                                       |
|------------------|-------------------------------------------------------------------|
| `Dialog.Title`   | Header line rendered above the content area                       |
| `Dialog.Content` | Scrollable body; accepts a `dividers` prop to add separator lines |
| `Dialog.Actions` | Footer row for action buttons                                     |

## Props

### `Dialog` (root)

| Prop         | Type                                            | Default | Description                                                                              |
|--------------|-------------------------------------------------|---------|------------------------------------------------------------------------------------------|
| `open`       | `boolean`                                       | —       | Whether the dialog is visible                                                            |
| `onClose`    | `(value?: TReturn) => void`                     | —       | Called when the dialog should close (backdrop click, Escape key, or explicit button)     |
| `onClosed`   | `() => void`                                    | —       | Called after the exit animation finishes — use this to unmount form state or run cleanup |
| `maxWidth`   | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| false` | `"sm"`  | Maximum width breakpoint                                                                 |
| `fullScreen` | `boolean`                                       | —       | Render the dialog full-screen (useful on narrow viewports)                               |

### `Dialog.Content`

| Prop       | Type      | Default | Description                                     |
|------------|-----------|---------|-------------------------------------------------|
| `dividers` | `boolean` | —       | Add a top and bottom border to the content area |

`Dialog.Title` and `Dialog.Actions` accept only `children`.

## Usage

### Simple confirmation dialog

```tsx
import Button from "@mui/material/Button"
import type { FC } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"

interface ConfirmDeleteDialogProps {
  open: boolean
  onClose: () => void
  onClosed: () => void
  onConfirm: () => void
}

export const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onClosed,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose} onClosed={onClosed} maxWidth="xs">
    <Dialog.Title>Delete item?</Dialog.Title>
    <Dialog.Content>This action cannot be undone.</Dialog.Content>
    <Dialog.Actions>
      <Button color="secondary" onClick={onClose}>Cancel</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
    </Dialog.Actions>
  </Dialog>
)
```

### With `DialogApiDialogProps` (via `DialogApi`)

`Dialog` is directly compatible with `DialogApiDialogProps` — spread the props
injected by `DialogApi.open(...)` straight onto the component.

```tsx
import Button from "@mui/material/Button"
import type { FC } from "react"

import type { DialogApiDialogProps } from "#/components/dialogs/api/dialogApiDialog.ts"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"

export const ConfirmDialog: FC<DialogApiDialogProps<boolean>> = (props) => (
  <Dialog {...props} maxWidth="xs">
    <Dialog.Title>Are you sure?</Dialog.Title>
    <Dialog.Content>This cannot be undone.</Dialog.Content>
    <Dialog.Actions>
      <Button color="secondary" onClick={() => props.onClose(false)}>Cancel</Button>
      <Button color="error" variant="contained" onClick={() => props.onClose(true)}>Delete</Button>
    </Dialog.Actions>
  </Dialog>
)

// Open it from any event handler — no JSX or local state required:
const ctrl = dialogApi.open<boolean>(ConfirmDialog)
const confirmed = await ctrl.result()
```

### With a form and cleanup on close

Use `onClosed` (runs after the exit animation) to reset form state so the
previous values are gone before the dialog can be opened again.

```tsx
import Button from "@mui/material/Button"
import type { FC } from "react"

import type { DialogApiDialogProps } from "#/components/dialogs/api/dialogApiDialog.ts"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"

export const AddNoteDialog: FC<DialogApiDialogProps> = ({ open, onClose, onClosed }) => {
  const form = useAppForm({
    defaultValues: { text: "" },
    onSubmit: ({ value }) => {
      saveNote(value.text)
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClosed={() => {
        form.reset()
        onClosed()
      }}
    >
      <Dialog.Title>Add note</Dialog.Title>
      <Dialog.Content dividers>
        <form.AppForm>
          {/* fields */}
        </form.AppForm>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => form.handleSubmit()}>Save</Button>
      </Dialog.Actions>
    </Dialog>
  )
}
```

> **TanStack Form note:** `defaultValues` are frozen at first mount. For
> dialogs that reuse a single mounted instance add `key={item?.id ?? "new"}` to
> the `Dialog` element so the form re-initialises when the target item changes.

### Inline `useState` dialog (no `DialogApi`)

Prefer this pattern when the dialog needs access to `CharacterSheetProvider`
or other React context (since `DialogApi` renders outside the provider tree).

```tsx
import Button from "@mui/material/Button"
import { useState } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"

export const ExamplePage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Open</Button>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onClosed={() => {/* optional cleanup */}}
        maxWidth="xs"
      >
        <Dialog.Title>Hello</Dialog.Title>
        <Dialog.Content>Some content here.</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
```

## Guidelines

- **Prefer inline `useState` dialogs** over `DialogApi` when the dialog needs
  access to `CharacterSheetProvider` or other React context — `DialogApi`
  renders outside the provider tree. See `AGENTS.md` → *Dialog patterns*.
- **`onClosed` vs `onClose`**: `onClose` triggers the close animation;
  `onClosed` fires after it finishes. Reset form state in `onClosed` to avoid
  a flash of empty fields while the animation runs.
- **`maxWidth`**: default is `"sm"`. Use `"xs"` for simple confirmation prompts
  and `"md"` / `"lg"` for complex forms with many fields.
- **Do not** pass `sx`, `className`, `slotProps`, or other MUI styling props —
  they are intentionally not forwarded so dialog appearance stays consistent.
