import { LocalStorageProvider } from "#/services/storage/providers/localStorageProvider.ts"

/**
 * Deletes the saved Builder draft at `runnerStorageKey`, leaving every other saved runner and
 * draft untouched. Used by `BuilderLoadErrorBoundary` to recover from a draft that was saved
 * under an older `RunnerData` shape and now crashes the Builder on load — drafts are never run
 * through `applyMigrations` (unlike saved runners; see `RunnerManager.getRunner`), so an old
 * draft is cast to the current type as-is instead of being upgraded to match it.
 */
export function clearSavedRunnerDraft(runnerStorageKey: string): Promise<void> {
  return LocalStorageProvider.getStorage().removeItem(runnerStorageKey)
}
