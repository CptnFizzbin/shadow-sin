import { resolveAlias } from "#/components/runner/runnerUtils.ts"
import type { RunnerManager } from "#/lib/persistence/runnerManager.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import type { useImportConflictDialog } from "./importConflictDialog.tsx"

export async function resolveConflictedRunner(
  runner: RunnerData,
  existing: RunnerData,
  importConflictDialog: ReturnType<typeof useImportConflictDialog>,
  runnerManager: RunnerManager,
): Promise<RunnerData | null> {
  const choice = await importConflictDialog.open({
    incomingRunner: runner,
    existingRunner: existing,
  })

  if (choice === "overwrite") {
    return runner
  }

  if (choice === "create-new") {
    const allRunners = await runnerManager.listRunners()
    const existingAliases = new Set(allRunners.map((c) => c.name))
    const newAlias = resolveAlias(runner.profile.alias, existingAliases)
    return {
      ...runner,
      id: crypto.randomUUID(),
      profile: { ...runner.profile, alias: newAlias },
    }
  }

  return null
}
