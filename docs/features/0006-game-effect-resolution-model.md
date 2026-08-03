# GameEffect Resolution Model

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

`GameEffect` entries can be attached to Items, Qualities, Spells, Complex Forms, and Powers. There
is currently no canonical layer that aggregates all active effects and applies them to derived
stats — components resolve effects ad-hoc via selector hooks, each re-implementing its own
target-filtering. The core resolution architecture is now settled (see **Resolved Design** below,
and `docs/adr/0009-game-effect-scope-resolution.md`); stacking rules and a few source types
remain open.

**Known sources of GameEffects** — multiple sources can affect the same derived stat:

| Source | Examples |
|---|---|
| Gear | Cyberware (Wired Reflexes), weapons, armor |
| Adept Powers | Increased Reflexes |
| Spells (sustained) | Increase Reflexes |
| Qualities | High Pain Tolerance, Low Pain Tolerance |
| Drugs / Compounds | _(not yet modelled)_ |
| Matrix connection mode | AR vs. Hot-sim VR vs. Cold-sim VR |
| Others (potential) | Critter powers, mentor spirits |

## Resolved Design

Two independent axes determine whether a `GameEffect` applies:

- **What it modifies** — `target: string | string[]`, unchanged in spirit from today, now
  supporting multiple values per effect. For `dicePoolMod`, `target` is one or more **Pool Id**s
  drawn from a static, hand-authored category tree (e.g. `skill.active.dataSearch`,
  `combat.attack`) — see **Pool Id** in `CONTEXT.md`. Leaves for branches backed by an existing
  canonical list (active skills) are generated from that list; free-text branches (Knowledge
  Skills, Languages) generate leaves per-Runner from that Runner's own entries, plus a `_all_`
  wildcard leaf to target the whole branch at once.
- **Which item instance(s) it reaches** — the new `scope` field, resolved at read time relative
  to the *granting* item's own position in the `ItemData.parentId`/`childIds` tree. See **Scope**
  in `CONTEXT.md` for the full `relativeTo`/`relation`/`itemType` grammar.

Resolution is centralized behind two selectors (replacing per-hook ad-hoc filtering):

- `selectGameEffectsGrantedBy(sourceId)` — the raw `effects[]` a single source carries.
- `selectGameEffectsAppliedTo(target: UUID | "runner")` — walks every source, resolves each
  one's `scope` relative to its own id, and returns the effects that land on `target`. This
  requires `selectAllGameEffects`'s aggregation step to start tagging each effect with its
  source's id as it flattens (derived at read time — no persisted schema change).

**Data model additions:**
- `KnowledgeSkillData` and `LanguageSkillData` gain a persisted `id` (UUID), independent of
  `name`, so a Scope or Pool Id targeting one specific free-text skill entry survives a rename.
  Requires a migration to backfill existing Runner records.
- `GameEffectData.target` becomes `string | string[]` uniformly across every effect type. The
  union keeps existing persisted single-value targets valid as-is — no migration needed there.

**Authoring UI:** a 3-step wizard (Effect Type → Target(s) → Scope), reusing the app's existing
hub-list pattern (`List`/`ListItemButton` with icon + primary/secondary text, drilling down with
back navigation — see `DefenseCalculatorDialogContent`/`DefenseCalculatorHubList` for the
existing single-level version this extends into multiple steps). Each step auto-skips when
trivial (no target options; source isn't Item-attached so Scope can only be `runner`), so a
targetless effect from a Quality still resolves to a single visible step. The Target step for
`dicePoolMod` drills through the Pool Id tree with plural, human-readable group labels ("Skills /
Active Skills / Data Search") independent of the id's own (singular) spelling. The Scope step
shows a fixed abstract schematic (Root/Parent/Self/Children/Siblings boxes) highlighting whichever
boxes the current `relativeTo`+`relation` selection covers — a picking aid, not a rendering of the
Runner's real item tree.

## Open Questions

- [ ] How are stacking rules handled? SR4e has explicit rules for what stacks — e.g. initiative
      enhancement bonuses from different sources. Orthogonal to Scope/Pool Id resolution; not yet
      designed.
- [ ] Where are drugs/compounds and matrix connection mode modelled — as Items, a separate field
      on `RunnerData`, or transient Session State? If not Items, they have no position in the
      ownership tree, so (like Qualities) their effects would be restricted to `relativeTo:
      "runner"`.
- [ ] Should active sustained spells be treated as a source of GameEffects the same way gear is?
      Today `selectAllGameEffects` includes every Spell's effects unconditionally, regardless of
      whether it's currently sustained — likely wrong, but unchanged by this design.

## Constraints

- SR4e stacking rules are not fully permissive — some bonuses from the same category do not
  stack; the resolution model must be able to express this (still open — see above).
- `GameEffectData` entries are currently attached to Items; the model must accommodate
  non-Item sources (qualities, sustained spells) without breaking existing Item-attached effects.
  Non-Item sources are restricted to `scope.relativeTo: "runner"`.
- This design blocks or significantly shapes: Matrix Programs dice pools, Entity StatusSheets
  (Vehicle/Drone effects), and any future feature that reads derived stats.

## Domain Notes

See `CONTEXT.md`: **GameEffect**, **Granted Effects**, **Applied Effects**, **Scope**, **Dice
Pool**, **Pool Id**, **Skill** (Knowledge/Language id addition), **Wound Modifier**.

## Rough Interface Sketches

```ts
type ScopeRelativeTo = "self" | "root" | "parent" | "children" | "siblings" | "runner"
type ScopeRelation = "ancestors" | "descendants"

interface EffectScope {
  relativeTo?: ScopeRelativeTo // default "self"
  relation?: ScopeRelation     // relative to relativeTo; includes the starting position
  itemType?: ItemType | ItemType[]
}

interface GameEffectData {
  type: GameEffectType | string
  target?: string | string[]
  scope?: EffectScope // omitted/default resolves to "self" for Item sources, "runner" for others
  subTarget?: string
  value: number
}
```

## Out of Scope

- Non-mechanical effects (flavour, narrative modifiers)
- Full drug/compound system — only ensuring the resolution model can accommodate it as a future
  source
- Stacking rules (separate open question above)

## Related Features

- [`docs/adr/0009-game-effect-scope-resolution.md`](../adr/0009-game-effect-scope-resolution.md)
  — the core architectural decision this doc's Resolved Design section summarizes
- [`docs/features/0005-matrix-programs.md`](./0005-matrix-programs.md) — Program ratings feeding
  into dice pools
- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — Vehicle/Drone
  effects may feed into this model
