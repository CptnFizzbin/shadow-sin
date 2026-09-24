# The repo becomes a monorepo: `packages/client` and `packages/server`

ShadowSIN is gaining a C# server (`api.shadowsin.app`, see `docs/features/0003-gm-table.md`) that
stores `RunnerData` as the client defines and migrates it. We're restructuring this repo into a
monorepo: the existing React SPA moves to `packages/client`, and the new server lives in
`packages/server`. The alternatives were a top-level `server/` folder next to the SPA or a separate
repo. We picked the monorepo so that a change to the `RunnerData` format and its server-side
handling can ship in one PR. We also didn't want the server folder treated as a guest inside a
repo whose root is the client.

## Consequences

- Root-level tooling (Yarn scripts, CI, deploy, ESLint, fallow, `tsconfig.json`, path aliases)
  has to be re-pointed at `packages/client`, and CI gains a .NET job for `packages/server`.
- `AGENTS.md` paths such as `src/...` become `packages/client/src/...`.
