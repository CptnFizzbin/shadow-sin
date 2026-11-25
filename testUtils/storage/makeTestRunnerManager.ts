import type { AsyncJsonStorage } from "#/state/storage/asyncStorage.ts"
import { createMemoryStorage } from "#/state/storage/providers/memoryStorageProvider.ts"
import { RunnerManager } from "#/state/persistence/runnerManager.ts"

export function makeTestRunnerManager(): {
  manager: RunnerManager
  storage: AsyncJsonStorage
} {
  const storage = createMemoryStorage()
  const manager = new RunnerManager({ local: storage })
  return { manager, storage }
}
