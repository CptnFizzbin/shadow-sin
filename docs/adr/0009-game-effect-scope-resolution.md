# GameEffect targeting splits into Pool Id (what) and Scope (which instance)

`dicePoolMod` GameEffects (gear/augment bonuses to a Dice Pool) need two independent pieces of
information to resolve: *what kind* of test is being modified, and *which item instance(s)* the
bonus reaches. Early designs tried to fold both into a single `target` string, but the two axes
don't compose — "this pistol's Attack test" and "all Knowledge skill tests" vary independently,
and ownership-relative reach (a drone's autosoft bonusing only the weapons mounted on that same
drone) can't be expressed as a fixed string at all, since it depends on where the granting item
sits in the Runner's Item tree at read time.

We split them:

- **Pool Id** — a static, hand-authored id tree (e.g. `skill.active.dataSearch`,
  `combat.attack`) identifying *what* a Dice Pool is, independent of any specific item instance.
- **Scope** — `{ relativeTo, relation, itemType }`, resolved at read time by walking the
  existing `ItemData.parentId`/`childIds` graph from the *granting* item's own position. Answers
  *which* item instance(s) the effect reaches — unrelated to what it modifies.

`selectGameEffectsAppliedTo(target)` replaces the old pattern of each dice-pool-producing hook
independently calling `useGameEffects(type)` and filtering by target itself
(`useActiveSkillDiceGroup`, `useActiveSkillDicePool`, etc.) — it resolves Scope centrally so no
consumer has to re-implement tree-walking.

## Considered options

- **Fold scope into the target string** (e.g. wildcard segments like `combat.attack._self_`).
  Rejected — conflates two unrelated concerns into one string that every consumer would need to
  parse, instead of two independently-typed fields.
- **Flat enum of every concrete Pool Id**, including one member per Skill/Item instance.
  Rejected — combinatorially unbounded (one id per Player-entered Knowledge Skill, per mounted
  weapon, ...); the tree only enumerates the *branch shape*, generating instance leaves from
  existing canonical lists (`skillList`) or per-Runner data at read time instead.

- `GameEffectData.target` becomes `string | string[]` uniformly across every effect type
  (`attrMod`, `skillMod`, `skillSpecializationMod`, `dicePoolMod`, pain tolerance), so a single
  effect can target several Pool Ids/Attributes/Skills at once. The union keeps every existing
  persisted `target: "body"` value valid as-is — no migration needed — since resolution logic
  normalizes to an array before matching (`toArray(e.target).includes(x)`).

## Consequences

- `selectAllGameEffects`/`useGameEffects` currently discard which source (Item/Quality/Spell/...)
  each effect came from once flattened. Scope resolution needs that source id, so the aggregation
  step must start tagging each effect with its source's id as it flattens — derived at read time,
  no persisted schema change.
- `KnowledgeSkillData` and `LanguageSkillData` need a new persisted `id` (UUID) field, independent
  of `name`, plus a migration to backfill existing Runner records — without it, a Scope or Pool Id
  targeting one specific free-text skill entry breaks silently if the Player renames it.
- Non-Item GameEffect sources (Qualities, Spells, Complex Forms, Powers) aren't part of the Item
  ownership tree, so `relativeTo: "runner"` is the only Scope that makes sense for them.
