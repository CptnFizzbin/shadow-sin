# Runner state access unifies on Selectors behind a single `useRunnerSelector`

**Status:** proposed

Components had two live ways to read `RunnerData`: calling `useRunnerStoreSelector(Selectors.<domain>.<fn>)`
directly (152 call sites), or one of ~36 custom hooks that wrapped the same call with derived logic on top.
Neither path was wrong on its own, but nothing said which to reach for, and the ambiguity was sharpest for
values that need to resolve relative to a different owning entity (e.g. a running Agent's Response/Signal
coming from whichever `MatrixNode` currently hosts it, per `docs/adr/0012-matrix-entity-model.md`) — exactly
where `AttributesProvider`/`useAttrValue` had already forked into a second, Context-based resolution
mechanism alongside plain selectors, without either doc acknowledging the other.

We're consolidating on one rule: **every value derived from `RunnerData` has exactly one implementation,
always a Selector**, and **all reads go through one hook, `useRunnerSelector`**. Its callback receives a
namespaced catalog mirroring the existing `Selectors.<domain>` split (e.g. `attribute`, `damage`), and picks
the value it needs — either by calling a namespace with a key (`attribute(AttributeKey.system).baseValue`)
or reading a bare property for values that don't need one (`damage.woundMod`). A Selector may be reachable
from more than one namespace when it genuinely has more than one natural home (a wound modifier is both a
Damage concept and a Modifier concept) — always the same underlying function, never reimplemented per
namespace.

## Considered options

- **Document a rule for when to use a hook vs. a raw selector call, keep both as coequal options.**
  Rejected — every real case the rule was tested against resolved to "selector," so a nuanced rule was
  overhead for a decision that was never actually close.
- **A general entity-relative Context (`EntityContext`) resolving any hosting entity by id, for every
  domain.** Considered and deferred, not rejected — Agent doesn't exist in the codebase outside
  `docs/features/0014-matrix-interactions.md` yet, and no domain besides `attribute` (and, later, Matrix
  stats) has anything to resolve relative to a host in the first place. Building it now would be
  speculative; only `attribute` needs entity-relative resolution today, and it already has one.
- **A lint rule flagging pure-selector wrapper hooks.** Rejected in favor of `@deprecated` + manual
  migration — the project doesn't run custom ESLint rules today, and a JSDoc deprecation is enough friction
  to stop new instances without standing up new tooling.

## Consequences

- `AttributesProvider`'s existing Context is retained but demoted from public API to private plumbing:
  `useAttrValue`/`useAttrInfo`/`useAllAttrInfos` are `@deprecated`, and `useRunnerSelector`'s `attribute`
  namespace reads the same context internally instead. `RunnerAttributesProvider` keeps populating it from
  `RunnerData` exactly as it does today — nothing about *how* attribute values reach the context changes,
  only who's allowed to read it directly. This preserves the "no explicit entity reference needed at the
  call site" property for whenever a non-Runner provider gets built, without deciding that design now.
- Existing pure-`RunnerData`-derivation hooks (`useGameEffects`, `useWoundModifier`, `useRunnerTabs`,
  `useNetWorth`, the `useRunnerArmor` family, `useVisibleSections`, the gear/adeptPowers/complexForms/sprites
  hooks, etc. — roughly 30 files) are migration candidates: deprecate each as its `useRunnerSelector` catalog
  equivalent lands, remove once callers move over.
- Hooks that need something a Selector structurally can't express — a different store (`useSpendKarmaSummary`
  reads `ImprovementStore`), a form library (`useLanguageSkillForm`), the router or Builder/Viewer context
  (`useOpenItemDetails`), or local component state (`useLicenseCheckState`) — are unaffected and stay
  ordinary hooks. This decision only touches hooks/selectors that read `RunnerData`, directly or
  transitively.
- Selector composition and memoization (`reselect`, `createCurriedSelector`) are unchanged — catalog entries
  are still ordinary Selectors underneath; only the call-site ergonomic changes.
