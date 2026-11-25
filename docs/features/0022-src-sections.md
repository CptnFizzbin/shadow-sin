# Source Sections

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> - #766 — move every file into its section, with moves and renames only

`src/` is divided into **sections**, one folder per layer: `common`, `data`, `rules`, `state`, `ui`, `forms` and
`app`. Each section is a future Yarn workspace package. Organising the code by section first makes that later
split a mechanical step. It also makes the code that sits in the wrong layer visible today.

## Placement rules

Check the sections from the bottom up. A file goes in the first section whose test it passes.

| Section | Test | Examples |
|---|---|---|
| `common` | Would it make sense in a non-Shadowrun app? Plain TypeScript, with no React, Redux or MUI | id helpers, array and number helpers, type utilities |
| `data` | Does it describe the *shape* of stored Runner data? Stores no derived values | types, Zod schemas, factories and defaults, migrations, import/export serialization, fixtures |
| `rules` | Does the rulebook define it? A pure function from data to an answer. No React, no Redux | formulas, dice pools, karma and essence costs, what an optional rule changes |
| `state` | Does it hold or change Runner state over time? No MUI | slices, actions, selectors, ad hoc stores, persistence, store hooks and contexts |
| `ui` | Would it look the same in a non-Shadowrun app? No domain types, no Redux | MUI wrappers, theme, layout primitives |
| `forms` | Is it a reusable form field or form building block? | currency and duration fields, the skill picker, shared field groups, the app-form setup |
| `app` | Does it compose the sections above? | routes, page and domain components, dialog orchestration |

Optional rules are split across three sections: the flag definitions go in `data`, what each rule changes goes in
`rules`, and the toggle state goes in `state`.

Inside a section, the top-level folders are feature areas, such as `rules/karma` or `ui/cards`. The app entry
points (`main.tsx`, `router.ts`, `routeTree.gen.ts`, `env.ts`) stay at the root of `src/`.

## Allowed imports

Imports go one way, down the layers. An arrow means "may import from".

- `common` → nothing
- `data` → `common`
- `rules` → `data`, `common`
- `state` → `rules`, `data`, `common`
- `ui` → `common`
- `forms` → `ui`, `state`, `rules`, `data`, `common`; only `app` imports `forms`
- `app` → every section

Nothing enforces these rules yet. Code that breaks them is tracked under Open Questions until it is untangled.

## Open Questions

- [ ] Which files must be split before every import goes downward? The known cases include the Runner utilities,
  the improvement utilities, the builder gear utilities, the defense calculator data, the export utilities, and
  the entity card slot manager and elements. Each one was placed whole in the section that fits most of its content.
- [ ] The Runner factory in `data` reads attribute defaults from `rules`. Should those defaults move into `data`,
  or should the factory carry literal defaults instead?
- [ ] The dialog stack sits in `forms` because it keeps its state in Redux and uses the router. Should it move to
  `ui` once its store no longer uses Redux?
- [ ] Should `ui` be allowed to depend on the router?
- [ ] How should ESLint enforce the allowed imports between sections?

## Constraints

- Moving a migration changes only its import paths, never its logic. The dated migrations live in their own
  folder, so the CI migration-timestamp check never mistakes a helper file for a migration.
- `routeTree.gen.ts` is generated. The router plugin is configured to read routes from `app/routes`.

## Out of Scope

- Splitting files or changing behaviour. This step is moves and renames only.
- Turning sections into Yarn workspace packages with their own entry points.

## Related Features

- [`docs/features/0017-top-level-directory-restructuring.md`](./0017-top-level-directory-restructuring.md): the
  container layout that these sections replace
