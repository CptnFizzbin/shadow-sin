---
applyTo: "**"
---

# Code style — ShadowSIN

## Formatting

- 2-space indentation (enforced via `.editorconfig` + Prettier)
- Double quotes for all JS/TS strings
- No trailing semicolons (`semicolons: "asNeeded"`)
- Trailing commas everywhere (`trailingCommas: "all"`)
- All local imports **must** include `.ts` / `.tsx` extensions

```ts
// ✅
import { useCharacterStore } from "#/components/Character/CharacterStoreProvider.tsx"
// ❌
import { useCharacterStore } from "#/components/Character/CharacterStoreProvider"
```

## Imports

- Use `import type { ... }` for type-only imports
- Use deep MUI imports — avoids barrel-import overhead

```ts
// ✅
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
// ❌
import { Stack, Typography } from "@mui/material"
```

- Group order (Biome `organizeImports: on` handles this automatically):
  1. External packages
  2. Internal `#/` aliases
  3. Relative imports

## React components

- One component per `.tsx` file. A trivial, no-prop presentational helper may live alongside its parent only if it is
  never reused.
- Named export + explicit props interface. No default exports, no anonymous components.

```tsx
// ✅ canonical pattern — see src/components/UI/Header.tsx
interface HeaderProps {
  character?: PlayerCharacterData
}

export const Header: FC<HeaderProps> = ({ character }) => { ... }
```

- Export props interfaces when they may be consumed by callers (e.g. when a parent spreads them).
- Avoid `React.FC` — import `FC` and `type` directly from `"react"`.

## Custom hooks

- File name uses `Use` prefix with PascalCase (e.g. `UseCharacterForm.ts`, `UseAttribute.ts`).
- Export a `ReturnType<typeof useXxx>` alias when callers need the hook's return type.

```ts
export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>
```

- Extract all non-trivial derived state and event handlers into a custom hook; keep JSX lean.

## Naming

- Prefer long, descriptive names over abbreviations — `characterAlias`, `bpSpent`, `bpLabel`.
- Short names only for universal conventions (`id`, `ok`, `vs`) or tiny local scopes.
- Boolean variables/props: `is` / `has` prefix (`isBpPanelExpanded`, `hasMountedRef`).

## TypeScript

- Prefer `interface` for object shapes and component props; use `type` for unions, aliases, and mapped types.
- Pair runtime-validated data with a Zod schema named `{TypeName}Schema` using `satisfies z.ZodType<Type>`:

```ts
export const QualityDataSchema = z.object({ ... }) satisfies z.ZodType<QualityData>
```

- Avoid `any`; add a `// biome-ignore` comment with a justification when it is unavoidable.

## Context pattern

Null-initialize context, guard in the consuming hook, throw a descriptive error if used outside the provider:

```ts
const MyContext = createContext<Store<T> | null>(null)

export function useMyContext (): Store<T> {
  const value = useContext(MyContext)
  if (!value) throw new Error("useMyContext must be used within a MyProvider")
  return value
}
```

## Utilities and pure functions

- Export pure utilities as named `const` arrow functions.
- Guard against edge cases (divide-by-zero, out-of-range) explicitly — see `src/lib/ProgressUtils.ts`.

## React Compiler

`babel-plugin-react-compiler` is active. Do **not** add manual `useMemo` / `useCallback` unless the compiler provably
cannot handle the case — annotate with a comment explaining why.
