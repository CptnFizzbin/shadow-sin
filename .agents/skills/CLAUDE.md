# CLAUDE.md — Skills index

Index of the agent skills under `.agents/skills/`. Each entry links to its `SKILL.md` for the full
instructions; the description here is the skill's own frontmatter `description`.

| Skill | Description |
| --- | --- |
| [`batch-grill-me`](./batch-grill-me/SKILL.md) | A relentless interview that asks every frontier question at once, round by round. |
| [`build-as-artifact`](./build-as-artifact/SKILL.md) | Builds the ShadowSIN client as a static site and publishes it as a claude.ai Artifact, so the user can try a branch in their browser without running it locally. Use when the user asks for a build, preview, or playable copy of the app as an artifact. |
| [`design-an-interface`](./design-an-interface/SKILL.md) | Generate multiple radically different interface designs for a module using parallel sub-agents. Use when user wants to design an API, explore interface options, compare module shapes, or mentions "design it twice". |
| [`domain-modeling`](./domain-modeling/SKILL.md) | Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR. |
| [`fallow`](./fallow/SKILL.md) | Codebase intelligence for TypeScript and JavaScript — dead code, duplication, complexity, architecture boundaries, design-system drift, and more. Use when asked to audit PR risk, find unused code, detect duplicates, or run fallow. |
| [`grill-me`](./grill-me/SKILL.md) | A relentless interview to sharpen a plan or design. |
| [`grill-with-docs`](./grill-with-docs/SKILL.md) | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go. |
| [`grilling`](./grilling/SKILL.md) | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases. |
| [`handoff`](./handoff/SKILL.md) | Compact the current conversation into a handoff document for another agent to pick up. |
| [`implement`](./implement/SKILL.md) | Implement a piece of work based on a spec or set of tickets. |
| [`prototype`](./prototype/SKILL.md) | Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like. |
| [`to-issues`](./to-issues/SKILL.md) | Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues. |
| [`to-prd`](./to-prd/SKILL.md) | Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context. |
| [`to-questionnaire`](./to-questionnaire/SKILL.md) | Turn a decision you can't fully answer into a questionnaire for someone else to fill in. |
| [`to-spec`](./to-spec/SKILL.md) | Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed. |
| [`to-tickets`](./to-tickets/SKILL.md) | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker). |
| [`ubiquitous-language`](./ubiquitous-language/SKILL.md) | Extract a DDD-style ubiquitous language glossary from the current conversation, flagging ambiguities and proposing canonical terms. Saves to UBIQUITOUS_LANGUAGE.md. Use when user wants to define domain terms, build a glossary, harden terminology, create a ubiquitous language, or mentions "domain model" or "DDD". |
| [`write-a-skill`](./write-a-skill/SKILL.md) | Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill. |

See also `.agents/skills/fallow/SKILL.md` for the fallow command reference used in `AGENTS.md`.
