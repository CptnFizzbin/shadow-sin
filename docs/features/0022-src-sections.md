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

Inside a section, the top-level folders are feature areas, such as `rules/karma` or `ui/cards`. Two sections don't
follow this yet: `app` keeps its technical split (`components`, `hooks`, `routes`, ...), and `state` keeps the
Runner store's root files beside its feature folders. The app entry points (`main.tsx`, `router.ts`,
`routeTree.gen.ts`, `env.ts`) stay at the root of `src/`.

Each section is imported through its own path alias, such as `#data/` or `#rules/`. The alias stands in for the
section's future package name.

## Allowed imports

Imports go one way, down the layers. An arrow means "may import from".

- `common` → nothing
- `data` → `common`
- `rules` → `data`, `common`
- `state` → `rules`, `data`, `common`
- `ui` → `common`
- `forms` → `ui`, `state`, `rules`, `data`, `common`; only `app` imports `forms`
- `app` → every section

Tests follow the same rules as the code they sit beside. A test that renders a component from a higher section
belongs in that section.

Nothing enforces these rules yet. Code that breaks them is tracked under Open Questions until it is untangled.

## Open Questions

- [ ] Should the Runner utilities and the export utilities be split? Each one was placed whole in the section that
  fits most of its content.
- [ ] Some entity card elements are domain-free and would pass the `ui` test, but ADR-0010 keeps every element in
  one folder, so they all sit in `app`. Should the generic ones move to `ui` under a superseding ADR?
- [ ] The dialog stack sits in `forms` because it keeps its state in Redux and uses the router. Should it move to
  `ui` once its store no longer uses Redux?
- [ ] Should `ui` be allowed to depend on the router?
- [ ] How should ESLint enforce the allowed imports between sections? The rule against `#/<section>/` imports
  checks static imports only, not dynamic imports or `vi.mock` paths.
- [ ] What will each package expose? If packages offer only named entry points instead of deep imports, the deep
  `#<section>/...` imports must move to those entry points when the sections become packages.
- [ ] Should `app` be regrouped into feature areas? Its `components/ui/` folder (cards, navigation, header, quick
  panel) is also easy to confuse with the `ui` section.

## Constraints

- Moving a migration changes only its import paths, never its logic. The dated migrations live in their own
  folder, so the CI migration-timestamp check never mistakes a helper file for a migration.
- `routeTree.gen.ts` is generated. The router plugin is configured to read routes from `app/routes`.

## Out of Scope

- Changing behaviour. Files are moved, renamed or split, never rewritten.
- Turning sections into Yarn workspace packages with their own entry points.

## Related Features

- [`docs/features/0017-top-level-directory-restructuring.md`](./0017-top-level-directory-restructuring.md): the
  container layout that these sections replace
