/**
 * The running app's version — the timestamp of the latest commit to the default branch at build
 * time, or the dev server's start time when running via `yarn dev`. Baked in by `vite.config.ts`
 * through the `__APP_VERSION__` define. Stamped onto a runner's `_meta_.appVersion` whenever
 * `applyMigrations` (`src/data/applyMigrations.ts`) runs a pending migration against it.
 */
export const APP_VERSION: string = __APP_VERSION__
