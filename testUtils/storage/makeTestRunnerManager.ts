import type { AsyncJsonStorage } from "#/services/storage/asyncStorage.ts"
import { createMemoryStorage } from "#/services/storage/providers/memoryStorageProvider.ts"
import { RunnerManager } from "#/services/persistence/runnerManager.ts"

export function makeTestRunnerManager(): {
  manager: RunnerManager
  storage: AsyncJsonStorage
} {
  const storage = createMemoryStorage()
  const manager = new RunnerManager({ local: storage })
  return { manager, storage }
}
