# Fallow Refactor Tickets

Copy-pastable GitHub issue drafts based on the Fallow analysis run on April 29, 2026.

Use each section as:

1. Copy the suggested title into the GitHub issue title field.
2. Copy the fenced markdown block into the GitHub issue body.
3. Adjust labels / priority to match current sprint reality.

---

## Ticket 1 — Break circular imports in the character sheet store layer

**Suggested title:** Break circular imports between character sheet providers and selectors

```md
## Summary

Fallow reported circular dependencies in the character sheet store layer:

- `src/components/character/sheet/characterAttributesProvider.tsx`
- `src/components/character/sheet/characterSheet.selectors.ts`
- `src/components/character/sheet/characterSheetProvider.tsx`

There is also a direct cycle between:

- `src/components/character/sheet/characterSheet.selectors.ts`
- `src/components/character/sheet/characterSheetProvider.tsx`

These cycles make the module graph harder to reason about and create a risk of initialization-order bugs. The goal is to extract shared logic into a neutral module so selectors and providers no longer import each other.

## Scope

- Audit imports across the three files above
- Move shared selector/store helpers into a separate non-React module if needed
- Preserve the current public API used by calling components
- Re-run Fallow dead-code checks for circular dependencies after the refactor

## Acceptance Criteria

- [ ] `fallow dead-code --circular-deps` reports no cycles in this area
- [ ] `characterSheetProvider` and selector modules no longer import each other directly or indirectly
- [ ] Existing behavior of `useCharacterSheet(...)` and related selector helpers remains unchanged
- [ ] Relevant tests pass
```

---

## Ticket 2 — Consolidate duplicate form field exports

**Suggested title:** Consolidate duplicate `CounterField` and `NuyenField` exports

```md
## Summary

Fallow flagged duplicate exports for two component names:

- `CounterField`
  - `src/components/ui/counter/counterField.tsx`
  - `src/integrations/tanstackForm/fields/counterField.tsx`
- `NuyenField`
  - `src/components/ui/form/fields/nuyenField.tsx`
  - `src/integrations/tanstackForm/fields/nuyenField.tsx`

The current naming makes it easy to import the wrong component. We should pick a canonical export for each concept and rename or wrap the TanStack Form adapters so the distinction is obvious.

## Scope

- Decide which module owns the canonical UI component export
- Rename or re-export adapter-layer components with unambiguous names
- Update imports across the app and tests
- Keep public behavior stable for forms using these fields

## Acceptance Criteria

- [ ] Fallow no longer reports duplicate exports for `CounterField`
- [ ] Fallow no longer reports duplicate exports for `NuyenField`
- [ ] Component names clearly communicate whether they are raw UI fields or TanStack Form adapters
- [ ] All affected tests and type checks pass
```

---

## Ticket 3 — Remove or reintegrate dead dialog compound components

**Suggested title:** Clean up unused dialog compound components under `src/components/ui/dialog/`

```md
## Summary

Fallow reported the following files as unused / outside the active module graph:

- `src/components/ui/dialog/dialog.tsx`
- `src/components/ui/dialog/dialogActions.tsx`
- `src/components/ui/dialog/dialogContent.tsx`
- `src/components/ui/dialog/dialogRoot.tsx`
- `src/components/ui/dialog/dialogTitle.tsx`

This is especially worth fixing because project conventions explicitly say new dialogs should use the compound dialog component from this folder. Either these files are dead and should be removed, or they are the intended pattern and current callers need to be migrated.

## Scope

- Verify whether the dialog compound API is truly abandoned or just not wired into live code
- If dead: remove the files and any stale references/docs
- If intended to stay: migrate real dialog callers to use the compound API and ensure Fallow sees them as live
- Update docs in `docs/ui/dialog.md` if behavior or usage expectations change

## Acceptance Criteria

- [ ] The `src/components/ui/dialog/` implementation is either actively used or cleanly removed
- [ ] Fallow no longer reports these dialog files as unused
- [ ] Dialog guidance in project docs matches the actual implementation
- [ ] Any affected tests pass
```

---

## Ticket 4 — Review dead `env` module and other dead files

**Suggested title:** Clean up dead files reported by Fallow (`env`, dice, and unused barrels)

```md
## Summary

Fallow reported several unused files that look like cleanup candidates:

- `src/env.ts`
- `src/components/dice/diceRollButton.tsx`
- `src/components/system/dice/diceResultsInfo.tsx`
- `src/components/items/card/index.ts`

At least `src/env.ts` is suspicious because project conventions mention adding new environment variables there. We should verify whether these files are actually obsolete, incorrectly unreferenced, or intended for future use but never integrated.

## Scope

- Trace whether each file is expected to be imported in production code
- Delete genuinely dead files
- If a file is intentionally retained, add the minimum justified suppression or reintegrate it properly
- Avoid keeping zombie files around “just in case”

## Acceptance Criteria

- [ ] Each flagged file has a documented disposition: removed, reintegrated, or explicitly suppressed with rationale
- [ ] Fallow dead-file count is reduced for this set
- [ ] No production behavior regresses after cleanup
- [ ] Tests / lint / type checks pass
```

---

## Ticket 5 — Remove unused exported prop types from dialog modules

**Suggested title:** Clean up unused exported dialog prop types across form and modal components

```md
## Summary

Fallow reported a large batch of unused exported types, mostly dialog prop interfaces and aliases such as:

- `UseAdeptPowerFormDialogProps`
- `UseSpellFormDialogProps`
- `UseTraditionFormDialogProps`
- `UseLoanDialogProps`
- `UseItemOptionsDialogProps`
- `UseVehicleFormDialogProps`
- many more under `src/components/character/**/dialogs/` and `src/components/items/**/dialogs/`

Most of these look like implementation-detail types that do not need to be exported. This is low-risk cleanup that should reduce API noise and make each file’s public surface more honest.

## Scope

- Audit Fallow’s unused type export list
- Remove `export` from implementation-only types
- Keep exports only where another module truly imports the type
- Avoid changing runtime behavior

## Acceptance Criteria

- [ ] Unused dialog/type exports are removed or intentionally justified
- [ ] The number of Fallow `unused_types` findings drops significantly
- [ ] No runtime code changes are introduced beyond type-surface cleanup
- [ ] Type checking passes
```

---

## Ticket 6 — Split the decision logic in `useItemOptions`

**Suggested title:** Refactor `useItemOptions` into smaller decision helpers

```md
## Summary

Fallow identified `src/components/items/dialogs/useItemOptions.ts` as one of the densest files in the repo:

- complexity density: `0.6`
- total cyclomatic complexity: `61`
- total cognitive complexity: `30`
- CRAP above threshold: `2`

This is a classic “too much branching in one hook” smell. We should extract smaller pure helpers for option building, visibility rules, and action eligibility.

## Scope

- Refactor `src/components/items/dialogs/useItemOptions.ts`
- Separate pure decision logic from hook wiring / React concerns
- Add focused tests for the extracted helpers if coverage is missing
- Keep the returned options and behavior stable for existing callers

## Acceptance Criteria

- [ ] Complexity of `useItemOptions.ts` is materially reduced
- [ ] Complex branching is covered by targeted tests
- [ ] Existing consumers of `useItemOptions(...)` do not require behavioral changes
- [ ] Fallow health metrics improve for this file
```

---

## Ticket 7 — Split `characterUtils.ts` into narrower modules

**Suggested title:** Break up `characterUtils.ts` hotspot into smaller focused utilities

```md
## Summary

Fallow marked `src/components/character/characterUtils.ts` as the top hotspot in the repo:

- hotspot score: `26.6`
- commits: `13`
- weighted commits: `12.24`
- complexity density: `0.23`
- fan-in: `23`

This file has both high churn and many dependents, which makes it expensive to change. The goal is to split it into narrower utility modules organized by concern so future edits have a smaller blast radius.

## Scope

- Audit the responsibilities currently living in `characterUtils.ts`
- Group helpers into smaller modules by concern (formatting, derived character values, display helpers, etc.)
- Keep a temporary compatibility export surface only if needed to avoid a giant migration diff
- Add tests where behavior is not already locked down

## Acceptance Criteria

- [ ] `characterUtils.ts` is reduced substantially in size/responsibility or replaced by smaller modules
- [ ] High-use helpers remain easy to import without creating a new barrel mess
- [ ] Existing behavior is preserved by tests
- [ ] Fallow hotspot pressure is reduced for this area
```

---

## Ticket 8 — Extract shared gear page section patterns

**Suggested title:** Extract shared section patterns from character gear page content components

```md
## Summary

Fallow flagged several gear page section components as hotspots:

- `src/components/character/gearPage/genericSectionContent.tsx` (`24.8`)
- `src/components/character/gearPage/weaponsSectionContent.tsx` (`21.3`)
- `src/components/character/gearPage/licensesSectionContent.tsx` (`17.7`)
- `src/components/character/gearPage/armorSectionContent.tsx` (`10.5`)
- `src/components/character/gearPage/gearViewSection.tsx` (`14.5`)

This smells like repeated orchestration and rendering logic across multiple section types. We should extract a shared section scaffold and keep only the genuinely type-specific rendering in each file.

## Scope

- Identify the common section layout / action / empty-state patterns in gear page content components
- Extract shared section scaffolding into reusable helpers/components
- Keep weapon/license/armor/generic special cases explicit where needed
- Preserve current UI behavior

## Acceptance Criteria

- [ ] Common gear section rendering logic is centralized
- [ ] Section-specific files are smaller and easier to read
- [ ] No visual regressions are introduced in the gear page
- [ ] Relevant tests pass and/or snapshots are updated
```

---

## Ticket 9 — Break up large finance dialogs

**Suggested title:** Refactor large finance dialogs into smaller form and summary units

```md
## Summary

Fallow identified multiple finance dialogs as large / high-maintenance components:

- `src/components/character/finances/loans/loanDialog.tsx`
- `src/components/character/finances/endOfMonth/endOfMonthDialog.tsx`
- `src/routes/$characterId/finances.tsx`

These components combine form state, calculations, rendering, and action handling in large files. We should split them into smaller components / helpers so the business rules are easier to test and the UI is easier to evolve.

## Scope

- Extract finance calculations into pure helper functions where appropriate
- Separate dialog shell, form fields, and summary blocks
- Add or improve tests around loan and end-of-month calculations
- Keep persistence and store interactions stable

## Acceptance Criteria

- [ ] `loanDialog.tsx` and related finance files are smaller and more focused
- [ ] Finance calculations are testable outside the full dialog render path
- [ ] User-visible finance workflows behave the same after the refactor
- [ ] Fallow health / hotspot results improve for the targeted files
```

---

## Ticket 10 — Deduplicate skill list item components

**Suggested title:** Extract shared skill list item UI used by active, knowledge, and language skills

```md
## Summary

Fallow found substantial duplication across skill list item components:

- `src/components/builder/sections/skills/activeSkills/activeSkillsListItem.tsx`
- `src/components/builder/sections/skills/activeSkills/activeSkillGroupsListItem.tsx`
- `src/components/builder/sections/skills/knowledgeSkills/knowledgeSkillsListItem.tsx`
- `src/components/builder/sections/skills/knowledgeSkills/languageSkillsListItem.tsx`

The repeated code includes shared row layout, name rendering, specialization display, rating chips, point totals, and delete actions. This is a good candidate for a reusable presentational primitive.

## Scope

- Extract a shared list item layout component or render helper for skill rows
- Keep differences explicit for active skills vs knowledge/language skills
- Preserve current click, edit, and delete behavior
- Update tests if any component contracts change

## Acceptance Criteria

- [ ] Duplicate skill list item markup is reduced substantially
- [ ] Shared UI behavior lives in a single reusable abstraction
- [ ] Type-specific display differences remain easy to understand
- [ ] Fallow duplication findings drop for these files
```

---

## Ticket 11 — Extract shared file import handler for YAML imports

**Suggested title:** Reuse the YAML file import flow across builder and character import buttons

```md
## Summary

Fallow reported duplicated file input handling between:

- `src/components/builder/importYamlBuilderButton.tsx`
- `src/components/character/exportImport/importCurrentCharacterButton.tsx`

Both components read a selected file, clear the input so the same file can be reselected, and then parse YAML content. This is small but very clean refactor bait.

## Scope

- Extract the shared file-reading / reset behavior into a helper or hook
- Keep caller-specific success / error handling in the parent component if needed
- Preserve current user flows and validation behavior

## Acceptance Criteria

- [ ] The duplicated file input handling code is consolidated
- [ ] Builder import and current-character import still behave identically to today
- [ ] Tests cover the shared helper if one is introduced
- [ ] Fallow duplication findings drop for this pair
```

---

## Ticket 12 — Extract common item card metadata footer blocks

**Suggested title:** Share repeated item card metadata/footer rendering across device, vehicle, and weapon cards

```md
## Summary

Fallow found a repeated metadata/footer block across these item card components:

- `src/components/items/types/devices/deviceItemCard.tsx`
- `src/components/items/types/vehicles/vehicleItemCard.tsx`
- `src/components/items/types/weapons/weaponItemCard.tsx`

The repeated block includes availability rendering, source rendering, and the delete action. We should extract a shared footer/meta component so item-specific cards only supply their unique stats.

## Scope

- Extract the shared availability/source/delete action block into a reusable component
- Keep device/vehicle/weapon-specific stats in their local card files
- Preserve current UI and click behavior

## Acceptance Criteria

- [ ] Common metadata/footer rendering is shared across the three card types
- [ ] Item-specific card files are smaller and more focused
- [ ] No UI regressions are introduced
- [ ] Fallow duplication findings drop for these files
```

---

## Ticket 13 — Extract shared test helpers in high-duplication test suites

**Suggested title:** Reduce repeated setup in storage, damage, counter, and migration tests

```md
## Summary

Fallow reported meaningful duplication in several test suites, including:

- `src/character/characterManager.test.ts`
- `src/components/system/damage/useDamageStore.test.tsx`
- `src/components/system/damage/useWoundModifier.test.tsx`
- `src/components/system/gameEffects/useGameEffects.test.tsx`
- `src/components/ui/counter/counter.test.tsx`
- `testUtils/renderUtils.tsx`

A lot of the duplication is repeated wrapper creation, repeated storage setup, and repeated Arrange / Act scaffolding. We should extract shared test helpers without making the tests cryptic.

## Scope

- Introduce narrowly scoped test helpers for repeated setup
- Preserve the project’s AAA test style
- Avoid over-abstracting assertions or hiding scenario intent
- Update existing tests incrementally rather than with one giant rewrite

## Acceptance Criteria

- [ ] Repeated setup and wrapper logic is consolidated where it improves readability
- [ ] Tests still read clearly and retain explicit Arrange / Act / Assert sections
- [ ] Fallow duplication findings improve across the targeted test files
- [ ] Full unit test suite still passes
```

---

## Ticket 14 — Refactor oversized item dialogs

**Suggested title:** Split oversized item dialogs and form dialogs into smaller components

```md
## Summary

Fallow highlighted several large item-related dialog components and functions, including:

- `src/components/items/dialogs/itemDialog.tsx`
- `src/components/items/dialogs/itemOptionsDialog.tsx`
- `src/components/items/types/credsticks/credstickDialog.tsx`
- `src/components/items/types/weapons/forms/useWeaponForm.tsx`

These files likely mix dialog orchestration, mode switching, item-specific branching, and field rendering. We should split them into smaller units so item workflows remain flexible without turning each dialog into a cursed kitchen-sink component.

## Scope

- Break large dialog files into smaller components/helpers by responsibility
- Pull pure mapping/branching logic into testable utilities where it helps
- Preserve current item creation/edit/purchase flows
- Add or extend tests around tricky branching behavior

## Acceptance Criteria

- [ ] Targeted dialog/form files are smaller and easier to reason about
- [ ] Complex branching logic has focused tests
- [ ] Existing item workflows behave the same after the refactor
- [ ] Fallow large-function / hotspot metrics improve for the targeted files
```

