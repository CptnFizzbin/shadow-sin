# Feature docs as the canonical source of truth for planned features

Feature design lives in `docs/features/` markdown files, not in GitHub Issues. This keeps
collaborative design (with humans and agents) version-controlled and repo-accessible, rather
than fragmented across GitHub comment threads.

A feature doc is the pre-planning scratchpad — open questions, domain constraints, design
intent. When the design is settled enough to implement, a human runs `/to-prd` to produce one
or more **PRD Issues** (rich, self-contained execution specs) in GitHub. A single feature may
produce multiple PRD Issues over time, each covering an independently-deliverable slice.

PRD Issues are **not** lean pointers — they contain full user stories, module decisions, and
testing decisions so an agent can implement a slice without re-reading the entire feature doc.
The feature doc remains the source of truth for **design intent**; if a PRD Issue conflicts
with the feature doc, the feature doc wins and the Issue is updated with a changelog note.

Bugs and small self-contained tasks bypass the feature doc flow entirely and go straight to
GitHub Issues.

## Considered Options

- **GitHub Issues as source of truth** — common default; works for small tasks but creates a
  split brain for complex features: design evolves in the issue thread while agents and
  reviewers need it in the codebase.
- **Feature docs as source of truth** ✅ — design stays in the repo alongside CONTEXT.md and
  ADRs; agents can read it without GitHub API access; a feature spanning multiple PRs has one
  authoritative reference; implemented docs are archived rather than deleted, preserving design
  history.

## Consequences

- A `docs/features/` file must exist before any PRD Issue is opened for that feature
- PRD Issues are rich execution specs, not lean pointers; the feature doc owns design intent
- If an agent discovers a design-impacting constraint during implementation, it updates the
  feature doc; implementation-only details (file names, interfaces) stay in the Issue
- Feature doc status lifecycle: **Draft → Ready to Implement → In Progress → Implemented**
  - `Ready to Implement`: human manually runs `/to-prd` to generate the first PRD Issue
  - `In Progress`: set by the first agent that opens a PR for the feature
  - `Implemented`: feature doc moved to `docs/features/archive/` once all PRD Issues are closed
- When archiving, sweep `CONTEXT.md` for stale references to the feature and update them
