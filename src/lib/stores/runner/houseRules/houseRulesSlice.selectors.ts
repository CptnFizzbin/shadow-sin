import type { RunnerData } from "#/system/runnerData.ts"

// TODO: Stubbed pending the persisted House Rules registry
// (docs/adr/0005-house-rules-feature-flag-namespace.md). Once `RunnerData.featureFlags.houseRules`
// exists, replace this switch with a real lookup (stored override ?? registry default), following
// the `optionalRules` namespace's pattern.
export function select(key: string) {
  return (_state: RunnerData): boolean => {
    switch (key) {
      case "items.licenseCheck.ratingPlusRating":
        return true
      default:
        return false
    }
  }
}
