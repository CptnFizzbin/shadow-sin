# Code comments

Every comment in the codebase is one of three styles — **Documentation**, **Explanation**, or **Task**. Comments
that don't fit any style (or that mix them) should be rewritten or removed.

**Documentation** comments describe a class, function, or field

- MUST be `/**` JSDoc block immediately above the declaration
- MUST NOT refer to old versions of the code (no "used to be", "previously", "renamed from", "legacy" framing) —
  document what the code *is*, not its history. History belongs in commit messages, ADRs, or migration files.
- MUST NOT include implementation details — describe the contract (what it's for, inputs/outputs, invariants
  callers can rely on), not how the body is written internally. If the implementation changes, the doc shouldn't
  need to.
- SHOULD include a usage example when the usage isn't self-evident from the signature alone.

```ts
// ✅ — describes the contract, no history, no internals
/** Returns the karma cost to raise `skill` from its current rating to `targetRating`. */
export const skillRaiseCost = (skill: ActiveSkill, targetRating: number): number => { ... }

// ❌ — refers to an old version of the code
/** Computes the raise cost. Replaces the old flat-rate formula from before the karma rework. */

// ❌ — implementation detail instead of contract
/** Loops over each rating band and sums the per-band cost. */
```

**Explanation** comments describe a line or block of code:

- MUST use an inline `//` above or beside it
- MUST NOT explain what the code does — if the code needs a line-by-line narration, prefer making the code clearer
  (better names, extracted helper) over commenting it.
- MUST explain *why* the code is there and what problem it fixed — the non-obvious reason the line exists in the
  form it does.
- SHOULD reference a GitHub issue when one exists.

```ts
// ✅ — explains why, references the issue
// Round half-away-from-zero: SR4A rules round karma costs up, and Math.round rounds
// .5 toward +Infinity which breaks negative adjustments. See #123.
const cost = roundHalfAwayFromZero(rawCost)

// ❌ — narrates what the line does
// Round the cost to the nearest integer
const cost = roundHalfAwayFromZero(rawCost)
```

**Task** comments (`// TODO` / `// FIXME`) flag outstanding work or a known defect at the line they sit on:

- MUST use an inline `// TODO:` (planned work not yet done) or `// FIXME:` (known defect in code that already
  ships) prefix, above or beside the line it concerns.
- MUST state what's outstanding, specifically enough that someone other than the author could act on it without
  asking. "TODO: fix this" isn't specific enough.
- SHOULD reference a GitHub issue when the task is non-trivial enough to track independently of the comment itself.
- MUST NOT be used to narrate finished work, or as a substitute for an Explanation comment justifying why the
  current code is correct as written — a Task comment marks something that still needs doing, not something that's
  done and merely worth knowing about.

```ts
// ✅ — specific about what's outstanding, references the issue
// TODO: apply GameEffects to attribute values once #145 lands
export const selectValue = selectBase

// ✅ — flags a known defect, not just a stylistic gripe
// FIXME: doesn't account for leap years — see #211
const daysUntil = (date: Date) => Math.floor((date.getTime() - Date.now()) / MS_PER_DAY)

// ❌ — too vague to act on
// TODO: fix this later
```

**Exemptions** — these don't need to fit any style:

- The `// Arrange` / `// Act` / `// Assert` labels required by `AGENTS.md` → "Testing conventions" — they're structural
  section labels, not documentation or explanation.
- Tool directives such as `// eslint-disable-next-line` or `// @ts-expect-error` — they instruct tooling, not
  readers.
