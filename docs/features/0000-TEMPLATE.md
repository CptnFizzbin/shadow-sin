# Feature Name

> **Status:** Draft | Ready to Implement | In Progress | Implemented (archived)
>
> **GitHub Issues / PRs:**
> <!-- Added after running /to-prd. A feature may generate multiple Issues (one per PR slice). -->
> - #??? — scope of this issue/PR

Brief description — what this feature is and why it matters to Players or the system.

## Open Questions

Design decisions not yet made. This is where design happens — list questions and resolve them
here before moving to implementation.

- [ ] Question one?
- [ ] Question two?

## Constraints

Known hard limits that the implementation must respect.

- Game rules that govern this feature (cite the rulebook if relevant)
- Existing data model constraints
- Patterns the implementation must follow (e.g. must use `StoreSlice`, must add a Migration)

## Domain Notes

CONTEXT.md terms that apply to this feature, or new terms being introduced. If a new term is
being introduced, add it to CONTEXT.md and reference it here.

## Rough Interface Sketches

_Optional._ High-level shapes for types or data structures where it helps clarify the design.
No implementation code — no function bodies, no component internals.

```ts
// Example: rough shape only
interface NewFeatureData {
  id: string
  // ...
}
```

## Out of Scope

What this feature explicitly does NOT cover. Be specific — this prevents scope creep and
clarifies what a future feature would need to handle.

## Related Features

Links to other feature docs or ADRs that this feature depends on or overlaps with.

- [`docs/features/NNNN-other-feature.md`](./NNNN-other-feature.md) — reason for the relationship
