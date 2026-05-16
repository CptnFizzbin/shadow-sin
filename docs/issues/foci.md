# Magical Foci

## Status

Planned — design complete, implementation not started. See PR sequence below.

## Background

In Shadowrun 4e, **Foci** are magical items used by Adepts and Magicians to enhance dice pools,
sustain spells, and augment weapons. A Focus has three distinct states:

- **Owned** — the Runner possesses the item; no mechanical effect
- **Bonded** — the Runner has spent Karma to permanently link the focus to themselves; a
  prerequisite for activation but still mechanically inert on its own
- **Activated** — a bonded focus that has been switched on via a play-time action; only
  activated foci contribute effects and count toward the Active Foci Limit

The sum of ratings of all **activated** (not merely bonded) foci cannot exceed the Runner's
Magic attribute.

## Design Decisions

All decisions were settled in a design session on 2026-05-15. Do not reopen without a clear
rules or architectural reason.

### Data model

- New `FocusData extends ItemData` with:
  - `focusType: FocusType` — discriminator for focus category (see groupings below)
  - `bonded?: boolean` — whether the Runner has paid the Karma cost to link this focus;
    prerequisite for activation; does **not** mean the focus is currently contributing effects
  - `effects: GameEffectData[]` — freeform effect list (reuses existing `ItemData.effects`)
  - `spellCategory?: SpellCategory` — **sustaining foci only**; fixed at item creation; restricts
    which spell can be slotted
  - `slottedSpellId?: UUID` — **sustaining foci only**; the currently held spell
- **Activation state**: reuses `ItemData.equipped` — the existing field that gates `GameEffect`
  application in `selectAllGameEffects`. A focus must be bonded before `equipped` can be set to
  `true`. Only `equipped === true` foci contribute effects and count toward the Active Foci Limit.
- **Force rating**: reuse `ItemData.rating` — no dedicated field
- All buffing focus effects are freeform `GameEffectData[]`; **power foci auto-populate** a
  standard effect entry for every magic-related dice pool when the focus type is selected in the
  form (the Player can then edit the entries)

### Focus type groupings

| Group | Types |
|---|---|
| **Buffing** | Power, Spellcasting, Summoning, Banishing, Centering |
| **Sustaining** | Sustaining (one per spell category) |
| **Weapon** | Weapon — **deferred** until the `itemType`-as-list PR lands |

### Bonding

Bonding is a permanent, one-time Karma expenditure. It is **not** the same as activating a focus.

- New `ImprovementType.bondFocus` with entry shape: `{ focusId: UUID, force: number }`
- Karma cost = Force × type multiplier per SR4A bonding table
- After bonding, `FocusData.bonded` is set to `true`; the focus remains inactive (`equipped: false`)
  until the Player explicitly activates it
- Bonding is available in **both** the Builder (via the PR #274 improvement flow) and in-play in
  the Viewer — in-play bonding requires the in-play karma extension PR (see PR sequence)
- **Un-bonding**: Karma is permanently lost; `bonded` is cleared; `equipped` is set to `false`;
  the `bondFocus` ImprovementEntry remains in the history for audit purposes

### Activation

Activation is a free, reversible play-time action. A focus must be bonded before it can be activated.

- Toggled via a UI action on the focus item card in the Viewer
- Stored as `ItemData.equipped` — hooks into the existing `selectAllGameEffects` filter for free
- The UI must guard the toggle: if `bonded !== true`, the activate action is disabled
- Deactivating a focus removes its effects immediately without any Karma cost

### Active Foci Limit

Applies to **activated** foci only — bonded-but-inactive foci do not count.

- SR4A rule: sum of ratings of all activated foci ≤ Magic attribute
- Surfaced as a **warning chip** only — same pattern as armor encumbrance; not a hard block
- Implemented as a selector that sums ratings of foci where `equipped === true`; compares to the
  Magic attribute
- Selector null-checks each `focusId` lookup; deleted items are silently skipped (see below)

### Deleted focus items

- Gear store deletion has no callbacks; a deleted focus leaves its `bondFocus` ImprovementEntry
  with a dangling `focusId`
- The active-foci limit selector guards every item lookup with a null-check — missing items are
  excluded from the sum without crashing
- Karma has already been deducted; the history entry remains for audit purposes
- **Decided**: handle gracefully at build time (trivial cost now vs. migration risk later)

### Sustaining focus spell slot

- `spellCategory` is fixed at item creation; the Player cannot change it after bonding
- The spell picker on the focus card filters to spells matching the focus's `spellCategory` and
  duration `Sustained`
- The slotted spell still appears in the Runner's spell list; no duplication or hiding

### Weapon foci

- Modelled as **two separate items** for now: a weapon Item and a focus Item
- Full linked-identity weapon foci (single item that is both) requires `itemType` to support
  multiple values — this is a prerequisite PR that must land first
- **Cost to reverse the two-item decision later**: high. The `itemType` discriminator is
  load-bearing across type guards, Zod schemas, gear filters, and UI components. Merging existing
  user data would require a migration. Accepted trade-off.

## PR Sequence

1. **`itemType`-as-list** — change `ItemData.itemType` from a single `ItemType` scalar to an
   array, updating all type guards, Zod schemas, and gear filters (~30–40 files). Prerequisite
   for linked weapon foci.
2. **Foci** — main implementation: `FocusData`, `FocusType`, bonding improvement entry,
   activation toggle (reusing `equipped`), active foci limit warning, sustaining focus spell
   slot, buffing focus effects with power focus auto-populate.
3. **In-play karma bonding** — extend the improvement system from PR #274 to support bonding
   foci from the Viewer (play-time) as well as the Builder. Blocked on PR #274 merging.

## Related

- `src/system/gear/armorData.ts` — pattern to follow for `FocusData` and its Zod schema
- `src/system/karma/improvements/improvementEntry.ts` — extend with `BondFocusEntry`
- `src/system/karma/improvements/improvementType.ts` — add `bondFocus`
- `src/system/magic/spellData.ts` — `SpellCategory` enum for sustaining focus filtering
- `src/components/system/encumbrance/` — warning chip + selector pattern to replicate for
  active foci limit
- `src/system/itemType.ts` — `ItemType` enum; extended by the prerequisite PR
- `CONTEXT.md` — Focus, Bond, Sustaining Focus, Active Foci Limit vocabulary
