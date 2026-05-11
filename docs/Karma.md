# Karma Advancement System

This document outlines what needs to be built to allow karma to be spent on increasing stats, skills, qualities, spells, and other character traits — mirroring what the BP system does during chargen, but for post-chargen advancement.

---

## Key Architectural Difference from BP

| Aspect | BP (Chargen) | Karma (Advancement) |
|--------|-------------|---------------------|
| Budget | Computed from current state | Deducted from `karma.current` (finite) |
| Baseline | Racial minimums (always known) | Whatever value was at chargen complete |
| History | None needed (fully derived) | Needs a ledger — players track what they bought and when |
| Mode | Only in the builder | Only in the character sheet (post-chargen) |

Unlike BP, karma is not fully derivable from character state — the baseline shifts as a character advances over time, so purchases must be logged.

---

## Step 1: Add `spendKarma()` to KarmaStore + Enable the Button

**File:** `src/components/character/karma/karmaStore.ts`

Add a spend method that guards against overdraw:

```typescript
spendKarma(amount: number) {
  this.setState(produce((draft) => {
    draft.karma.current = Math.max(0, draft.karma.current - amount)
  }))
}
```

Also remove the `disabled` prop from the "Spend Karma" button in `src/components/character/karma/karmaSection.tsx` and wire it to open a dialog (mirroring `addKarmaDialog.tsx`).

---

## Step 2: Add `karmaLog` to Character Sheet + Migration

**File:** `src/system/characterSheet.ts`

Add a transaction log to the karma field:

```typescript
karma: {
  total: number
  current: number
  log: Array<{
    date: string
    description: string  // e.g. "Raised Agility 3 → 4"
    amount: number       // negative = spent
  }>
}
```

Create a migration at `src/character/migrations/` to initialize `karma.log = []` on existing characters.

---

## Step 3: Create `karmaUtils.ts` with SR4e Cost Formulas

**File:** `src/components/character/karma/karmaUtils.ts`

Define karma advancement costs per SR4e rules (parallel to `src/components/builder/buildPoints/attributeUtils.ts`):

| What | Formula |
|------|---------|
| Attribute | `new rating × 5` |
| Active Skill (raise existing) | `new rating × 2` |
| Active Skill (new at rating 1) | `2` flat |
| Skill Specialization | `2` flat |
| Active Skill Group | `new rating × 5` |
| Spells | `5` per spell |
| Complex Forms | `1` per rating |
| Knowledge / Language Skill | `new rating × 1` |
| Positive Quality | karma = BP value |
| Buy off Negative Quality | karma = BP value × 2 |

---

## Step 4: Add `mode` to Character Sheet

**File:** `src/system/characterSheet.ts`

```typescript
mode: 'chargen' | 'advancement'
```

This tells the UI which currency and cost formulas are in play. Add a migration to default existing characters to `'advancement'` if chargen is already complete, or `'chargen'` otherwise.

A control in the builder (or profile section) allows transitioning from `chargen` → `advancement` when the player is ready to "lock in" their character.

---

## Step 5: Build Karma Cost Hooks Per Category

Create hooks parallel to the BP hooks in `src/components/builder/buildPoints/hooks/`, but computing the cost of the *next* increment from the current value:

- `useAttributeKarmaCost(attr)` → `(currentRating + 1) × 5`
- `useSkillKarmaCost(skillName)` → `(currentRating + 1) × 2`, or `2` if new
- `useSpellKarmaCost()` → `5`
- `useComplexFormKarmaCost(form)` → `(currentRating + 1) × 1`
- `useQualityKarmaCost(quality)` → `quality.bpValue`

Each hook also checks `karma.current >= cost` to produce a `canAfford` flag for disabling UI controls.

---

## Step 6: Wire Increment Controls to Karma in Advancement Mode

**Files:** `src/components/builder/sections/attributes/attrIncrementButton.tsx` and equivalent skill/spell controls.

When `mode === 'advancement'`, increment buttons should:
1. Display karma cost instead of BP cost
2. Call `karmaStore.spendKarma(cost)` instead of mutating the builder budget
3. Append an entry to `karma.log` describing the purchase
4. Be disabled when `karma.current < cost` or stat is at racial max

The cleanest approach is to branch inside the existing increment components on `mode`, or create karma-specific variants that live in the character sheet view rather than the builder.

---

## Step 7: Add Karma Log Display to the Karma Section

**File:** `src/components/character/karma/karmaSection.tsx`

Below the current/total display, render `karma.log` as a scrollable list showing:
- Description of what was purchased
- Karma spent
- Date

This gives players the advancement audit trail that Shadowrun expects and allows a future "undo last purchase" feature.

---

## Recommended Build Order

1. `spendKarma()` method + enable button (Step 1)
2. `karmaLog` on character sheet + migration (Step 2)
3. `karmaUtils.ts` cost formulas (Step 3)
4. `mode` field on character sheet (Step 4)
5. Karma cost hooks per category (Step 5)
6. Wire increment controls to karma mode (Step 6)
7. Karma log display UI (Step 7)
