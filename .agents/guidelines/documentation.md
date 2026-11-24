# External documentation

**External documentation** is prose that lives outside the code: `README.md`, `CONTRIBUTING.md`, `GLOSSARY.md`, every
`AGENTS.md`, `docs/`, `.agents/guidelines/` and `.agents/agents/`. Code comments follow `.agents/guidelines/comments.md` instead.

External documentation is read long after it was written, by people who can't see the change that prompted it. It
must stay true without being touched every time the code moves.

- MUST NOT include implementation details — how code works internally: function bodies, algorithms, private helpers,
  internal state shapes. Describe the purpose, the rules, the public contract (props and usage of a shared component,
  a command's flags) and the reasoning. If a refactor that keeps behaviour the same would make the doc wrong, the doc
  is describing implementation.
- MUST NOT include high-churn information — anything likely to be outdated soon after it's written:
  - counts and sizes ("the 12 item types", "about 300 lines")
  - line numbers and code excerpts copied from source files
  - lists that mirror the code ("the hooks are `useA`, `useB`, `useC`") — they go stale the moment a sibling is added
  - status snapshots ("currently", "for now", "as of this PR", "not yet migrated") outside a doc whose job is to track
    status, such as a feature doc's status line
  - version numbers, except a requirement the project enforces (e.g. the Node version in `package.json` → `engines`)
- SHOULD point to the source of truth instead of copying it: "see `package.json` → `scripts`", not the list of
  scripts. A pointer to a stable path (a directory, a `AGENTS.md`, an ADR) is fine; a pointer to a function name or
  line is high-churn.
- MUST NOT refer to old versions of the code or docs ("previously", "renamed from", "the new X") — document what is
  true now. History belongs in commit messages and ADRs.
- MUST NOT cite a GitHub issue the author hasn't checked, nor a rulebook page (root `AGENTS.md` → "Conventions"
  forbids fabricated page citations everywhere).

## Point-in-time records

Some documents record a moment rather than describe the present, and follow their own rules instead of the churn
rules above:

- **ADRs** (`docs/adr/`) record a decision and its context when it was made. They may name the code the decision is
  about. Don't edit one to keep it current; `CONTRIBUTING.md` → "ADRs (`docs/adr/`)" says how ADRs change.
- **Feature docs** (`docs/features/`) capture design intent and track status; their content rules are in
  `CONTRIBUTING.md` → "Feature docs (`docs/features/`)". Archived feature docs (`docs/features/archive/`) are not kept current.
