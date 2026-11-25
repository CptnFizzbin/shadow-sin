# src/state — Redux store

Runner state lives here, in one Redux Toolkit store per open Runner — not in React state or Context values. The
store's shape, how it's created, and its selector/dispatch hooks are defined in this directory; see
`docs/adr/0016-unify-redux-state.md` for the design and `docs/features/0022-src-sections.md` →
"Placement rules" for what belongs in this section.

- Every write goes through a dispatched action and the domain reducers — never replace state wholesale from outside
  a reducer.
- Components and hooks dispatch Runner writes with `useRunnerStoreDispatch`
  (`src/state/runner/runnerStore.dispatch.ts`) — the one Runner dispatch hook. Don't add a parallel
  `useDispatch.withTypes` hook for the Runner store (#711).
- Store instances are stable — never re-create one on every render.
- When adding a slice, follow the layout of an existing sibling domain folder rather than inventing a new shape.
- Small ad hoc UI stores (dice, Karma-spend staging, ...) are not part of the Runner store (`src/state/runner/`):
  each gets its own `src/state/<feature>/` folder and wraps `configureStore` via the compat-store helper in
  `src/state/reduxToolkit/`. The dialog store is the exception: it sits with the dialog stack in `src/forms/dialog/`.
- The root domain type is `RunnerData`. The older `character` naming deliberately survives only in the migration
  subsystem and localStorage key literals — see `docs/adr/0001-runner-data-not-character-sheet.md`.
