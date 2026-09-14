/**
 * The storage key a Builder draft is saved under: the fixed `"builder/new"` key for the
 * in-progress "Create New" draft (there's only ever one), or `"editor/<runnerId>"` for a
 * specific runner's Editor draft. Shared by `useBuilderStores` (reads/writes drafts) and
 * `migrateOldLocalStorageFormat` (migrates old-format drafts to this same layout).
 */
export function getRunnerStorageKey(runnerId?: string): string {
  return runnerId ? `editor/${runnerId}` : "builder/new"
}
