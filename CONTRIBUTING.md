# Contributing to ShadowSIN

ShadowSIN is a Shadowrun 4th Edition character sheet web app. This guide covers how work flows through the project —
from idea to implementation — and what goes where in the documentation system.

> **Developers:** This guide covers process and workflow. For code conventions, architecture,
> and tooling details see [AGENTS.md](./AGENTS.md).

---

## Table of Contents

- [Workflow overview](#workflow-overview)
- [Documentation artifacts](#documentation-artifacts)
  - [Feature docs (`docs/features/`)](#feature-docs-docsfeatures)
  - [GitHub Issues](#github-issues)
  - [ADRs (`docs/adr/`)](#adrs-docsadr)
- [Feature lifecycle](#feature-lifecycle)
- [Code contributions](#code-contributions)

---

## Workflow overview

```
Idea
  ↓  (worth implementing? design questions? domain constraints?)
Feature Doc (Draft)
  ↓  (design settled, human runs /to-prd)
Feature Doc (Ready to Implement) + GitHub Issue #1 (PRD slice)
  ↓  (more slices needed?)
GitHub Issue #2, #3 … (additional PRD slices)
  ↓  (first PR for the feature opens)
Feature Doc (In Progress)
  ↓  (all PRD Issues closed)
docs/features/archive/  (Implemented)
```

1. **Design first** — flesh out the idea in a feature doc; open questions, domain constraints, design intent
2. **Turn it into PRDs** — once the design is settled, a human runs `/to-prd` to produce one or more
   implementation-ready PRD Issues (labelled `ready-for-agent`). Each Issue is a self-contained execution spec for one
   independently-deliverable slice.
3. **Link back** — add the GitHub Issue URL (s) to the feature doc's "GitHub Issues / PRs" section and set status to
   "Ready to Implement"
4. **Mark In Progress** — the first agent to open a PR for the feature updates the feature doc status to "In Progress"
5. **Record hard decisions** — irreversible architectural choices get an ADR
6. **Archive on completion** — when all PRD Issues are closed, move the feature doc to `docs/features/archive/`, set
   status to "Implemented", and sweep `CONTEXT.md` for stale references to the feature

### Feature doc vs PRD

These are different artefacts at different stages:

| Artefact        | Lives in         | Purpose                                                                      | When                                                       |
|-----------------|------------------|------------------------------------------------------------------------------|------------------------------------------------------------|
| **Feature doc** | `docs/features/` | Collaborative design space — fuzzy ideas, open questions, domain constraints | Before design is settled; stays live during implementation |
| **PRD**         | GitHub Issue     | Self-contained execution spec — user stories, module decisions, testing plan | After design is settled; one per deliverable slice         |

The feature doc is the source of truth for **design intent**. A PRD Issue is the source of truth for **one
implementation slice**. If they conflict, the feature doc wins — update the feature doc and note the change in the
Issue.

A single feature may produce multiple PRD Issues over time. An agent implementing a slice works from the PRD Issue
alone. If the agent discovers a design-impacting constraint, it updates the feature doc; implementation details (exact
file names, interfaces) stay in the Issue.

---

## Documentation artifacts

### Feature docs (`docs/features/`)

**Purpose:** The canonical source of truth for a planned feature. Captures the *why*, the constraints, the open
questions, and the domain terms — not the implementation.

**When to create one:**

- A feature is too complex or uncertain to implement without thinking through first
- A feature will span multiple PRs and needs a shared reference point
- You want to capture open design questions before they get lost

**What goes in it:** Use [`docs/features/0000-TEMPLATE.md`](./features/0000-TEMPLATE.md) as your starting point. The key sections
are:

| Section                  | Purpose                                                               |
|--------------------------|-----------------------------------------------------------------------|
| Description              | What the feature is and why it matters                                |
| GitHub Issues / PRs      | Links to all related Issues and PRs — added as they are created       |
| Open Questions           | Unresolved design decisions — resolve them here, not in code comments |
| Constraints              | Hard limits: game rules, data model, architectural patterns           |
| Domain Notes             | CONTEXT.md terms in play, or new terms being introduced               |
| Rough Interface Sketches | Optional — high-level type shapes only, no implementation code        |
| Out of Scope             | Explicit exclusions to prevent scope creep                            |
| Related Features         | Links to overlapping or dependent feature docs / ADRs                 |

**What does NOT go in it:**

- Implementation code (function bodies, component internals, hooks)
- Step-by-step implementation plans
- Anything that belongs in an ADR (architectural decisions → `docs/adr/`)

**Naming:** `docs/features/NNNN-kebab-case-feature-name.md` — sequential number, starting from the next available.

---

### GitHub Issues

**Purpose:** Track a discrete unit of *work*. Feature Issues are PRDs published by the
`/to-prd` skill. Bug and task Issues are self-contained.

**When to create one:**

- Run `/to-prd` when a feature doc's design is settled — it publishes the PRD as a GitHub Issue and applies the
  `ready-for-agent` label automatically
- File directly for bugs or small, self-contained tasks (no feature doc or PRD needed)

**What a PRD Issue contains** (generated by `/to-prd`):

- Problem statement and solution summary
- User stories
- Implementation decisions (modules, interfaces, schema changes)
- Testing decisions
- Out of scope
- Link back to the feature doc

**What goes in a bug/task Issue:**

- Full description of the problem or task
- Steps to reproduce (for bugs)
- Acceptance criteria

**Labels:** `needs-triage` · `needs-info` · `ready-for-agent` · `ready-for-human` · `wontfix`

**Feature doc is the source of truth for design.** If an implementing developer or agent discovers a design-impacting
constraint mid-slice:

1. Update the feature doc with the new design intent
2. Add a comment to any **other** PRD Issues affected by the change, summarising what changed and pointing at the
   updated feature doc section — so the next agent doesn't start from a stale spec
3. Leave implementation-only details (file names, exact interfaces) in the Issue; don't push those back to the feature
   doc

---

### ADRs (`docs/adr/`)

**Purpose:** Record irreversible architectural decisions — specifically *that* a decision was made and *why*. ADRs are
permanent; they are never deleted or edited after the fact.

**When to write one** — all three must be true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader would wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one

If any of the three is missing, skip the ADR.

**What goes in it:** Short and punchy — one to three sentences of context, decision, and rationale. Optional sections
for considered alternatives and consequences when they add genuine value. See [
`docs/adr/0001-runner-data-not-character-sheet.md`](./adr/0001-runner-data-not-character-sheet.md)
as an example.

**Naming:** `docs/adr/NNNN-slug.md` — sequential, starting from the next available number.

**What does NOT go in it:**

- Implementation details
- Feature design (that's a feature doc)
- Decisions that are easy to reverse

---

## Feature lifecycle

```
docs/features/NNNN-my-feature.md        ← created, status: Draft
        ↓  (open questions resolved, human runs /to-prd)
docs/features/NNNN-my-feature.md        ← status: Ready to Implement
GitHub Issue #123  ← PRD slice 1 (ready-for-agent)
GitHub Issue #124  ← PRD slice 2, if needed
        ↓  (first PR for the feature opens)
docs/features/NNNN-my-feature.md        ← status: In Progress
        ↓  (all PRD Issues closed)
docs/features/archive/NNNN-my-feature.md  ← status: Implemented
```

When archiving:

1. Update the status line to "Implemented"
2. Move the file to `docs/features/archive/`
3. Close all related GitHub Issues
4. Sweep `CONTEXT.md` for any references to the feature and update or remove them

---

## Code contributions

- Follow the existing conventions in [AGENTS.md](./AGENTS.md) — that's the authoritative reference for code style,
  architecture patterns, testing, and tooling
- Run `yarn fix` before pushing — it auto-fixes lint and formatting
- Run `yarn tsc` to confirm no type errors
- One PR per feature slice or bug fix — keep PRs focused and reviewable
- If a feature spans multiple PRs, reference the feature doc in each PR description so reviewers have the full context
