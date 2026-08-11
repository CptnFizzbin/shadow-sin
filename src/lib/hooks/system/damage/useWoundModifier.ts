import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"

export function useWoundModifier() {
  return useRunnerSelector(({ damage }) => damage.woundMod)
}
