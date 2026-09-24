# The repo becomes a monorepo: `packages/client` and `packages/server`

ShadowSIN is gaining a C# server (`api.shadowsin.app`, see `docs/features/0003-gm-table.md`) that
stores `RunnerData` as the client defines and migrates it. We're restructuring this repo into a
monorepo: the existing React SPA moves to `packages/client`, and the new server lives in
`packages/server`. The alternatives were a top-level `server/` folder next to the SPA or a separate
repo. We picked the monorepo so that a change to the `RunnerData` format and its server-side
handling can ship in one PR. A third package, `packages/api` (`@shadowsin/api`), holds the
TypeScript API bindings generated from the server's OpenAPI document. The server's build regenerates it, and the client depends on it rather
than on the C# project. We also didn't want the server folder treated as a guest inside a
repo whose root is the client.

## Consequences

- Root-level tooling (Yarn scripts, CI, deploy, ESLint, fallow, `tsconfig.json`, path aliases)
  has to be re-pointed at `packages/client`, and CI gains a .NET job for `packages/server`.
- The generated bindings in `packages/api` are committed, so the client builds without .NET. A CI
  job regenerates them from the server. On same-repo PRs it pushes any changes to the PR branch;
  on fork PRs and the default branch it fails instead if they differ.
- `AGENTS.md` paths such as `src/...` become `packages/client/src/...`.
