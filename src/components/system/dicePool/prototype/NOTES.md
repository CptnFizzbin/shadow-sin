# DicePool redesign — prototype notes

**Question:** What should the `DicePool` component look like, and how should players roll it
digitally, without it becoming so different that the existing dense pages (like Defense) turn
into visual noise?

Today `DicePool` (`../dicePool.tsx`) only renders the breakdown ledger — total + named modifier
rows. Rolling is bolted on separately by each caller (see `weaponAttackPanel.tsx`,
`defenseCalculatorPanel.tsx`): they build their own `useDiceRoller`, `<DiceResult>`, and a "Roll"
`<Button>` next to the pool. Every one of the 12+ dice pools on the Defense tab
(`resistanceDicePools.tsx`) has no roll button at all today.

**Variants**, live app-wide. `DicePool` itself (`../dicePool.tsx`) now calls `usePrototypeVersion()`
and swaps in the matching variant, falling through to today's design when there's no ancestor
`Prototype` (every existing test). `__root.tsx` wraps the entire app in
`<Prototype versions={dicePoolPrototypeVersions}>`, so the bottom switcher bar and every real
`DicePool` in the app — the Defense tab's 12+ resistance pools, the weapon attack calculator, the
defense calculator, the legwork dialog, spirit summoning, and the two example pools below —
change together, wherever you navigate. See "Consuming the selection directly" in
`docs/ui/prototype.md` for the pattern.

- **A — Ledger + Roll Footer**: today's ledger, unchanged, with a roll footer appended below.
  Safest, most incremental option.
- **B — Hero Dial + Chips**: total becomes a big tappable dial; modifiers become a chip row.
  Rolling happens by tapping the dial itself; the number inside swaps to hits rolled.
- **C — Compact Row, Expand for Detail**: collapsed to one dense line (name, total, roll icon)
  by default; breakdown hides behind a caret. Best density for a page with many pools.
- **D — Split Panel**: ledger and a standing roll module side by side as equal partners.
- **E — Minimal HUD Pill**: as small as it gets — a pill with a roll icon and a colored-dot
  result cluster; breakdown hidden behind tapping the name.

**Verdict:** _pending — fill in once a design is picked (or picked-and-remixed)._

**Cleanup, once decided:**
1. Delete the losing `dicePoolVariant*.tsx` files.
2. Remove the `<Prototype>` wrapping (and the `usePrototypeVersion()` switch) from `dicePool.tsx`,
   folding the winning shape's markup directly into it — giving it its own `useDiceRoller` + roll
   affordance permanently, no switch required. Every caller (`resistanceDicePools.tsx`, the
   attack/defense calculators, the legwork dialog, spirit summoning) gets digital rolling for free.
3. Remove the `<Prototype>` wrapping from `__root.tsx` and delete `dicePoolPrototypeVersions.ts`.
4. Delete `dicePoolPrototypeDemo.tsx` and the `<DicePoolPrototypeDemo />` line from `defense.tsx`.
5. Consider whether `usePrototypeVersion()` (added to `#/components/ui/prototype/prototype.tsx`
   for this) is worth keeping as a general capability, or should go too if unused elsewhere.
