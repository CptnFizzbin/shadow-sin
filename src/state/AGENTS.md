# src/state — Redux store

Runner state lives here, in one Redux Toolkit store per open Runner — not in React state or Context values. The
store's shape, how it's created, and its selector/dispatch hooks are defined in this directory; see
`docs/adr/0016-unify-redux-state.md` for the design and `docs/features/0017-top-level-directory-restructuring.md` →
"Container definitions" for how slices are laid out.

- Every write goes through a dispatched action and the domain reducers — never replace state wholesale from outside
  a reducer.
- Store instances are stable — never re-create one on every render.
- When adding a slice, follow the layout of an existing sibling domain folder rather than inventing a new shape.
- Small ad hoc UI stores (dice, dialogs, Karma-spend staging, ...) don't live here: they sit in
  `src/services/<feature>/` and wrap `configureStore` via the compat-store helper in `src/integrations/reduxToolkit/`.
- The root domain type is `RunnerData`. The older `character` naming deliberately survives only in the migration
  subsystem and localStorage key literals — see `docs/adr/0001-runner-data-not-character-sheet.md`.
