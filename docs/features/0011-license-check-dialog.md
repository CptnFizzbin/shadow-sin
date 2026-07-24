# License Check Dialog

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

A simulated security scan of a Runner's carried gear: a **Verification System Rating** (1–6) is
set, then every carried SIN and every Restricted item is opposed-tested against it to see whether
the fake credentials backing them hold up. The design converged over four rounds of interactive
prototyping (screenshots below) — this doc captures the mechanics and resolved design decisions
to hand off to implementation.

**Prototype record** (screenshots of the converged Round 4 design — "4-Lane Console" — walking the
full flow; the original was a private Claude Artifact, captured here as static images so the
record doesn't depend on that link staying alive. Earlier rounds 1–3 were superseded and are not
included):

1. Setup — rating picker and per-item checklist, grouped into SIN / Unlicensed / Forbidden lanes:

![Setup — rating and checklist](./images/0011-license-check-1-setup.png)

2. Scan in progress — all four lanes resolving concurrently, dice mid-roll:

![Scan in progress — four lanes concurrently](./images/0011-license-check-2-scanning.png)

3. Result — Question Further state, listing every flagged item and reason (including the
   multi-SIN alert):

![Result — Question Further with flagged items](./images/0011-license-check-3-result.png)

## Mechanics (settled)

- **Trigger:** Player self-check only for v1 — a Runner's own Player runs it against their own
  carried gear before a run ("am I clean?"). No GM tool: the app has no Game/GM concept at all
  today (`docs/features/0003-gm-game.md` is still Draft), so a GM-facing trigger is out of scope
  until that lands.
- **Verification System Rating source:** a plain 1–6 input the Player sets fresh every run, as
  prototyped. No new entity, no persistence — this is not tied to a location/checkpoint concept.
- **Setup step:** a 1–6 button group sets the Verification System Rating. A checklist lists every
  eligible item, grouped as:
  - **SINs** — every owned `SinData` item, unconditionally. A SIN is a held identity, not
    carried gear, so it has no equip/carry state and no eligibility filter — unlike weapons or
    armor, there is nothing to "leave at the safehouse." Each SIN is a group header, with the
    Restricted gear covered by a Licence attached to that SIN nested underneath it (via
    `Licence.parentId` → SIN, `ItemData.licenseId` → Licence).
  - **Unlicensed Gear** — Restricted items with no `licenseId` at all. Confirmed reachable today:
    `isItemLicensed` (`licenseUtils.ts`) treats a missing or dangling `licenseId` as unlicensed,
    and `0001-license-quick-buy.md`'s own Resolved Questions note there is no SIN-burning
    mechanic to clean up a dangling reference after a Licence is deleted.
  - **Forbidden Gear** — items with restriction code `F`.
  - Unrestricted gear is never listed — there's nothing to check.
  - Every row reflects the item's `stashed` flag (see
    [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md)) — a stashed item is excluded
    from the run entirely, not verified. License Check reads this flag; it does not introduce its
    own local stash state.
- **Scan step:** four lanes run concurrently — one per active (non-stashed) SIN, one for
  Unlicensed Gear, one for Forbidden Gear. Each lane processes its own items strictly in sequence
  (a SIN lane checks the SIN itself, then each of its licensed gear items, one at a time).
- **Per-item resolution:**
  - A **real** SIN or Licence clears instantly — no roll.
  - A **fake** SIN or Licence rolls an Opposed Test: `rating × 2` d6 for the credential vs.
    `Verification System Rating × 2` d6 for the scanner. A Hit is a 5 or 6 (existing definition).
    Whichever side has more Hits wins; a tie favours the credential (it holds). The `× 2`
    multiplier ships as fixed default-on behavior gated behind a new feature flag,
    `items.licenseCheck.ratingPlusRating` (defaults to enabled) — see Constraints below for why
    this doesn't use the existing `optionalRules` mechanism.
  - **Unlicensed** and **Forbidden** items have nothing to oppose — they're flagged immediately,
    no roll.
  - A resolved result (dice + verdict) holds on screen for exactly 500ms before the lane starts
    its next queued item. Settled dice are displayed sorted low → high on both sides.
  - Scan duration for a rolled item is not fixed — it scales with the total dice pool size, so a
    higher-rated fake credential visibly takes longer to resolve than a low-rated one.
- **Alerts:** two active SINs at once is *always* an alert, independent of how the individual
  rolls go. Any alert (a flagged item, or the multi-SIN condition) puts the dialog in a
  **Question Further** state that lists every flagged item and a short reason. No alerts →
  **All Clear**.
- **Lasting effects:** none. License Check is purely informational — a flagged result is not
  logged, does not notify a GM, does not confiscate the item, and does not feed Public Awareness /
  Notoriety. The dialog shows results and closes; nothing is written to `RunnerData` as a
  consequence of a check.
- **Tone:** no narrative/flavour text anywhere in the dialog — item rows show name, category, and
  dice only; reasons are short mechanical strings (e.g. `you 3 vs scanner 4`), not prose.

## Constraints

- Availability/restriction codes already exist: `R` (Restricted) requires a Licence, `F`
  (Forbidden) has no legal Licence path (`AvailabilityChip`, `availabilityInfo.ts`). Forbidden
  gear must never be offered a roll — matches the existing Licence Quick-Buy rule that Forbidden
  items get no quick-buy trigger either.
- `LicenseData.rating` / `SinData.rating` are `"real" | number` — a `"real"` value must always
  auto-clear and must never be rolled.
- Licence → SIN is the existing Attachment relationship (`Licence.parentId` = SIN id). Gear →
  Licence is the existing flat reference (`ItemData.licenseId`). No new relationship fields are
  needed to build the lane groupings.
- `Hit` (die result of 5 or 6) is the existing dice-pool definition and must be reused, not
  redefined, for the Opposed Test.
- Item eligibility for the "stashed" checklist state depends on
  [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md) — that feature must exist (or
  ship alongside this one) before License Check can read/write `ItemData.stashed`.
- **`items.licenseCheck.ratingPlusRating` deliberately breaks from `docs/adr/0002-feature-flags-design.md`.**
  That ADR's registry pattern (`optionalRulesRegistry`) requires a `SourceData` book/page citation
  and defaults every rule to disabled, since an Optional Rule is a published SR4e variant a table
  opts into. `rating × 2` is not from a sourcebook — it's a house-rule pacing choice from
  prototyping — so it doesn't fit that pattern: it ships as a separate, non-cited flag defaulting
  to **enabled**. This is an accepted, temporary shortcut (only one table uses the app right now);
  no ADR amendment is being made for it yet. Revisit once a general house-rule/table-settings
  system exists.
- Implementation must follow the established dialog pattern (`useDialog` + compound `Dialog`
  component, per `docs/ui/dialog.md`) and MUI style-prop discipline (no restating theme
  defaults) — the prototypes are bespoke HTML/CSS mockups, not real MUI components, and should
  not be treated as a component-level reference beyond layout and interaction intent.

## Domain Notes

Existing terms in play: **SIN**, **Licence**, **Availability**, **Restricted**, **Forbidden**,
**Hit**, **Dice Pool**, **Optional Rule**.

New terms this feature would introduce to `CONTEXT.md` if implemented as designed:

- **License Check** — the simulated verification flow itself.
- **Verification System Rating** — the 1–6 rating representing the scanning system's strength for
  one License Check run; forms one side of each Opposed Test.
- **Opposed Test** — not currently a named glossary term; CONTEXT.md defines `Hit` and `Dice Pool`
  but not the general pattern of two pools rolled against each other with the higher Hit count
  winning. Worth promoting to a shared term now that a second consumer (beyond combat, if any)
  exists.

`Stash` is defined by [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md), not by
this feature — License Check is a consumer of that flag, not its origin.

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
type CredentialRating = "real" | number // matches existing SinData/LicenseData.rating

interface VerificationLane {
  key: string // a SIN's id, or "unlicensed" / "forbidden"
  title: string // the SIN's display name, or "Unlicensed Gear" / "Forbidden Gear"
  checks: VerificationCheck[] // processed strictly in sequence within the lane
}

interface VerificationCheck {
  itemId: string // SinData.id or ItemData.id
  kind: "sin" | "licensed-gear" | "unlicensed-gear" | "forbidden-gear"
  credentialRating?: CredentialRating // absent for unlicensed/forbidden — nothing to roll
}

interface VerificationOutcome {
  itemId: string
  status: "clear" | "flagged"
  credentialHits?: number
  scannerHits?: number
}

interface LicenseCheckResult {
  scannerRating: number // 1–6, set for this run
  outcomes: VerificationOutcome[]
  alerts: Array<{ itemId: string | "multiple-sins"; reason: string }>
}
```

## Out of Scope

- Any lasting consequence to `RunnerData` from a flagged result (confiscation, arrest, Notoriety
  change, GM notification) — this is purely an informational simulation.
- A GM-facing trigger or GM-side configuration of checkpoint/scanner presets — no GM tooling
  exists yet (`docs/features/0003-gm-game.md`).
- Editing or creating SINs/Licences from within this dialog — that's the existing SIN/Licence
  forms and the Licence Quick-Buy flow.
- Changes to the core dice engine beyond this feature's own Opposed Test — the `rating × 2`
  formula is scoped to License Check only, not a change to Dice Pool assembly elsewhere.
- Real-time or multiplayer presentation of a check (e.g. a GM watching a Player's scan live).
- The general item-stashing mechanic itself (flag definition, equip-blocking, gear-list
  presentation) — that lives in
  [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md); License Check only consumes
  the resulting flag.

## Related Features

- [`docs/features/0001-license-quick-buy.md`](./0001-license-quick-buy.md) — this feature's SIN ↔
  Licence ↔ gear data model is the foundation the lane grouping is built on
- [`docs/features/0003-gm-game.md`](./0003-gm-game.md) — relevant to the "who triggers this?"
  decision above; still Draft, no GM view exists yet
- [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md) — License Check's "stashed"
  checklist state is a consumer of this feature's `ItemData.stashed` flag, not its own mechanic
