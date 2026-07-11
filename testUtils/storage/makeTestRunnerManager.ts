import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"
import { createMemoryStorage } from "#/lib/storage/providers/memoryStorageProvider.ts"
import { RunnerManager } from "#/runner/runnerManager.ts"

export function makeTestRunnerManager(): {
  manager: RunnerManager
  storage: AsyncJsonStorage
} {
  const storage = createMemoryStorage()
  const manager = new RunnerManager({ local: storage })
  return { manager, storage }
}
