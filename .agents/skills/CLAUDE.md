# CLAUDE.md — Skills index

Index of the agent skills under `.agents/skills/`. Each entry links to its `SKILL.md` for the full
instructions; the description here is the skill's own frontmatter `description`.

| Skill | Description |
| --- | --- |
| [`batch-grill-me`](./batch-grill-me/SKILL.md) | A relentless interview that asks every frontier question at once, round by round. |
| [`design-an-interface`](./design-an-interface/SKILL.md) | Generate multiple radically different interface designs for a module using parallel sub-agents. Use when user wants to design an API, explore interface options, compare module shapes, or mentions "design it twice". |
| [`domain-modeling`](./domain-modeling/SKILL.md) | Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to maintain the domain model. |
| [`fallow`](./fallow/SKILL.md) | Codebase intelligence for TypeScript and JavaScript — dead code, duplication, complexity, architecture boundaries, design-system drift, and more. Use when asked to audit PR risk, find unused code, detect duplicates, or run fallow. |
| [`grill-me`](./grill-me/SKILL.md) | A relentless interview to sharpen a plan or design. |
| [`grill-with-docs`](./grill-with-docs/SKILL.md) | A relentless interview to sharpen a plan or design, which also creates docs (ADRs and glossary) as it goes. |
| [`grilling`](./grilling/SKILL.md) | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any "grill" trigger phrases. |
| [`handoff`](./handoff/SKILL.md) | Compact the current conversation into a handoff document for another agent to pick up. |
| [`prototype`](./prototype/SKILL.md) | Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like. |
| [`to-issues`](./to-issues/SKILL.md) | Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. |
| [`to-prd`](./to-prd/SKILL.md) | Turn the current conversation context into a PRD and publish it to the project issue tracker. |
| [`to-questionnaire`](./to-questionnaire/SKILL.md) | Turn a decision you can't fully answer into a questionnaire for someone else to fill in. |
| [`to-spec`](./to-spec/SKILL.md) | Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what's already been discussed. |
| [`to-tickets`](./to-tickets/SKILL.md) | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker. |
| [`ubiquitous-language`](./ubiquitous-language/SKILL.md) | Extract a DDD-style ubiquitous language glossary from the current conversation, flagging ambiguities and proposing canonical terms. |
| [`write-a-skill`](./write-a-skill/SKILL.md) | Create new agent skills with proper structure, progressive disclosure, and bundled resources. |

See also `AGENTS.md` → "Skills inventory" for the same list grouped by theme, and
`.agents/skills/fallow/SKILL.md` for the fallow command reference used throughout `AGENTS.md`.
