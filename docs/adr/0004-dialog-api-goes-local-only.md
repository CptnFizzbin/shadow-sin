# Dialogs are declared locally; there is no global dialog registry

`DialogApi` + `DialogApiProvider` let any component open a dialog via `dialogApi.open(factory)`
without declaring its JSX locally — the dialog was mounted into a Tanstack Store keyed map and
rendered by whichever `DialogApiProvider` sat above it. This worked, but a dialog opened this way
only inherits the React context available at the *Provider's* position in the tree, not the
calling component's position. Any dialog whose content needed context not available at the
Provider (e.g. `useCharacterSheetContext()`) threw `OutOfContextError`, caught by a dedicated
`DialogErrorBoundary`. The practical fix was to scope a `DialogApiProvider` inside every context
boundary a dialog might need — one at the app root, one per character route, one in the builder
root — with correctness depending on providers being nested in exactly the right order. This
scoping requirement was the direct cause of recurring bugs and grew harder to reason about as
more context providers were introduced.

We removed `DialogApi`, `DialogApiProvider`, the dialog store, and `DialogErrorBoundary` entirely.
Every dialog is now declared inline in the component that opens it: a `DialogCtrl` instance
(via `useDialogCtrl()`) is handed to `ControlledDialog` (or spread via `useDialogProps(ctrl)` onto
the raw `Dialog` for manual control), and awaited with `await ctrl.open()`. A dialog rendered this
way sits at its caller's actual tree position, so it inherits real context automatically — the
provider-scoping problem cannot occur by construction, because there is no separate mount point to
scope. A shared `useDialog<TReturn, TProps>(render)` hook removes the remaining boilerplate for
reusable `use*Dialog()`-style hooks (`useConfirmDialog`, `useAddKarmaDialog`,
`useWeaponFormDialog`, etc.), returning `{ open, dialog }`, where `dialog` is a small node the
caller renders once alongside its trigger.

Two follow-on problems surfaced once real dialog call sites (not just the simple static ones) were
checked against this shape, both stemming from the same root cause: `DialogApi.open()` used to
mount a **brand-new** component instance and a **brand-new** `DialogCtrl` on every single call,
so nothing was ever reused across opens. `useDialog` instead creates its ctrl once (via
`useDialogCtrl()`) and reuses it across every `open()` call on that hook instance — which is
exactly what makes `{ open, dialog }` renderable once and left alone, but it silently drops two
guarantees the old per-call-fresh-instance behavior gave for free:

1. **Frozen form defaults.** ~30 of the ~40 dialogs in the app are TanStack-Form dialogs
   (`useWeaponFormDialog().open({ weapon })`, `useItemFormDialog().open({ item })`, etc.) whose
   `defaultValues` freeze at first mount. Under the old system this never mattered — a fresh
   mount happened on every `open()` call. Under a naively-reused `dialog` node, editing Weapon A
   then Weapon B without an intervening full remount would silently show Weapon A's stale form
   values. Fix: `useDialog<TReturn, TProps>(render: (ctrl, props: TProps) => ReactNode)` takes a
   `TProps` generic and wraps its rendered output in a `Fragment` keyed by an internal counter that
   increments on every `open(props)` call — forcing a fresh mount each time, matching the old
   per-call-fresh-instance behavior exactly, transparently, with no per-call-site key management
   required.
2. **Stale in-flight promises.** Because the ctrl is now reused across calls rather than created
   fresh per call, calling `open()` a second time before a first call's returned promise has
   resolved would silently orphan the first promise forever (`DialogCtrl.open()` overwrites its
   internal `resolve` reference). Fix: `DialogCtrl.open()` now resolves any still-pending previous
   promise with `undefined` before starting a new one — the same "safe to call again at any time"
   guarantee `close()` already documents.

## Considered Options

- **Keep `DialogApi`, fix the scoping problem some other way** — e.g. a single global provider
  plus a mechanism to re-inject context into imperatively-mounted trees. Rejected: no clean way to
  "teleport" arbitrary ambient context to a different mount point without re-threading every
  context a dialog might ever need through the API itself, which is worse than the problem it
  solves.
- **Local-only ctrl + inline JSX** ✅ — trades the "open a dialog from anywhere with zero local
  JSX" ergonomic for dialogs always inheriting correct context by construction. The remaining
  boilerplate (one extra element per call site) is small and mechanical, and is itself reduced by
  `useDialog()`.

## Consequences

- There is no longer any need to reason about where a `DialogApiProvider` is mounted relative to
  other context providers — that whole class of bug is gone.
- Every `use*Dialog()`-style hook returns `{ open, dialog }` instead of just `{ open }`; callers
  must render the returned `dialog` node once, typically right next to the trigger that calls
  `open()`.
- `open()` always takes whatever `TProps` the underlying dialog component needs, and always
  remounts that component fresh — the `AGENTS.md` "TanStack Form" guidance about manually adding
  `key={item?.id ?? "new"}` no longer applies to `useDialog`-based dialogs; it still applies to
  hand-rolled inline `useState` dialogs that don't go through `useDialog` (e.g. `SpiritList`).
- `DialogCtrl` no longer has an `onClosed()` method, an `onClosedCallback`, or a safety timeout —
  those existed only to evict entries from the now-deleted global store. The `onClosed` *prop* on
  `Dialog`/`ControlledDialog` (for feature-level cleanup like `form.reset()` after the exit
  animation) is unaffected and still fires normally.
- A dialog's own hooks can no longer throw `OutOfContextError` from being mounted outside their
  needed context, since dialogs are always rendered inline at the caller's real tree position; a
  genuinely misused hook now just throws like anywhere else in the app.
