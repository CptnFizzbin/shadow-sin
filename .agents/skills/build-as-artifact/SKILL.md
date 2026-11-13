---
name: build-as-artifact
description: Builds the ShadowSIN client as a static site and publishes it as a claude.ai Artifact, so the user can try a branch in their browser without running it locally. Use when the user asks for a build, preview, or playable copy of the app as an artifact.
---

# Build the client as an Artifact

## Quick start

```bash
yarn tsx .agents/cli/build-as-artifact.ts --out <scratchpad>/client-artifact
```

Then publish with the Artifact tool, copying the arguments from `<out>.publish.json`
(see [Publish](#publish)).

## What the script does

1. Builds with `vite build --base ./` (relative asset paths, so the site works under the
   Artifact's sub-path). Defaults to a production build with `VITE_SEED_FIXTURES=true`, so the
   landing page offers the sample Runners (Artemis, Hexen) a dev server shows.
2. Removes host-only files (`CNAME`, `robots.txt`).
3. Rewrites literal U+FFFD characters as escapes. The publisher rejects any file containing one,
   but micromark (via `react-markdown`) uses it on purpose: CommonMark replaces invalid character
   references with it, and the minifier inlines it as a literal. The escape is read back as the
   same character, so behaviour doesn't change.
4. Checks Artifact limits (file count, per-file and total size) and fails on root-relative asset
   paths (`"/assets/…"`), which would 404 under the sub-path.
5. Smoke-tests the build: serves it under a sub-path, loads it in headless Chromium, and fails on
   page errors, failed requests, or an empty `#root`.
6. Writes `<out>.publish.json` (next to the output folder, not inside it) with `file_path`,
   `root`, `files`, `description` and `label`, plus `stale`: paths the previous build into the same
   `--out` had and this one doesn't (see [Publish](#publish) for when that's the right list).

Options:

| Option | Default | Notes |
| --- | --- | --- |
| `--out <dir>` | `dist/artifact` | Use the session scratchpad when there is one; the Artifact tool only reads sources under the working directory or the scratchpad. |
| `--mode production\|development` | `production` | `development` keeps React's development build and readable errors, at a larger size. |
| `--no-fixtures` | off | Don't seed the sample Runners. |
| `--no-smoke` | off | Skip the browser smoke test. |

## Publish

The script can't call the Artifact tool, so publish yourself:

1. Read `<out>.publish.json`.
2. **First publish:** call the Artifact tool's `publish` action with `file_path`, `root`, `files`,
   `description` and `label` from the manifest, plus `icon: "dice"`.
3. **Updating an artifact already published in this conversation:** publish the same `file_path`
   again to keep its URL. Chunk names change with every build, so also remove the old chunks by
   mapping each to `null` in `files` (object form: `{"assets/a.js": "assets/a.js", "assets/old.js": null}`).
   - Which paths to remove: `stale` lists what the previous build into this `--out` had and this
     one doesn't. That matches the artifact only if the previous build is the one you last
     published. If you rebuilt without publishing, or aren't sure, list the artifact's files
     (`action: "list"`, `scope: "files"`) and remove every published path not in `files`.
   - A publish takes at most 255 `files` entries, *removals included*. If the new files plus the
     removals are over 255, publish the new `files` first, then publish again with only the `null`
     removals.
   - Leaving old chunks in place is harmless (nothing references them), so skip the cleanup if
     it's a bother; a version holds up to 511 files in all.
4. **Artifact from an earlier conversation:** pass its `url` and read it first, then list its
   files as above to find what to remove; `stale` knows nothing about it.

## Notes for the user

- The artifact is private until the user shares it from the page's Share menu.
- Runners created in it live in that browser's local storage for the artifact's origin, separate
  from the real app's data.
- The artifact is a snapshot: it doesn't follow the branch, so rebuild and republish after changes.
