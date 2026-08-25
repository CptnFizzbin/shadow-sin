# Dialog

**Location:** `src/components/ui/dialog/`
**Import:** `import { Dialog, ControlledDialog } from "#/components/ui/dialog/dialog.tsx"`

A compound modal dialog that wraps MUI's dialog family and enforces a consistent look across the application. Dialogs
are always full-width; use `maxWidth` to control how wide they can grow.

Dialogs are controlled by a `DialogCtrl<TReturn>` — a small object with `open()`, `close(value?)`, `save(value)`, and
`result()`. There is no provider, no global registry, and no per-scope mounting to get right: a `ctrl` is created
locally (via `useDialogCtrl()` or the `useDialog()` hook below) and the dialog it controls is rendered inline, right
where it's used. See `docs/adr/0004-dialog-api-goes-local-only.md` for why this replaced the old `DialogApi` pattern.

## Slots

| Slot             | Description                                                       |
|------------------|-------------------------------------------------------------------|
| `Dialog.Title`   | Header line rendered above the content area                       |
| `Dialog.Content` | Scrollable body; accepts a `dividers` prop to add separator lines |
| `Dialog.Actions` | Footer row for action buttons                                     |

## Props

### `Dialog` (root)

| Prop         | Type                                            | Default | Description                                                                              |
|--------------|--------------------------------------------------|---------|--------------------------------------------------------------------------------------|
| `open`       | `boolean`                                       | —       | Whether the dialog is visible                                                            |
| `onClose`    | `() => void`                                    | —       | Called when the dialog should close (backdrop click, Escape key, or explicit button)     |
| `onClosed`   | `() => void`                                    | —       | Called after the exit animation finishes — use this to reset form state or run cleanup   |
| `maxWidth`   | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| false` | `"sm"`  | Maximum width breakpoint                                                                 |
| `fullScreen` | `boolean`                                        | —       | Render the dialog full-screen (useful on narrow viewports)                               |

### `ControlledDialog`

| Prop         | Type                                       | Default | Description                                                                     |
|--------------|---------------------------------------------|---------|-----------------------------------------------------------------------------|
| `ctrl`       | `DialogCtrl<TReturn>`                      | —       | The control object driving `open`/`close`                                       |
| `onClose`    | `false \| ((value?: TReturn) => void)`     | —       | Omit to call `ctrl.close()`; `false` disables backdrop/Escape close; a function overrides the default (e.g. to close with a specific value) |
| `onClosed`   | `() => void`                               | —       | Called after the exit animation finishes — reset form state here                |
| ...          | `DialogRootProps` (minus `open`/`onClose`) | —       | `maxWidth`, `fullScreen`, etc.                                                   |

### `Dialog.Content`

| Prop       | Type      | Default | Description                                     |
|------------|-----------|---------|-------------------------------------------------|
| `dividers` | `boolean` | —       | Add a top and bottom border to the content area |

`Dialog.Title` and `Dialog.Actions` accept only `children`.

## Usage

### Simple inline dialog

The most direct pattern: create a `ctrl` with `useDialogCtrl()`, render `ControlledDialog` locally, and `await
ctrl.open()` from wherever you want to trigger it.

```tsx
import Button from "@mui/material/Button"

import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialogCtrl } from "#/components/ui/dialog/useDialogCtrl.ts"

export const DeleteItemButton = ({ onConfirm }: { onConfirm: () => void }) => {
  const ctrl = useDialogCtrl<boolean>()

  const handleClick = async () => {
    if (await ctrl.open()) onConfirm()
  }

  return (
    <>
      <Button color="error" onClick={handleClick}>Delete</Button>
      <ControlledDialog ctrl={ctrl} maxWidth="xs">
        <Dialog.Title>Delete item?</Dialog.Title>
        <Dialog.Content>This action cannot be undone.</Dialog.Content>
        <Dialog.Actions>
          <Button color="secondary" onClick={() => ctrl.close(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => ctrl.close(true)}>Delete</Button>
        </Dialog.Actions>
      </ControlledDialog>
    </>
  )
}
```

### Reusable dialog hook — `useDialog`

For a dialog reused across many call sites (form dialogs, confirm/alert prompts), wrap it in a `use*Dialog()` hook
built on `useDialog<TReturn, TProps>(render)`. It returns `{ open, outlet }`: `open(props)` opens the dialog and
returns a promise of the result; `outlet` is a small node the caller must render once, anywhere in its own JSX.

```tsx
import Button from "@mui/material/Button"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"

interface AddKarmaDialogProps extends ControlledDialogProps<void> {}

const AddKarmaDialog: FC<AddKarmaDialogProps> = ({ ctrl }) => {
  const form = useAppForm({
    defaultValues: { amount: 1 },
    onSubmit: ({ value }) => {
      karmaStore.addKarma(value.amount)
      ctrl.close()
    },
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>Add Karma</Dialog.Title>
      <Dialog.Content>{/* fields */}</Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button variant="contained" onClick={() => form.handleSubmit()}>Add</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAddKarmaDialog = () => useDialog<void, void>((ctrl) => <AddKarmaDialog ctrl={ctrl} />)
```

```tsx
// At the call site:
const { open, outlet } = useAddKarmaDialog()

return (
  <>
    <Button onClick={() => open()}>Add Karma</Button>
    {outlet}
  </>
)
```

For a dialog whose content varies per call (e.g. editing a specific item), add a `TProps` type — `useDialog` remounts
the rendered content fresh on every `open(props)` call, so TanStack Form's frozen `defaultValues` are never stale even
when the same hook instance is reused to edit different items:

```tsx
export const useWeaponFormDialog = () => useDialog<WeaponData, { weapon?: WeaponData }>(
  (ctrl, props) => <WeaponFormDialog ctrl={ctrl} {...props} />,
)

// At the call site:
const { open, outlet } = useWeaponFormDialog()

const handleEdit = async (weapon: WeaponData) => {
  const updated = await open({ weapon })
  if (updated) gearStore.save(updated)
}
```

### Confirm / alert prompts

`useConfirmDialog()` and `useAlertDialog()` are `useDialog`-based hooks that ship with the app for the common
confirm-before-destructive-action and error-alert cases. Both return an `outlet` node alongside their trigger function
— render it once next to whatever calls the trigger:

```tsx
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"

const { confirm, outlet } = useConfirmDialog()

const handleRemove = async () => {
  if (await confirm({ title: "Remove implant?", body: "This cannot be undone." })) {
    gearStore.remove(implant)
  }
}

return (
  <>
    <MenuItem onClick={handleRemove}>Remove</MenuItem>
    {outlet}
  </>
)
```

### Manual control — `useDialogProps`

For cases needing more control than `ControlledDialog` offers (e.g. custom close values per interaction), spread
`useDialogProps(ctrl)` directly onto the raw `Dialog` instead:

```tsx
import { useDialogProps } from "#/components/ui/dialog/useDialogProps.ts"

const ctrl = useDialogCtrl<boolean>()
const dialogProps = useDialogProps(ctrl)

return (
  <Dialog {...dialogProps} maxWidth="xs">
    <Dialog.Title>Are you sure?</Dialog.Title>
    <Dialog.Actions>
      <Button onClick={() => ctrl.close(true)}>Yes</Button>
    </Dialog.Actions>
  </Dialog>
)
```

`useDialogProps` returns a reactive `{ open, onClose }` (`onClose` defaults to `ctrl.close()`); add your own
`onClosed` after the spread for feature-level cleanup, and override `onClose` after the spread if you need a
non-default close value.

### Fully inline `useState` dialog

For a one-off dialog with no reusable `ctrl` semantics at all — e.g. no need to `await` a result — plain `useState`
is still the simplest option:

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

If this pattern reuses a single mounted instance to edit different targets (like `SpiritList` does), add
`key={item?.id ?? "new"}` to the `Dialog` element so it remounts (and re-initializes any form) when the target
changes — see `AGENTS.md` → *TanStack Form*. `useDialog`-based dialogs don't need this since they remount
automatically on every `open()` call (the outlet always renders fresh).

## Guidelines

- **Prefer `useDialog` + a `use*Dialog` hook** for any dialog used from more than one place, or whose content varies
  per call. Use the plain inline `ControlledDialog` pattern for genuinely one-off dialogs.
- Every dialog renders at its caller's real position in the tree — React context (`CharacterSheetProvider`, etc.)
  propagates normally with no provider or scoping to set up.
- **`onClosed` vs `onClose`**: `onClose` triggers the close animation; `onClosed` fires after it finishes. Reset form
  state in `onClosed` to avoid a flash of empty fields while the animation runs.
- **`maxWidth`**: default is `"sm"`. Use `"xs"` for simple confirmation prompts and `"md"` / `"lg"` for complex forms
  with many fields.
- **Do not** pass `sx`, `className`, `slotProps`, or other MUI styling props — they are intentionally not forwarded so
  dialog appearance stays consistent.
