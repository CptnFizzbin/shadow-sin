# src/components — React components

- One React component per `.tsx` file — including small internal helpers.
- Functional components as a named exported const with an explicit props interface
  (`export const Header: FC<Props> = ({ ... }) => { ... }`). No class components or default anonymous exports.

## Reading and writing state

- Read Runner state reactively through the selector hooks in `src/state/` and write through dispatched actions, so
  every write goes through the domain reducers. Never read a store snapshot (`getState()` or equivalent) in a
  component — it won't re-render when the state changes.
- Read ad hoc stores (from `src/services/`) with `useSelector(store, selector)` from `src/integrations/reduxToolkit/`.
  `@tanstack/react-store`'s `useSelector` is only for `@tanstack/react-form`'s own internal form stores — never for
  ours.

## MUI

Only pass MUI style props that deviate from the theme defaults, and use MUI CSS variables (not palette callbacks) for
theme-responsive styles. Read the full rules in `.agents/guidelines/mui.md` before writing or editing MUI code:

@../../.agents/guidelines/mui.md

## Dialogs and forms

- New dialogs use a `use*Dialog` hook built on `useDialog`, which returns `{ open, outlet }`. There is no provider or
  global registry — render the returned `outlet` once, next to whatever calls `open(props)`. Keep the returned object
  named rather than destructuring it:
  ```tsx
  const addKarmaDialog = useAddKarmaDialog()

  return (
    <>
      <Button onClick={() => addKarmaDialog.open()}>Add Karma</Button>
      {addKarmaDialog.outlet}
    </>
  )
  ```
  Because dialogs render at the caller's real tree position, React context propagates normally. See
  `docs/ui/dialog.md` for the `Dialog`/`ControlledDialog` components and confirmation prompts, and
  `docs/adr/0004-dialog-api-goes-local-only.md` for the rationale.
- `useDialog` remounts its content fresh on every `open(props)` call, so each open gets a brand-new form.
- TanStack Form's `defaultValues` are frozen at first mount — the form doesn't reset when props change. For a
  hand-rolled dialog that doesn't go through `useDialog`, add `key={item?.id ?? "new"}` to the dialog element so it
  remounts when the target item changes.
- Wire submit buttons as `onClick={() => form.handleSubmit()}`, not `onClick={form.handleSubmit}`, to avoid
  forwarding the click event.

Screenshot requirements for visual changes are in the root `AGENTS.md` → "UI changes".
