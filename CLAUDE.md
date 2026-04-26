# Claude workspace instructions — ShadowSIN

> Sourced from `.github/copilot-instructions.md`. Update both files when conventions change.

- Don't use short or ambiguous variable names. Prefer descriptive identifiers (for example `characterHealth` instead of `hp`, `damageThreshold` instead of `dt`). Short names are acceptable only for well-known conventions (`id`, `ok`, `vs`) or in tiny local scopes where a longer name reduces clarity.
- One React component per `.tsx` file. Combine a tiny helper with the main component only when the helper is trivial and used exclusively by the parent (no props, pure presentational fragment). Otherwise, place each component in its own file and export it.
- Prefer functional React components using a named exported const with an explicit props interface (e.g. `export const Header: FC<Props> = ({ ... }) => { ... }`). Avoid class components and default anonymous exports.

## Formatting and tooling

- ESLint + @stylistic for formatting. 2 spaces indentation, double quotes for JS/TS strings.
- Path alias `#/` maps to `src/`. Respect it in all imports.
- After making changes, verify with `yarn fix` (auto-fix lint/format). Must pass before a change is complete.

## TanStack Store patterns

- **Store objects are stable** — do not re-create store instances on every render. Use `useMemo` or module-level singletons.
- **Reactivity requires `useSelector`** — reading directly off a store instance (e.g. `store.state.foo`) gives a snapshot and will not trigger re-renders. Always use `useSelector(store, selector)` for reactive reads:
  ```ts
  // ✅ reactive
  const max = useSelector(edgeStore, (state) => state.max)

  // ❌ snapshot only — stale after first render
  const max = edgeStore.state.max
  ```
- `StoreSlice` instances work with `useSelector` the same way.

## MUI v9 CSS variables

- `colorSchemeSelector: "data"` is active. Palette callbacks like `(t) => t.palette.background.paper` return static hex values, not CSS variables — they will not respond to theme/color-scheme changes.
- Use CSS variable strings directly for theme-responsive styles: `"var(--mui-palette-background-paper)"`.
- For opacity tints use channel variables: `"rgba(var(--mui-palette-error-mainChannel) / 0.15)"`.

## Dialog patterns

- Prefer inline `useState`-managed dialogs (open/closed state in the parent component) over `dialogApi` for dialogs that need access to `CharacterSheetProvider` or other React context, since `dialogApi` renders outside the provider tree.
- Use `useConfirmDialog()` from `#/components/dialogs/confirmDialog.tsx` for confirmation prompts before destructive actions.

## TanStack Form

- `defaultValues` are frozen at first mount — the form does not reset when props change. For dialogs that reuse a single mounted instance, add `key={item?.id ?? "new"}` to the dialog component element so it remounts (and re-initializes the form) when the target item changes.
- When the form's `onSubmit` is wired to a button, wrap it: `onClick={() => form.handleSubmit()}` rather than `onClick={form.handleSubmit}` to avoid forwarding the click event.
