# DicePool redesign — prototype notes

**Question:** What should the `DicePool` component look like, and how should players roll it
digitally, without it becoming so different that the existing dense pages (like Defense) turn
into visual noise?

Today `DicePool` (`../dicePool.tsx`) only renders the breakdown ledger — total + named modifier
rows. Rolling is bolted on separately by each caller (see `weaponAttackPanel.tsx`,
`defenseCalculatorPanel.tsx`): they build their own `useDiceRoller`, `<DiceResult>`, and a "Roll"
`<Button>` next to the pool. Every one of the 12+ dice pools on the Defense tab
(`resistanceDicePools.tsx`) has no roll button at all today.

**Variants**, mounted live on `/​:runnerId/defense` via the shared `Prototype` switcher
(`#/components/ui/prototype/prototype.tsx`), rendering two real pools (Ranged Full Defense,
Melee Full Block) built from the same live attribute/skill hooks the rest of the page uses:

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
1. Delete the losing `dicePoolVariant*.tsx` files and `dicePoolPrototypeDemo.tsx`.
2. Remove the `<DicePoolPrototypeDemo />` line from `defense.tsx`.
3. Fold the winning shape into `dicePool.tsx` itself (giving it its own `useDiceRoller` +
   roll affordance) so every caller — including `resistanceDicePools.tsx` and the attack/defense
   calculators — gets digital rolling for free instead of wiring it up by hand.
