# License Check Dialog

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

A simulated security scan of a Runner's carried gear: a **Verification System Rating** (1–6) is
set, then every carried SIN and every Restricted item is opposed-tested against it to see whether
the fake credentials backing them hold up. The design converged over four rounds of interactive
prototyping (Artifact links below) — this doc captures the mechanics and open questions to hand
off to implementation.

**Prototype record** (private Claude Artifacts — share or replace with screenshots before wider
review):
- Round 4, converged design — [4-Lane Console](https://claude.ai/code/artifact/d8b2e93f-4474-497d-881b-a7d9c2448199)
- Round 3 — [Slot Bay Gallery](https://claude.ai/code/artifact/a7f1d31f-1d5c-4d20-93c0-b729007a64bf)
- Round 2 — [Interrogation Gallery](https://claude.ai/code/artifact/92e056cd-4933-4afb-86ef-d495e358d788)
- Round 1 — [Dialog Prototypes](https://claude.ai/code/artifact/38ade6bb-06a6-40db-ad3e-58e5af701521)

## Mechanics (settled)

- **Setup step:** a 1–6 button group sets the Verification System Rating. A checklist lists every
  eligible item, grouped as:
  - **SINs** — each SIN as a group header, with the Restricted gear covered by a Licence attached
    to that SIN nested underneath it (via `Licence.parentId` → SIN, `ItemData.licenseId` → Licence)
  - **Unlicensed Gear** — Restricted items with no `licenseId` at all
  - **Forbidden Gear** — items with restriction code `F`
  - Unrestricted gear is never listed — there's nothing to check.
  - Every row is checked (included) by default; unchecking marks it **stashed** — excluded from
    this run entirely, not verified.
- **Scan step:** four lanes run concurrently — one per active (non-stashed) SIN, one for
  Unlicensed Gear, one for Forbidden Gear. Each lane processes its own items strictly in sequence
  (a SIN lane checks the SIN itself, then each of its licensed gear items, one at a time).
- **Per-item resolution:**
  - A **real** SIN or Licence clears instantly — no roll.
  - A **fake** SIN or Licence rolls an Opposed Test: `rating × 2` d6 for the credential vs.
    `Verification System Rating × 2` d6 for the scanner. A Hit is a 5 or 6 (existing definition).
    Whichever side has more Hits wins; a tie favours the credential (it holds).
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
- **Tone:** no narrative/flavour text anywhere in the dialog — item rows show name, category, and
  dice only; reasons are short mechanical strings (e.g. `you 3 vs scanner 4`), not prose.

## Open Questions

- [ ] **Who triggers this?** A Player self-check on their own Runner ("am I clean before this
      run?"), a GM tool run against a Runner they're viewing, or both? There's no GM/Game tooling
      in the app yet (`docs/features/0003-gm-game.md` is still Draft), which points toward a
      Player-facing entry point for now — confirm before picking where the trigger button lives.
- [ ] **Any lasting effect?** Is this purely an informational simulation, or does a flagged result
      do anything to `RunnerData` — get logged, notify a GM, trigger confiscation of the flagged
      item, or feed into Public Awareness / Notoriety? Prototypes assume no persisted
      consequences.
- [ ] **Is "stashed" persisted?** In the prototypes, stashing an item is local, single-run dialog
      state that resets every time the dialog reopens. Should it instead be a lasting `ItemData`
      flag (so a Runner can mark gear as "left at the safehouse" and have that reflected
      elsewhere, e.g. gear lists, item cards), or does that belong to a separate feature?
- [ ] **Is `rating × 2` a house rule or an Optional Rule?** SR4e's standard Opposed Test uses the
      rating as the dice pool directly. Doubling it was a prototyping choice to make the dice
      animation and pacing more interesting — confirm whether this ships as fixed behaviour, or
      should be gated behind the existing `Optional Rule` mechanism (`featureFlags.optionalRules`)
      so tables that want stock SR4e math can turn it off.
- [ ] **"Unlicensed Gear" — does this case exist in practice today?** Confirm a Restricted item
      with `licenseId` unset is reachable in current data (e.g. gear acquired outside the Licence
      Quick-Buy flow, or a Licence later deleted) rather than something that can't currently occur.
- [ ] **Where does the Verification System Rating come from?** A fresh Player-chosen value on
      every run (as prototyped), or eventually tied to a location/checkpoint entity a GM
      configures? Fine to ship as a plain input for v1 either way — flagging in case it affects
      the dialog's prop shape.
- [ ] **Multiple simultaneous SIN "carrying"** — does the app have any existing notion of which
      SINs a Runner currently has "on them" vs. merely owns, or does this feature introduce that
      distinction for the first time (today all owned SIN items would presumably be eligible)?

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
- **Stash** (tentative) — marking a carried item as unavailable for a given check. Naming and
  persistence depend on the open question above.

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
  change, GM notification) — pending the "any lasting effect?" question above.
- GM-side configuration of checkpoint/scanner presets — no GM tooling exists yet
  (`docs/features/0003-gm-game.md`).
- Editing or creating SINs/Licences from within this dialog — that's the existing SIN/Licence
  forms and the Licence Quick-Buy flow.
- Changes to the core dice engine beyond this feature's own Opposed Test — the `rating × 2`
  formula is scoped to License Check only, not a change to Dice Pool assembly elsewhere.
- Real-time or multiplayer presentation of a check (e.g. a GM watching a Player's scan live).

## Related Features

- [`docs/features/0001-license-quick-buy.md`](./0001-license-quick-buy.md) — this feature's SIN ↔
  Licence ↔ gear data model is the foundation the lane grouping is built on
- [`docs/features/0003-gm-game.md`](./0003-gm-game.md) — relevant to the "who triggers this?" open
  question; still Draft, no GM view exists yet
